const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient;

const protect = require('../middleware/authMiddleware')

//REGISTER
router.post('/register', async (req, res) => {

    //get email and password
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({message: 'Please fill in all the fields'})
    }
    
    //find if email exists in database
    const existingUser = await prisma.user.findUnique({
        where: { email: email }
    })
    if (existingUser) {
        return res.status(409).json({message: 'This email is already taken'})
    };

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user
    const user = await prisma.user.create({
        data: {
            email: email,
            password: hashedPassword,
        }
    })

    //return success
    return res.status(201).json({message: 'User successfully created'})
});


//LOGIN

router.post('/login', async (req, res) => {

    //get email and password
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({message: 'Please fill in all the fields'})
    }

    //find if email exists in database
    const user = await prisma.user.findUnique({
        where: {email: email}
    })
    if (!user) {
        return res.status(409).json({message: 'Please use a correct email address'})
    }

    //compare password and hashed password
    const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return res.status(409).json({message: 'Incorrect Password'})
        }

        //return token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
        )
    
        res.json({ token });

});

router.get('/profile', protect, (req, res, next) => {
    return res.json(req.user)
})

module.exports = router