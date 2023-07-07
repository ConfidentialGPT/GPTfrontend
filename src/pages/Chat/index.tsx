import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import Menu from 'components/Menu'
import { RootPathName, getRoutes, RouteDataProps } from '../routes'
// import Header from 'components/Header'
import './index.scss'

const { Sider, Content } = Layout

export const getRootRoute = (user: any) => {
  return getRoutes(user).find((route: RouteDataProps) => route.path === RootPathName)
}

const Admin = () => {
  return (
    <Layout className="chat-layout">
      <Sider theme="light" className="chat-sidebar">
        <Layout.Header className="chat-sidebar-logo">GPT</Layout.Header>
        <Content className="chat-menu-container">
          <Menu />
        </Content>
      </Sider>
      <Layout>
        <Content className="chat-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default Admin
