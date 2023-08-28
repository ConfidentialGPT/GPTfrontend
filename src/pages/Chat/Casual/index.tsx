import { Button, Input, Layout } from 'antd'

import './index.scss'
import { RobotOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { useCallback, useEffect, useState } from 'react'
import chatApi from 'api/chat'
import { MsgProps, Role, newChatID, parseStreamData } from './utils'
import ChatItem from './ChatItem'
import ConfigForm, { ConfigProps, DefaultConfig } from 'components/ChatConfig'

const STORAGE_KEY = 'chat-context'

const CasualChat = () => {
  const [input, setInput] = useState<string>('')
  const [list, setList] = useState<MsgProps[]>([])
  const [config, setConfig] = useState<ConfigProps>(DefaultConfig)

  useEffect(() => {
    try {
      setList(JSON.parse(localStorage.getItem(STORAGE_KEY) || ''))
    } catch (e) {
      setList([])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  }, [list])

  const doPost = useCallback(() => {
    const msg: MsgProps = { role: Role.user, chatID: newChatID(), content: input, loading: true }
    const msgList = [...list, msg]
    setList(msgList)

    const sse = chatApi.chat(input)

    if (!sse) return

    let curMsg: MsgProps | null = null

    sse.addEventListener('message', (evt: { stopPropagation: () => void; data: string }) => {
      evt.stopPropagation()

      delete msg.loading

      console.log(Date.now(), evt.data)

      const data = parseStreamData(evt.data)
      if (!curMsg) {
        curMsg = data
        setList((list) => [...list, curMsg as MsgProps])
      } else {
        // eslint-disable-next-line @typescript-eslint/no-extra-semi
        ;(curMsg as MsgProps).content += data?.content
        setList((list) => [...list])
      }
    })

    sse.addEventListener('error', (err: any) => {
      console.error(err)
    })
    sse.stream()

    setInput('')
  }, [input, list])

  return (
    <Layout className="chat-page">
      <Layout.Header className="chat-header">
        <RobotOutlined rev={undefined} /> Casual Chat with GPT-3.5
        <ConfigForm config={config} onChange={setConfig} />
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
