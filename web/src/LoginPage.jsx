import {Link} from "react-router-dom";
import React from "react";

function LoginPage() {
    return <div class="center">
        <div>
            <label>Username</label>
            <input type="text" placeholder="username"/>
        </div>
        <div>
            <label>Password</label>
            <input type="text" placeholder="password"/>
        </div>
        <div>
            <Link to="/">
                <button class="medium">Login</button>
            </Link>
        </div>
        <div>
            <Link to="/signup">
                <button class="medium">Sign Up</button>
            </Link>
        </div>
        <div>
            <Link to="/">
                <button class="long">Login as guest</button>
            </Link>
        </div>
    </div>

}

export default LoginPage;