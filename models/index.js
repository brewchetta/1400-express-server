import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Character from './Character.js'

dotenv.config()

// check for .env variables
if (!process.env.MONGO_USER || !process.env.MONGO_PW) {
    throw new Error('You must include MONGO_USER and MONGO_PW in your .env!')
}

const MONGO_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@cluster0.mmdkp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

await mongoose.connect(MONGO_URL)

export default mongoose