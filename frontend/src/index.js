import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter,Routes, Route} from 'react-router-dom'
import './index.css';
import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
        <Route exact path="" element={<Login/>}></Route>
        <Route exact path="/login" element={<Login/>}></Route>
        <Route exact path="/register" element={<Register/>}></Route>
        <Route exact path="/profile" element={<Profile/>}></Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
