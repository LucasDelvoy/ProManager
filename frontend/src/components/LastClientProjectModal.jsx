import React, { useState, useEffect } from 'react'

function LastClientProject ({ lastClient, onSuccess }) {

    const token = localStorage.getItem('token')
    const [newProject, setNewProject] = useState('')

    async function handleSubmit (e) {
        e.preventDefault()
    
        const projectForm = await fetch('http://localhost:5000/api/user/me/projects/lastClientProject', {
            method: 'POST',
            headers: {
                'authorization': 'Bearer ' + token,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                projectName: newProject,
                clientName: lastClient.name,
            })
        })
    
        if (projectForm.ok) {
            const data = await projectForm.json()
            setNewProject('')

            if (onSuccess) onSuccess();
            alert('New Project added!')
        }
    
    }

    return (
        <>
        
            <div className='p-4 bg-white shadow-x1 rounded-md bg-gray-100 border border-gray-300 h-full'>
                <div className='flex flex-col items-center pb-4'>
                    <p>Add a project for: </p>
                    <p>{lastClient?.name}</p>
                </div>
                
                <form onSubmit={handleSubmit} className='flex flex-col gap-2 max-w-40 mx-auto'>
                    <input type='text' value={newProject} onChange={(e) => setNewProject(e.target.value)} placeholder='New Project' className='border-1 rounded-md p-1 w-25 text-xs self-center' />
                    <button type='submit' className='bg-blue-500 text-gray-200 rounded-md p-1 w-25 text-xs self-center'>Create Project</button>
                </form>
            </div>

        </>
    )
}

export default LastClientProject;