import {Link} from "react-router-dom";

function SignUp() {

    return(
        <div>
            <p>sign up</p>
            <div className="mb-3">
                <label className="form-label">Username</label>
                <input type="text" className="form-control" placeholder="username"/>
            </div>
            <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="text" className="form-control" placeholder="password"/>
            </div>
            <div className="mb-3">
                <label className="form-label">Repeat password</label>
                <input type="text" className="form-control" placeholder="password"/>
            </div>
            <div className="mb-3">
            <Link to="/"><button>Login</button></Link>
            </div>
        </div>);
}
export default SignUp;