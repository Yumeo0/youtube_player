import './App.css';
import {useOutletContext} from "react-router-dom";

function App() {
    const {mode} = useOutletContext();
    return (
        <div className="App">
            <div class="center">
                <div>
                    <div>
                        video playlist
                    </div>
                </div>
                <div>
                    <div>
                        <input type="text" class="main" placeholder="Youtube playlist id/link"/>
                        <input type="text" class="main" placeholder="Room ID"/>
                        <button type="button">Random</button>
                        <button type="button">Reverse</button>
                    </div>
                </div>
            </div>
        </div>);
}

export default App;
