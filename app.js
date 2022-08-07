// app.js
App({
  onLaunch: function () {
    const info = wx.getSystemInfoSync()
    this.globalData.statusBarHeight = info.statusBarHeight
    this.globalData.screenHeight = info.screenHeight
  },
  globalData: {
    statusBarHeight: 0,
    screenHeight: 0
  }
})