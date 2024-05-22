const express = require('express')
const cors = require('cors')
require('dotenv').config()

const PORT = process.env.PORT || 5000
const app = express()

app.use(cors())

const API_KEY = process.env.API_KEY_VALUE;

app.get('/api/key', (req, res) => {
    res.json({ apiKey: API_KEY})
})

app.listen(PORT, () => console.log(`server running on port ${PORT}`))
