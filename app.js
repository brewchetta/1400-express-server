import express from 'express'
// import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import dotenv from 'dotenv'

import indexRouter from './routes/index.js'
import ancestriesRouter from './routes/ancestries.js'
import charactersRouter from './routes/characters.js'
import itemsRouter from './routes/items.js'
import spellsRouter from './routes/spells.js'
import ritualsRouter from './routes/rituals.js'
import trainingsRouter from './routes/trainings.js'
import usersRouter from './routes/users.js'

import mongoose from './models/index.js'

dotenv.config()

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/ancestries', ancestriesRouter);
app.use('/characters', charactersRouter);
app.use('/items', itemsRouter);
app.use('/rituals', ritualsRouter);
app.use('/spells', spellsRouter);
app.use('/trainings', trainingsRouter);
app.use('/users', usersRouter);

app.use((err, req, res, next) => {
    res.json({
        status: res.statusCode,
        error: err.message
    })
})

export default app