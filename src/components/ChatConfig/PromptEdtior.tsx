import { Input, Row } from 'antd'
import { TextAreaProps } from 'antd/es/input/TextArea'

const PromptEditor = (props: TextAreaProps) => {
  return (
    <Row>
      <Input.TextArea {...props} />
    </Row>
  )
}

export default PromptEditor
