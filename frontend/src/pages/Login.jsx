import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';



function Login () {

    //Prepare 2 states
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        const loginForm = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        })
        if (loginForm.ok) {
            const data = await loginForm.json()
            localStorage.setItem('token', data.token)
            navigate('/Dashboard')
        }
    }

    //Show the page
    return (
        <>
            <form onSubmit={handleSubmit}>
                <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email'></input>
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='password'></input>
                <button type='submit'>Login</button>
            </form>
        </>
    )

}

export default Login;
//Backend response