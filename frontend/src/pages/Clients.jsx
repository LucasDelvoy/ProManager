import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AddClient from '../components/AddClientModal';

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

    return (
        <>
        
            <div className='flex flex-col items-center justify-center gap-4 px-4 min-h-[60vh]'>
                <div className='text-center mb-2'>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Clients</h1>
                    <p>Keep track of your clients here</p>
                </div>
                <div className='flex items-stretch justify-center gap-4'>
                    <div className='p-4 bg-white shadow-x1 rounded-md bg-gray-100 border border-gray-300'>
                        <h4 className='self-center p-2 font-bold'>Add a client</h4>
                        <AddClient onSuccess={fetchClients} />
                    </div>
                    
                    <div className='p-4 bg-white shadow-x1 rounded-md bg-gray-100 border border-gray-300'>

                        {clients.length > 0 ? (
                            <div>
                                <h4 className='self-center p-2 font-bold'>Client List</h4>
                                <ul>
                                    {clients?.map(client => (
                                        <li className='text-sm' key={client.id}>{client.name}</li>
                                    ))}
                                </ul>
                            </div>
                            
                        ) : (
                            <p>You don't have any client</p>
                        )}

                    </div>
                </div>
                
            </div>
            

        </>
    )
}

export default Client;