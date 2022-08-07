export default function getQueryRect(selector) {
  return new Promise((resolve) => {
    const query = wx.createSelectorQuery()
    //通过监听图片加载完成后，获取图片的高度设置轮播图的高度
    query.select(selector).boundingClientRect()
    query.exec(resolve)
  })
}