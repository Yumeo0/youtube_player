import {Link} from "react-router-dom";

function SignUp() {

    return (
        <div className="container" style={{marginTop:"auto", marginBottom:"auto"}}>

            <div className="row">
                <div className="col-3"></div>
                <div className="col-6">
                    <div className="mb-3">
                        <p>SIGN UP</p>
                        <label className="form-label">Username</label>
                        <input type="text" className="form-control" placeholder="username"/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="text" className="form-control" placeholder="password"/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Repeat password</label>
                        <input type="text" className="form-control" placeholder="password"/>
                            <Link to="/">
                                <div className="d-grid gap-2 col-6 mx-auto">
                                <button type="button" className="btn btn-primary" style={{marginTop:"3rem"}}>Login</button>
                                </div>
                            </Link>
                    </div>
                </div>
                <div className="col-3"></div>


                <div className="mb-3">
                </div>
            </div>
        </div>);
}

export default SignUp;