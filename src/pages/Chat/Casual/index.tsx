import { Button, Input, Layout } from 'antd'

import './index.scss'
import { RobotOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { useCallback, useState } from 'react'
import chatApi from 'api/chat'
import { MsgProps, Role, newChatID, parseStreamData } from './utils'
import ChatItem from './ChatItem'

const CasualChat = () => {
  const [input, setInput] = useState<string>('')
  const [list, setList] = useState<MsgProps[]>([])

  const doPost = useCallback(() => {
    const msg: MsgProps = { role: Role.user, chatID: newChatID(), content: input, loading: true }
    const msgList = [...list, msg]
    setList(msgList)

    chatApi.chat(input).then(async (res) => {
      delete msg.loading

      const reader = res.body?.getReader()
      let curMsg: MsgProps | null = null
      while (true && reader) {
        const { done, value } = await reader.read()
        if (done) {
          return
        }

        const data = parseStreamData(value)
        if (!curMsg) {
          curMsg = data
          setList((list) => [...list, curMsg as MsgProps])
        } else {
          curMsg.content += data?.content
          setList((list) => [...list])
        }
        console.log(data)
      }
    })

    setInput('')
  }, [input, list])

  return (
    <Layout className="chat-page">
      <Layout.Header className="chat-header">
        <RobotOutlined rev={undefined} /> Casual Chat with GPT-3.5
      </Layout.Header>
      <Layout.Content className="chat-content">
        <div className="chat-scroll-zone">
          {list.map((msg) => (
            <ChatItem msg={msg} key={msg.chatID} />
          ))}
        </div>
      </Layout.Content>
      <Layout.Footer className="chat-footer">
        <div className="chat-input-zone">
          <Input
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={doPost}
            suffix={
              <Button
                className="chat-input-btn"
                onClick={doPost}
                disabled={!input}
                icon={<ArrowRightOutlined rev={undefined} />}></Button>
            }></Input>
        </div>
      </Layout.Footer>
    </Layout>
  )
}

export default CasualChat
