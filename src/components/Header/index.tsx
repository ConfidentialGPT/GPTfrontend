import { Layout, Breadcrumb, Button } from 'antd'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { getRootRoute } from 'pages/Chat'
import { matchRoutes, useLocation } from 'react-router-dom'
import { RouteDataProps } from 'pages/routes'
import userApi from 'api/user'
import './index.scss'
import store from 'rtk/store'
import { setUserInfo } from 'rtk/features/user/userSlice'

const HeaderBreadcrumb: React.FC = () => {
  const [route, setRoute] = useState<RouteDataProps>()
  const location = useLocation()

  const getRoute = useCallback(() => {
    const user = store.getState().user
    setRoute(getRootRoute(user))
  }, [])

  useEffect(() => {
    getRoute()
    return store.subscribe(() => {
      getRoute()
    })
  }, [])

  const matched = useMemo(
    () =>
      ((route && matchRoutes([route], location)) || []).filter(
        (m) => (m.route as RouteDataProps)?.name
      ),
    [route, location]
  )

  return (
    <Breadcrumb
      separator=">"
      items={matched.map((m, i) => {
        const { route } = m
        const { path, name, icon } = route as RouteDataProps
        return {
          title: (
            <>
              {icon}
              {name}
            </>
          ),
          href: '#/admin/' + (path || '')
        }
      })}></Breadcrumb>
  )
}

const Header: React.FC = () => {
  const [user, setUser] = useState<any>()

  const logout = useCallback(async () => {
    userApi.logout()
    store.dispatch(setUserInfo(null))
  }, [])

  useEffect(() => {
    setUser(store.getState().user)
    store.subscribe(() => {
      setUser(store.getState().user)
    })
  }, [])

  return (
    <Layout.Header className="admin-header">
      <HeaderBreadcrumb />
      <div className="user-info">
        <span>欢迎，{user?.nickName}</span>
        <Button type="link" onClick={logout}>
          退出
        </Button>
      </div>
    </Layout.Header>
  )
}

export default Header
