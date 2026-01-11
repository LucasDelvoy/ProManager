import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AddClient from '../components/AddClientModal';
import LastClientProject from '../components/LastClientProjectModal';

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
                fetchLastClient()
            } else {
                localStorage.removeItem('token')
                navigate('/Login')
            }
        }
        checkAuth()
    }, [])

    const [lastClient, setLastClient] = useState(null)

    async function fetchLastClient () {

        const res = await fetch('http://localhost:5000/api/user/me/clients/last', {
            method: 'GET',
            headers: {
                'authorization': 'Bearer ' + token
            }
        })

        const data = await res.json();
        setLastClient(data)
    }

    return (
        <>   

            <div className='flex flex-col items-center justify-center gap-4 px-4 min-h-[60vh]'>
                <div className='text-center mb-2'>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{status}</h1>
                    <p>Keep track of your projects</p>
                </div>
                <div className='flex items-stretch justify-center gap-4'>
                    <div className='p-4 bg-white shadow-x1 rounded-md bg-gray-100 border border-gray-300'>

                        {lastClient ? (
                            <div className='flex flex-col items-center pb-4'>
                                <h4 className='text-md font-bold text-gray-900'>Last Client</h4>
                                <p className='text-sm'>{lastClient.name}</p>
                            </div>
                        ) : (
                            <div>
                                <p>You don't have any clients yet</p>
                            </div>
                        )}

                        <div>
                            <AddClient  onSuccess={fetchLastClient}/>    
                        </div>
                        
                    </div>

                    <div>
                        {lastClient ? (
                            <LastClientProject lastClient={lastClient} onSuccess={fetchLastClient}/>
                        ) : (
                            <div>
                                <p>You need to add clients to create a project</p>
                            </div>
                            
                        )}
                    </div>
                    
                </div>
            </div>
            
            
        </>
    )
}

export default Dashboard;