// components/song-menu-area/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: "默认歌单"
    },
    songMenu: {
      type: Array,
      value: []
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
    handleSongMenuItemClick(event) {
      const id = event.currentTarget.dataset.item.id
      wx.navigateTo({
        url: `/pages/detail-songs/index?id=${id}&type=menu`,
      })
    },
    handleMoreClick() {
      this.triggerEvent('click')
    }
  }
})