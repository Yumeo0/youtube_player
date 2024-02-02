import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider, Link } from 'react-router-dom';
import App from './App.tsx';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';
import { ThemeProvider } from '@/components/theme-provider';

import './index.css';
import { ModeToggle } from './components/mode-toggle.tsx';

// eslint-disable-next-line react-refresh/only-export-components
function Logic() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <div className='me-auto ms-auto flex w-screen max-w-7xl flex-row justify-between p-4'>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to='/Login'>Login</Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <ModeToggle />
      </div>
      <Outlet />
    </ThemeProvider>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Logic />}>
      <Route path='/' element={<App />} />
    </Route>,
  ),
);

ReactDOM.createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
