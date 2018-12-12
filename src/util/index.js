/*
 * @Author: chenghao
 * @Date: 2018-12-11 09:39:36
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-12-11 19:06:08
 * @desc: util方法
 */
import { VIEW } from '../config'

export const USER_KEY = 'userInfo'
export const TOKEN_KEY = 'token'
export const APP_KEY = 'appName'

/**
 *设置用户信息
 * @param {object} user 用户信息
 */
export const setUserInfo = user => {
  plus.storage.setItem(USER_KEY, JSON.stringify(user))
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  const user = plus.storage.getItem(USER_KEY)
  if (user) return JSON.parse(user)
  return ''
}

/**
 *设置token
 * @param {string} token
 */
export const setToken = token => {
  plus.storage.setItem(TOKEN_KEY, token)
}

/**
 * 获取token
 */
export const getToken = () => {
  const token = plus.storage.getItem(TOKEN_KEY)
  if (token) return token
  return ''
}

/**
 *设置应用名称
 * @param {string} token
 */
export const setAppName = name => {
  plus.storage.setItem(APP_KEY, name)
}

/**
 * 获取应用名称
 */
export const getAppName = () => {
  const name = plus.storage.getItem(APP_KEY)
  if (name) return name
  return ''
}

/**
 *自动消失消息框
 * @param {string | number} message 消息内容
 * @param {string} duration short | long 时长
 * @param {string} position top | center | bottom 通知框位置
 */
export const toast = (message, duration = 'short', position = 'bottom') => {
  plus.nativeUI.toast(message, {
    verticalAlign: position,
    duration: duration
  })
}

/**
 *删除文本内的空格
 * @param {string} str 需要被处理的字符串
 */
export const trim = str => {
  return str.replace(/\s+/g, '')
}

/**
 *删除文本中的html标签
 * @param {string} str 需要被处理的带html标签的文本
 */
export const removeTag = str => {
  return str.replace(/<[^>]+>/g, '')
}

/**
 *字符串时间转时间戳
 * @param {string} time
 */
export const getTimeStamp = time => {
  return Date.parse(new Date(time))
}

/**
 *判断内容是否包含emoji表情
 * @param {string} content
 */
export const haveEmoji = content => {
  const reg = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi
  return reg.test(content)
}

/**
 *调用相机
 * @param {function} callBack 拍照成功回调
 */
export const getCamera = callBack => {
  plus.camera.getCamera().captureImage(
    path => {
      callBack(path)
    },
    error => {
      toast(error.message)
    },
    {
      filename: '_doc/camera/',
      index: 1
    }
  )
}

/**
 *上传图片
 * @param {string} path 图片路径
 * @param {function} callBack 回调函数
 */
export const uploadImage = (path, callBack) => {
  const task = plus.uploader.createUpload(
    IMAGE_UPLOAD_CONFIG,
    {
      method: 'POST'
    },
    (t, status) => {
      if (status == 200) callBack(JSON.parse(t.responseText))
      else toast('图片上传失败')
    }
  )
  task.addFile(path, {
    key: 'file'
  })
  task.start()
}

/**
 *图片压缩
 * @param {string} src 图片源地址
 * @param {string} dst 存贮地址
 * @param {function} success 压缩成功回调
 * @param {function} fail 压缩失败回调
 * @param {number} quality 压缩质量
 */
export const compressImage = (src, dst, success, fail, quality = 40) => {
  plus.zip.compressImage(
    {
      src: src,
      dst: dst,
      overwrite: true,
      quality: quality
    },
    event => {
      success && success(event)
    },
    error => {
      fail && fail(error)
    }
  )
}

export const showWebview = (id, extras = {}, animation = 'slide-in-right', animationTime, isWaiting = false) => {
  const view = VIEW[id]
  // 打开webview
  mui.openWindow({
    url: view.url,
    id: view.id,
    extras: extras,
    show: {
      aniShow: animation,
      duration: animationTime
    },
    waiting: {
      autoShow: isWaiting
    }
  })
}
