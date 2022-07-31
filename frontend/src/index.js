import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './estilos.css';
import './estilosPersonalizados.css';

// components import
import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import ModelerComponent from './components/diagram/ModelerComponent';
import reportWebVitals from './reportWebVitals';
import RequireAuth from './components/RequireAuth';
import DiagramsCardList from './components/diagram/DiagramsCardList';
import Home from './components/Home';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    {/* <RequireAuth>
        <NavBar/>
      </RequireAuth> */}
    <Routes>
      {/* Authentication */}
      <Route exact path="/login" element={<Login />}></Route>
      <Route exact path="/register" element={<Register />}></Route>

      {/* User */}
      <Route exact path="/" element={<RequireAuth><Home /></RequireAuth>}></Route>
      <Route exact path="/profile" element={<RequireAuth><Profile /></RequireAuth>}></Route>

      {/* EBPM */}
      <Route exact path="/diagrams" element={<RequireAuth><DiagramsCardList /></RequireAuth>}></Route>
      <Route exact path="/diagram/design/:diagramId" element={<RequireAuth><ModelerComponent /></RequireAuth>}></Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
