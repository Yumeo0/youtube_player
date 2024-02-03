import QueueManager from '@/QueueManager';
import * as types from '../types';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

function Queue({
  queue,
  currentVideo,
  setCurrentVideo,
  queueManager,
}: {
  queue: types.Queue;
  currentVideo: number;
  setCurrentVideo: (index: number) => void;
  queueManager: QueueManager;
}) {
  return (
    <div id='Queue' className='h-full w-2/6 max-w-md overflow-hidden rounded-lg border bg-background'>
      <div>
        <Button className='m-2 self-end' type='button' onClick={() => queueManager.randomize(currentVideo)}>
          {queueManager?.isRandomized() ? 'Unrandomize' : 'Randomize'}
        </Button>
        <Button className='m-2' type='button' onClick={() => queueManager.reverse()}>
          {queueManager?.isReversed() ? 'Unreverse' : 'Reverse'}
        </Button>
      </div>
      <ScrollArea id='Videos' className='pe-2' style={{ height: 'calc(100% - 2.5rem - 1rem)' }}>
        {queue.map((video, index: number) => (
          <div
            id={currentVideo === index ? 'playing' : ''}
            className={'flex h-20 items-center pe-1 ps-2 ' + (currentVideo === index ? 'bg-accent' : '')}
            key={video.url + '_' + index}
            onClick={() => setCurrentVideo(index)}
          >
            <img
              className='me-2 w-28 rounded-lg'
              loading='lazy'
              src={video.thumbnails[video.thumbnails.length - 1].url}
              alt={video.title + ' Thumbnail'}
            />
            <div className={currentVideo === index ? 'text-accent-foreground' : 'text-primary'}>
              <p>{video.title}</p>
              <a href={video.author.url} target='_blank' rel='noreferrer'>
                {video.author.name}
              </a>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}

export default Queue;
