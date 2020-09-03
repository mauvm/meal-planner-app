import { Component, ChangeEvent } from 'react'
import autobind from 'autobind-decorator'
import { List, Checkbox, Input, Select, Tag, ConfigProvider } from 'antd'
import { CustomTagProps } from 'rc-select/lib/interface/generator'
import { debounce } from 'helpful-decorators'
import { ListItem, ListItemLabel } from '../util/types'
import getItemLabels from '../util/getItemLabels'
import getLabelColor from '../util/getLabelColor'

const { Option } = Select

type Props = {
  item: ListItem
  existingLabels: ListItemLabel[]
  isUpdating?: boolean
  onFinish: (item: ListItem) => Promise<void>
  onTitleChange: (item: ListItem, title: string) => Promise<void>
  onLabelsChange: (item: ListItem, labels: ListItemLabel[]) => Promise<void>
}

type State = {
  title: string
}

export default class ListItemComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      title: props.item.title,
    }
  }

  getLabels(): ListItemLabel[] {
    return getItemLabels(this.props.item)
  }

  getAllLabels(): ListItemLabel[] {
    const labels = this.getLabels()
    const existingLabels = this.props.existingLabels

    return labels
      .concat(existingLabels)
      .sort()
      .filter((value, index, self) => self.indexOf(value) === index) // Unique
  }

  @autobind
  handleFinish() {
    this.props.onFinish(this.props.item)
  }

  @autobind
  handleTitleChange(event: ChangeEvent<{ value: string }>) {
    const title = event.target.value
    this.setState({ title })
    this.triggerTitleChange(title)
  }

  @debounce(1000)
  triggerTitleChange(title: string) {
    this.props.onTitleChange(this.props.item, title)
  }

  @autobind
  handleLabelsChange(labels: string[]) {
    const newLabels = labels.sort()
    const labelsHaveChanged =
      this.getLabels().join(',') !== newLabels.sort().join(',')

    if (labelsHaveChanged) {
      this.props.onLabelsChange(this.props.item, newLabels)
    }
  }

  render() {
    const item = this.props.item
    const isUpdating = this.props.isUpdating
    const title = this.state.title
    const labels = this.getLabels()

    return (
      <List.Item key={item.id}>
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{ width: '2em', flex: '0 1 auto' }}>
            <Checkbox
              value={item.id}
              checked={isUpdating}
              disabled={isUpdating}
              onChange={this.handleFinish}
              // Increase clickable area
              style={{
                position: 'relative',
                margin: '-0.7em',
                padding: '0.7em',
              }}
            />
          </div>
          <div style={{ flex: '1 1 auto' }}>
            <Input
              value={title}
              disabled={isUpdating}
              onChange={this.handleTitleChange}
              placeholder="Geen omschrijving"
              style={{ border: 'none', boxShadow: 'none' }}
            />
          </div>
          <div style={{ flex: '0 1 auto' }}>
            {/* Fix for notification messages suddenly being RTL as well */}
            <ConfigProvider direction="ltr">
              <ConfigProvider direction="rtl" renderEmpty={() => 'Geen items..'}>
                <Select
                  mode="tags"
                  tagRender={this.renderTag}
                  value={labels}
                  disabled={isUpdating}
                  onChange={this.handleLabelsChange}
                  placeholder="Labels"
                  bordered={false}
                >
                  {this.getAllLabels().map((label) => (
                    <Option key={label} value={label}>
                      {label}
                    </Option>
                  ))}
                </Select>
              </ConfigProvider>
            </ConfigProvider>
          </div>
        </div>
      </List.Item>
    )
  }

  @autobind
  renderTag(props: CustomTagProps) {
    const { label, value, closable, onClose } = props

    return (
      <Tag
        color={getLabelColor(String(value))}
        closable={closable}
        onClose={onClose}
      >
        {label}
      </Tag>
    )
  }
}
