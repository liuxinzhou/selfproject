const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toolip: '下一个词',
    playstartflag: false,
    index: 0,
    height: wx.getSystemInfoSync().windowHeight,
    words: [{
        id: 1,
        text: '发生错误',
        speek: 0,
        speekLimit: 3,
        src: 'https://vdept.bdstatic.com/5a4861774b72574566763954794a4659/596c374341376447/e69e82e76f475354e3175b3348de9d49608637673671bb06d2629d74b1f03e5856cf55a372aa534fe30fd8ed03bcadf9.mp4?auth_key=1577764509-0-0-cb1504031274afdec89f87a5860efdfa'
      },
      {
        id: 1,
        text: '我是兔兔',
        speek: 0,
        speekLimit: 3,
        src:'https://vdept.bdstatic.com/38633446756c7773784e727731657433/336171376d384646/dfeaf1ee9d739cc9d0f28e7a1e35be12a040c64399f283ce967ff92ae2b0d8236fa04bb84e16c8461dacae49b251b8b2.mp4?auth_key=1577766404-0-0-02a6b921140b9e0bbbc5e23335a92798'
      },
      {
        id: 1,
        text: '我是宝宝',
        speek: 0,
        speekLimit: 3,
        src:'https://vdept.bdstatic.com/737556636e6253627874486e6566566b/436954565263794c/79ef87c912b957489b44c31a6d26fe972b7924a6a9e3c2052014bb56958ecd8506603cc6a0f6655de505c05b17c3fba8.mp4?auth_key=1577766477-0-0-6865c9fe3ce067abb2dfa6c08cebde0b'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let that = this
    wx.request({
      url: `${app.globalData.baseurl}/voice/weChat/startTask`,
      header: {
        "Authorization": `Bearer ${app.globalData.Authorization}`
      },
      data: {
        id: options.id
      },
      method: 'POST',
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            words: res.data.data
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
    this.audioCtx = wx.createAudioContext('myAudio')

  },
  switchword() {
    wx.hideLoading()
    this.audioCtx.pause()
    this.setData({
      index: this.data.index + 1,
      playstartflag:false
    })
  },
  audioPlay: function() {
    this.setData({
      playstartflag: !this.data.playstartflag
    })
    if (this.data.playstartflag) {
      wx.showLoading({
        title: '播放中',
      })
      this.audioCtx.play()

    } else {
      wx.hideLoading()
      this.audioCtx.pause()
    }

  },
  audioPause: function() {},
  audio14: function() {
    this.audioCtx.seek(14)
  },
  audioStart: function() {
    this.audioCtx.seek(0)
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