// import React, { useContext } from "react";
// import UserContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  let navigate = useNavigate();
  const logout = (event) => {
    event.preventDefault()
    sessionStorage.clear()
    navigate("/login")
  }
  return (
    <span onClick={logout} style={{ cursor: 'pointer' }} className="navbar-text">Logout
    </span>
  );
};

export default LogoutButton;