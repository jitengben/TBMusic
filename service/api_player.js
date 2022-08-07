import tbRequest from './index'
export function getSongDetail(ids) {
  return tbRequest.get('/song/detail', {
    ids
  })
}

export function getSongLyric(id){
  return tbRequest.get('/lyric',{
    id
  })
}