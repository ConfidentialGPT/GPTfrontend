import { Outlet } from 'react-router-dom'
import { Routes, Route, IndexRouteProps, useLocation } from 'react-router-dom'
import { getRoutes, RouteDataProps } from 'pages/routes'
import { Suspense, useEffect, useState } from 'react'
import store from 'rtk/store'
import NProgress from 'nprogress'
import { getUserInfo } from 'api/user'
import { setUserInfo } from 'rtk/features/user/userSlice'

import 'nprogress/nprogress.css'
import './App.scss'

NProgress.configure({
  showSpinner: false
})

const mapRoutes = (routes: RouteDataProps[]) =>
  routes.map((route: RouteDataProps, i: number) => {
    const { path, element, index, children } = route
    const subRoutes = (children && mapRoutes(children)) || null
    if (index) {
      const props: IndexRouteProps = {
        index,
        element
      }
      return <Route key={path || i} {...props} />
    }

    return (
      <Route path={path} key={path} element={element}>
        {subRoutes}
      </Route>
    )
  })

const LazyLoad = () => {
  useEffect(() => {
    console.log('loading begin')
    NProgress.start()
    return () => {
      console.log('loading complete')
      NProgress.done()
    }
  }, [])

  return <></>
}

function App() {
  const location = useLocation()
  const [routes, setRoutes] = useState<RouteDataProps[]>([])

  useEffect(() => {
    getUserInfo().then((user) => {
      setRoutes(getRoutes(user))
      store.dispatch(setUserInfo(user))
    })
    return store.subscribe(() => {
      const user = store.getState().user.user
      setRoutes(getRoutes(user))
    })
  }, [])

  return (
    <div className="App">
      <Suspense fallback={<LazyLoad />}>
        {routes.length > 0 && <Routes location={location}>{mapRoutes(routes)}</Routes>}
      </Suspense>
      <Outlet />
    </div>
  )
}

export default App
