import { Component } from 'react'
import axios from 'axios'
import { notification, Divider, Button } from 'antd'
import { LoadingOutlined, UserOutlined } from '@ant-design/icons'
import HttpStatus from 'http-status-codes'
import fetchMe from '../api/auth/fetchMe'
import ShoppingList from '../components/ShoppingList'
import MainLayout from '../components/MainLayout'

type Props = {}
type State = {
  isAuthorizing: boolean
  isAuthorized: boolean
  username: string
}

export default class IndexPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      isAuthorizing: true,
      isAuthorized: false,
      username: '',
    }
  }

  componentDidMount() {
    this.authorize()
  }

  async authorize() {
    try {
      // Check if logged in (has session)
      const me = await fetchMe()

      // Use access token for all API calls
      const apiDomain = `${window.location.protocol}//${window.location.host}`

      axios.interceptors.request.use((config) => {
        if (config.url.startsWith(apiDomain)) {
          config.headers.Authorization = `Bearer ${me.accessToken}`
        }

        return config
      })

      this.setState({
        isAuthorizing: false,
        isAuthorized: true,
        username: me.username,
      })
    } catch (err) {
      // Not logged in
      if (err.response?.status === HttpStatus.UNAUTHORIZED) {
        this.setState({
          isAuthorizing: false,
          isAuthorized: false,
        })
        return
      }

      console.error('Error logging in', { ...err })
      notification.error({
        message: 'Fout bij inloggen!',
        description: err.message,
        placement: 'topRight',
      })
    }
  }

  render() {
    const isAuthorizing = this.state.isAuthorizing
    const isAuthorized = this.state.isAuthorized
    const username = this.state.username

    return (
      <MainLayout>
        {isAuthorizing && <LoadingOutlined />}
        {!isAuthorizing && isAuthorized && (
          <>
            <ShoppingList />
            <Divider orientation="right" plain>
              Hoi {username}!
              <Divider type="vertical" plain />
              <a href="/api/auth/logout">Uitloggen</a>
            </Divider>
          </>
        )}
        {!isAuthorizing && !isAuthorized && (
          <Button type="primary" icon={<UserOutlined />} href="/api/auth/login">
            Inloggen
          </Button>
        )}
      </MainLayout>
    )
  }
}
