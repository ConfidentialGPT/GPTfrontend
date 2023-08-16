export enum Role {
  user = 'user',
  assistant = 'assistant'
}

export interface MsgProps {
  role: Role
  chatID: string
  content: string
  loading?: boolean
}

export const RandomString = () => {
  return Math.random().toString(36).substring(2)
}

export const newChatID = () => 'chat-' + RandomString()

export const parseStreamData: (value: string) => MsgProps | null = (value) => {
  try {
    const res: MsgProps = { role: Role.assistant, content: '', chatID: '' }
    const obj = JSON.parse(value)
    res.chatID = obj.id
    res.content += obj.choices[0].delta.content || ''
    return res
  } catch (e) {
    console.error(e)
  }

  return null
}
