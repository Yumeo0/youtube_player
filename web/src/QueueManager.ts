import * as types from './types';

class QueueManager {
  #fixedQueue = [] as types.Queue
  #queue = [] as types.Queue
  #reversedQueue = [] as types.Queue

  #isReversed = false
  #isRandom = false

  #onChangeHandle

  constructor (onChangeHandle: Function) {
    this.#onChangeHandle = onChangeHandle
    this.#isRandom = false
  }

  add (element: types.QueueElement) {
    if (element.type.toLowerCase().includes("video")) {
      let rawVideo: types.RawVideo = element.video;

      let video: types.Video = {
        title: rawVideo.videoDetails.title,
        author: rawVideo.videoDetails.author,
        durationSec: rawVideo.videoDetails.durationSec,
        url: rawVideo.videoDetails.video_url,
        bestThumbnail: rawVideo.videoDetails.bestThumbnail,
        thumbnails: rawVideo.videoDetails.thumbnails,
      }

      this.#fixedQueue.push(video)
      this.#queue.push(video)
      this.#queue = [...this.#queue]
    } else if (element.type.toLowerCase().includes("playlist")) {
      let playlist = element.playlist.items;

      let videos: types.Queue = []

      playlist.forEach(video => {
        videos.push({
          title: video.title,
          author: video.author,
          durationSec: video.durationSec,
          url: video.shortUrl,
          bestThumbnail: video.bestThumbnail,
          thumbnails: video.thumbnails,
        })
      })

      this.#fixedQueue = this.#fixedQueue.concat(videos)
      this.#queue = this.#queue.concat(videos)
    } else return

    this.onChange()
  }

  randomize () {
    this.#isRandom = !this.#isRandom

    if (this.#isRandom) this.#queue = shuffle(this.#fixedQueue)
    else if(this.#isReversed) {
      this.#queue = [...this.#fixedQueue]
      this.#queue.reverse()
      this.#queue = [...this.#queue]
    }
    else this.#queue = [...this.#fixedQueue]

    this.onChange()
  }

  reverse () {
    this.#isReversed = !this.#isReversed

    this.#queue.reverse()
    this.#queue = [...this.#queue]

    this.onChange()
  }

  onChange () {
    if (this.#onChangeHandle === undefined) {
      console.error('No Change Function passed')
      return
    }
    this.#onChangeHandle(this.#queue)
  }
}

function shuffle (array: types.Queue) {
  let arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default QueueManager
