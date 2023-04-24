class QueueManager {
  #fixedQueue = []
  #queue = []
  #reversedQueue = []

  #isReversed = false
  #isRandom = false

  #onChangeHandle

  constructor (onChangeHandle) {
    this.#onChangeHandle = onChangeHandle
  }

  add (element) {
    if (element.type === 'video') {
      let video = element.video;

      video = {
        title: video.videoDetails.title,
        author: video.videoDetails.author,
        durationSec: video.videoDetails.durationSec,
        url: video.videoDetails.video_url,
        bestThumbnail: video.videoDetails.bestThumbnail,
        thumbnails: video.videoDetails.thumbnails,
      }

      this.#fixedQueue.push(video)
      this.#queue.push(video)
      this.#queue = [...this.#queue]
    } else if (element.type === 'playlist') {
      let playlist = element.playlist.items;

      let videos = []

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

function shuffle (array) {
  let arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default QueueManager
