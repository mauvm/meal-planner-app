import axios from 'axios'
import { getHost } from './service'
import { Item } from '../../util/types'

export default async function searchItems(query: string): Promise<Item[]> {
  const response = await axios.get(
    `${getHost()}/v1/shopping-lists/search-items`,
    { params: { query } },
  )
  return response.data.data
}
