import tbRequest from './index'

export function getTopMV(offset) {
  return tbRequest.get('/top/mv', {
    offset,
    limit: 10
  })
}

export function getMVURL(id) {
  return tbRequest.get("/mv/url", {
    id
  })
}
/**
 * 请求mv的详情
 * @param {number} mvid MV的id
 */
export function getMVDetail(mvid) {
  return tbRequest.get('/mv/detail', {
    mvid
  })
}
/**
 * 
 * @param {id} id 
 */
export function getRelatedVideo(id) {
  return tbRequest.get('/related/allvideo', {
    id
  })
}