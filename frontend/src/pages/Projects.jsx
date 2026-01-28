import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Projects () {

    //check if user is connected
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


    //check if user has clients
    const [clients, setClients] = useState([])

    async function fetchClients () {

        const res = await fetch('http://localhost:5000/api/user/me/clients', {
            method: 'GET',
            headers: {
                'authorization': 'Bearer ' + token
            }
        })
        const data = await res.json()
        setClients(data)
    }
    
    //check the client's projects
    const [projects, setProject] = useState([])
    const [newProject, setNewProject] = useState('')
    const [activeClientId, setActiveClientId] = useState(null)
    
    async function fetchProjects (clientName, clientId) {

        setActiveClientId(clientId)
        const res = await fetch('http://localhost:5000/api/user/me/projects?clientName=' + clientName, {
            method: 'GET',
            headers: {
                'authorization': 'Bearer ' + token
            }
        })
        const data = await res.json()
        setProject(data)
    }

    //create new project
    async function handleSubmit(e, clientName, clientId) {
        e.preventDefault();

        const projectForm = await fetch('http://localhost:5000/api/user/me/projects/createProject', {
            method: 'POST',
            headers: {
                'authorization': 'Bearer ' + token,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                projectName: newProject,
                clientName: clientName
            })
        })
        
        if (projectForm.ok) {
            const data = await projectForm.json()
            setNewProject('')
            alert('New Project added!')
            fetchProjects(clientName, clientId)
        }
    }

    const [editProjectId, setEditProjectId] = useState(null)
    const [editName, setEditName] = useState('')

    const editMode = (project) => {

        if (project && project.id) {
            setEditProjectId(project.id)
            setEditName(project.name)
        }

    }

    async function handleEdit(e, clientName, clientId) {

        if (e.key === 'Escape') {
            setEditProjectId(null)
            return
        }

        if (e.key === 'Enter') {
            const res = await fetch(`http://localhost:5000/api/user/me/projects/${editProjectId}`, {
                method: 'PATCH',
                headers: {
                    'authorization': 'Bearer ' + token,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: editName
                })
            })

            if (res.ok) {
                const data = await res.json()
                setEditProjectId(null)
                alert('Project Successfully Deleted')
                fetchProjects(clientName, clientId)
            }
        }
    }

    async function handleDelete(e, clientName, clientId) {

        if (!window.confirm('Are you sure you want to delete this project?')) return

        const res = await fetch(`http://localhost:5000/api/user/me/projects/${editProjectId}/delete`, {
            method: 'DELETE',
            headers: {
                'authorization': 'Bearer ' + token,
                'content-type': 'application/json'
            }
        })

        if (res.ok) {
            const data = await res.json()
            setEditProjectId(null)
            fetchProjects(clientName, clientId)
        }
    }

    return (
        <>
            <div className='flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4'>
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">

                    <div className='text-center mb-2 p-2'>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Project</h1>
                        <p>Keep track and add new projects here</p>
                    </div>

                    <div className='p-4 bg-white shadow-x1 rounded-md bg-gray-100 border border-gray-300 p-2 shadow-xl'>
                        {clients.length > 0 ? (
                            <ul>
                            {clients?.map(client => (
                                <li className='list-none' key={client.id} onClick={() => fetchProjects(client.name, client.id)}>
                                    <span className='font-semibold hover:text-blue-500' onClick={() => fetchProjects(client.name, client.id)}>
                                        {client.name}
                                    </span>
                                    
                                    {activeClientId === client.id && (
                                        <div onClick={(e) => e.stopPropagation()}>

                                            {projects.length > 0 ? (
                                                <ul>
                                                    {projects.map(project => (
                                                        <div key={project.id} onClick={() => handleEdit(project)}>
                                                            {editProjectId === project.id ? (
                                                                <div>
                                                                    <input value={editName} onChange={(e) => setEditName(e.target.value)} onKeyDown={(e) => handleEdit(e, client.name, client.id)} />
                                                                    <button onClick={() => handleDelete(project, client.name, client.id)}> Delete Project </button>
                                                                </div>
                                                            ) : (
                                                                <li className='text-sm hover:text-blue-500' onClick={() => editMode(project)}>{project.name}</li>
                                                            )}
                                                        </div>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className='text-sm'>You don't have any project with this client</p>
                                            )}

                                            <form onSubmit={(e) => handleSubmit(e, client.name, client.id)} className='flex flex-col gap-2 max-w-40 mx-auto'>
                                                <input type='text' value={newProject} onChange={(e) => setNewProject(e.target.value)} placeholder='New Project Name'className='border-1 rounded-md p-1 w-35 text-xs font-medium self-center' />
                                                <button type='submit' className='bg-blue-500 text-gray-200 rounded-md p-1 w-35 text-xs self-center font-medium'>Add New Project </button>
                                            </form>

                                        </div>
                                    )}
                                </li>
                            ))}  
                            </ul>
                        ) : (
                            <p>You don't have any client</p>
                        )}
                    </div>
                    

                </div>
            </div>
            
        
        </>
    )
}

export default Projects;