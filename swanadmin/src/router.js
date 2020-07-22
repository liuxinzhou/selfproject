import Vue from 'vue'
import Router from 'vue-router'
const InfoCountWap = resolve => require(['@/views/infoConut/info-count-wap'], resolve)
const InfoCount = resolve => require(['@/views/infoConut/info-count'], resolve)
const Login = resolve => require(['@/views/login'], resolve)

Vue.use(Router)

var router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/infocount', // infocount
      name: 'InfoCount',
      component: InfoCount,
      meta: {
        title: '信息统计'
      }
    },
    {
      path: '/infocountwap', // infocount
      name: 'InfoCountwap',
      component: InfoCountWap,
      meta: {
        title: '信息统计'
      }
    },
    {
      path: '/',
      name: 'Login',
      component: Login,
      meta: {
        title: '登录'
      }
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.fullPath !== '/') {
    if (!sessionStorage.userinfo) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})
export default router
