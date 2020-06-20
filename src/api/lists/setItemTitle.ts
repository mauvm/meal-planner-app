import axios from 'axios'
import { getHost } from './service'
import user from '../../util/user'

export default async function setItemTitle(
  id: string,
  title: string,
): Promise<void> {
  await axios.patch(
    `${getHost()}/v1/lists/items/${id}`,
    {
      title,
    },
    {
      headers: {
        authorization: `Bearer ${user.accessToken}`,
      },
    },
  )
}
