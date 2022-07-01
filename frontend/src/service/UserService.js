const API_URL = "http://127.0.0.1:8000/users/login/"

export const login = async (data) => {
    return await fetch(API_URL,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": String(data.username),
            "password": String(data.password),
        })
    })
}

export const register = async (data) => {
    return await fetch(API_URL,{
        method:'POST',
        headers : {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            'username': String(data.username),
            'password': String(data.password),
            'email': String(data.email),
            'password_confirmation': String(data.password_confirmation),
            'first_name': String(data.first_name),
            'last_name': String(data.last_name)
        })
    })
}