import { Layout } from 'antd'

import './index.scss'
import { RobotOutlined } from '@ant-design/icons'

const CasualChat = () => {
  return (
    <Layout className="chat-page">
      <Layout.Header className="chat-header">
        <RobotOutlined rev={undefined} /> Casual Chat with GPT-3.5
      </Layout.Header>
      <Layout.Content className="chat-content">
        <div className="chat-scroll-zone"></div>
      </Layout.Content>
      <Layout.Footer className="chat-input"></Layout.Footer>
    </Layout>
  )
}

export default CasualChat
