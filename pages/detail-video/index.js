// pages/detail-video/index.js
import {
  getMVURL,
  getMVDetail,
  getRelatedVideo
} from '../../service/api_video'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvURLInfo: {},
    mvDetail: {},
    relatedVideos: {},
    poster: '',
    danmuList: [{
      text: '姬腾奔最帅～',
      color: '#ff0000',
      time: 1
    }, {
      text: '姬腾奔无敌帅～',
      color: '#ff00ff',
      time: 3
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id
    //请求页面数据
    this.getPageData(id)

  },
  handleVideoItemClick: function (event) {
    console.log(event.currentTarget.dataset)
    // const id = event.currentTarget.dataset.item.vid
    // wx.navigateTo({
    //   url: `/pages/detail-video/index?id=${id}`,
    // })
  },

  //获取页面数据
  getPageData: function (id) {
    //请求播放地址
    getMVURL(id).then(res => {
      this.setData({
        mvURLInfo: res.data
      })
    })
    //请求视频信息
    getMVDetail(id).then(res => {
      this.setData({
        mvDetail: res.data
      })
    })
    //请求相关视频
    getRelatedVideo(id).then(res => {
      this.setData({
        relatedVideos: res.data
      })
    })
  }

})