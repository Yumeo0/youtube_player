import { useEffect, useState } from 'react';
import Queue from './components/Queue';
import VideoPlayer from './components/VideoPlayer';
import QueueManager from './QueueManager';
import { QueueElement, Queue as QueueType } from './types';
import { Input } from '@/components/ui/input';
import { API_BASE } from './consts';

function App() {
  const [queueManager, setQueueManager] = useState(undefined as unknown as QueueManager);
  const [queue, setQueue] = useState([] as QueueType);
  const [currentVideo, setCurrentVideo] = useState(0);

  useEffect(() => {
    setQueueManager(new QueueManager(onQueueChange));
  }, []);

  useEffect(() => {
    const playingVideo = document.getElementById('playing');
    if (playingVideo == null) return;
    const queue = document.getElementById('Videos');
    if (queue == null) return;
    const offset = playingVideo.offsetTop - queue.clientHeight / 2 + 80;
    queue.getElementsByTagName('div')[0].scrollTop = offset >= 0 ? offset : 0;
  }, [currentVideo]);

  const onQueueChange = (queue: QueueType, newVideoNumber?: number) => {
    setQueue(queue);
    if (newVideoNumber !== undefined) {
      setCurrentVideo(newVideoNumber);
    }
  };

  const nextVideo = () => {
    if (currentVideo + 1 < queue.length) setCurrentVideo(currentVideo + 1);
  };

  const onPreviousVideo = () => {
    if (currentVideo - 1 > 0) setCurrentVideo(currentVideo - 1);
  };

  const search = async (url: string) => {
    if (queueManager == null) return;
    const res = await fetch(`${API_BASE}/youtube`, {
      headers: { url: url },
    });
    const element: QueueElement = (await res.json()) as QueueElement;
    if (element.status === 200) {
      queueManager.add(element);
    }
  };

  return (
    <>
      <div className='me-auto ms-auto w-full max-w-screen-md'>
        <Input
          type='text'
          id='search'
          placeholder='Youtube video/playlist id/link'
          onKeyDown={(e) => {
            if (e.target == null) return;
            const input: HTMLInputElement = e.target as HTMLInputElement;
            if (e.code === 'Enter') search(input.value).catch((e) => console.log(e));
          }}
        />
      </div>
      <div className='flex h-5/6 w-screen justify-center p-3'>
        <div className='h-100 w-4/6 max-w-7xl pe-3'>
          <VideoPlayer
            video={queue[currentVideo]}
            onVideoEnd={nextVideo}
            onSkipVideo={nextVideo}
            onPreviousVideo={onPreviousVideo}
          />
        </div>
        <Queue
          queueManager={queueManager}
          queue={queue}
          currentVideo={currentVideo}
          setCurrentVideo={setCurrentVideo}
        />
      </div>
    </>
  );
}

export default App;
