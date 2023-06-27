export type HMS = {
  hours: number,
  minutes: number,
  seconds: number
}

export type RawVideo = {
  formats: Format[],
  videoDetails: VideoDetails
}

export type Format = {
  mimeType: string,
  bitrate: number,
  url: string
}

export type VideoDetails = {
  author: Author,
  bestThumbnail: Thumbnail | undefined,
  lengthSeconds: number,
  durationSec: number,
  thumbnails: Thumbnail[], 
  title: string,
  video_url: string
}

export type Video = {
  author: Author,
  bestThumbnail: Thumbnail | undefined,
  durationSec: number,
  thumbnails: Thumbnail[], 
  title: string,
  url: string
}

export type Queue = Video[];

export type QueueElement = {
  status: number,
  type: string,
  video: RawVideo,
  playlist: Playlist
};

export type Playlist = {
  items: PlaylistVideo[]
};

export type PlaylistVideo = {
  author: Author,
  bestThumbnail: Thumbnail | undefined,
  durationSec: number,
  thumbnails: Thumbnail[], 
  title: string,
  shortUrl: string
}

export type Author = {
  channelID: string,
  name: string,
  url: string
}

export type Thumbnail = {
  height: number,
  width: number,
  url: string
}
