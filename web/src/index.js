import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {createBrowserRouter, createRoutesFromElements, RouterProvider, Outlet, Route, Link} from "react-router-dom";
import App from './Pages/App.jsx';
import LoginPage from "./Pages/LoginPage.jsx";
import SignUp from "./Pages/SignUp.jsx";
import Failed from "./Pages/failed";

function Logic() {
    const [mode, setMode] = useState(true);

    useEffect(
        () => {
            const r = document.querySelector(":root");
            r.style.setProperty("--bgColor", mode ? "white" : "#313233");
            r.style.setProperty("--txtColor", mode ? "black" : "white");
        }, [mode]
    );

    return (
        <>
            <nav style={{alignSelf: "end"}}>
                <Link to="/Login">
                    <button>Login</button>
                </Link>
                <button type="button" style={{marginLeft: ".25rem"}}
                        onClick={() => setMode(!mode)}>Light/Dark
                </button>
            </nav>
            <Outlet context={mode}/>
        </>
    );
}

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Logic/>}>
            <Route path="/" element={<App/>}/>
            <Route path="login" element={<LoginPage/>}/>
            <Route path="signup" element={<SignUp/>}/>
            <Route path="*" element={<Failed/>}/>
        </Route>
    )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router}/>
);

