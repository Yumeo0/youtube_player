import { useState, useEffect, useMemo } from 'react'

function Queue ({ setRef }) {
  const [queue, setQueue] = useState([])
  const [random, setRandom] = useState(false)
  const [reversed, setReversed] = useState(false)
  const [rendered, setRendered] = useState([])

  useEffect(() => {
    setRef({
      add,
      get
    })
  }, [])

  const add = element => {
    let newQueue = queue;
    if (Array.isArray(element)) {
      console.log('array')
      newQueue = queue.concat(element)
    } else {
      console.log('single video')
      newQueue.push(element)
    }
    setQueue(newQueue)
  }

  const get = page => {
    page = page * 100
    return queue.reduce((newQueue, current, index) => {
      if (index >= page && index <= page + 100) newQueue.push(current)
      return newQueue
    }, [])
  }

  useEffect(() => {
    console.log('Queue', queue)
  }, [JSON.stringify(queue)])

  return (
    <div className='queue'>
      {rendered.map(video => (
        <div>
          <p>video.videoDetails.title</p>
        </div>
      ))}
    </div>
  )
}

export default Queue
