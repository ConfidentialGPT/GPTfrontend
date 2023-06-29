import { RouteObject } from 'react-router-dom'
import Root from './Root'
import Home from './Root/Home'
import Login from './Login'
import { HomeOutlined } from '@ant-design/icons'
import { UserState } from 'rtk/features/user/userSlice'

export interface RouteDataProps extends RouteObject {
  icon?: React.ReactNode
  children?: RouteDataProps[]
  name?: string
  hideInMenu?: boolean
  permission?: number
}

export const RootPath = '/'

const routes: RouteDataProps[] = [
  {
    path: RootPath,
    element: <Root />, //一级路由，不作为菜单项
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
  }
]

const filterRoutes = (routes: RouteDataProps[], userRole?: number) => {
  return routes.filter((route) => {
    if (
      route.permission === undefined ||
      (userRole !== undefined && route.permission >= userRole)
    ) {
      if (route.children) {
        route.children = filterRoutes(route.children, userRole)
      }
      return true
    }

    return false
  })
}

export const getRoutes = (user?: UserState) => {
  if (user) {
    return filterRoutes(routes, user.role)
  }

  return routes
}

export default routes
