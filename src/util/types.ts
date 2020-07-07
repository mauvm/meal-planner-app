export type List = {
  id: string
  title: string
}

export type ListItem = {
  id: string
  title: string
  createdAt: string
  finishedAt?: string
  labels?: ListItemLabel[]
}

export type ListItemLabel = string
