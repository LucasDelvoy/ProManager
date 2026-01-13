const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient

const protect = require('../middleware/authMiddleware')

//Create Client

router.post('/createClient', protect, async (req, res,) => {

    //get name of client
    const clientName = req.body.name;
    if (!clientName) {
        return res.status(400).json({message: 'Please provide a client name.'})
    }
    
    //get user id
    const userId = req.user.userId
    if (!userId) {
        return res.status(401).json({message: 'Please log in.'})
    }

    //create client in database
    const newClient = await prisma.client.create({
        data: { 
            name: clientName,
            users: {
                connect: {
                    id: userId
                }
            }

        }
    })

    //return success message
    return res.status(201).json({message: 'Client file created'})
})


// See all clients

router.get('/', protect, async (req, res) => {
    
    //garde
    const userId = req.user.userId

    if (!userId) {
        return res.status(401).json({message: 'Please Log in.'})
    }

    //Chercher la liste
    const clients = await prisma.client.findMany({
        where: { users: { some: { id: userId } } },
    })

    //montrer la liste
    return res.json(clients)

})

router.get('/last', protect, async (req, res) => {

    //garde
    const userId = req.user.userId

    if (!userId) {
        return res.status(401).json({message: 'Please Log in.'})
    }

    //chercher dans la liste le dernier client
    const lastClient = await prisma.client.findFirst({
        where: {
            users: { some: { id: userId }},
        },
        orderBy: {
            createdAt: 'desc',
        }
    })

    return res.json(lastClient)
})

router.patch('/:id', protect, async (req, res) => {

    const userId = req.user.userId
    if (!userId) {
        return res.status(401).json({message: 'Please Log in.'})
    }

    const clientId = parseInt(req.params.id)
    if(!clientId) {
        return res.status(404).json({message: 'Please select a client.'})
    }

    const updatedClientName = req.body.name

    const client = await prisma.client.findUnique({
        where : {
            id: clientId,
            users: { some: { id: userId }}
        }
    })

    if (client) {
        const updatedClient = await prisma.client.update({
            where : {
                id: clientId,
                users: { some: { id: userId }}
            },
            data: { name: updatedClientName }
        })

        return res.json(updatedClient)

    } else {
        return res.status(404).json({message: 'Client not found.'})
    }

})

module.exports = router