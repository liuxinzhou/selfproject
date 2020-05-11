import Config from '../../utils/config.js'
//获取应用实例
const app = getApp()

Page({
  data: {
    person: {
      "idCard": "",
      "tel": "",
      "userName": "",
      "userinfo": {
        "currAddress": "",
        "isDuty": "",
        "isOtherFeverCough": "",
        "isSelfFeverCough": "",
        "temperature": ""
      }
    },
    nowdate: new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate(),
    companyName:'春光幼儿园贝贝二班'
  },
  bindUsername(e) {
    let person = this.data.person
    person.userName = e.detail.value
    this.setData({
      person: person
    })
    console.log(this.data.person)
  },
  bindIdCard(e) {
    let person = this.data.person
    person.idCard = e.detail.value
    this.setData({
      person: person
    })
    console.log(this.data.person)
  },
  bindtel(e) {
    let person = this.data.person
    person.tel = e.detail.value
    this.setData({
      person: person
    })
    console.log(this.data.person)
  },
  isOtherFeverCoughChange(e) {
    let person = this.data.person
    person.userinfo.isOtherFeverCough = e.detail.value
    this.setData({
      person: person
    })
    console.log(this.data.person)
  },
  isSelfFeverCoughChange(e) {
    let person = this.data.person
    person.userinfo.isSelfFeverCough = e.detail.value
    this.setData({
      person: person
    })
    console.log(this.data.person)
  },
  isDutyChange(e) {
    let person = this.data.person
    person.userinfo.isDuty = e.detail.value
    this.setData({
      person: person
    })
    console.log(this.data.person)
  },
  bindAddress(e) {
    let person = this.data.person
    person.userinfo.currAddress = e.detail.value
    this.setData({
      person: person
    })
    console.log(this.data.person)
  },
  bindtemperature(e) {
    let person = this.data.person
    person.userinfo.temperature = e.detail.value
    this.setData({
      person: person
    })
    console.log(this.data.person)
  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    this.getUserInfo()
  },
  getUserInfo: function(e) {
    let that = this
    // 登录
    wx.login({
      success: res => {
        console.log(res)
        wx.request({
          method: 'POST',
          url: `${Config.url}/authorize/code2Session?jsCode=${res.code}`,
          success(res) {
            if (res.data.code == 200) {
              app.globalData.openid = res.data.openid
              wx.request({
                url: `${Config.url}/wxuser/info?openId=${res.data.openid}`,
                success(res) {
                  if (res.data.code == 200) {
                    let person = that.data.person
                    let userinfo = that.data.person.userinfo
                    if (res.data.user) {
                      for (let key in that.data.person) {
                        person[key] = res.data.user[key]
                      }
                      person.userName = res.data.user.name
                      person.userinfo = userinfo
                    }
                    if (res.data.healthinfo) {
                      for (let key in that.data.person.userinfo) {
                        person.userinfo[key] = res.data.healthinfo[key]
                      }
                    }

                    that.setData({
                      person: person
                    })
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  saveUserInfo() {
    let isNull = false
    for (let key in this.data.person) {
      console.log(this.data.person[key])
      if (this.data.person[key] == "") {
        isNull = true
      }
    }
    if (!isNull) {
      for (let key in this.data.person.userinfo) {
        if (this.data.person.userinfo[key] == "") {
          isNull = true
        }
      }
    }
    if (isNull) {
      wx.showToast({
        title: '请填写所有信息',
        icon: 'none'
      })
      return
    }
    let paramsData = this.data.person
    paramsData.openId = app.globalData.openid
    wx.request({
      method: 'POST',
      url: `${Config.url}/userinfo/add`,
      data: paramsData,
      success(res) {
        console.log(res)
        if (res.data.code == 200) {
          wx.showToast({
            title: '提交成功',
          })
        } else {
          wx.showToast({
            title: '提交失败,请再次尝试',
            icon: 'none'
          })
        }
      }
    })
  }
})