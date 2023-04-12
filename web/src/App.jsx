import './App.css';
import {useOutletContext} from "react-router-dom";
import Queue from "./Queue.jsx";
import {useState} from "react";

function App() {
    const {mode} = useOutletContext();
    const [queue, setQueue] = useState(undefined);

    const search = async (url) => {
        let res = await fetch(`http://localhost:3000/youtube`, {headers: {'url': url}});
        res = await res.json();
        if(res.status === 200) {
            console.log(res);
            if(res.type === 'video')
                queue.add(res.video);
            if(res.type === 'playlist')
                queue.add(res.playlist);
        }
    }

    return (
        <div className="App">
            <div className="center">
                <div>
                    <Queue setRef={setQueue} />
                </div>
                <div>
                    <div>
                        <input type="text" className="main" placeholder="Youtube video/playlist id/link" onKeyPress={
                            e => {if(e.code === "Enter") search(e.target.value)}
                        }/>
                        <input type="text" className="main" placeholder="Room ID"/>
                        <button type="button">Random</button>
                        <button type="button">Reverse</button>
                    </div>
                </div>
            </div>
        </div>);
}

export default App;