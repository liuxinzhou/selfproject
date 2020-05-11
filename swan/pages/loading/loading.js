// pages/loading/loading.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getUserInfo: function (e) {
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
              // 通过该人的openID查询用户的组织信息

              // wx.request({
              //   url: `${Config.url}/wxuser/info?openId=${res.data.openid}`,
              //   success(res) {
              //     if (res.data.code == 200) {
              //       let person = that.data.person
              //       let userinfo = that.data.person.userinfo
              //       if (res.data.user) {
              //         for (let key in that.data.person) {
              //           person[key] = res.data.user[key]
              //         }
              //         person.userName = res.data.user.name
              //         person.userinfo = userinfo
              //       }
              //       if (res.data.healthinfo) {
              //         for (let key in that.data.person.userinfo) {
              //           person.userinfo[key] = res.data.healthinfo[key]
              //         }
              //       }
              //       that.setData({
              //         person: person
              //       })
              //     }
              //   }
              // })
            }
          }
        })
      }
    })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})