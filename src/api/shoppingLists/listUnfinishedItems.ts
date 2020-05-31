import axios from 'axios'
import { getHost } from './service'
import { Item } from '../../util/types'

export default async function listUnfinishedItems(): Promise<Item[]> {
  const response = await axios.get(
    `${getHost()}/v1/shopping-lists/unfinished-items`,
  )
  return response.data.data
}
