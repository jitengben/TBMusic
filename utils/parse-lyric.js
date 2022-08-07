//[03:55.81]谁说站在光里的才算英雄
const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

export function parseLyric(lyric) {
  const lyricResult = []
  const lyricArray = lyric.split('\n')
  for (const item of lyricArray) {
    const result = timeRegExp.exec(item)
    if (result) {
      //获取时间
      const minute = result[1]
      const second = result[2]
      const millSecond = result[3].length === 2 ? result[3] * 10 : result[3] * 1
      const timestamp = minute * 60 * 1000 + second * 1000 + millSecond
      const lyricText = item.replace(timeRegExp, "")
      if (lyricText) {
        lyricResult.push({
          timestamp,
          lyricText
        })
      }
    }
  }
  return lyricResult
}