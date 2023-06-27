import http from './http'

export const USER_KEY = 'user_info_storage'

let user: any = null

export const getUserInfo = async () => {
  try {
    if (!user) {
      user = await api.getUserInfo()
    }
    return user
  } catch (e) {
    return null
  }
}

const api = {
  login(data: { name: string; password: string }) {
    return http.post('/user/login', data)
  },
  logout() {
    return http.get('/user/logout')
  },
  getUserInfo() {
    return http.get('/user/info')
  },

  getList(page: number, pageSize: number, search: any) {
    return http.get('/user/list', {
      page,
      pageSize,
      ...search
    })
  },

  getLeaders(id?: number) {
    return http.get('/user/leaders', {
      id
    })
  },

  getAssignable() {
    return http.get('/user/assignable-users')
  },

  insert(data: any) {
    return http.post('/user/add', data)
  },

  update(data: any) {
    return http.post('/user/update', data)
  },

  delete(id: string) {
    return http.post('/user/delete?id=' + id)
  }
}

export default api
