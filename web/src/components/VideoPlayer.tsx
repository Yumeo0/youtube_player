import { computed, signal } from '@preact/signals-react';
import { BiSkipPrevious, BiSkipNext, BiPause, BiPlay, BiVolumeFull, BiRevision, BiRotateRight } from 'react-icons/bi';
import { FaSpinner } from 'react-icons/fa6';
import { HMS, Format, Video, YoutubeResponse, RawVideo } from '../types';
import { useEffect } from 'react';

import './VideoPlayer.css';
import { Slider } from './ui/slider';
import { API_BASE } from '@/consts';

const audio = signal(undefined as unknown as HTMLAudioElement);
const videoRef = signal(undefined as unknown as HTMLVideoElement);

// Urls and selected Quality
//const videoQuality = signal(0);
//const audioQuality = signal(0);
const videoUrls = signal([] as Format[]);
const audioUrls = signal([] as Format[]);

// Player state
const bufferTime = 650;
const defaultVolume = 5;
const playing = signal(false);
const isTabFocused = signal(true);
const duration = signal(0);
const durationHMS = computed(() => convertSecondsToHMS(duration.value));
const currentTime = signal(0);
const currentTimeHMS = computed(() => convertSecondsToHMS(currentTime.value));
const loop = signal(false);

// Video element state
const isVideoReady = signal(false);

