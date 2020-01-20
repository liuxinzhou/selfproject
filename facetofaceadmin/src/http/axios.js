import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
// import qs from 'qs'

let ROOT = 'https://wfsy.tsingmicro.com/framework' // http://152.136.13.150:8888  https://wfsy.tsingmicro.com
Vue.use(VueAxios, axios)

// 将全局的根地址绑定到axios的默认基础路径
Vue.axios.defaults.baseURL = ROOT

// 设置公共请求header信息
Vue.axios.defaults.headers = {
  'Content-Type': 'application/json;charset=UTF-8'
}

/**
 * sendPost请求
 * @param url
 * @param params 参数默认为空对象
 * @returns {Promise}
 */
export function sendPost (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        resolve(response.data)
      }).catch(err => {
      reject(err)
    })
  })
}

/**
 * sendGet请求
 * @param url
 * @param params 参数默认为空对象
 * @returns {Promise}
 */
export function sendGet (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, data)
      .then(response => {
        resolve(response.data)
      }).catch(err => {
      reject(err)
    })
  })
}

// http request拦截器
Vue.axios.interceptors.request.use(
  (config) => {
    if (localStorage.userinfo) {
      let loginToken = JSON.parse(localStorage.userinfo || {})
      if (loginToken) {
        config.headers['Authorization'] = 'Bearer ' + loginToken.authorization
      }
    }
    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// http response 拦截器
Vue.axios.interceptors.response.use(
  (response) => {
    if (response.status == 200) {
      var resultMap = response.data
      if (resultMap) {
        if (!resultMap.code) {
          return response
        } else {
          if (resultMap.code == 200) {
            return response
          } else if (resultMap.code == 403) {
            // window.location.href = '/tologin'
          } else {
            return response
          }
        }
      }
    } else {
      return response
    }
  },
  (error) => {
    // window.location.href = '/tologin'
    return Promise.reject(error)
  }
)
export default axios
