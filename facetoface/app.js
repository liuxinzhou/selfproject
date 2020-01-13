//app.js

const utils = require('./utils/util.js')

App({
  onLaunch: function () {
    this.getRecordAuth()
    
  },
  // 权限询问
  getRecordAuth: function() {
    wx.getSetting({
      success(res) {
        console.log("succ")
        console.log(res)
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
                // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                console.log("succ auth")
            }, fail() {
                console.log("fail auth")
            }
          })
        } else {
          console.log("record has been authed")
        }
      }, fail(res) {
          console.log("fail")
          console.log(res)
      }
    })
  },

  onHide: function () {
    wx.stopBackgroundAudio()
  },
  globalData: {
    baseurl: 'https://wfsy.tsingmicro.com/framework',
    history: [],
    appId:'wx493240612931798e',
    Authorization:'',
    sessionKey:''
  }
})