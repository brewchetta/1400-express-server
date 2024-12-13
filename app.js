import express from 'express'
// import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import dotenv from 'dotenv'

import indexRouter from './routes/index.js'
import charactersRouter from './routes/characters.js'
import ancestriesRouter from './routes/ancestries.js'

import mongoose from './models/index.js'

dotenv.config()

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/characters', charactersRouter);
app.use('/ancestries', ancestriesRouter);

app.use((err, req, res, next) => {
    res.json({
        status: res.statusCode,
        error: err.message
    })
})

export default app