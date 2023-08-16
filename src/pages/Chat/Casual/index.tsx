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

    const sse = chatApi.chat(input)

    if (!sse) return

    let curMsg: MsgProps | null = null

    sse.addEventListener('message', (evt: { stopPropagation: () => void; data: string }) => {
      evt.stopPropagation()

      delete msg.loading

      console.log(evt.data)

      const data = parseStreamData(evt.data)
      if (!curMsg) {
        curMsg = data
        setList((list) => [...list, curMsg as MsgProps])
      } else {
        // eslint-disable-next-line @typescript-eslint/no-extra-semi
        ;(curMsg as MsgProps).content += data?.content
        setList((list) => [...list])
      }

      // console.log("got: ", evt.data);
      // let isChatRespDone = false;
      // if (evt.data == "[DONE]") {
      //     isChatRespDone = true
      // }

      // if (!isChatRespDone) {
      //     const payload = JSON.parse(evt.data)
      //     const respContent = parseChatResp(chatmodel, payload);

      //     if (payload.choices[0].finish_reason) {
      //         isChatRespDone = true;
      //     }

      //     switch (currentAIRespEle.dataset.status) {
      //         case "waiting":
      //             currentAIRespEle.dataset.status = "writing";

      //             if (respContent) {
      //                 currentAIRespEle.innerHTML = respContent;
      //                 rawHTMLResp += respContent;
      //             } else {
      //                 currentAIRespEle.innerHTML = "";
      //             }

      //             break
      //         case "writing":
      //             if (respContent) {
      //                 rawHTMLResp += respContent;
      //                 currentAIRespEle.innerHTML = window.Markdown2HTML(rawHTMLResp);
      //             }

      //             scrollChatToDown();
      //             break
      //     }
      // }

      // if (isChatRespDone) {
      //     sse.close();
      //     sse = null;

      //     let markdownConverter = new window.showdown.Converter();
      //     currentAIRespEle.innerHTML = window.Markdown2HTML(rawHTMLResp);

      //     Prism.highlightAll();
      //     window.EnableTooltipsEverywhere();

      //     scrollChatToDown();
      //     appendChats2Storage(RoleAI, currentAIRespEle.innerHTML, chatID);
      //     unlockChatInput();
      // }
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
