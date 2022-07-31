import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import * as UserService from "../service/UserService"
// import UserContext from '../context/UserContext';

function Login() {
    let sessionStorage = window.sessionStorage
    sessionStorage.clear()

    let navigate = useNavigate();
    // const { setStateUser } = useContext(UserContext)
    const [data, setData] = useState({
        username: "",
        password: "",
    })

    const signin = async () => {
        try {
            const res = await UserService.login(data)
            const cred = await res.json()
            if (cred.access_token) {
                sessionStorage.setItem('userToken', cred.access_token)
                sessionStorage.setItem('userId', cred.user.id)
                navigate('/profile')
            } else {
                navigate('/login')
            }

        } catch (error) {
            // console.log(error)
        }
    }
    const handleInputChange = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        })
    }

    const sendData = (event) => {
        event.preventDefault()
        signin()
    }

    return (
        <div className="container">
            <div className="card text-center">
                <div className="card-header bg-dark text-white">
                    <h5 className='card-title'>Login</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={sendData} className="mb-3">
                        <div className="row mb-3">
                            <div className="col col-md-4">
                                <h5 className="card-title">Username</h5>
                            </div>
                            <div className="col ">
                                <input onChange={handleInputChange} type="text" className="form-control" id="username" name="username" />
                                <small className="text-muted">Min 8 letters</small>
                            </div>
                        </div>

                        <div className="row mb-3">

                            <div className="col col-md-4">
                                <h5 className="card-title">Password</h5>
                            </div>

                            <div className="col ">
                                <input onChange={handleInputChange} type="password" className="form-control" id="password" name="password" />
                                <small className="text-muted">Please introduce secure password</small>
                            </div>

                        </div>
                        <div className="text-center">
                            <p>Not a member? <Link to="/register">Register</Link></p>
                        </div>
                        <button type="submit" className="btn btn-primary form-control">Go!</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;