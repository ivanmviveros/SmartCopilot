import React, { useContext } from "react";
import UserContext from '../context/UserContext';
import { Link } from 'react-router-dom';

const LogoutButton = () => {
  const { setStateUser } = useContext(UserContext)

  const logout = (event) => {
    event.preventDefault()
    setStateUser(false)
  }
  return (
    <span className="navbar-text">
      <Link className="btn" onClick={logout} to="/login">logout</Link>
    </span>
  );
};

export default LogoutButton;