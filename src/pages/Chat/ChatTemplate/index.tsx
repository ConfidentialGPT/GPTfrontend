import { Button, Form, Input, Layout } from 'antd'
import { RobotOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import chatApi from 'api/chat'
import { MsgProps, Role, newChatID, parseStreamData } from './utils'
import ChatItem from './ChatItem'
import ConfigForm, { ConfigProps, DefaultConfig } from 'components/ChatConfig'
import { debounce } from 'lodash'

import './index.scss'

const STORAGE_KEY = 'chat-context'

const scrollToLastOne = (ref: React.RefObject<HTMLDivElement>) => {
  if (ref.current) {
    ref.current.lastElementChild?.scrollIntoView({ behavior: 'smooth' })
  }
}

const CasualChat = (props: {
  title: string
  model: string
  api?: string
  maxTokenSize?: number
  id: string
}) => {
  const [list, setList] = useState<MsgProps[]>([])
  const [config, setConfig] = useState<ConfigProps>(DefaultConfig)
  const [disabled, setDisabled] = useState(true)

  const contentRef = useRef<HTMLDivElement>(null)
  const [form] = Form.useForm()

  const { title, model, api, maxTokenSize } = props

  useEffect(() => {
    try {
      setList(JSON.parse(localStorage.getItem(STORAGE_KEY) || ''))
    } catch (e) {
      setList([])
    }
  }, [])

  useLayoutEffect(() => {
    setTimeout(() => scrollToLastOne(contentRef))
  }, [contentRef, list])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  }, [list])

  const doPost = useCallback(() => {
    if (disabled) return

    const input = form.getFieldValue('input')
    const msg: MsgProps = { role: Role.user, chatID: newChatID(), content: input, loading: true }
    const msgList = [...list, msg]
    setList(msgList)
    // scrollToLastOne(contentRef)
    form.setFieldValue('input', '')

    const sse = chatApi.chat({
      max_tokens: config.max_tokens,
      temperature: config.temperature,
      presence_penalty: config.presence_penalty,
      frequency_penalty: config.frequency_penalty,
      messages: [
        {
          role: Role.system,
          content: config.system_prompt
        },
        ...msgList
          .filter((msg) => msg.role === Role.user)
          .reverse()
          .slice(0, config.contexts + 1)
          .reverse()
          .map((msg) => {
            const _msg = { ...msg }
            delete _msg.loading
            return _msg
          })
      ]
    })

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

      scrollToLastOne(contentRef)
    })

    sse.addEventListener('error', (err: any) => {
      console.error(err)
    })
    sse.stream()
  }, [list, config, contentRef, form, disabled])

  return (
    <Layout className="chat-page">
      <Layout.Header className="chat-header">
        <RobotOutlined rev={undefined} /> {title}
        <ConfigForm
          config={config}
          maxTokenSize={maxTokenSize}
          onChange={(config) => {
            setConfig(config)
          }}
        />
      </Layout.Header>
      <Layout.Content className="chat-content">
        <div className="chat-scroll-zone" ref={contentRef}>
          {list.map((msg) => (
            <ChatItem msg={msg} key={msg.chatID} />
          ))}
        </div>
      </Layout.Content>
      <Layout.Footer className="chat-footer">
        <Form form={form} className="chat-input-zone">
          <Form.Item noStyle name="input">
            <Input
              className="chat-input"
              onChange={debounce((e) => {
                setDisabled(!e.target.value)
              }, 500)}
              onPressEnter={doPost}
              suffix={
                <Button
                  className="chat-input-btn"
                  onClick={doPost}
                  disabled={disabled}
                  icon={<ArrowRightOutlined rev={undefined} />}></Button>
              }></Input>
          </Form.Item>
        </Form>
      </Layout.Footer>
    </Layout>
  )
}

export default CasualChat
