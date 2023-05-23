import './Queue.css'

function Queue ({ queue, randomize, reverse, currentVideo, setCurrentVideo }) {
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
          <div className={'Video' + (currentVideo === index ? " Playing" : "")} key={video.url+"_"+index} onClick={() => setCurrentVideo(index)}>
            <img loading="lazy" src={video.bestThumbnail.url} alt={video.title + " Thumbnail"}/>
            <div>
              <p>{video.title}</p>
              <a href={video.author.url} target="_blank" rel="noreferrer">{video.author.name}</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Queue
