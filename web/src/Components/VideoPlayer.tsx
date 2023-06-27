import { useEffect, useRef } from "preact/hooks";
import { signal } from "@preact/signals";
import ReactPlayer from "react-player";
import {
  BiSkipPrevious,
  BiSkipNext,
  BiPause,
  BiPlay,
  BiVolumeFull,
  BiRevision,
  BiRotateRight,
} from "react-icons/bi";
import * as types from "../types";

import "./VideoPlayer.css";
import { TargetedEvent } from "preact/compat";

const audio = signal(undefined as unknown as HTMLAudioElement);

// Urls and selected Quality
const videoQuality = signal(0);
const audioQuality = signal(0);
const videoUrls = signal([] as types.Format[]);
const audioUrls = signal([] as types.Format[]);

// Player state
const playing = signal(false);
const isTabFocused = signal(true);
const duration = signal(0);
const currentTime = signal(0);
const loop = signal(false);

// Video element state
const videoPlaying = signal(false);
const videoReady = signal(false);

function VideoPlayer({
  video,
  onVideoEnd,
  onSkipVideo,
  onPreviousVideo,
}: {
  video: types.Video;
  onVideoEnd: Function;
  onSkipVideo: Function;
  onPreviousVideo: Function;
}) {
  // Video element state
  const videoRef = useRef(null as unknown as ReactPlayer);

  useEffect(() => {
    if (video?.url)
      fetch(`http://localhost:3001/youtube`, {
        headers: { url: video.url },
      })
        .then((response) => response.json())
        .then((json) => {
          let video: types.RawVideo = json.video;
          let formats = video.formats;

          if (formats.length < 1) {
            onVideoEnd();
            return;
          }

          let videoFormats = formats.filter((format: types.Format) => {
            return format.mimeType.includes("video/mp4");
          });
          videoFormats = videoFormats.sort(
            (a: types.Format, b: types.Format) => {
              return a.bitrate - b.bitrate;
            }
          );
          videoUrls.value = videoFormats;

          let audioFormats = formats.filter((format: types.Format) => {
            return format.mimeType.includes("audio");
          });
          audioFormats = audioFormats.sort(
            (a: types.Format, b: types.Format) => {
              return a.bitrate - b.bitrate;
            }
          );
          audioUrls.value = audioFormats;
          duration.value = video.videoDetails.lengthSeconds;

          navigator.mediaSession.metadata = new MediaMetadata({
            title: video.videoDetails.title,
            artist: video.videoDetails.author.name,
            album: video.videoDetails.title,
            artwork: video.videoDetails.thumbnails.map(thumbnail => {
              let img: MediaImage = {
                src: thumbnail.url,
                sizes: `${thumbnail.width}x${thumbnail.height}`,
                type: "image/png",
              }
              return img;
            }),
          });
        });
  }, [video]);

  useEffect(() => {
    navigator.mediaSession.setActionHandler('play', function() {
      play();
    });
    navigator.mediaSession.setActionHandler('pause', function() {
      play();
    });
    navigator.mediaSession.setActionHandler('previoustrack', function() {
      previous();
    });
    navigator.mediaSession.setActionHandler('nexttrack', function() {
      skip();
    });
    navigator.mediaSession.setActionHandler('seekto', function(e) {
      if(e.seekTime)
      audio.value.currentTime = e.seekTime;
    });
    navigator.mediaSession.setActionHandler('seekforward', function(e) {
      if(e.seekOffset)
      audio.value.currentTime = audio.value.currentTime + e.seekOffset;
    });
    navigator.mediaSession.setActionHandler('seekbackward', function(e) {
      if(e.seekOffset)
      audio.value.currentTime = audio.value.currentTime - e.seekOffset;
    });
    const audioElement = document.getElementById("audio") as HTMLAudioElement;
    if (audioElement == null) return;
    audio.value = audioElement;
    audio.value.volume = 0.05;
    const volumeSlider: HTMLInputElement = document.getElementById(
      "volume"
    ) as HTMLInputElement;
    if (volumeSlider == null) return;
    volumeSlider.value = "5";

    document.addEventListener("visibilitychange", function () {
      isTabFocused.value = !document.hidden;
    });
  }, []);

  function onVideoReady() {
    console.log("onVideoReady()");
    setTimeout(() => {
      videoReady.value = true;
      if (playing.value) resume();
    }, 350);
  }

  function onBufferEnd() {
    console.log("onBufferEnd()");
    setTimeout(() => {
      videoReady.value = true;
      if (playing.value) resume();
    }, 350);
  }

  function resume() {
    console.log("resume()");
    if (!videoReady.value) {
      const wait = () => {
        setTimeout(() => {
          resume();
        }, 350);
      };
      wait();
    } else {
      videoPlaying.value = true;
      audio.value.play();
      navigator.mediaSession.playbackState = "playing";
    }
  }

  function pause() {
    console.log("pause()");
    videoPlaying.value = false;
    audio.value.pause();
    navigator.mediaSession.playbackState = "paused";
  }

  function play() {
    console.log("play()");
    playing.value = !playing.value;
    if (playing.value) resume();
    else pause();
  }

  function skip() {
    console.log("skip()");
    onSkipVideo();
    pause();
  }

  function previous() {
    console.log("previous()");
    pause();
    onPreviousVideo();
  }

  function onProgress(e: TargetedEvent) {
    if (e.target == null) return;
    const player = e.target as HTMLAudioElement;
    const time = player.currentTime;
    currentTime.value = time;

    navigator.mediaSession.setPositionState({
      duration: duration.value,
      playbackRate: 1,
      position: time
    });

    if (
      !isTabFocused.value ||
      videoRef.current == null ||
      videoRef.current.getCurrentTime() == null
    )
      return;
    if (
      videoRef.current.getCurrentTime() < time - 0.25 ||
      videoRef.current.getCurrentTime() > time + 0.25
    ) {
      pause();
      videoRef.current.seekTo(time);
    }
  }

  function changeVolume(e: TargetedEvent) {
    if (e.target == null) return;
    const input = e.target as HTMLInputElement;
    audio.value.volume = parseFloat(input.value) / 100;
  }

  function seekTo(e: TargetedEvent) {
    if (e.target == null) return;
    const input = e.target as HTMLInputElement;
    audio.value.currentTime = parseFloat(input.value);
  }

  function videoEnd() {
    if (loop.value) {
      audio.value.currentTime = 0;
    } else {
      onVideoEnd();
    }
  }

  return (
    <div className="VideoPlayer">
      <audio
        id="audio"
        src={audioUrls.value[audioUrls.value.length - 1]?.url}
        onTimeUpdate={(e) => onProgress(e)}
        preload="auto"
        onEnded={() => videoEnd()}
        //onPause={(e) => pause()}
        //onPlay={() => resume()}
        //controls
      />
      <div className="player">
        <div onClick={() => play()}>
          <ReactPlayer
            url={videoUrls.value[videoUrls.value.length - 1]?.url}
            playing={videoPlaying.value}
            onReady={() => onVideoReady()}
            onBufferEnd={() => onBufferEnd()}
            //onEnded={() => videoEnd()}
            width={"100%"}
            height={"100%"}
            ref={videoRef}
            muted
          />
        </div>
        <div className="backdrop"></div>
        <div className="VideoControls">
          <BiSkipPrevious
            class="icon"
            color="white"
            onClick={() => previous()}
          ></BiSkipPrevious>
          {playing.value ? (
            <BiPause
              class="icon"
              color="white"
              onClick={() => play()}
            ></BiPause>
          ) : (
            <BiPlay class="icon" color="white" onClick={() => play()}></BiPlay>
          )}
          <BiSkipNext
            class="icon"
            name="skip-next"
            color="white"
            onClick={() => skip()}
          ></BiSkipNext>
          {loop.value ? (
            <BiRevision
              color="white"
              class="icon loop"
              onClick={() => (loop.value = !loop)}
            ></BiRevision>
          ) : (
            <BiRotateRight
              color="white"
              class="icon loop"
              onClick={() => (loop.value = !loop)}
            ></BiRotateRight>
          )}

          <BiVolumeFull
            color="white"
            type="solid"
            class="icon volume"
          ></BiVolumeFull>
          <input
            type="range"
            min="0"
            max="100"
            id="volume"
            onChange={(e) => changeVolume(e)}
          ></input>
        </div>
        <input
          type="range"
          min="0"
          max={duration.value}
          value={currentTime.value}
          onChange={(e) => seekTo(e)}
          id="progress"
        ></input>
      </div>
    </div>
  );
}

export default VideoPlayer;
