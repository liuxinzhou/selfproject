const app = getApp()
const conf = require('../../utils/conf.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorization: true,
    receiveTaskList: [],
    sessionKey: '',
    currentPage: 1,
    height: wx.getSystemInfoSync().windowHeight,
    total: 0,
    language: app.globalData.language
  },
  /**
   *  领取任务
   */
  receiveWork(e) {
    let that = this
    wx.request({
      url: `${app.globalData.baseurl}/voice/weChat/receive`,
      header: {
        "Authorization": `Bearer ${app.globalData.Authorization}`
      },
      data: {
        "accent": wx.getStorageSync("accentTypeIndex") * 1 + 1,
        "age": wx.getStorageSync("ageindex") * 1 + 1,
        "id": e.currentTarget.dataset.id,
        "sex": wx.getStorageSync("sexindex") * 1 + 1,
        "type": wx.getStorageSync("accentindex") * 1 + 1
      },
      method: 'POST',
      success(res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: that.data.language.receiveSuccess,
            icon: 'none'
          })
          wx.switchTab({
            url: '/pages/myTask/myTask',
          })
        } else {
          let message = that.data.language.reerrormsg
          if(res.data.message.indexOf("任务条件")>-1){
            message=res.data.message
            if(that.data.languageIndex==1){
              message = "The task condition is not in line with yourself, please check !"
            }
          }
          wx.showModal({
            title: that.data.language.toast,
            content: message,
            confirmText:that.data.language.submit,
            showCancel: false,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })



  },
  gettaskList(authorization) {
    let that = this
    if (app.globalData.Authorization && wx.getStorageSync('userifno')) {
      wx.request({
        url: `${app.globalData.baseurl}/voice/weChat/receiveTaskList`,
        header: {
          "Authorization": `Bearer ${app.globalData.Authorization}`
        },
        data: {
          current: that.data.currentPage,
          size: 10
        },
        method: 'POST',
        success(res) {
          if (res.data.code == 200) {
            let oldreceiveTaskList = that.data.receiveTaskList
            res.data.data.records.map((obj) => {
              let flag = false
              oldreceiveTaskList.map(newobj => {
                if (obj.id == newobj.id) {
                  flag = true
                }
              })
              if (!flag) {
                oldreceiveTaskList.push(obj)
              }
            })

            that.setData({
              receiveTaskList: oldreceiveTaskList,
              total: res.data.data.total
            })
          }
        },
        complete(res) {
          console.log(res, 'receiveTaskList')
        }
      })
    } else {
      wx.login({
        success: function (res) {
          wx.request({
            url: `${app.globalData.baseurl}/wechat/user/code2Session?code=${res.code}`,
            header: {
              'e-app-id': app.globalData.appId
            },
            method: 'GET',
            success(res) {
              if (res.data.code == 200) {
                if (res.data.data.authorization && wx.getStorageSync('userifno')) {
                  app.globalData.Authorization = res.data.data.authorization
                  app.globalData.sessionKey = res.data.data.sessionKey
                  that.gettaskList(res.data.data.authorization)
                  that.setData({
                    authorization: true,
                  })
                } else {
                  app.globalData.sessionKey = res.data.data.sessionKey
                  wx.switchTab({
                    url: '/pages/setting/setting',
                  })
                }
              }
            },
            complete(res) {
              console.log(res, 'dasfasf')
            }
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    that.setData({
      language: app.globalData.language
    })
    wx.setNavigationBarTitle({
      title: app.globalData.language.navigationBarTitle,
    })
    if (app.globalData.language == "") {
      wx.showActionSheet({
        itemList: ['汉语', 'English'],
        success(res) {
          console.log("navigationBarTitle生命周期函数--监听页面加载")
          app.globalData.language = conf.language[res.tapIndex]
          app.globalData.languageIndex=res.tapIndex + ""

          wx.setNavigationBarTitle({
            title: app.globalData.language.navigationBarTitle,
          })
          that.setData({
            language: app.globalData.language,
            languageIndex:res.tapIndex + ""
          })
          for (let i = 0; i < 4; i++) {
            wx.setTabBarItem({
              index: i,
              text: app.globalData.language.tabName[i],
            })
          }
        },
        fail(res) {
          console.log("navigationBarTitle生命周期函数--监听页面加载")
          app.globalData.language = conf.language[0]
          app.globalData.languageIndex=res.tapIndex + ""
          wx.setNavigationBarTitle({
            title: app.globalData.language.navigationBarTitle,
          })
          that.setData({
            language: app.globalData.language,
            languageIndex:res.tapIndex + ""
          })
          for (let i = 0; i < 4; i++) {
            wx.setTabBarItem({
              index: i,
              text: app.globalData.language.tabName[i],
            })
          }
        }
      })
     
    }
    this.setData({
      receiveTaskList: [],
      currentPage: 1
    })
    this.gettaskList()

  },
  isauthoriez() {
    let that = this
    console.log(app.globalData.Authorization, 'AuthorizationAuthorizationAuthorizationAuthorization')
    this.setData({
      receiveTaskList: []
    })
    if (app.globalData.Authorization && wx.getStorageSync('userifno')) {
    } else {
      wx.showModal({
        title: that.data.language.toast,
        content: that.data.language.setingToast,
        confirmText:that.data.language.submit,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.switchTab({
              url: '/pages/setting/setting',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      currentPage: 1
    })
    this.gettaskList(app.globalData.Authorization)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (parseInt(this.data.total / (this.data.currentPage * 10)) > 0) {
      this.setData({
        currentPage: this.data.currentPage + 1
      })
      this.gettaskList(app.globalData.Authorization)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})