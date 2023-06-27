import React from 'react'
import { LoadingOutlined } from '@ant-design/icons'

interface LoadingProps {
  backgroundColor?: string
  color?: string
  padding?: number
}

const Loading: React.FC<LoadingProps> = ({ backgroundColor, color, padding }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: padding || 0,
        bottom: padding || 0,
        left: padding || 0,
        right: padding || 0,
        background: backgroundColor || '#ffffff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: color || '#00a2ff',
        zIndex: 999
      }}>
      <LoadingOutlined style={{ fontSize: 36 }} rev={undefined}></LoadingOutlined>
    </div>
  )
}
export default Loading
