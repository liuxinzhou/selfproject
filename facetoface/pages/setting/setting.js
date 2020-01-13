const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    agearray: [{ key: '1', value: '儿童(1-9)' }, { key: '2', value: '少年(10-17)' }, { key: '3', value: '青年(18-40)' }, { key: '4', value: '中年(41-64)' }, { key: '5', value: '老年(65以上)' }],
    ageindex: '',
    accentarray: [{ key: '1', value: '普通话' }, { key: '2', value: '方言' }],
    accentindex: '',
    accentTypeArray: [{ key: '1', value: '南方口音' }, { key: '2', value: '北方口音' }, { key: '3', value: '东北口音' }, { key: '4', value: '两广口音' }],
    accentTypeIndex: '',
    items: [
      { name: '1', value: '男' },
      { name: '2', value: '女' }
    ],
    sexindex: ''
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      sexindex: e.detail.value-1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ageindex: wx.getStorageSync('ageindex')*1,
      sexindex: wx.getStorageSync('sexindex')*1,
      accentindex: wx.getStorageSync('accentindex')*1,
      accentTypeIndex: wx.getStorageSync('accentTypeIndex')*1
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      ageindex: e.detail.value
    })
  },
  bindPickerTypeChange(e) {
    this.setData({
      accentTypeIndex: e.detail.value
    })
  },
  bindAccentChange(e) {
    this.setData({
      accentindex: e.detail.value
    })
  },
  bindgetuserinfo(e) {
    console.log(e)
    let that = this
    wx.request({
      url: `${app.globalData.baseurl}/wechat/user/bind`,
      header: {
        'e-app-id': app.globalData.appId,
        'e-session-key': app.globalData.sessionKey
      },
      data: {
        "encryptedData": e.detail.encryptedData,
        "iv": e.detail.iv,
        "rawData": e.detail.rawData,
        "signature": e.detail.signature
      },
      method: 'POST',
      success(res) {
        if (res.data.code == 200) {
          if (res.data.data.authorization) {
            app.globalData.Authorization = res.data.data.authorization
            that.savesetting()
          } else {
            that.setData({
              authorization: false
            })
          }
        }
      },
      fail() {
        wx.openSetting()
        that.savesetting()
      },
      complete(res) {
        console.log(res, 'receiveTaskList')
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
   * 保存设置信息
   */
  savesetting() {
    if ('' + this.data.ageindex == '' || '' + this.data.sexindex == '' || '' + this.data.accentindex == '' || '' +this.data.accentTypeIndex == '') {
      wx.showToast({
        title: '请填写全部个人信息',
        icon: 'none'
      })
    } else {
      wx.setStorageSync("userifno", true)
      wx.setStorageSync("ageindex", ''+this.data.ageindex)
      wx.setStorageSync("sexindex", ''+this.data.sexindex)
      wx.setStorageSync("accentindex", ''+this.data.accentindex)
      wx.setStorageSync("accentTypeIndex", ''+this.data.accentTypeIndex)
      wx.showToast({
        title: '保存成功',
        icon: 'none'
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