import { Link } from "react-router-dom";
import { useState } from "preact/hooks";

function LoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  async function login() {
    fetch("http://localhost:3001/login", {
      headers: {
        username: user,
        password: pass,
      },
    })
      .then((respone) => respone.json())
      .then((json) => {
        if (json.status == 200) window.location.href = "/";
      });
  }

  return (
    <div className="center">
      <div>
        <label>Username</label>
        <input
          type="text"
          placeholder="username"
          onInput={(e) => {
            if(e.target == null) return;
            const input: HTMLInputElement = e.target as HTMLInputElement;
            setUser(input.value)
          }}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          placeholder="password"
          onInput={(e) => {
            if(e.target == null) return;
            const input: HTMLInputElement = e.target as HTMLInputElement;
            setPass(input.value)
          }}
        />
      </div>
      <div>
        <button className="medium" onClick={() => login()}>
          Login
        </button>
      </div>
      <div>
        <Link to="/signup">
          <button className="medium">Sign Up</button>
        </Link>
      </div>
      <div>
        <Link to="/">
          <button className="long">Login as guest</button>
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
