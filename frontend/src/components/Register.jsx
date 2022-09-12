import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import * as UserService from "../service/UserService"

function Register() {
    let navigate = useNavigate();
    const [data, setData] = useState({
        username: "",
        password: "",
        email: "",
        password_confirmation: "",
        first_name: "",
        last_name: ""
    })

    const signup = async () => {
        try {
            UserService.register(data)
            navigate('/login')
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
        signup()
    }

    return (
        <div className="container">
            <div className="card text-center">
                <div className="card-header bg-dark text-white">
                    <h5 className='card-title'>Register</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={sendData} className="mb-3">

                        {/* first_name field*/}
                        <div className="row mb-3">
                            <div className="col col-md-4">
                                <h5 className="card-title">First name</h5>
                            </div>
                            <div className="col ">
                                <input onChange={handleInputChange} type="text" className="form-control" id="first_name" name="first_name" />
                                <small className="text-muted">Introduce your first name</small>
                            </div>
                        </div>
                        {/* last_name field*/}
                        <div className="row mb-3">
                            <div className="col col-md-4">
                                <h5 className="card-title">Last name</h5>
                            </div>
                            <div className="col ">
                                <input onChange={handleInputChange} type="text" className="form-control" id="lastname" name="last_name" />
                                <small className="text-muted">Introduce your last name</small>
                            </div>
                        </div>
                        {/* Email field*/}
                        <div className="row mb-3">
                            <div className="col col-md-4">
                                <h5 className="card-title">Email</h5>
                            </div>
                            <div className="col ">
                                <input onChange={handleInputChange} type="email" className="form-control" id="email" name="email" />
                                <small className="text-muted">Introduce a correct email</small>
                            </div>
                        </div>

                        {/* Username field*/}
                        <div className="row mb-3">
                            <div className="col col-md-4">
                                <h5 className="card-title">Username</h5>
                            </div>
                            <div className="col ">
                                <input onChange={handleInputChange} type="text" className="form-control" id="username" name="username" />
                                <small className="text-muted">Min 8 letters</small>
                            </div>
                        </div>

                        {/* Password field*/}
                        <div className="row mb-3">
                            <div className="col col-md-4">
                                <h5 className="card-title">Password</h5>
                            </div>
                            <div className="col ">
                                <input onChange={handleInputChange} type="password" className="form-control" id="password" name="password" />
                                <small className="text-muted">Min 8 letters</small>
                            </div>
                        </div>

                        {/* Password_confirmation field*/}
                        <div className="row mb-3">
                            <div className="col col-md-4">
                                <h5 className="card-title">Password confirmation</h5>
                            </div>
                            <div className="col ">
                                <input onChange={handleInputChange} type="password" className="form-control" id="password_confirmation" name="password_confirmation" />
                                <small className="text-muted">Please confirm your password</small>
                            </div>
                        </div>


                        <button type="submit" className="btn btn-primary form-control">Go!</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;