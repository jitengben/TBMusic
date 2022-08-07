// components/navigation-bar/index.js
Component({
  options: {
    multipleSlots: true //允许多个插槽
  },

  properties: {
    title: {
      type: String,
      value: '默认标题'
    }
  },


  data: {
    statusBarHeight: getApp().globalData.statusBarHeight
  },


  methods: {
    handleLeftClick(){
      this.triggerEvent('click')
    }
  }
})