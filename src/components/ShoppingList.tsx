import axios from 'axios'
import { Component } from 'react'
import autobind from 'autobind-decorator'
import { Key } from 'ts-keycode-enum'
import { List, Input, Divider, ConfigProvider, Empty, notification } from 'antd'
import { PlusCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import ShoppingListItem from './ShoppingListItem'
import { Item, ItemLabel } from './ShoppingListItem'

type Props = {
  initialItems: Item[]
  initialItemsLabels: ItemLabel[]
}

type State = {
  items: Item[]
  labels: ItemLabel[]
  newItemTitle: string
  creatingItem: boolean
  updatingItems: string[]
}

export default class ShoppingList extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      items: props.initialItems,
      labels: props.initialItemsLabels,
      newItemTitle: '',
      creatingItem: false,
      updatingItems: [],
    }
  }

  @autobind
  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ newItemTitle: event.currentTarget.value })
  }

  @autobind
  async handleKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.keyCode === Key.Enter) {
      if (!this.state.newItemTitle) {
        return
      }

      this.setState({ creatingItem: true })

      const data = { title: this.state.newItemTitle }

      try {
        await axios.post('/api/create-item', {
          body: data,
        })
        this.setState({ newItemTitle: '' })
        await this.refreshItems()
      } catch (err) {
        console.error('Failed to create item', data, err)

        notification.error({
          message: 'Toevoegen mislukt!',
          description: err.message,
          placement: 'topRight',
        })
      } finally {
        this.setState({ creatingItem: false })
      }
    }
  }

  @autobind
  async handleItemFinish(item: Item) {
    this.setState({
      updatingItems: this.state.updatingItems.concat([item.id]),
    })

    try {
      // @todo Change to ID in URL
      await axios.post('/api/finish-item', {
        body: { id: item.id },
      })
      await this.refreshItems()
    } catch (err) {
      console.error('Failed to finish item', item, err)

      notification.error({
        message: 'Afronden mislukt!',
        description: err.message,
        placement: 'topRight',
      })
    } finally {
      this.setState({
        updatingItems: this.state.updatingItems.filter((id) => id !== item.id),
      })
    }
  }

  @autobind
  async handleItemLabelsChange(item: Item, labels: ItemLabel[]) {
    try {
      // @todo Change to ID in URL
      await axios.post('/api/set-item-labels', {
        body: { id: item.id, labels },
      })
      await this.refreshItems()
      await this.refreshItemsLabels()
    } catch (err) {
      console.error('Failed to update item labels', item, labels, err)

      notification.error({
        message: 'Labels bijwerken mislukt!',
        description: err.message,
        placement: 'topRight',
      })
    } finally {
      this.setState({
        updatingItems: this.state.updatingItems.filter((id) => id !== item.id),
      })
    }
  }

  async refreshItems() {
    const response = await axios.get('/api/list-unfinished-items')
    const items = response.data
    this.setState({ items })
  }

  async refreshItemsLabels() {
    const response = await axios.get('/api/list-items-labels')
    const labels = response.data
    this.setState({ labels })
  }

  renderAddForm() {
    return (
      <Input
        value={this.state.newItemTitle}
        disabled={this.state.creatingItem}
        prefix={
          this.state.creatingItem ? <LoadingOutlined /> : <PlusCircleOutlined />
        }
        placeholder="Voeg product toe.."
        autoComplete="on"
        onChange={this.handleChange}
        onKeyUp={this.handleKeyUp}
      />
    )
  }

  @autobind
  renderItem(item: Item) {
    const updatingItems = this.state.updatingItems
    const labels = this.state.labels

    return (
      <ShoppingListItem
        item={item}
        existingLabels={labels}
        isUpdating={updatingItems.includes(item.id)}
        onFinish={this.handleItemFinish}
        onLabelsChange={this.handleItemLabelsChange}
      />
    )
  }

  render() {
    const items = this.state.items

    return (
      <>
        <Divider orientation="left">Boodschappen</Divider>
        <ConfigProvider
          renderEmpty={() => (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Geen producten"
            />
          )}
        >
          <List
            size="small"
            header={this.renderAddForm()}
            bordered
            dataSource={items}
            renderItem={this.renderItem}
          />
        </ConfigProvider>
      </>
    )
  }
}
