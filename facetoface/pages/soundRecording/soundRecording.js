
const plugin = requirePlugin("WechatSI")
// 获取**全局唯一**的语音识别管理器**recordRecoManager**
const manager = plugin.getRecordRecognitionManager()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    streamRecordFlag: false,
    index: 0,
    toolip: '按住开始录音',
    currentText: '',
    resultMsg: '',
    words: [],
    info: {}
  },
  /**
     * 按住按钮开始语音识别
     */
  streamRecord: function (e) {
    wx.showLoading({
      title: '录音中',
    })
    this.setData({
      resultMsg: ''
    })
    console.log("streamrecord", e)
    manager.start({
      lang: "zh_CN",
    })
  },
  /**
   * 松开按钮结束语音识别
   */
  streamRecordEnd: function (e) {
    wx.showLoading({
      title: '信息识别中',
      mask: true
    })
    console.log('streamRecordEnd', e)
    manager.stop()
    // this.submitRecord()
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
        status: status,
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
     * 初始化语音识别回调
     * 绑定语音播放开始事件
     */
  initRecord: function () {
    console.log('initRecord')
    let that = this
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = (res) => {
      console.log('initRecord', res)

      let text = res.result
      that.setData({
        currentText: text,
      })
    }
    // 识别结束事件
    manager.onStop = (res) => {
      wx.hideLoading()
      console.log('onStop', res)
      let text = res.result
      if (text == "") {
        wx.showToast({
          title: '我没有听清,请您大声说话',
          icon: 'none'
        })
        return
      }
      let localword = that.data.info.entryList
      let speekWord = that.data.words
      let status = ''
      text = text.replace(/,/g, '');
      text = text.replace(/\./g, '');
      text = text.replace(/，/g, '');
      text = text.replace(/。/g, '');

      if (text.indexOf(speekWord.name) > -1 || speekWord.name.indexOf(text) > -1) {
        status = 2
        this.submitRecord(res.tempFilePath, status)
        let nextIndex = that.data.index + 1
        if (nextIndex == localword.length) {
          wx.switchTab({
            url: '/pages/completeTask/completeTask',
          })
        } else {
          that.setData({
            currentText: text,
            toolip: '按住开始录音',
            resultMsg: '',
            index: nextIndex,
            words: that.data.info.entryList[nextIndex]
          })
        }
      } else {
        speekWord.speek = speekWord.speek + 1
        // localword[nextIndex] = speekWord
        status = 1
        this.submitRecord(res.tempFilePath, status)
        if (speekWord.speek < 3) {
          that.setData({
            currentText: text,
            toolip: '再说一次',
            words: speekWord,
            resultMsg: '发音错误'
          })
        } else {
          let nextIndex = that.data.index + 1
          console.log(nextIndex)
          if (nextIndex == localword.length) {
            wx.switchTab({
              url: '/pages/completeTask/completeTask',
            })
          } else {
            that.setData({
              currentText: text,
              toolip: '按住开始录音',
              resultMsg: '',
              index: nextIndex,
              words: that.data.info.entryList[nextIndex]
            })
          }
        }

      }
    }

    // 识别错误事件
    manager.onError = (res) => {

      that.setData({
        recording: false,
        bottomButtonDisabled: false,
      })

    }

    // // 语音播放开始事件
    wx.onBackgroundAudioPlay(res => {

      const backgroundAudioManager = wx.getBackgroundAudioManager()
      let src = backgroundAudioManager.src

      that.setData({
        currentTranslateVoice: src
      })

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
          if (res.data.data.status==2){
            wx.showModal({
              title: that.data.language.toast,
              content: that.data.language.setingToast,
              confirmText:that.data.language.submit,
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.switchTab({
                    url: 'pages/myTask/myTask',
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                  wx.switchTab({
                    url: 'pages/myTask/myTask',
                  })
                }
              }
            })
            return
          }
          res.data.data.entryList.map(obj => {
            obj.speek = 0
          })
          that.setData({
            info: res.data.data,
            words: res.data.data.entryList[that.data.index]
          })
        }else{
          wx.showModal({
            title: that.data.language.toast,
            content: that.data.language.setingToast,
            confirmText:that.data.language.submit,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.switchTab({
                  url: 'pages/myTask/myTask',
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
                wx.switchTab({
                  url: 'pages/myTask/myTask',
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
    this.initRecord()
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