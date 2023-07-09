import { LoadingOutlined } from '@ant-design/icons'
import { MsgProps } from './utils'

const ChatItem = (props: { msg: MsgProps }) => {
  const { msg } = props

  return (
    <div className="chat-content-item">
      <pre
        className={
          'chat-content-item-box chat-content-item-box-' +
          msg.role +
          (msg.loading ? ' chat-content-item-loading' : '')
        }>
        {msg.content}
      </pre>
      {msg.loading && <LoadingOutlined rev={undefined} />}
    </div>
  )
}

export default ChatItem
