/*
 * @Author: chenghao
 * @Date: 2018-12-10 19:31:02
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-12-11 17:46:22
 * @desc: 网络请求封装
 */

import axios from '../../lib/axios'
import _ from '../../lib/lodash'
import { toast, getToken, setToken, showWebview } from '../util'

class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      timeout: 10000,
      withCredentials: true,
      headers: {
        common: {}
      }
    }
    return config
  }
  destroy(url) {
    delete this.queue[url]
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      config => {
        config.headers.common['Authorization'] = getToken()
        switch (config.method) {
          case 'post':
          case 'put':
            config.headers['Content-Type'] = 'application/json'
            _.forIn(config.data, (value, key) => {
              config.data[key] = typeof value === 'string' ? value.replace(/"/, '') : value
            })
            break
          case 'get':
            config.url = encodeURI(config.url)
            break
          default:
            break
        }
        this.queue[url] = true
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )
    // 响应拦截
    instance.interceptors.response.use(
      res => {
        this.destroy(url)
        if (res.data && res.data.msg !== 'success') {
          Notice.error({ title: res.data.msg, desc: `${res.data.msg}` })
        }
        return res.data
      },
      error => {
        console.log('===error===', JSON.stringify(error))
        this.destroy(url)
        if (!error.response) return toast('请求超时')
        switch (error.response.status) {
          case 401:
            toast('会话超时，请重新登录')
            setToken('')
            showWebview('login')
            break
          case 500:
            toast(`服务端发生异常,异常的接口地址为${error.response.data.path}`)
            break
          default:
            break
        }
        return Promise.reject(error)
      }
    )
  }
  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
