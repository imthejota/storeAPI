const express = require('express')
require('express-async-errors')
const {PORT} = require('./config.js')
const notFoundMiddleware = require('./middleware/not-found.js')
const errorHandlerMiddleware = require('./middleware/error-handler')
const connectDB = require('./db/connect.js')
const router = require('./routes/products')



const app = express();



// Middlewares
app.use(express.json());

// Routes

app.get('/', (req, res) => {
    res.send('<h1>Store Api</h1><a href="/api/v1/products">Products Route</a>')
})

app.use('/api/v1/products', router)

// Products Route

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        console.log('Connected to MongoDB')
        app.listen(PORT, console.log(`Server up on port: ${PORT}, https://localhost:${PORT}`))
    } catch (error) {
        console.log(error)
    }
}
start()