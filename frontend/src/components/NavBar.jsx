import React, {useContext} from "react";
import {Link} from 'react-router-dom';
import LogoutButton from "./LogoutButton";
import UserContext from '../context/UserContext';


const NavBar = () => {
    const {stateUser} = useContext(UserContext)
    let hide 
    if(stateUser){
        hide = false
    }else{
        hide =true
    }
  return (
    <nav hidden={hide} className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
            <a className="navbar-brand" href="#">Home</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    <Link className="nav-link" to="/home">Projectts</Link>
                    {/* <a className="nav-link" href="#">Projects</a> */}
                    <a className="nav-link" href="#">Diagrams</a>
                    <a className="nav-link" href="#">Profile</a>
                </div>
          
            </div>
            {/* componente logout */}
            <LogoutButton />
        </div>
    </nav>
  );
};

export default NavBar;