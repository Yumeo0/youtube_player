import { QueueElement, Queue, RawVideo, Video } from './types';

class QueueManager {
  #fixedQueue = [] as Queue;
  #queue = [] as Queue;

  #isReversed = false;
  #isRandom = false;

  #onChangeHandle;

  constructor(onChangeHandle: (queue: Queue) => void) {
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

  randomize() {
    this.#isRandom = !this.#isRandom;

    if (this.#isRandom) this.#queue = shuffle(this.#fixedQueue);
    else if (this.#isReversed) {
      this.#queue = [...this.#fixedQueue];
      this.#queue.reverse();
      this.#queue = [...this.#queue];
    } else this.#queue = [...this.#fixedQueue];

    this.onChange();
  }

  reverse() {
    this.#isReversed = !this.#isReversed;

    this.#queue.reverse();
    this.#queue = [...this.#queue];

    this.onChange();
  }

  onChange() {
    if (this.#onChangeHandle === undefined) return;
    this.#onChangeHandle(this.#queue);
  }
}

function shuffle(array: Queue) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default QueueManager;
