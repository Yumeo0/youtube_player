import { useState } from 'preact/hooks';
import { LoginResponse } from '../types';

function SignUp() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [passA, setPassA] = useState('');

  function signUp() {
    fetch('http://localhost:3001/register', {
      headers: {
        username: user,
        password: pass,
        passwordA: passA,
      },
    })
      .then((respone) => respone.json())
      .then((json: LoginResponse) => {
        if (json.status == 200) window.location.href = '/login';
      })
      .catch((e) => console.log(e));
  }

  return (
    <div className={'center'}>
      <div>
        <p>SIGN UP</p>
        <label htmlFor={'username'}>Username</label>
        <input
          id={'username'}
          type={'text'}
          placeholder={'username'}
          onInput={(e) => {
            if (e.target == null) return;
            const input: HTMLInputElement = e.target as HTMLInputElement;
            setUser(input.value);
          }}
        />
      </div>
      <div>
        <label htmlFor={'password'}>Password</label>
        <input
          id={'password'}
          type={'password'}
          placeholder={'password'}
          onInput={(e) => {
            if (e.target == null) return;
            const input: HTMLInputElement = e.target as HTMLInputElement;
            setPass(input.value);
          }}
        />
      </div>
      <div>
        <label htmlFor={'password'}>Repeat password</label>
        <input
          id={'password'}
          type={'password'}
          placeholder={'password'}
          onInput={(e) => {
            if (e.target == null) return;
            const input: HTMLInputElement = e.target as HTMLInputElement;
            setPassA(input.value);
          }}
        />
      </div>
      <div>
        <button type={'button'} className={'long'} onClick={() => signUp()}>
          Sign up
        </button>
      </div>
    </div>
  );
}

export default SignUp;
