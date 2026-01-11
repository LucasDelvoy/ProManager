import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';



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

            <div className='flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4'>
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Login</h1>
                    </div>

                    <form className='flex flex-col gap-4 max-w-sm mx-auto' onSubmit={handleSubmit}>
                        <input className='border-1 rounded-md p-2' type='text' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email'></input>
                        <input className='border-1 rounded-md p-2' type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='password'></input>
                        <button className='bg-blue-500 text-gray-200 rounded-md p-2 w-24 self-center' type='submit'>Login</button>
                    </form>

                    <p className='self-center text-gray-400 text-sm m-2'>Not registered yet? You can do it <Link className='text-blue-400 underline' to='/Register'>here</Link>.</p>
                </div>
            </div>
        </>
    )

}

export default Login;
//Backend response