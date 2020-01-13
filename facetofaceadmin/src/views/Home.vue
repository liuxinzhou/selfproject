<template>
  <div>
    <div class="ff-header-box">
      <div class="ff-header">
        <div class="sysname">微风拾音后台管理系统</div>
        <el-menu
          :default-active="activeIndex2"
          class="el-menu-demo"
          mode="horizontal"
          background-color="#545c64"
          text-color="#fff"
          router
          active-text-color="#ffd04b">
          <el-menu-item :index="item.path" v-for="(item,index) in menus" :key="index">{{item.name}}</el-menu-item>
        </el-menu>
      </div>
      <div class="ff-info">
        <span class="user-info">{{username}}</span>
        <span @click="exit" class="exitstyle el-icon-refresh-left">退出</span>
      </div>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'home',
    components: {},
    data () {
      return {
        activeIndex2: '/',
        username: '',
        menus: [
          {
            id: '1',
            name: '词语',
            path: '/'
          },
          {
            id: '2',
            name: '组合',
            path: 'group-page'
          },
          {
            id: '3',
            name: '说话人',
            path: 'speek-person'
          },
          {
            id: '4',
            name: '任务控制定义',
            path: 'work-seting'
          },
          {
            id: '5',
            name: '采集任务发布',
            path: 'push-work'
          },
          {
            id: '6',
            name: '待处理任务',
            path: 'wait-work'
          },
          {
            id: '7',
            name: '已完成任务',
            path: 'comptele-work'
          },
          {
            id: '8',
            name: '语料统计',
            path: 'word-total'
          }
        ]
      }
    },
    created () {
      this.activeIndex2 = this.$route.path.length == 1 ? this.$route.path : this.$route.path.replace('/', '')
    },
    mounted () {
      try {
        let userinfo = JSON.parse(localStorage.userinfo)
        this.username = userinfo.userQueryVo.nickname
      } catch (e) {
        this.$router.push('/tologin')
      }
    },
    methods: {
      exit () {
        localStorage.clear()
        this.$router.push('/tologin')
      }
    }
  }
</script>
<style lang="less" scoped>
  .ff-header-box {
    display: flex;
    background: #545c64;
    .ff-header {
      width: 100%;
      display: flex;
      .sysname {
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        border-right: 1px solid;
        padding: 15px;
        margin: 5px;
      }
    }
    .ff-info {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
      width: 200px;
      color: #ffffff;
      .user-info {
        margin-right: 20px;
      }
      .exitstyle {
        cursor: pointer;
        color: #d6d6d6;
      }
    }
  }

  .main {
    padding: 20px;
    height: 100%;
  }
</style>
