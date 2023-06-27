import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import Menu from 'components/Menu'
import { AdminPathName, getRoutes, RouteDataProps } from '../routes'
import Header from 'components/Header'
import './index.scss'

const { Sider, Content } = Layout

export const getAdminRoute = (user: any) => {
  return getRoutes(user).find((route: RouteDataProps) => route.path === AdminPathName)
}

const Admin = () => {
  return (
    <Layout className="admin-layout">
      <Sider theme="light" className="admin-sidebar">
        <Layout.Header className="admin-sidebar-logo">GPT</Layout.Header>
        <Content className="admin-menu-container">
          <Menu />
        </Content>
      </Sider>
      <Layout>
        <Header />
        <Content className="admin-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default Admin
