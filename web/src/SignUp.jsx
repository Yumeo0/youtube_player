import {Link} from "react-router-dom";
import {useState} from "react";

function SignUp() {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [passA, setPassA] = useState("");


    async function signUp() {
        fetch("http://localhost:3001/register", {
            headers: {
                "username": user,
                "password": pass,
                "passwordA": passA
            }
        });
    }

    return (
        <div className="center">

            <div>
                <p>SIGN UP</p>
                <label>Username</label>
                <input type="text" placeholder="username" onInput={e => setUser((e.target.value))}/>
            </div>
            <div>
                <label>Password</label>
                <input type="password" placeholder="password" onInput={e => setPass((e.target.value))}/>
            </div>
            <div>
                <label>Repeat password</label>
                <input type="password" placeholder="password" onInput={e => setPassA((e.target.value))}/>
            </div>
            <div>
                <Link to="/">
                    <button type="button" className="long" onClick={e => signUp()}>Sign up</button>
                </Link>
            </div>
        </div>);
}


export default SignUp;