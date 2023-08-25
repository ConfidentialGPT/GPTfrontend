import { LoadingOutlined } from '@ant-design/icons'
import { MsgProps, Role } from './utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkExtendedTable from 'remark-extended-table'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism'

//https://github.com/remarkjs/remark/blob/main/doc/plugins.md#list-of-plugins

const ChatItem = (props: { msg: MsgProps }) => {
  const { msg } = props

  return (
    <div className="chat-content-item">
      {msg.role == Role.user ? (
        <p
          className={
            'chat-content-item-box chat-content-item-box-' +
            msg.role +
            (msg.loading ? ' chat-content-item-loading' : '')
          }>
          {msg.content}
        </p>
      ) : (
        <ReactMarkdown
          className={'chat-content-item-box chat-content-item-box-' + msg.role}
          remarkPlugins={[[remarkGfm, {}], remarkExtendedTable]}
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter {...props} style={coy} language={match[1]} PreTag="div">
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code {...props} className={className}>
                  {children}
                </code>
              )
            }
          }}>
          {msg.content}
        </ReactMarkdown>
      )}
      {msg.loading && <LoadingOutlined rev={undefined} />}
    </div>
  )
}

export default ChatItem
