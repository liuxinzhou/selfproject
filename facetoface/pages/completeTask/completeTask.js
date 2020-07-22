const app = getApp()
const conf = require('../../utils/conf.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    receiveTaskList: [],
    total: 0,
    currentPage: 1,
    languageIndex:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  playAudio(e) {
    console.log(e)
    wx.navigateTo({
      url: `/pages/soundDetail/soundDetail?id=${e.currentTarget.dataset.audio.id}`,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    that.setData({
      language: app.globalData.language,
      languageIndex:app.globalData.languageIndex
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
        },
        fail(res) {
          console.log("navigationBarTitle生命周期函数--监听页面加载")
          app.globalData.language = conf.language[0]
          wx.setNavigationBarTitle({
            title: app.globalData.language.navigationBarTitle,
          })
          that.setData({
            language: app.globalData.language
          })
        }
      })
    }
    this.setData({
      receiveTaskList: [],
      currentPage: 1
    })
    this.gettaskList()
  },
  gettaskList(authorization) {
    let that = this
    if (app.globalData.Authorization && wx.getStorageSync('userifno')) {
      wx.request({
        url: `${app.globalData.baseurl}/voice/weChat/completeTaskList`,
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
          } else {
            wx.showModal({
              title: that.data.language.toast,
              content: that.data.language.setingToast,
              confirmText:that.data.language.submit,
              success(res) {
                if (res.confirm) {
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
        complete(res) {
          console.log(res, 'receiveTaskList')
        }
      })
    } else {
      wx.showModal({
        title: that.data.language.toast,
        content: that.data.language.setingToast,
        confirmText:that.data.language.submit,
        showCancel: false,
        success(res) {
          if (res.confirm) {
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
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      currentPage: 1
    })
    this.gettaskList(app.globalData.Authorization)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
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
  onShareAppMessage: function() {

  }
})