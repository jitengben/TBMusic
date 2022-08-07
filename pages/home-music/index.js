// pages/home-music/index.js
import {
  getBannerData,
  getSongMenu
} from '../../service/api_music'
import getQueryRect from '../../utils/query-rect'
import {
  rankingStore,
  rankingMap,
  playerStore
} from '../../store/index'
import throttle from '../../utils/throttle'
const throttleGetQueryRect = throttle(getQueryRect)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    swiperHeight: 0,
    recommendSongs: [],
    hotSongMenu: [],
    recommendSongMenu: [],
    rankings: {
      0: {},
      2: {},
      3: {}
    },
    currentSong: {},
    isPlaying: false,
    playAnimState: "paused"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我开卷了～～'
    })
    //获取页面轮播图数据
    this.getPageData()
    playerStore.dispatch('playMusicWithSongId', {
      id: '1495012824'
    })
    //获取共享数据
    rankingStore.dispatch('getRankingDataAction')
    rankingStore.onState('hotRanking', (res) => {
      if (res.tracks) {
        const recommendSongs = res.tracks.slice(0, 6)
        this.setData({
          recommendSongs
        })
      }
    })
    rankingStore.onState('newRanking', this.handleRankingMenu(0))
    rankingStore.onState('originRanking', this.handleRankingMenu(2))
    rankingStore.onState('upRanking', this.handleRankingMenu(3))
    playerStore.onStates(['currentSong', 'isPlaying'], ({
      currentSong,
      isPlaying
    }) => {
      if (currentSong) {
        this.setData({
          currentSong
        })
      }
      if (isPlaying !== undefined) {
        this.setData({
          isPlaying,
          playAnimState: isPlaying ? 'running' : 'paused'
        })

      }
    })
  },

  getPageData: function () {
    getBannerData().then(res => {
      this.setData({
        banners: res.banners
      })
    })
    getSongMenu().then(res => {
      this.setData({
        hotSongMenu: res.playlists
      })
    })
    getSongMenu("华语").then(res => {
      this.setData({
        recommendSongMenu: res.playlists
      })
    })
  },

  handleSearchClick: function () {
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  },

  handleSwiperImageLoaded: function () {
    throttleGetQueryRect('.swiper-image').then(res => {
      this.setData({
        swiperHeight: res[0].height
      })
    })
  },


  //处理首页巅峰榜单数据
  handleRankingMenu: function (idx) {
    return (res) => {
      if (Object.keys(res).length === 0) return
      const {
        name,
        coverImgUrl,
        tracks,
        playCount
      } = res
      const rankingObj = {
        name,
        coverImgUrl,
        playCount,
        songList: tracks.slice(0, 3)
      }

      const newRankings = {
        ...this.data.rankings,
        [idx]: rankingObj
      }
      this.setData({
        rankings: newRankings
      })
    }
  },

  //处理推荐歌曲点击更多逻辑
  handleMoreClick: function () {
    this.handleNavigateToDetailSongs('hotRanking')
  },
  //处理热门歌单点击更多逻辑
  handleMoreClick: function () {
    wx.navigateTo({
      url: '/pages/detail-menu/index',
    })
  },
  handleRankingItemClick: function (event) {
    const idx = event.currentTarget.dataset.idx
    this.handleNavigateToDetailSongs(rankingMap[idx])
  },
  handlePlayBtnClick: function () {
    playerStore.dispatch('changeMusicPlayStatusAction')
  },
  handleNavigateToDetailSongs(rankingName) {
    wx.navigateTo({
      url: `/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
    })
  },

  handleSongItemClick: function (event) {
    playerStore.setState('playListSongs', this.data.recommendSongs)
    playerStore.setState('playListIndex', event.currentTarget.dataset.index)
  },

  handleAlbumClick: function () {
    wx.navigateTo({
      url: `/pages/music-player/index?id=${this.data.currentSong.id}`,
    })
  }
})