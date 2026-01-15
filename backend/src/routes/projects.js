const express = require('express')
const router = express.Router()

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient

const protect = require ('../middleware/authMiddleware')

//create project
router.post('/createProject', protect, async (req, res) => {

    //Guard
    const userId = req.user.userId
    if (!userId) {
        return res.status(401).json({message: 'Please Log in.'})
    }

    //Name project
    const {clientName, projectName} = req.body
    if (!clientName || !projectName) {
        return res.status(400).json({message: 'Please fill in all fields'})
    }

    //Link to user and client
    const client = await prisma.client.findFirst({
        where: {
            name: clientName, 
            users: {
                some: {id: userId}
            }
        }
    })
    if (!client) {
        return res.status(400).json({message: 'Please give a correct client name'})
    }

    //Create Project
    const newProject = await prisma.project.create({
        data: {
            name: projectName,
            clientId: client.id,
            userId: userId,
            }
        })

    //Return success
    return res.status(201).json({message: 'Project successfully created'})
})

//get projects
router.get('/', protect, async (req, res) => {
    
    //guard
    const userId = req.user.userId
    if (!userId) {
        return res.status(401).json({message: 'Please Log In'})
    }

    //give client name
    const { clientName } = req.query
    if (!clientName) {
        return res.status(400).json({message: 'Please give a correct client name'})
    }
    const client = await prisma.client.findFirst({
        where: {
            name: clientName,
            users:{
                some: {id: userId,}
            }
        }
    })

    if(!client) {
        return res.status(404).json({message: 'Client or Project not found'})
    }

    //get all projects
    const projects = await prisma.project.findMany({
        where: { 
            clientId: client.id,
            userId: userId
        }
    })

    return res.json(projects)
})

router.post('/lastClientProject', protect, async (req, res) => {

    const userId = req.user.userId
    if (!userId) {
        return res.status(401).json({message: 'Please Log In'})
    }

    const {projectName, clientName} = req.body

    if (!clientName) {
        return res.status(400).json({message: 'Client Name missing'})
    }

    const client = await prisma.client.findFirst({
        where:{
            name: clientName
        }
    })

    const newProject = await prisma.project.create({
        data:{
            name: projectName,
            client: {
                connect: { id: client.id },
            },
            user: {
                connect:{ id: userId }
            }
        }
    })

    return res.status(201).json({message: 'Project successfully created'})
})

router.patch('/:id', protect, async (req, res) => {

    const userId = req.user.userId
    if (!userId) {
        return res.status(401).json({message: 'Please Log In'})
    }

    const projectId = parseInt(req.params.id)
    if (!projectId) {
        return res.status(404).json({message: 'Please select a project'})
    }

    const updatedProjectName = req.body.name

    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
            userId: userId
        }
    })

    if (project) {
        const updatedProject = await prisma.project.update({
            where: {
                id: projectId,
                userId: userId
            },
            data: { name: updatedProjectName }
        })
        return res.json(updatedProject)
    } else {
        return res.status(404).json({message: 'Project not found'})
    }

})

router.delete('/:id/delete', protect, async (req, res) => {

    const userId = req.user.userId
    if (!userId) {
        return res.status(401).json({message: 'Please Log In'})
    }

    const projectId = parseInt(req.params.id)
    if (!projectId) {
        return res.status(404).json({message: 'Please select a project'})
    }

    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
            userId: userId
        }
    })
    if (project) {
        const deletedProject = await prisma.project.delete({
            where: {
                id: projectId,
            }
        })

        return res.json(deletedProject)
    } else {
        return res.status(404).json({message: 'Project not found.'})
    }
})


module.exports = router