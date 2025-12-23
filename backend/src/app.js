//app.js créé
const express = require('express')
const app = express();
//init cors
const cors = require('cors')
app.use(cors())
app.use(express.json())

const authMiddleware = require('./middleware/authMiddleware')
const auth = require('./routes/auth');
const clients = require ('./routes/clients')

app.get('/api/health', (req, res) => {
    res.json({ message: "Le serveur répond !" });
});

//créer la route
app.use('/api/auth', auth);
app.get('/api/user/me', authMiddleware, (req, res) => {
    res.json({ message: "Bonjour" });
});
app.use('/api/user/me/clients', clients)

//exporter vers server.js
module.exports = app