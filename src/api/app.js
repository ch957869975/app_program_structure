/*
 * @Author: chenghao
 * @Date: 2018-12-11 11:25:47
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-12-11 16:55:38
 * @desc: 系统配置类接口
 */
import axios from '../http'

/**
 * 获取系统名字
 */
export const getAppName = () => {
  return new Promise((resolve, reject) => {
    axios
      .request({
        url: '/api/sysConf/10000/sys_name',
        method: 'get'
      })
      .then(result => {
        resolve(result)
      })
      .catch(err => {
        reject(err)
      })
  })
}
