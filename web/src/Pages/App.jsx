import './App.css'
import { useOutletContext } from 'react-router-dom'
import Queue from '../Components/Queue.jsx'
import VideoPlayer from '../Components/VideoPlayer.jsx'
import { useState, useEffect } from 'react'
import QueueManager from '../QueueManager.js'

function App () {
  const { mode } = useOutletContext()
  const [queueManager, setQueueManager] = useState(undefined)
  const [queue, setQueue] = useState([])
  const [currentVideo, setCurrentVideo] = useState(0);

  useEffect(() => {
    setQueueManager(new QueueManager(onQueueChange))
  }, [])

  const onQueueChange = queue => {
    console.log(queue)
    setQueue(queue)
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
    <div className='App center flex-row'>
      <div className='h-100'>
        <VideoPlayer video={queue[currentVideo]} />
          <input
            type='text'
            className='main'
            placeholder='Youtube video/playlist id/link'
            onKeyPress={e => {
              if (e.code === 'Enter') search(e.target.value)
            }}
          />
      </div>
      <Queue queue={queue} randomize={queueManager?.randomize} reverse={queueManager?.reverse} setCurrentVideo={setCurrentVideo}/>
    </div>
  )
}

// <input type='text' className='main' placeholder='Room ID' />

export default App
