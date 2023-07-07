import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Menu, { MenuProps } from 'antd/es/menu'
import { RouteDataProps } from 'pages/routes'
import { MenuInfo, SubMenuType } from 'rc-menu/lib/interface'
import { useLocation, useNavigate, matchRoutes } from 'react-router-dom'
import { resolvePaths } from './helper'
import { getRootRoute } from 'pages/Chat'
import store from 'rtk/store'

type TitleClickFnType = Required<SubMenuType>['onTitleClick']
type MenuItem = Required<MenuProps>['items'][number]

const SiderMenu: React.FC = () => {
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const [route, setRoute] = useState<RouteDataProps>()

  const location = useLocation()
  const navigate = useNavigate()

  const getRoute = useCallback(() => {
    const user = store.getState().user.user
    setRoute(getRootRoute(user))
  }, [])

  useEffect(() => {
    getRoute()
    return store.subscribe(() => {
      getRoute()
    })
  }, [getRoute])

  const baseUrl = useMemo<string>(() => {
    return route?.path || '/'
  }, [route])

  const onSubMenuClick: TitleClickFnType = useCallback((info) => {
    setOpenKeys((openKeys) => {
      let _openKeys = [...openKeys]
      const { key } = info
      const index = openKeys.indexOf(key)
      if (index === -1) {
        // _openKeys.push(key)  支持打开多个菜单
        _openKeys = [key]
      } else {
        _openKeys = []
        // _openKeys.splice(index, 1)   支持关闭多个菜单
      }
      return _openKeys
    })
  }, [])

  const getMenuItems: (routes: RouteDataProps[]) => MenuItem[] = useCallback((routes) => {
    return routes
      .filter((r) => !r.hideInMenu)
      .map((route: RouteDataProps) => {
        const { path, children, name, icon } = route
        const subMenu = (children && getMenuItems(children)) || null
        const item = {
          key: path || '',
          label: name,
          icon,
          children: subMenu as MenuItem[],
          type: subMenu && subMenu.length > 0 ? 'subMenu' : 'menuItem'
        } as MenuItem
        if (subMenu) {
          // eslint-disable-next-line @typescript-eslint/no-extra-semi
          ;(item as SubMenuType).onTitleClick = onSubMenuClick
        }
        return item
      })
  }, [])

  const onClick = useCallback(
    (item: MenuInfo) => {
      navigate(resolvePaths([...item.keyPath, baseUrl]))

      //如果切换菜单，则需要更新展开的子菜单
      const _openKeys: string[] = []
      ;(openKeys || []).forEach((key) => {
        if (item.keyPath.includes(key)) {
          _openKeys.push(key)
        }
      })

      setOpenKeys(_openKeys)
      setSelectedKeys(item.keyPath)
    },
    [baseUrl]
  )

  useEffect(() => {
    setItems(getMenuItems(route?.children || []))
  }, [route])

  useEffect(() => {
    const matched = matchRoutes(route ? [route] : [], location)
    const keys = (matched || []).map((m) => m.route.path || '')
    setOpenKeys(keys)
    setSelectedKeys(keys)
  }, [location, route])

  return (
    <Menu
      theme="light"
      openKeys={openKeys}
      selectedKeys={selectedKeys}
      mode="inline"
      onClick={onClick}
      items={items}
    />
  )
}

export default SiderMenu
