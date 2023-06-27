import './index.scss'
import { Button, Form, Input, message } from 'antd'
import userApi from 'api/user'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import md5 from 'js-md5'
import store from 'rtk/store'
import { setUserInfo } from 'rtk/features/user/userSlice'

const Login = () => {
  const [form] = Form.useForm<{ name: string; password: string }>()
  const [loading, setLoading] = useState<boolean>(false)

  const navigate = useNavigate()

  const doLogin = useCallback(async () => {
    setLoading(true)

    try {
      const value = await form.validateFields()
      const response: any = await userApi.login({
        name: value.name,
        password: md5(value.password)
      })
      if (response.code === 200) {
        message.success('登录成功')
        store.dispatch(setUserInfo(response.data))
        navigate('/')
      } else {
        console.error(response.msg)
        message.error(response.msg)
      }
      // const data = (await userApi.login() as UserDataProps
      // setUserInfo(data)
    } catch (e: any) {
      message.error(e)
    }

    setLoading(false)
  }, [])

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-info">
          <p className="title"></p>
        </div>
        <Form
          onKeyDown={(e) => {
            if (e.key === 'Enter') doLogin()
          }}
          form={form}
          className="login-box"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 24 }}>
          <div className="login-title">登录</div>
          <Form.Item name="name" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input
              prefix={<UserOutlined rev={undefined} />}
              size="large"
              placeholder="请输入用户名"
            />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password
              prefix={<LockOutlined rev={undefined} />}
              size="large"
              placeholder="请输入密码"
            />
          </Form.Item>

          <Button
            size="large"
            block
            className="login-btn"
            type="primary"
            onClick={doLogin}
            loading={loading}>
            登录
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default Login
