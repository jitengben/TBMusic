// pages/detail-search/index.js

import {
  getHotSearch,
  getSearchSuggest,
  getSearchResult
} from '../../service/api_search'
import {
  stringToNodes
} from '../../utils/string2nodes'
import debounce from '../../utils/debounce'

const debounceGetSearchSuggest = debounce(getSearchSuggest)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotList: [],
    suggestSongs: [],
    suggestSongsNodes: [],
    searchValue: '',
    resultSongs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData()
  },
  getPageData: function () {
    getHotSearch().then(res => {
      this.setData({
        hotList: res.result.hots
      })
    })
  },

  //处理搜索逻辑
  handleSearchChange: function (event) {
    const searchValue = event.detail
    this.setData({
      searchValue
    })
    if (!searchValue) {
      this.setData({
        suggestSongs: []
      })
      this.setData({
        suggestSongsNodes: []
      })
      this.setData({
        resultSongs: []
      })
      debounceGetSearchSuggest.cancel()
      return
    }
    debounceGetSearchSuggest(searchValue).then(res => {
      // if (this.data.searchValue.length === 0) return
      const suggestSongs = res.result.allMatch
      this.setData({
        suggestSongs
      })
      const suggestKeywords = suggestSongs.map(item => item.keyword)
      const suggestSongsNodes = []
      for (const keyword of suggestKeywords) {
        const nodes = stringToNodes(keyword, searchValue)
        suggestSongsNodes.push(nodes)
        suggestSongsNodes.sort((pre, next) => {
          return next.length - pre.length
        })
        this.setData({
          suggestSongsNodes
        })
      }
    })
  },

  handleSearchAction: function () {
    getSearchResult(this.data.searchValue).then(res => {
      this.setData({
        resultSongs: res.result.songs
      })
    })
  },
  //监听搜索条目的点击
  handleSearchItemClick: function (event) {
    //拼接好要搜索的内容
    const currentItem = event.currentTarget.dataset.value
    let searchValue = ''
    currentItem.forEach(item => {
      searchValue += item.children[0].text
    })
    //将点击的条目内容设置到searchvalue中
    this.setData({
      searchValue
    })
    //发送网络请求
    this.handleSearchAction()
  },
  //监听点击热门搜索
  handleHotSeacrhClick: function (event) {
    const name = event.currentTarget.dataset.name
    this.setData({
      searchValue: name
    })
    this.handleSearchAction()
  }
})