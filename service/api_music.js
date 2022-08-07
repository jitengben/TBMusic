import tbRequest from './index'

export function getBannerData() {
  return tbRequest.get('/banner', {
    type: 1
  })
}

export function getRankings(idx) {
  return tbRequest.get('/top/list', {
    idx
  })
}

export function getSongMenu(cat = "全部", limit = 6, offset = 0) {
  return tbRequest.get('/top/playlist', {
    cat,
    limit,
    offset
  })
}

export function getSongMenuDetail(id) {
  return tbRequest.get("/playlist/detail/dynamic", {
    id
  })
}
//获取所有的标签用于获取detail-song页面数据
export function getSongMenuTags() {
  return tbRequest.get("/playlist/hot")
}