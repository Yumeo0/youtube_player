import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

function VideoPlayer({video}) {
  const [audio, setAudio] = useState(undefined);

  // Urls and selected Quality
  const [videoQuality, setVideoQuality] = useState(0);
  const [audioQuality, setAudioQuality] = useState(0);
  const [videoUrls, setVideoUrls] = useState([]);
  const [audioUrls, setAudioUrls] = useState([]);

  // Player state
  const [playing, setPlaying] = useState(false);

  // Video element state
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if(video?.url)
    fetch(`http://localhost:3001/youtube`, {
      headers: { url: video.url }
    }).then(response => response.json())
    .then(json => {
      let video = json.video;
      let formats = video.formats
      let videoFormats = formats.filter(format => {
        return format.mimeType.includes("video/mp4")
      });
      videoFormats = videoFormats.sort((a, b) => {
        return a.bitrate - b.bitrate
      });
      setVideoUrls(videoFormats);
      
      let audioFormats = formats.filter(format => {
        return format.mimeType.includes("audio")
      });
      audioFormats = audioFormats.sort((a, b) => {
        return a.bitrate - b.bitrate
      });
      setAudioUrls(audioFormats);
    })
  }, [video])

  useEffect(() => {
    setAudio(document.getElementById("audio"));
  }, [])
  
  
  function onVideoReady() {
    setVideoReady(true);
  }

  function resume() {
    console.log(videoReady);
    if(!videoReady) {
      const wait = () => {
        setTimeout(() => {
          console.log("Wait");
          resume();
        }, 250)}
      wait();
    } else {
      setVideoPlaying(true);
      audio.play();
    }
  }

  function pause() {
    setVideoPlaying(false);
    audio.pause();
  }

  function play() {
    console.log("Play");
    setPlaying(!playing);
    if(!playing) resume();
    else pause();
  }
  
  return (
    <div>
      <button onClick={() => play()}>Play</button>
      <ReactPlayer url={videoUrls[videoUrls.length - 1]?.url} onPlay={() => resume()} playing={videoPlaying} onReady={() => onVideoReady()} muted/>
      <audio id="audio" src={audioUrls[audioUrls.length - 1]?.url} preload="auto" controls />
    </div>
  );
}

export default VideoPlayer;