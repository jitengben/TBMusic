import tbRequest from './index'

export function getHotSearch() {
  return tbRequest.get("/search/hot")
}

export function getSearchSuggest(keywords) {
  return tbRequest.get("/search/suggest", {
    keywords,
    type: 'mobile'
  })
}

export function getSearchResult(keywords) {
  return tbRequest.get("/search", {
    keywords
  })
}