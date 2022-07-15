import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter,Routes, Route} from 'react-router-dom'
import './index.css';

// components import
import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import ModelerComponent from './components/ModelerComponent';
import reportWebVitals from './reportWebVitals';
import NavBar from './components/NavBar';
import { UserContextProvider } from './context/UserContext';
import RequireAuth from './components/RequireAuth';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <BrowserRouter>
      {/* <RequireAuth>
        <NavBar/>
      </RequireAuth> */}
        <Routes>
            <Route exact 
              path="/home" 
              element={
                <RequireAuth>
                  <ModelerComponent/>
                </RequireAuth>
              }>
            </Route>
            <Route exact path="/login" element={<Login/>}></Route>
            <Route exact path="/register" element={<Register/>}></Route>
            <Route exact 
            path="/profile" 
            element={
              <RequireAuth>
              <Profile/>
            </RequireAuth>
            }>

            </Route>
        </Routes>
    </BrowserRouter>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
