import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import './index.css';
import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider, Link } from 'react-router-dom';
import App from './Pages/App';
import Failed from './Pages/Failed';
import LoginPage from './Pages/LoginPage';
import SignUp from './Pages/SignUp';

function Logic() {
  const [mode, setMode] = useState(false);

  useEffect(() => {
    const root = document.querySelector(':root') as HTMLElement;
    if (root == null) return;
    root.style.setProperty('--bgColor', mode ? 'white' : '#313233');
    root.style.setProperty('--txtColor', mode ? 'black' : 'white');
  }, [mode]);

  return (
    <>
      <nav style={{ alignSelf: 'end' }}>
        <Link to='/Login'>
          <button>Login</button>
        </Link>
        <button type='button' style={{ marginLeft: '.25rem' }} onClick={() => setMode(!mode)}>
          Light/Dark
        </button>
      </nav>
      <Outlet context={mode} />
    </>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Logic />}>
      <Route path='/' element={<App />} />
      <Route path='login' element={<LoginPage />} />
      <Route path='signup' element={<SignUp />} />
      <Route path='*' element={<Failed />} />
    </Route>,
  ),
);

render(<RouterProvider router={router} />, document.getElementById('app') as HTMLElement);
