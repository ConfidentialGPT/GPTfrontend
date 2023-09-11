import ChatTemplate from '../ChatTemplate'
import './index.scss'

const CasualChat = () => {
  return (
    <ChatTemplate
      title="Casual Chat with GPT-3.5"
      model="GPT-3.5"
      id="casual"
      maxTokenSize={3700}
    />
  )
}

export default CasualChat
