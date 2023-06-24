import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "preact/hooks";
import * as types from '../types';

import Queue from "../Components/Queue";
import VideoPlayer from "../Components/VideoPlayer";
import QueueManager from "../QueueManager";

import "./App.css";

function App() {
  //const { mode } = useOutletContext();
  const [queueManager, setQueueManager] = useState(undefined as unknown as QueueManager);
  const [queue, setQueue] = useState([] as types.Queue);
  const [currentVideo, setCurrentVideo] = useState(0);

  useEffect(() => {
    setQueueManager(new QueueManager(onQueueChange));
  }, []);

  useEffect(() => {
    const playingVideo = document.querySelector(".Video.Playing") as HTMLElement;
    if (playingVideo == null) return;
    const queue = document.getElementsByClassName("Videos")[0];
    queue.scrollTop = playingVideo.offsetTop;
    console.log(playingVideo.offsetTop, queue.scrollTop);
  }, [currentVideo]);

  const onQueueChange = (queue: types.Queue) => {
    console.log(queue);
    setQueue(queue);
  };

  const nextVideo = () => {
    if (currentVideo + 1 < queue.length) setCurrentVideo(currentVideo + 1);
  };

  const onPreviousVideo = () => {
    if (currentVideo - 1 > 0) setCurrentVideo(currentVideo - 1);
  };

  const search = async (url: string) => {
    if(queueManager == null) return;
    let res = await fetch(`http://localhost:3001/youtube`, {
      headers: { url: url },
    });
    let element: types.QueueElement = await res.json();
    if (element.status === 200) {
      queueManager.add(element);
    }
  };

  return (
    <div className="App">
      <div className="h-100">
        <VideoPlayer
          video={queue[currentVideo]}
          onVideoEnd={nextVideo}
          onSkipVideo={nextVideo}
          onPreviousVideo={onPreviousVideo}
        />
        <input
          type="text"
          className="main"
          placeholder="Youtube video/playlist id/link"
          onKeyPress={(e) => {
            if(e.target == null) return;
            const input: HTMLInputElement = e.target as HTMLInputElement;
            if (e.code === "Enter") search(input.value);
          }}
        />
      </div>
      <Queue
        queue={queue}
        randomize={() => queueManager?.randomize()}
        reverse={() => queueManager?.reverse()}
        currentVideo={currentVideo}
        setCurrentVideo={setCurrentVideo}
      />
    </div>
  );
}

// <input type='text' className='main' placeholder='Room ID' />

export default App;
