import { useState } from "preact/hooks";

function SignUp() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [passA, setPassA] = useState("");

  async function signUp() {
    fetch("http://localhost:3001/register", {
      headers: {
        username: user,
        password: pass,
        passwordA: passA,
      },
    })
      .then((respone) => respone.json())
      .then((json) => {
        if (json.status == 200) window.location.href = "/login";
      });
  }

  return (
    <div className="center">
      <div>
        <p>SIGN UP</p>
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
        <label>Repeat password</label>
        <input
          type="password"
          placeholder="password"
          onInput={(e) => {
            if(e.target == null) return;
            const input: HTMLInputElement = e.target as HTMLInputElement;
            setPassA(input.value)
          }}
        />
      </div>
      <div>
        <button type="button" className="long" onClick={() => signUp()}>
          Sign up
        </button>
      </div>
    </div>
  );
}

export default SignUp;
