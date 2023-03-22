import './App.css';
import {Link} from "react-router-dom";

function App() {
    return (
        <div className="App">


            <div className="container" style={{width:"100%"}}>
                <div className="row" style={{width:"100%", height:"10%"}}>
                    <div>
                        <Link to="/login">
                            <button type="button" className="btn btn-secondary">Login</button>
                        </Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col mb-3" style={{width:"40%"}}>
                        <label className="form-label">Youtube playlist id/link</label>
                        <input type="text" className="form-control" example="youtube.com/playlist/123"/>
                    </div>
                    <div className="col mb-3" style={{width:"40%"}}>
                        <label className="form-label">Room ID</label>
                        <input type="text" className="form-control" example="12345678"/>
                    </div>
                    <div className="col" style={{width:"20%"}}>
                        <button type="button" className="btn btn-secondary">Randomize</button>
                        <button type="button" className="btn btn-secondary">Reverse</button>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
}

export default App;
