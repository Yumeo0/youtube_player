import './App.css'
import { useOutletContext } from 'react-router-dom'
import { useState, useEffect } from 'react'

import Queue from '../Components/Queue.jsx'
import VideoPlayer from '../Components/VideoPlayer.jsx'
import QueueManager from '../QueueManager.js'

function App () {
  const { mode } = useOutletContext()
  const [queueManager, setQueueManager] = useState(undefined)
  const [queue, setQueue] = useState([])
  const [currentVideo, setCurrentVideo] = useState(0);

  useEffect(() => {
    setQueueManager(new QueueManager(onQueueChange))
  }, [])

  useEffect(() => {
    const playingVideo = document.querySelector(".Video.Playing");
    if(playingVideo == null) return;
    const queue = document.getElementsByClassName("Videos")[0];
    queue.scrollTop = playingVideo.offsetTop;
    console.log(playingVideo.offsetTop, queue.scrollTop)
  }, [currentVideo])

  const onQueueChange = queue => {
    console.log(queue)
    setQueue(queue)
  }

  const nextVideo = () => {
    if(currentVideo + 1 < queue.length)
    setCurrentVideo(currentVideo + 1)
  }

  const onPreviousVideo = () => {
    if(currentVideo - 1 > 0)
    setCurrentVideo(currentVideo - 1)
  }

  const search = async url => {
    let res = await fetch(`http://localhost:3001/youtube`, {
      headers: { url: url }
    })
    res = await res.json()
    if (res.status === 200) {
      queueManager.add(res)
    }
  }

  return (
    <div className='App center flex'>
      <div className='h-100'>
        <VideoPlayer 
          video={queue[currentVideo]} 
          onVideoEnd={nextVideo}
          onSkipVideo={nextVideo}
          onPreviousVideo={onPreviousVideo}
        />
          <input
            type='text'
            className='main'
            placeholder='Youtube video/playlist id/link'
            onKeyPress={e => {
              if (e.code === 'Enter') search(e.target.value)
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
  )
}

// <input type='text' className='main' placeholder='Room ID' />

export default App
