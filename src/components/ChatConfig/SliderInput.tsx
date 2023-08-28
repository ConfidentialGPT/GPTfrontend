import { Row, Col, Slider, InputNumber } from 'antd'
import { SliderSingleProps } from 'antd/es/slider'

const SliderInput = (props: SliderSingleProps) => {
  const { value, onChange, step, min, max } = props
  return (
    <Row gutter={16}>
      <Col flex={1}>
        <Slider {...props} />
      </Col>
      <Col>
        <InputNumber
          step={step || 1}
          value={value}
          min={min}
          max={max}
          onChange={(v: number | null) => {
            if (onChange) onChange(v || 0)
          }}
        />
      </Col>
    </Row>
  )
}

export default SliderInput
