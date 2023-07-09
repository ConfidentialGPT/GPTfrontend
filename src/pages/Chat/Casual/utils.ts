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

export const parseStreamData: (value: Uint8Array) => MsgProps | null = (value) => {
  const str = String.fromCodePoint(...Array.from(value as Uint8Array))

  try {
    const res: MsgProps = { role: Role.assistant, content: '', chatID: '' }
    const splits = str.split(/\n/)
    splits.forEach((str) => {
      const match = str.match(/data:(.*)/)
      if (match) {
        const obj = JSON.parse(match[1])
        res.chatID = obj.id
        res.content += obj.choices[0].delta.content || ''
      }
    })
    return res
  } catch (e) {
    console.error(e)
  }

  return null
}
