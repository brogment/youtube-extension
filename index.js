const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const PORT = process.env.PORT || 5000
const app = express()

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10 mins
    max: 10
})

app.use(cors())
app.use(limiter)
app.set('trust proxy', 1)
const API_KEY = process.env.API_KEY_VALUE;

app.get('/api/key', (req, res) => {
    res.json({ apiKey: API_KEY})
})

app.listen(PORT, () => console.log(`server running on port ${PORT}`))
