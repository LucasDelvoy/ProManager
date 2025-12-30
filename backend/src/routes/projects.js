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


module.exports = router