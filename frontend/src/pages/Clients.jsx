import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Client () {

    //check if user is connected else go to login page
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    useEffect(() => {
        const checkAuth = async () => {

            if (!token) {
                navigate('/Login')
                return;
            }

            const response = await fetch('http://localhost:5000/api/user/me/clients', {
                headers: {
                    'authorization': 'Bearer ' + token
                }
            })
            if (response.ok) {
                fetchClients()
            } else {
                localStorage.removeItem('token')
                navigate('/Login')
            } 
        }
        checkAuth()
    }, [])
    
    //show client list
    const [clients, setClients] = useState([])
    const [newClient, setNewClient] = useState('')

    async function fetchClients () {

        const res = await fetch('http://localhost:5000/api/user/me/clients', {
            method: 'GET',
            headers: {
                'authorization': 'Bearer ' + token
            }
        })
        const data = await res.json();
        setClients(data)
    }

    
    //create new client form
    async function handleSubmit(e) {
        e.preventDefault();
        const clientForm = await fetch('http://localhost:5000/api/user/me/clients/createClient', {
            method: 'POST',
            headers: {
                'authorization': 'Bearer ' + token,
                'content-type': "application/json"
            },
            body: JSON.stringify({name: newClient})
        })

        if (clientForm.ok) {
            const data = await clientForm.json()
            setNewClient('')
            fetchClients()
        }
    }

    return (
        <>
        
            <form onSubmit={handleSubmit}>
                <input type='text' value={newClient} onChange={(e) => setNewClient(e.target.value)} placeholder='New Client name' />
                <button type='submit'>Add New Client</button>
            </form>

            <div className='client-list'>

                {clients.length > 0 ? (
                    <ul>
                        {clients?.map(client => (
                            <li key={client.id}>{client.name}</li>
                        ))}
                    </ul>
                ) : (
                    <p>You don't have any client</p>
                )}

            </div>

        </>
    )
}

export default Client;