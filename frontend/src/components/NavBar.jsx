import { Link } from 'react-router-dom';
import LogoutButton from "./LogoutButton";


const NavBar = () => {
    const userToken = sessionStorage.getItem('userToken')
    console.log(userToken)
    let hide
    if (userToken) {
        hide = false
    } else {
        hide = true
    }
    return (
        <nav hidden={hide} className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Home</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <Link className="nav-link" to="/home">Projectts</Link>
                        {/* <a className="nav-link" href="#">Projects</a> */}
                        <Link className="nav-link" to="/">Diagrams</Link>
                        <Link className="nav-link" to="/">Profile</Link>
                    </div>

                </div>
                {/* componente logout */}
                <LogoutButton />
            </div>
        </nav>
    );
};

export default NavBar;