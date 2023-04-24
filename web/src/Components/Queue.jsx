import './Queue.css'

function Queue ({ queue, randomize, reverse, setCurrentVideo }) {
  return (
    <div className='queue'>
      <div>
        <button
          style={{ alignSelf: 'end' }}
          type='button'
          onClick={() => randomize()}
        >
          Random
        </button>
        <button type='button' onClick={() => reverse()}>
          Reverse
        </button>
      </div>
      <div className="Videos">
        {queue.map((video, index) => (
          <div className='Video' key={video.url} onClick={() => setCurrentVideo(index)}>
            <p>{video.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Queue
