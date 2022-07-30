// import React, { useContext } from "react";
// import UserContext from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  // const { setStateUser } = useContext(UserContext)
  let navigate = useNavigate();
  const logout = (event) => {
    event.preventDefault()
    // console.log(sessionStorage.getItem("userToken"))
    sessionStorage.clear()
    navigate("/login")
  }
  return (
    <span onClick={logout} style={{ cursor: 'pointer' }} className="navbar-text">Logout
    </span>
  );
};

export default LogoutButton;