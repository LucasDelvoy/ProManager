import React, { useState, useEffect } from 'react'


function AddClient ({ onSuccess, isOpen, onClose }) {

    const token = localStorage.getItem('token')
    const [newClient, setNewClient] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()
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

            if (onSuccess) onSuccess();
            alert('New client added!')
        }
    }

    return (
        <>
        
            <form onSubmit={handleSubmit} className='flex flex-col gap-2 max-w-40 mx-auto'>
                <input type='text' value={newClient} onChange={(e) => setNewClient(e.target.value)} placeholder='New Client name' className='border-1 rounded-md p-1 w-25 text-xs self-center' />
                <button type='submit' className='bg-blue-500 text-gray-200 rounded-md p-1 w-25 text-xs self-center'>Add New Client</button>
            </form>
        
        </>
    )
}

export default AddClient;
