import { QueueElement, Queue, RawVideo, Video } from './types';

class QueueManager {
  #fixedQueue = [] as Queue;
  #queue = [] as Queue;

  #isReversed = false;
  #isRandom = false;

  #onChangeHandle;

  constructor(onChangeHandle: (queue: Queue, newVideoNumber?: number) => void) {
    this.#onChangeHandle = onChangeHandle;
    this.#isRandom = false;
  }

  add(element: QueueElement) {
    if (element.type.toLowerCase().includes('video')) {
      const rawVideo: RawVideo = element.video;

      const video: Video = {
        title: rawVideo.videoDetails.title,
        author: rawVideo.videoDetails.author,
        durationSec: rawVideo.videoDetails.durationSec,
        url: rawVideo.videoDetails.video_url,
        bestThumbnail: rawVideo.videoDetails.bestThumbnail,
        thumbnails: rawVideo.videoDetails.thumbnails,
      };

      this.#fixedQueue.push(video);
      this.#queue.push(video);
      this.#queue = [...this.#queue];
    } else if (element.type.toLowerCase().includes('playlist')) {
      const playlist = element.playlist.items;

      const videos: Queue = [];

      playlist.forEach((video) => {
        videos.push({
          title: video.title,
          author: video.author,
          durationSec: video.durationSec,
          url: video.shortUrl,
          bestThumbnail: video.bestThumbnail,
          thumbnails: video.thumbnails,
        });
      });

      this.#fixedQueue = this.#fixedQueue.concat(videos);
      this.#queue = this.#queue.concat(videos);
    } else return;

    this.onChange();
  }

  randomize(currentVideo?: number) {
    this.#isRandom = !this.#isRandom;

    let newVideoNumber = 0;

    if (this.#isRandom) this.#queue = shuffle(this.#fixedQueue, currentVideo);
    else if (this.#isReversed) {
      this.#queue = [...this.#fixedQueue];
      this.#queue.reverse();
      this.#queue = [...this.#queue];
    } else {
      newVideoNumber = currentVideo !== undefined ? this.findVideoInQueue(this.#queue[currentVideo].url) : 0;
      this.#queue = [...this.#fixedQueue];
    }

    this.onChange(newVideoNumber);
  }

  isRandomized() {
    return this.#isRandom;
  }

  reverse() {
    this.#isReversed = !this.#isReversed;

    this.#queue.reverse();
    this.#queue = [...this.#queue];

    this.onChange();
  }

  isReversed() {
    return this.#isReversed;
  }

  onChange(newVideoNumber?: number) {
    if (this.#onChangeHandle === undefined) return;
    this.#onChangeHandle(this.#queue, newVideoNumber);
  }

  findVideoInQueue(videoUrl: string) {
    let queuePosition = 0;
    for (const video of this.#fixedQueue) {
      if (video.url.includes(videoUrl)) {
        return queuePosition;
      }
      queuePosition++;
    }
    return 0;
  }
}

function shuffle(array: Queue, currentVideo?: number) {
  const arr = [...array];
  let currentVideoObj;
  if (currentVideo !== undefined) {
    currentVideoObj = arr[currentVideo];
    arr.splice(currentVideo, 1);
  }
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  if (currentVideoObj) {
    arr.unshift(currentVideoObj);
  }
  return arr;
}

export default QueueManager;
