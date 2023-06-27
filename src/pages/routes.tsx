import { Navigate, RouteObject } from 'react-router-dom'
import Admin from './Admin'
import Home from './Admin/Home'
import Login from './Login'
import {
  HomeOutlined,
} from '@ant-design/icons'

export interface RouteDataProps extends RouteObject {
  icon?: React.ReactNode
  children?: RouteDataProps[]
  name?: string
  hideInMenu?: boolean
  permission?: number
}

export const AdminPathName = '/admin'

const routes: RouteDataProps[] = [
  {
    path: AdminPathName,
    element: <Admin />, //一级路由，不作为菜单项
    children: [
      {
        element: <Home />, //二级路由，作为菜单项
        index: true,
        name: '首页',
        icon: <HomeOutlined rev={undefined} />
      }
    ]
  },
  {
    path: 'login',
    element: <Login />,
    hideInMenu: true
  },
  {
    path: '/',
    element: <Navigate to={AdminPathName} />
  }
]

const filterRoutes = (routes: RouteDataProps[], userRole: number) => {
  return routes.filter((route) => {
    if (route.permission === undefined || route.permission >= userRole) {
      if (route.children) {
        route.children = filterRoutes(route.children, userRole)
      }
      return true
    }

    return false
  })
}

export const getRoutes = (user: any) => {
  if (user) {
    return filterRoutes(routes, user.role)
  }

  return routes
}

export default routes
