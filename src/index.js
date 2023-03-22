import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {createBrowserRouter, createRoutesFromElements, RouterProvider, Outlet, Route} from "react-router-dom";
import LoginPage from "./LoginPage.jsx";
import SignUp from "./SignUp.jsx";
import Failed from "./failed";

function Logic() {
    const [mode,setMode] = useState(true);

    useEffect(
        () => {
            const r = document.querySelector(":root");
            r.style.setProperty("--bgColor",mode?"white":"#313233");
            r.style.setProperty("--txtColor",mode?"black":"white");
        },[mode]
    );
    return (
        <>
            <button type="button" className="btn btn-secondary" onClick={() => setMode(!mode)}>Light/Dark</button>
            <Outlet />
        </>
    );
}

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Logic />}>
            <Route path="/" element={<App />}/>
            <Route path="login" element={<LoginPage />}/>
            <Route path="signup" element={<SignUp />}/>
            <Route path="*" element={<Failed />}/>
        </Route>
    )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router}/>
);

