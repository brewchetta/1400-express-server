import express from 'express'
import Ancestry from '../models/Ancestry.js'
import { checkExistence } from './_routeHelpers.js'

const router = express.Router();


/* GET /ancestries */
router.get('/', async (req, res, next) => {
// TODO: names query currently not working (partially due to not capitalizing)
    if (req.query?.name) {
        req.query.name = req.query.name.toLowerCase()
    }
    const ancestries = await Ancestry.find({...req.query})
    res.json({result: ancestries, query: req.query})
});


export default router