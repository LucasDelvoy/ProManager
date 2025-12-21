import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard () {

    // Charger la page
    // Regarder si le token est présent dans le storage
    // Si non, renvoyer à la page login

    const [status, setStatus] = useState('Loading')
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    useEffect(() => {
        const checkAuth = async () => {

            if (!token) {

                navigate('/Login')
                return;
            }

            const response = await fetch('http://localhost:5000/api/user/me', {
            headers: {
                'Authorization': 'Bearer ' + token
                }
            })
            if (response.ok) {
                const data = await response.json()
                setStatus(data.message)
            } else {
                localStorage.removeItem('token')
                navigate('/Login')
            }
        }
        checkAuth()
    }, [])

    return (
        <>
        
            <div>
                <h1>{status}</h1>
            </div>

        </>
    )
}

export default Dashboard;