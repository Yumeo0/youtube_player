import './App.css';
import {useOutletContext} from "react-router-dom";

function App() {
    const {mode} = useOutletContext();
    return (
        <div className="App">


            <div className="container-fluid">
                <div className="row">
                    <div className="col-9">
                        //video
                    </div>
                    <div className="col-3">
                        //playlist
                    </div>
                </div>
                <div className="row">
                    <div className="col-1"></div>
                    <div className="col-4 mb-3">
                        <input type="text" className="form-control" placeholder="Youtube playlist id/link"/>
                    </div>
                    <div className="col-4 mb-3">
                        <input type="text" className="form-control" placeholder="Room ID"/>
                    </div>
                    <div className="col-3">
                        <button type="button" className="btn btn-primary"
                                style={{marginRight: "1rem", marginLeft: "auto"}}>Random
                        </button>
                        <button type="button" className="btn btn-primary"
                                style={{marginRight: "auto", marginLeft: "1rem"}}>Reverse
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
}

export default App;
