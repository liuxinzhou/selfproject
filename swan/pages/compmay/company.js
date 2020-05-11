import Config from '../../utils/config.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowdate: new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate(),
    array: [{
      compnayId: '1',
      companyName: '西湾堡乡政府',
      showerror: false
    }],
    index: ''
  },
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value,
      showerror: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getUserInfo()
  },

  intosetInfo() {
    if (this.data.index == '') {
      this.setData({
        showerror: true
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/info/setinfo',
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})