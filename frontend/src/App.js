import logo from './logo.svg';
import './App.css';
import {Auth0Provider} from "@auth0/auth0-react"
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import Profile from './components/Profile';

function App() {
  return (
    <Auth0Provider
    domain='dev-75a1b10s.us.auth0.com'
    clientId='RHgXbPx3XQUqkGRPwbknKPCSDl939u5U'
    redirectUri={window.location.origin}
    audience="http://127.0.0.1:8000/login">
     
     <LoginButton />
     <LogoutButton />
     <Profile />
    </Auth0Provider>
  );
}

export default App;
