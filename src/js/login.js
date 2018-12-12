/*
 * @Author: chenghao
 * @Date: 2018-12-10 15:46:56
 * @Last Modified by: chenghao
 * @Last Modified time: 2018-12-11 17:49:10
 * @desc: 登录逻辑
 */
import _ from '../../lib/lodash'
import { getAppName } from '../api/app'
import { setAppName, toast } from '../util'
;(function(c, $) {
  new Vue({
    el: '#login_page',
    data() {
      return {
        isLogining: false // 是否正在登录
      }
    },
    created() {
      getAppName().then(res => {
        console.log('===系统名称===', JSON.stringify(res))
        if (res.msg !== 'success') return
        const {
          data: { paravalue }
        } = res
        toast(paravalue)
        setAppName(paravalue)
      })
    },
    mounted() {
      $.plusReady(() => {
        plus.navigator.setStatusBarStyle('light')
        /**
         * 禁止右滑
         */
        plus.webview.currentWebview().setStyle({
          popGesture: 'none'
        })
      })
    },
    methods: {
      forget() {
        // 忘记密码
        alert('hahahha')
      },
      validate() {
        // 表单校验
      },
      login() {
        // 登录
        alert('点击了登录')
      }
    }
  })
})(window, mui)
