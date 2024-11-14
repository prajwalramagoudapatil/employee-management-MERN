import { Link, Outlet } from "react-router-dom"
import '../App.css'
import logo from '../myLogo.png';

const NavBar = ()=>{
    return <>
    <nav className="navbar bg-body-tertiary">
  <div className="container-fluid">
    <a className="navbar-brand" href="/">
      <img src={logo} alt="Logo" width="38" height className="d-inline-block align-text-top me-3" />
      Employee Management
    </a>
    <ul>
        {/* <li><Link to="/">Login</Link></li> */}
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/create-employee">Create Employee</Link></li>
        {/* <li><Link to="/edit-employee">Edit Employee</Link></li> */}
    </ul>
        
  </div>
</nav>
{/* <br/> */}
<Outlet />
    </>
}

export {
    NavBar
}