import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

const WordPage = resolve => require(['@/views/wordPage/word-page'], resolve)
const GroupPage = resolve => require(['@/views/groupPage/group-page'], resolve)
const SpeekPerson = resolve => require(['@/views/speekPerson/speek-person'], resolve)
const WorkSeting = resolve => require(['@/views/workSeting/work-seting'], resolve)
const PushWork = resolve => require(['@/views/pushWork/push-work'], resolve)
const WaitWork = resolve => require(['@/views/waitWork/wait-work'], resolve)
const CompteleWork = resolve => require(['@/views/compteleWork/comptele-work'], resolve)
const WordTotal = resolve => require(['@/views/wordTotal/word-total'], resolve)

Vue.use(Router)

var router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [{
        path: '/',
        name: 'word-page',
        component: WordPage,
        meta: {
          title: '词条'
        }
      },
        {
          path: '/group-page',
          name: 'group-page',
          component: GroupPage,
          meta: {
            title: '组合'
          }
        },
        {
          path: '/speek-person',
          name: 'speek-person',
          component: SpeekPerson,
          meta: {
            title: '说话人'
          }
        },
        {
          path: '/work-seting',
          name: 'work-seting',
          component: WorkSeting,
          meta: {
            title: '任务控制定义'
          }
        },
        {
          path: '/push-work',
          name: 'push-work',
          component: PushWork,
          meta: {
            title: '采集任务发布'
          }
        },
        {
          path: '/wait-work',
          name: 'wait-work',
          component: WaitWork,
          meta: {
            title: '待处理任务'
          }
        },
        {
          path: '/comptele-work',
          name: 'comptele-work',
          component: CompteleWork,
          meta: {
            title: '已完成任务'
          }
        },
        {
          path: '/word-total',
          name: 'word-total',
          component: WordTotal,
          meta: {
            title: '语料统计'
          }
        }
      ]
    },
    {
      path: '/tologin',
      name: 'login',
      component: () => import(/* webpackChunkName: "about" */ './views/login.vue')
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.fullPath !== '/tologin') {
    if (!localStorage.userinfo) {
      next('/tologin')
    } else {
      next()
    }
  } else {
    next()
  }
})
export default router
