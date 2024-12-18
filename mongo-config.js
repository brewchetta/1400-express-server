import dotenv from 'dotenv'

dotenv.config()

// check for .env variables
if (!process.env.MONGO_USER || !process.env.MONGO_PW) {
    throw new Error('You must include MONGO_USER and MONGO_PW in your .env!')
}

let MONGO_URL

if (process.env.NODE_ENV === 'production') {
    MONGO_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@cluster0.mmdkp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
}

if (process.env.NODE_ENV === 'development') {
    MONGO_URL = 'mongodb://127.0.0.1:27017/fourteen-hundred-dev'
}

if (process.env.NODE_ENV === 'test') {
    MONGO_URL = 'mongodb://127.0.0.1:27017/fourteen-hundred-test'
}

export { MONGO_URL }