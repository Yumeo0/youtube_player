import {Link} from "react-router-dom";

function LoginPage() {
    return <div>
        <p>Login</p>
        <input type="text"/>
        <input type="text"/>
        <Link to="/"><button>Login</button></Link>
        <Link to="/signup"><button>Sign Up</button></Link>
        <Link to="/"><button>Login as guest</button></Link>
    </div>
}
export default LoginPage;