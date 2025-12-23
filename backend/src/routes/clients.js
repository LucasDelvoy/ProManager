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
        return res.status(400).json({message: 'Please log in.'})
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
    console.log("ID utilisateur récupéré :", userId);
    console.log("Type de l'ID :", typeof userId);

    //Chercher la liste
    const clients = await prisma.client.findMany({
        where: { users: { some: { id: userId } } },
    })

    //montrer la liste
    return res.json(clients)

})

module.exports = router