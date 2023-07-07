import { RouteObject } from 'react-router-dom'
import Chat from './Chat'
import CasualChat from './Chat/Casual'
import Login from './Login'
import { RobotOutlined } from '@ant-design/icons'

export interface RouteDataProps extends RouteObject {
  icon?: React.ReactNode
  children?: RouteDataProps[]
  name?: string
  hideInMenu?: boolean
  permission?: number
}

export const RootPathName = '/'

const routes: RouteDataProps[] = [
  {
    path: RootPathName,
    element: <Chat />, //一级路由，不作为菜单项
    children: [
      {
        element: <CasualChat />, //二级路由，作为菜单项
        index: true,
        name: 'Casual Chat',
        icon: <RobotOutlined rev={undefined} />
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
