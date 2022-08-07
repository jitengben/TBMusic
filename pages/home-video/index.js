// pages/home-video/index.js
import {
  getTopMV
} from '../../service/api_video'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topMvs: [],
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载(类似于vue中的created)
   */
  onLoad: async function (options) {
    this.getTopMVData(0)
  },
  getTopMVData: async function (offset) {
    if (!this.data.hasMore && offset !== 0) return
    wx.showNavigationBarLoading()
    const res = await getTopMV(offset)
    let newData = this.data.topMvs
    if (offset === 0) {
      newData = res.data
    } else {
      newData = newData.concat(res.data)
    }
    this.setData({
      topMvs: newData
    })
    this.setData({
      hasMore: res.hasMore
    })
    wx.hideNavigationBarLoading()
    if (offset === 0) {
      wx.stopPullDownRefresh()
    }
  },
  //监听滚动到底部的生命周期
  onReachBottom: function () {
    this.getTopMVData(this.data.topMvs.length)
  },
  //监听下拉刷新，需要在index.json中配置 "enablePullDownRefresh": true,
  onPullDownRefresh: async function () {
    this.getTopMVData(0)
  },

  handleVideoItemClick: function (event) {
    const id = event.currentTarget.dataset.item.id
    wx.navigateTo({
      url: `/pages/detail-video/index?id=${id}`,
    })
  }
})