function VideoPlayer({
  video,
  onVideoEnd,
  onSkipVideo,
  onPreviousVideo,
}: {
  video: Video;
  onVideoEnd: () => void;
  onSkipVideo: () => void;
  onPreviousVideo: () => void;
}) {
  useEffect(() => {
    console.log('new video request');
    if (video?.url)
      fetch(`${API_BASE}/youtube`, {
        headers: { url: video.url },
      })
        .then((response) => response.json())
        .then((json: YoutubeResponse) => {
          if (json.video == undefined) return;
          console.log('new video loaded');

          const video: RawVideo = json.video;
          const formats = video.formats;

          if (formats.length < 1) {
            onVideoEnd();
            return;
          }

          let videoFormats = formats.filter((format: Format) => {
            console.log(format);
            return format.mimeType?.includes('video/mp4');
          });
          videoFormats = videoFormats.sort((a: Format, b: Format) => {
            return a.bitrate - b.bitrate;
          });
          videoUrls.value = videoFormats;

          let audioFormats = formats.filter((format: Format) => {
            return format.mimeType?.includes('audio');
          });
          audioFormats = audioFormats.sort((a: Format, b: Format) => {
            return a.bitrate - b.bitrate;
          });
          audioUrls.value = audioFormats;
          duration.value = video.videoDetails.lengthSeconds;

          navigator.mediaSession.metadata = new MediaMetadata({
            title: video.videoDetails.title,
            artist: video.videoDetails.author.name,
            album: video.videoDetails.title,
            artwork: video.videoDetails.thumbnails.map((thumbnail) => {
              const img: MediaImage = {
                src: thumbnail.url,
                sizes: `${thumbnail.width}x${thumbnail.height}`,
                type: 'image/png',
              };
              return img;
            }),
          });

          console.log(video);

          document.title = `${video.videoDetails.title} - YouTube Player`;

          audio.value.src = audioUrls.value[audioUrls.value.length - 1]?.url;
          videoRef.value.src = videoUrls.value[videoUrls.value.length - 1]?.url;
          audio.value.load();
          videoRef.value.load();
        })
        .catch((e) => console.log(e));
  }, [video]);

  useEffect(() => {
    navigator.mediaSession.setActionHandler('play', function () {
      play();
    });
    navigator.mediaSession.setActionHandler('pause', function () {
      play();
    });
    navigator.mediaSession.setActionHandler('previoustrack', function () {
      previous();
    });
    navigator.mediaSession.setActionHandler('nexttrack', function () {
      skip();
    });
    navigator.mediaSession.setActionHandler('seekto', function (e) {
      if (e.seekTime) audio.value.currentTime = e.seekTime;
    });
    navigator.mediaSession.setActionHandler('seekforward', function (e) {
      if (e.seekOffset) audio.value.currentTime = audio.value.currentTime + e.seekOffset;
    });
    navigator.mediaSession.setActionHandler('seekbackward', function (e) {
      if (e.seekOffset) audio.value.currentTime = audio.value.currentTime - e.seekOffset;
    });
    const audioElement = document.getElementById('audio') as HTMLAudioElement;
    if (audioElement == null) return;
    audio.value = audioElement;
    audio.value.volume = defaultVolume / 100;
    const volumeSlider: HTMLInputElement = document.getElementById('Volume') as HTMLInputElement;
    if (volumeSlider == null) return;
    volumeSlider.value = `${defaultVolume}`;

    videoRef.value = document.getElementById('video') as HTMLVideoElement;

    document.addEventListener('visibilitychange', function () {
      isTabFocused.value = !document.hidden;
    });
  }, []);

  function onVideoReady() {
    console.log('onVideoReady()');
    setTimeout(() => {
      isVideoReady.value = true;
      if (playing.value) resume();
    }, bufferTime);
  }

  function resume() {
    console.log('resume()');
    if (!isVideoReady.value) {
      const wait = () => {
        setTimeout(() => {
          resume();
        }, bufferTime);
      };
      wait();
    } else {
      videoRef.value.play().catch((e) => console.log(e));
      audio.value.play().catch((e) => console.log(e));
      navigator.mediaSession.playbackState = 'playing';
    }
  }

  function pause() {
    console.log('pause()');
    videoRef.value.pause();
    audio.value.pause();
    navigator.mediaSession.playbackState = 'paused';
  }

  function play() {
    console.log('play()');
    playing.value = !playing.value;
    if (playing.value) resume();
    else pause();
  }

  function skip() {
    console.log('skip()');
    onSkipVideo();
    pause();
  }

  function previous() {
    console.log('previous()');
    pause();
    onPreviousVideo();
  }

  function onProgress(e: React.SyntheticEvent<HTMLAudioElement, Event>) {
    if (e.target == null) return;
    const player = e.target as HTMLAudioElement;
    const time = player.currentTime;
    currentTime.value = time;

    navigator.mediaSession.setPositionState({
      duration: duration.value,
      playbackRate: 1,
      position: time,
    });
    // !isTabFocused.value ||
    if (time < 3) return;
    if (videoRef.value.currentTime < time - 0.25 || videoRef.value.currentTime > time + 0.25) {
      videoRef.value.currentTime = time;
    }
  }

  function changeVolume(e: number[]) {
    audio.value.volume = e[0] / 100;
  }

  function seekTo(e: number[]) {
    pause();
    audio.value.currentTime = e[0];
  }

  function videoEnd() {
    if (loop.value) {
      audio.value.currentTime = 0;
      resume();
    } else {
      onVideoEnd();
    }
  }

  function onBuffer() {
    console.log('Buffering');
    //pause();
  }

  return (
    <div id='VideoPlayer' className='me-auto ms-auto w-full'>
      <audio id='audio' onTimeUpdate={(e) => onProgress(e)} preload='auto' onEnded={() => videoEnd()} />
      <div id='player' className='group relative w-full'>
        <FaSpinner
          className={isVideoReady.value ? 'hidden' : 'absolute left-1/2 top-1/2 block h-8 w-8 animate-spin'}
          color='white'
        ></FaSpinner>
        <video
          onClick={() => play()}
          onCanPlayThrough={onVideoReady}
          onWaiting={onBuffer}
          className='aspect-video w-full max-w-full rounded-lg'
          id='video'
          preload='auto'
          muted
        />
        <div
          id='VideoControls'
          className='absolute bottom-0 hidden w-full flex-col items-center pe-2 ps-2 pt-9 group-hover:flex'
        >
          <Slider
            defaultValue={[33]}
            min={0}
            max={duration.value}
            value={[currentTime.value]}
            onValueChange={(e) => seekTo(e)}
            id='progress'
            className='w-full'
          />
          <div className='flex w-full flex-row items-center justify-between'>
            <div className='flex items-center'>
              <BiSkipPrevious className='me-1 ms-4 h-6 w-6' color='white' onClick={() => previous()}></BiSkipPrevious>
              {playing.value ? (
                <BiPause className='me-1 ms-1 h-6 w-6' color='white' onClick={() => play()}></BiPause>
              ) : (
                <BiPlay className='me-1 ms-1 h-6 w-6' color='white' onClick={() => play()}></BiPlay>
              )}
              <BiSkipNext
                className='me-1 ms-1 h-6 w-6'
                name='skip-next'
                color='white'
                onClick={() => skip()}
              ></BiSkipNext>
              <div id='VolumeGroup' className='flex h-12 items-center'>
                <BiVolumeFull id='VolumeIcon' color='white' type='solid' className='me-1 ms-1 h-5 w-5'></BiVolumeFull>
                <Slider
                  defaultValue={[5]}
                  min={0}
                  max={10}
                  step={0.1}
                  onValueChange={(e) => changeVolume(e)}
                  id='Volume'
                  className='m-0 mr-1 hidden h-5 w-24'
                />
              </div>
              <p>{formatTime(currentTimeHMS.value) + ' / ' + formatTime(durationHMS.value)}</p>
            </div>
            <div className='me-6 flex items-center justify-self-end'>
              {loop.value ? (
                <BiRevision
                  color='white'
                  className='me-1 ms-1 h-5 w-5'
                  onClick={() => (loop.value = !loop.value)}
                ></BiRevision>
              ) : (
                <BiRotateRight
                  color='white'
                  className='me-1 ms-1 h-5 w-5'
                  onClick={() => (loop.value = !loop.value)}
                ></BiRotateRight>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;

function convertSecondsToHMS(seconds: number): HMS {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const HMS: HMS = {
    hours: hours,
    minutes: minutes,
    seconds: remainingSeconds,
  };
  return HMS;
}

function formatTime(hms: HMS) {
  return hms.hours != 0
    ? `${formatNumber(hms.hours)}:${formatNumber(hms.minutes)}:${formatNumber(hms.seconds)} / ${formatNumber(
        hms.hours,
      )}:${formatNumber(hms.minutes)}:${formatNumber(hms.seconds)}`
    : `${formatNumber(hms.minutes)}:${formatNumber(hms.seconds)}`;
}

function formatNumber(number: number): string {
  return number.toFixed(0).padStart(2, '0');
}
