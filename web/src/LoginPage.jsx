import { Link } from 'react-router-dom'
import React, { useState } from 'react'

function LoginPage () {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')

  async function login () {
    fetch('http://localhost:3001/login', {
      headers: {
        username: user,
        password: pass
      }
    })
  }

  return (
    <div className='center'>
      <div>
        <label>Username</label>
        <input
          type='text'
          placeholder='username'
          onInput={e => setUser(e.target.value)}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type='text'
          placeholder='password'
          onInput={e => setPass(e.target.value)}
        />
      </div>
      <div>
        <Link to='/'>
          <button className='medium' onClick={() => login()}>
            Login
          </button>
        </Link>
      </div>
      <div>
        <Link to='/signup'>
          <button className='medium'>Sign Up</button>
        </Link>
      </div>
      <div>
        <Link to='/'>
          <button className='long'>Login as guest</button>
        </Link>
      </div>
    </div>
  )
}

export default LoginPage
