// pages/detail-songs/index.js
import {
  rankingStore,
  playerStore
} from '../../store/index'

import {
  getSongMenuDetail
} from '../../service/api_music'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ranking: '',
    songInfo: {},
    type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      type
    } = options
    this.setData({
      type
    })
    if (type === 'menu') {
      const {
        id
      } = options
      getSongMenuDetail(id).then(res => {
        this.setData({
          songInfo: res.playlist
        })
      })
    } else if (type === 'rank') {
      const {
        ranking
      } = options
      this.setData({
        ranking
      })

      rankingStore.onState(ranking, this.getRankingSongs)
    }

  },
  onUnload: function () {
    if (this.data.ranking) {
      rankingStore.offState(this.data.ranking, this.getRankingSongs)
    }
  },

  getRankingSongs(res) {
    this.setData({
      songInfo: res
    })
  },
  handleSongItemClick: function (event) {
    playerStore.setState('playListSongs', this.data.songInfo.tracks)
    playerStore.setState('playListIndex', event.currentTarget.dataset.index)
  }
})