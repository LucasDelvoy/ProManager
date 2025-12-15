//app.js créé
const express = require('express')
const app = express();
//init cors
const cors = require('cors')
app.use(cors())

//créer la route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: "ok" })
})

//exporter vers server.js
module.exports = app