// pages/detail-menu/index.js

import {
  getSongMenuTags,
  getSongMenu
} from '../../service/api_music'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songMenuList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const promises = []
    getSongMenuTags().then(res => {
      const songMenuList = []
      res.tags.forEach(item => {
        songMenuList.push({
          name: item.name,
          list: []
        })
        promises.push(getSongMenu(item.name))
      })
      Promise.all(promises).then(res => {
        songMenuList.forEach((item, index) => {
          if (item.name === res[index].cat) {
            item.list = res[index].playlists
          }
        })
        this.setData({
          songMenuList
        })
      })
    })
  },
  songItemClick: function (event) {
    const id = event.currentTarget.dataset.item.id
    wx.navigateTo({
      url: `/pages/detail-songs/index?id=${id}&type=menu`,
    })
  }
})