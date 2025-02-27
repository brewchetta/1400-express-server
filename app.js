import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url' // used for static paths with node modules
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import dotenv from 'dotenv'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import cors from 'cors'

import { MONGO_URL } from './mongo-config.js'
import mongoose from './models/index.js'

import indexRouter from './routes/index.js'
import ancestriesRouter from './routes/ancestries.js'
import charactersRouter from './routes/characters.js'
import itemsRouter from './routes/items.js'
import spellsRouter from './routes/spells.js'
import ritualsRouter from './routes/rituals.js'
import trainingsRouter from './routes/trainings.js'
import usersRouter from './routes/users.js'
import storyGroupsRouter from './routes/story-groups.js'
import storyPlayersRouter from './routes/story-players.js'


dotenv.config()

const app = express();

app.set('trust proxy', 'loopback') // allow localhost proxies
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGO_URL
    }),
    cookie: {
        secure: false, // TODO: use process.env.NODE_ENV === 'production' here
        maxAge: 12 * 60 * 60 * 1000,
        httpOnly: false,
        sameSite: "strict"
    }
}))
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const buildPath = path.normalize(path.join(__dirname, 'client/dist'))
app.use(express.static(buildPath))

const BASE_URL = '/api'

app.use(`${BASE_URL}/ancestries`, ancestriesRouter);
app.use(`${BASE_URL}/characters`, charactersRouter);
app.use(`${BASE_URL}/items`, itemsRouter);
app.use(`${BASE_URL}/rituals`, ritualsRouter);
app.use(`${BASE_URL}/spells`, spellsRouter);
app.use(`${BASE_URL}/trainings`, trainingsRouter);
app.use(`${BASE_URL}/users`, usersRouter);
app.use(`${BASE_URL}/story-groups`, storyGroupsRouter);
app.use(`${BASE_URL}/story-players`, storyPlayersRouter);

app.use('/*', (req, res, next) => {
    if (/(.ico|.js|.css|.jpg|.png|.map|.svg)$/i.test(req.path)) {
        next();
    } else {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
        res.header('Expires', '-1')
        res.header('Pragma', 'no-cache')
        res.sendFile(path.join(__dirname, 'client', 'index.html'))
    }
})

app.use((err, req, res, next) => {
    res.json({
        status: res.statusCode,
        error: err.message
    })
})

export default app