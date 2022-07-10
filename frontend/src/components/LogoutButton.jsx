import React, {useContext} from "react";
import UserContext from '../context/UserContext';
import {useNavigate, Navigate, useLocation} from 'react-router-dom';

const LogoutButton = () => {
  const {stateUser, setStateUser} = useContext(UserContext)
  let location = useLocation()

  const logout  = (event)=>{
    event.preventDefault()
    setStateUser(false)    
  }
  return (
      <span className="navbar-text">
        <a className="btn" onClick={logout}>logout</a>
      </span>
  );
};

export default LogoutButton;