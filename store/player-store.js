import {
  HYEventStore
} from "hy-event-store"
import {
  getSongDetail,
  getSongLyric
} from '../service/api_player'
import {
  parseLyric
} from '../utils/parse-lyric'
const audioContext = wx.createInnerAudioContext()

const playerStore = new HYEventStore({
  state: {
    isFirst: true,
    id: 0,
    currentSong: {},
    duration: 0,
    lyricInfos: [],
    currentLyric: "",
    currentLyricIndex: 0,
    currentTime: 0,
    playModelIndex: 0, //0:循环播放 1:单曲循环 2:随机播放
    isPlaying: false,

    playListSongs: [],
    playListIndex: 0
  },
  actions: {
    playMusicWithSongId(ctx, {
      id
    }) {
      if (ctx.id === id) return
      ctx.isPlaying = true

      ctx.isPlaying = true
      ctx.currentSong = {}
      ctx.duration = 0
      ctx.lyricInfos = []
      ctx.currentTime = 0
      ctx.currentLyricIndex = 0
      ctx.currentLyric = ''
      //请求数据
      ctx.id = id
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0],
          ctx.duration = res.songs[0].dt
      })
      getSongLyric(id).then(res => {
        const lyricResult = parseLyric(res.lrc.lyric)
        ctx.lyricInfos = lyricResult,
          ctx.currentLyric = lyricResult[0].lyricText
      })
      //播放该歌曲
      //创建播放器
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.autoplay = true
      if (ctx.isFirst) {
        this.dispatch('setupAudioContextListenerAction')
        ctx.isFirst = false
      }
    },
    setupAudioContextListenerAction(ctx) {
      //监听歌曲可以播放
      audioContext.onCanplay(() => {
        audioContext.play()
      })
      audioContext.onEnded(() => {
        this.dispatch('changeCurrentSongs', {
          mode: 'next'
        })
      })
      //监听歌曲时间变化
      audioContext.onTimeUpdate(() => {
        //获取当前播放的时间
        const currentTime = audioContext.currentTime * 1000
        //生成当前播放时间的进度条
        //生成当前句歌词
        const currentLyricIndex = ctx.lyricInfos.findIndex(item => item.timestamp > currentTime) - 1
        if (currentLyricIndex !== -2) {
          const currentLyricText = ctx.lyricInfos[currentLyricIndex].lyricText
          if (ctx.currentLyric !== currentLyricText) {
            ctx.currentLyric = ctx.lyricInfos[currentLyricIndex].lyricText
            ctx.currentLyricIndex = currentLyricIndex
          }
        } else {
          ctx.currentLyric = ctx.lyricInfos[ctx.lyricInfos.length - 1].lyricText
          ctx.currentLyricIndex = currentLyricIndex
        }
        ctx.currentTime = currentTime
      })
    },
    changeMusicPlayStatusAction(ctx) {
      ctx.isPlaying = !ctx.isPlaying
      ctx.isPlaying ? audioContext.play() : audioContext.pause()
    },
    changeCurrentSongs(ctx, {
      mode
    }) {
      if (mode === 'next') {
        if (ctx.playModelIndex === 2) {
          ctx.playListIndex = Math.floor(Math.random() * ctx.playListSongs.length)
        } else {
          if (ctx.playListIndex === ctx.playListSongs.length - 1) {
            ctx.playListIndex = 0
          } else {
            ctx.playListIndex++
          }
        }
        this.dispatch('playMusicWithSongId', {
          id: ctx.playListSongs[ctx.playListIndex].id
        })
      } else if (mode === 'prev') {
        if (ctx.playListIndex === 0) {
          ctx.playListIndex = ctx.playListSongs.length - 1
        } else {
          ctx.playListIndex--
        }
        this.dispatch('playMusicWithSongId', {
          id: ctx.playListSongs[ctx.playListIndex].id
        })
      }
    }
  }
})
export {
  audioContext,
  playerStore
}