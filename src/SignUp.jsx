import {Link} from "react-router-dom";

function SignUp() {

    return (
        <div class="center">

            <div>
                <p>SIGN UP</p>
                <label>Username</label>
                <input type="text" placeholder="username"/>
            </div>
            <div>
                <label>Password</label>
                <input type="text" placeholder="password"/>
            </div>
            <div>
                <label>Repeat password</label>
                <input type="text" placeholder="password"/>
            </div>
            <div>
                <Link to="/">
                    <button type="button" class="long">Login</button>
                </Link>
            </div>
        </div>);
}

export default SignUp;