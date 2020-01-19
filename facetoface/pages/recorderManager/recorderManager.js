// pages/recorderManager/recorderManager.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    speekCount: '点击开始录音',
    speekFlag:false,
    src: 'https://si-1300127975.cos.ap-beijing.myqcloud.com/videos/%E6%88%91%E6%98%AF%E4%BD%A0%E7%9A%84%E5%BD%951579182262364.mp3',
    audioCtx: '',
    words: [{
      name: '我是录音词语',
      speekLimit: 3
    }, {
      name: '我是描述词语',
      speekLimit: 2
    }],
    index: 1
  },
  startRecord() {
    this.setData({
      speekCount: 1,
      speekFlag:true
    })
    let that = this
    let interval = setInterval(() => {
      let count = this.data.speekCount + 1
      if (that.data.words[that.data.index].speekLimit < count){
        this.setData({
          speekCount: 1
        })
      }else{
        this.setData({
          speekCount: count
        })
      }
     
    }, 1000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.audioCtx = wx.createAudioContext('myAudio')

  },
  /**
   * 播放示例录音
   */
  audioPlay: function () {
    this.audioCtx.play()
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