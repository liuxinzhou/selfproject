const plugin = requirePlugin("WechatSI")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    innerAudioContext: "",
    src:''
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //创建内部 audio 上下文 InnerAudioContext 对象。
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.onError(function (res) {
      console.log(res);
      wx.showToast({
        title: '语音播放失败',
        icon: 'none',
      })
    })
  },

  yuyinPlay: function (e) {
    if (this.data.src == '') {
      console.log(暂无语音);
      return;
    }
    this.innerAudioContext.src = this.data.src
    this.innerAudioContext.play();
  },
  textToSpeech() {
    let that = this
    plugin.textToSpeech({
      lang: 'zh_CN',
      content: 'ABCD',
      success(res) {
        console.log(res)
        that.setData({
          src: res.filename
        })
        that.yuyinPlay()
      }
    })
  }
})