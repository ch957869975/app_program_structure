/*
 * @Author: chenghao
 * @Date: 2018-12-10 20:00:10
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-12-11 11:22:58
 * @desc: http实例
 */
import HttpRequest from './axios'
import { BASE_URL } from '../config/host'

const axios = new HttpRequest(BASE_URL)
export default axios
