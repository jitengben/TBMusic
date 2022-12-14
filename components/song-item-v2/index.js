// components/song-item-v2/index.js
import {
  playerStore
} from '../../store/index'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    index: {
      type: Number,
      value: 0
    },
    item: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleSongItemClick() {
      wx.navigateTo({
        url: `/pages/music-player/index?id=${this.properties.item.id}`,
      })
      playerStore.dispatch('playMusicWithSongId', {
        id: this.properties.item.id
      })
    }
  }
})