const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorization: true,
    receiveTaskList: [],
    sessionKey:'',
    currentPage:1,
    height:wx.getSystemInfoSync().windowHeight,
    total:0
  },
  /**
   *  领取任务
   */
  receiveWork(e) {
    wx.request({
      url: `${app.globalData.baseurl}/voice/weChat/receive`,
      header: {
        "Authorization": `Bearer ${app.globalData.Authorization}`
      },
      data: {
        "accent": wx.getStorageSync("accentTypeIndex")*1+1,
        "age": wx.getStorageSync("ageindex")*1+1,
        "id": e.currentTarget.dataset.id,
        "sex": wx.getStorageSync("sexindex")*1+1,
        "type": wx.getStorageSync("accentindex")*1+1
      },
      method: 'POST',
      success(res){
        if(res.data.code==200){
          wx.showToast({
            title: '真棒，任务领取成功',
            icon:'none'
          })
          wx.switchTab({
            url: '/pages/myTask/myTask',
          })
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.message,
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
      }
    })



  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.login({
      success: function(res) {
        wx.request({
          url: `${app.globalData.baseurl}/wechat/user/code2Session?code=${res.code}`,
          header: {
            'e-app-id': app.globalData.appId
          },
          method: 'GET',
          success(res) {
            if (res.data.code == 200) {
              if (res.data.data.authorization && wx.getStorageSync('userifno')){
                 app.globalData.Authorization = res.data.data.authorization
                app.globalData.sessionKey = res.data.data.sessionKey
                 that.gettaskList(res.data.data.authorization)
                 that.setData({
                   authorization:true,
                 })
               }else{
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

  },
  gettaskList(authorization) {
    let that = this
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
          res.data.data.records.map((obj)=>{
            let flag=false
            oldreceiveTaskList.map(newobj=>{
              if (obj.id == newobj.id){
                flag=true
              }
            })
            if (!flag){
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
    console.log(app.globalData.Authorization,'AuthorizationAuthorizationAuthorizationAuthorization')
    this.setData({
      receiveTaskList: []
    })
    if (app.globalData.Authorization && wx.getStorageSync('userifno')){
      this.gettaskList()
    }else{
      wx.showModal({
        title: '提示',
        content: "请设置个人信息",
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