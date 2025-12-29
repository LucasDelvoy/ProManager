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
            fetchProjects(clientName, clientId)
        }
    }

    return (
        <>
        
            <div className='client-list'>

                {clients.length > 0 ? (
                    <ul>
                      {clients?.map(client => (
                        <li key={client.id} onClick={() => fetchProjects(client.name, client.id)}>
                            {client.name}
                            
                            {activeClientId === client.id && (
                                <div onClick={(e) => e.stopPropagation()}>

                                    <form onSubmit={(e) => handleSubmit(e, client.name, client.id)}>
                                        <input type='text' value={newProject} onChange={(e) => setNewProject(e.target.value)} placeholder='New Project Name'></input>
                                        <button type='submit'>Add New Project </button>
                                    </form>

                                    {projects.length > 0 ? (
                                        <ul>
                                            {projects.map(project => (
                                                <li key={project.id}>{project.name}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>You don't have any project with this client</p>
                                    )}

                                </div>
                            )}
                        </li>
                      ))}  
                    </ul>
                ) : (
                    <p>You don't have any client</p>
                )}

            </div>
        
        </>
    )
}

export default Projects;