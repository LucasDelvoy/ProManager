//app.js créé
const express = require('express')
const app = express();
//init cors
const cors = require('cors')
app.use(cors())
app.use(express.json())

const auth = require('./routes/auth');

//créer la route
app.use('/api/auth', auth);

//exporter vers server.js
module.exports = app