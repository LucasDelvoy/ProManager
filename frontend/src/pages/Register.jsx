import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css'




function Register () {

    //Prepare 2 states
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        const loginForm = await fetch('http://localhost:5000/api/auth/register', {
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
                        <h1 className="text-3xl font-bold text-gray-900">Register</h1>
                        <p className="text-gray-500 mt-2">Join ProManager starting today!</p>
                    </div>


                    <form className='flex flex-col gap-4 max-w-sm mx-auto' onSubmit={handleSubmit}>
                        <input className='border-1 rounded-md p-2' type='text' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email'></input>
                        <input className='border-1 rounded-md p-2' type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='password'></input>
                        <button className='bg-blue-500 text-gray-200 rounded-md p-2 w-24 self-center' type='submit'>Register</button>
                    </form>

                    

                </div>
                
            </div>
            
        </>
    )

}

export default Register;
//Backend response