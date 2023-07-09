import { LoadingOutlined } from '@ant-design/icons'
import { MsgProps } from './utils'

const ChatItem = (props: { msg: MsgProps }) => {
  const { msg } = props

  return (
    <div className="chat-content-item">
      <div
        className={
          'chat-content-item-box chat-content-item-box-' +
          msg.role +
          (msg.loading ? ' chat-content-item-loading' : '')
        }>
        {msg.content}
      </div>
      {msg.loading && <LoadingOutlined rev={undefined} />}
    </div>
  )
}

export default ChatItem
