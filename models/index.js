import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'

import { MONGO_URL } from '../mongo-config.js'

await mongoose.connect(MONGO_URL)

export default mongoose