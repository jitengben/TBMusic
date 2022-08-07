// pages/music-player/index.js

import {
  audioContext,
  playerStore
} from '../../store/index'
const playModeNames = ['order', 'repeat', 'random']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    currentSong: {},
    currentPage: 0,
    contentHeight: 0,
    lyricInfos: [],

    duration: 0,
    currentTime: 0,
    sliderValue: 0,
    isSliderChanging: false,
    currentLyric: "",
    currentLyricIndex: 0,
    lyricScrollTop: 0,

    playModelIndex: 0,
    playModeName: 'order',

    isPlaying: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      id
    } = options
    this.setData({
      id
    })
    this.setupPlayerStoreListener()

    //获取内容的高度
    const {
      screenHeight,
      statusBarHeight
    } = getApp().globalData
    const contentHeight = screenHeight - statusBarHeight - 44
    this.setData({
      contentHeight
    })
  },


  //==============处理返回按钮的点击===================
  handleBackClick: function () {
    wx.navigateBack()
  },
  //===============处理播放模式的点击==================
  handleModeBtnClick: function () {
    let playModelIndex = this.data.playModelIndex + 1
    if (playModelIndex === 3) playModelIndex = 0
    playerStore.setState('playModelIndex', playModelIndex)
    this.setData({
      playModelIndex,
      playModeName: playModeNames[playModelIndex]
    })
  },

  //===============处理播放/暂停的点击=================
  handlePlayBtnClick: function () {
    playerStore.dispatch('changeMusicPlayStatusAction')
  },
  //==============处理上一首/下一首的点击=====================
  handlePrevBtnClick: function () {
    playerStore.dispatch('changeCurrentSongs', {
      mode: 'prev'
    })
  },
  handleNextBtnClick: function () {
    playerStore.dispatch('changeCurrentSongs', {
      mode: 'next'
    })
  },

  //==============处理轮播图的滚动=====================
  handleSwiperChange: function (event) {
    const current = event.detail.current
    this.setData({
      currentPage: current
    })
  },
  //=================处理slider的事件===================
  handleSliderChange: function (event) {
    //获取slider点击的值，为整数，满的是100
    const {
      value
    } = event.detail
    this.setData({
      sliderValue: value
    })
    //获取点击的时间
    const currentTime = this.data.duration * (value / 100)
    audioContext.pause()
    //设置当前播放的时间
    audioContext.seek(currentTime / 1000)
    //当sliderchanging不再滑动的时候触发的是change事件
    this.setData({
      isSliderChanging: false
    })
  },
  handleSliderChanging: function (event) {
    this.setData({
      isSliderChanging: true
    })
    const {
      value
    } = event.detail
    this.setData({
      currentTime: this.data.duration * value / 100
    })
  },

  //=========================监听playerstore=========================
  setupPlayerStoreListener: function () {
    playerStore.onStates(['id', 'currentSong', 'duration', 'lyricInfos', 'currentLyric'], ({
      currentSong,
      duration,
      lyricInfos
    }) => {
      if (currentSong) this.setData({
        currentSong
      })
      if (duration) this.setData({
        duration
      })
      if (lyricInfos) this.setData({
        lyricInfos
      })
    })

    playerStore.onStates(['currentLyric', 'currentLyricIndex', 'currentTime'], ({
      currentLyric,
      currentLyricIndex,
      currentTime
    }) => {
      if (currentTime && !this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.duration * 100
        this.setData({
          currentTime,
          sliderValue
        })
      }
      if (currentLyricIndex) {
        const lyricScrollTop = currentLyricIndex === -2 ? (this.data.lyricInfos.length - 1) * 35 : currentLyricIndex * 35
        this.setData({
          currentLyricIndex,
          lyricScrollTop
        })
      }
      if (currentLyric) {
        this.setData({
          currentLyric
        })
      }
    })

    playerStore.onStates(['playModelIndex', 'isPlaying'], ({
      playModelIndex,
      isPlaying
    }) => {
      if (playModelIndex !== undefined) {
        this.setData({
          playModelIndex,
          playModeName: playModeNames[playModelIndex]
        })
      }
      if (isPlaying !== undefined) {
        this.setData({
          isPlaying
        })
      }

    })
  },

})