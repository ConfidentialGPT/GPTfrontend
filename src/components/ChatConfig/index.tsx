import { SettingOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import SliderInput from './SliderInput'
import PromptEditor from './PromptEdtior'

export interface ConfigProps {
  token: string
  contexts: number
  max_tokens: number
  temperature: number
  presence_penalty: number
  frequency_penalty: number
  system_prompt: string
}

export const DefaultConfig: ConfigProps = {
  token: 'FREETIER-xSzpUQkUf2dzgnfnCfTxz45lkRkKSAxb',
  contexts: 5,
  max_tokens: 1000,
  temperature: 0,
  presence_penalty: 0,
  frequency_penalty: 0,
  system_prompt:
    "The following is a conversation with Chat-GPT, an AI created by OpenAI. The AI is helpful, creative, clever, and very friendly, it's mainly focused on solving coding problems, so it likely provide code example whenever it can and every code block is rendered as markdown. However, it also has a sense of humor and can talk about anything. Please answer user's last question, and if possible, reference the context as much as you can."
}

interface ConfigFormProps {
  maxTokenSize?: number
  config?: ConfigProps
  onChange?: (config: ConfigProps) => void
}

const DefaultFormConfig: ConfigFormProps = {
  maxTokenSize: 4000
}

const ConfigForm = (props: ConfigFormProps) => {
  const [open, setOpen] = useState(false)

  const [form] = Form.useForm()

  const { onChange, config } = props

  const formConfig = useMemo(() => {
    return { ...DefaultFormConfig, props }
  }, [props])

  useEffect(() => {
    form.setFieldsValue({ ...DefaultConfig, ...config })
  }, [config])

  const onClose = useCallback(() => {
    if (onChange) {
      const values = form.getFieldsValue()
      onChange(values)
    }

    setOpen(false)
  }, [form, onChange])

  return (
    <>
      <Button
        style={{ marginLeft: 10 }}
        icon={<SettingOutlined rev={undefined} onClick={() => setOpen(true)} />}></Button>
      <Modal
        width={540}
        title="Configurations"
        open={open}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={onClose}
        maskClosable>
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 7 }}
          labelAlign="left"
          wrapperCol={{ span: 17 }}>
          <Form.Item name="token" label="token" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
            <Input></Input>
          </Form.Item>
          <Form.Item name="contexts" label="contexts">
            <SliderInput min={1} max={10} />
          </Form.Item>
          <Form.Item name="max_tokens" label="max tokens">
            <SliderInput min={1000} max={formConfig.maxTokenSize} step={100} />
          </Form.Item>
          <Form.Item name="temperature" label="temperature">
            <SliderInput min={0} max={2} step={0.1} />
          </Form.Item>
          <Form.Item name="presence_penalty" label="presence penalty">
            <SliderInput min={-2} max={2} step={0.1} />
          </Form.Item>
          <Form.Item name="frequency_penalty" label="frequency penalty">
            <SliderInput min={-2} max={2} step={0.1} />
          </Form.Item>
          <Form.Item
            name="system_prompt"
            label="system prompt"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}>
            <PromptEditor />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ConfigForm
