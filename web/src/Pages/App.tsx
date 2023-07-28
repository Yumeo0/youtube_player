import { useState, useEffect } from 'preact/hooks';
import Queue from '../Components/Queue';
import VideoPlayer from '../Components/VideoPlayer';
import QueueManager from '../QueueManager';
import { QueueElement, Queue as QueueType } from '../types';

import './App.css';

function App() {
  //const { mode } = useOutletContext();
  const [queueManager, setQueueManager] = useState(undefined as unknown as QueueManager);
  const [queue, setQueue] = useState([] as QueueType);
  const [currentVideo, setCurrentVideo] = useState(0);

  useEffect(() => {
    setQueueManager(new QueueManager(onQueueChange));
  }, []);

  useEffect(() => {
    const playingVideo = document.querySelector('.Video.Playing') as HTMLElement;
    if (playingVideo == null) return;
    const queue = document.getElementsByClassName('Videos')[0];
    queue.scrollTop = playingVideo.offsetTop;
  }, [currentVideo]);

  const onQueueChange = (queue: QueueType) => {
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
    if (queueManager == null) return;
    const res = await fetch(`http://localhost:3001/youtube`, {
      headers: { url: url },
    });
    const element: QueueElement = (await res.json()) as QueueElement;
    if (element.status === 200) {
      queueManager.add(element);
    }
  };

  return (
    <div className='App'>
      <div className='h-100 main'>
        <VideoPlayer
          video={queue[currentVideo]}
          onVideoEnd={nextVideo}
          onSkipVideo={nextVideo}
          onPreviousVideo={onPreviousVideo}
        />
        <input
          type='text'
          placeholder='Youtube video/playlist id/link'
          onKeyPress={(e) => {
            if (e.target == null) return;
            const input: HTMLInputElement = e.target as HTMLInputElement;
            if (e.code === 'Enter') search(input.value).catch((e) => console.log(e));
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
