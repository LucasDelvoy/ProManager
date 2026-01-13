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

    const [editClientId, setEditClientId] = useState(null)
    const [editName, setEditName] = useState('')

    const editMode = (client) => {

        console.log(client.id)
        console.log(client.name)
        if (client && client.id) {
            setEditClientId(client.id);
            setEditName(client.name)

            console.log(editClientId, editName)
        } else {
            console.log('ca marche pas')
        }}

    async function handleEdit(e) {

        if (e.key === 'Escape') {
            setEditClientId(null)
            return;
        }

        if (e.key === 'Enter') {
            console.log('id: ', editClientId)
            const res = await fetch(`http://localhost:5000/api/user/me/clients/${editClientId}`, {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    name: editName
                })
            })

            if(res.ok) {
                const data = await res.json()
                setEditClientId(null)
                fetchClients()
            }
        }
        
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
                                        <div key={client.id} onClick={() => handleEdit(client)}>
                                            {editClientId === client.id ? (
                                                <input value={editName} onChange={(e) => setEditName(e.target.value)} onKeyDown={(e) => handleEdit(e)} />
                                            ) : (
                                                <li className='text-sm hover:text-blue-500' onClick={() => editMode(client)}>{client.name}</li>
                                            )}
                                        </div>
                                        
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