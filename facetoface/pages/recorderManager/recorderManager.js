var interval = ""
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    speekCount: 1,
    speeking: false,
    speekFlag: false,
    info: '',
    audioCtx: '',
    words: [],
    index: 0,
    speekSum: 1,
    recorderManager: '',
    language:'',
    languageIndex:app.globalData.languageIndex
  },
  /**
   * 开始录音
   */
  startRecord() {
    let that = this
    this.data.recorderManager.start({
      format: 'mp3',
      sampleRate:16000
    })
    this.data.recorderManager.onStart((e) => {
      that.setData({
        speekCount: 1,
        speekFlag: true,
        speeking: true,
      })
      interval = setInterval(() => {
        that.setData({
          speekCount: that.data.speekCount + 1
        })
      }, 1000)
    })
  },
  /**
   *  结束录音
   */
  stopRecord() {
    this.data.recorderManager.stop()
    this.data.recorderManager.onStop((e) => {
      console.log(e)
      if (e.fileSize>0) {
        this.submitRecord(e.tempFilePath)
        // 松开手结束录音
        clearInterval(interval)
        // 判断是否读完该词语
        if (this.data.speekSum == this.data.info.times) {
          if (this.data.index == (this.data.info.entryList.length - 1)) {
            wx.switchTab({
              url: '/pages/completeTask/completeTask',
            })
          } else {
            this.setData({
              speekCount: 1,
              speeking: false,
              speekFlag: false,
              speekSum: 1,
              index: this.data.index + 1,
              words: this.data.info.entryList[this.data.index + 1]
            })
          }

        } else {
          this.setData({
            speekCount: 0,
            speeking: false,
            speekSum: this.data.speekSum + 1
          })
        }
      }
      clearInterval(interval)
      this.setData({
        speekCount: 0,
        speeking: false
      })
    })
  },
  /**
   * 保存录音结果
   */
  submitRecord(tempFilePath, status) {
    let that = this
    wx.uploadFile({
      url: `${app.globalData.baseurl}/voice/weChat/submitRecord`,
      filePath: tempFilePath,
      header: {
        "Authorization": `Bearer ${app.globalData.Authorization}`
      },
      name: 'file',
      formData: {
        entryId: that.data.words.id,
        status: 1,
        taskReceiverId: that.data.info.id,
        files: [tempFilePath]
      },
      // data: formData,
      success(res) {
        const data = res.data
      },
      complete(res) {
        const data = res.data
        console.log(res, "上传结果")
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let recorderManager = wx.getRecorderManager()
    this.setData({
      recorderManager: recorderManager
    })
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
          if (res.data.data.speed == 1) {
            res.data.data.speed = that.data.language.nspeed
          } else if (res.data.data.speed == 2) {
            res.data.data.speed = that.data.language.fspeed
          } else if (res.data.data.speed == 3) {
            res.data.data.speed = that.data.language.lowspeed
          }
          that.setData({
            info: res.data.data,
            words: res.data.data.entryList[that.data.index]
          })
        } else {
          wx.showModal({
            title: that.data.language.toast,
            content: that.data.language.stopwork,
            confirmText:that.data.language.submit,
            showCancel:false,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.switchTab({
                  url: '/pages/myTask/myTask',
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
                wx.switchTab({
                  url: '/pages/myTask/myTask',
                })
              }
            }
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
    wx.setNavigationBarTitle({
      title: app.globalData.language.navigationBarTitle,
    })
    this.setData({
      language:app.globalData.language,
      languageIndex:app.globalData.languageIndex
    })
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