import {Link} from "react-router-dom";
import React from "react";

function LoginPage() {
    return <div>
        <div className="container-fluid">
            <div className="row">
                <div className="row">
                    <div className="col-3"></div>
                    <div className="col-6">
                        <div className="mb-3">
                            <p>LOGIN</p>
                            <label className="form-label">Username</label>
                            <input type="text" className="form-control" placeholder="username"/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input type="text" className="form-control" placeholder="password"/>
                        </div>
                        <div className="mb-3">
                            <Link to="/">
                                <div className="d-grid gap-2 col-3 mx-auto">
                                    <button className="btn btn-primary">Login</button>
                                </div>
                            </Link>
                        </div>
                        <div className="mb-3">
                            <Link to="/signup">
                                <div className="d-grid gap-2 col-3 mx-auto">
                                    <button className="btn btn-primary">Sign Up</button>
                                </div>
                            </Link>
                        </div>
                        <div className="mb-3">
                            <Link to="/">
                                <div className="d-grid gap-2 col-6 mx-auto">
                                    <button className="btn btn-primary">Login as guest</button>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="col-3"></div>
                </div>
            </div>
        </div>
    </div>
}

export default LoginPage;