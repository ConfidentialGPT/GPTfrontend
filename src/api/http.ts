import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: '/api', // 可以根据需要替换为其他 URL
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(
  (config: any) => {
    // 在请求发送之前做一些处理，例如加入 token 等
    // const userInfo = getUserInfo()
    // config.headers['x-sjx-token'] = userInfo?.accessToken
    return config
  },
  (error: any) => {
    // 处理请求错误信息
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    // 处理响应数据
    // if (response.status !== 200) {
    //   // 统一处理状态码非 200 的情况

    //   return Promise.reject(response.data)
    // }
    return response.data
  },
  (error: AxiosError<any>) => {
    // 处理错误信息
    console.error('请求错误：', error)
    if (error.response) {
      if (error.response.status === 401) {
        // 处理 401 错误码的情况
        // console.error('需要登录！')
        window.location.href = '#/login'
      } else if (error.response.status >= 400 && error.response.status < 500) {
        // 处理 4xx 错误码的情况
        console.error('请求出错：', error.response.status, error.response.data)
      } else {
        // 处理 5xx 错误码的情况
        console.error('服务器出错：', error.response.status, error.response.data)
      }
    } else if (error.request) {
      console.error('请求未响应：', error.request)
    } else {
      console.error('请求出错：', error.message)
    }
    return Promise.reject(error)
  }
)

export default {
  async get<T>(url: string, params?: object): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.get(url, { params })
    return response as any
  },

  // POST 请求
  async post<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.post(url, data)
    return response as any
  },

  // PUT 请求
  async put<T>(url: string, data: any): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.put(url, data)
    return response as any
  }
}
