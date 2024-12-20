import express from 'express'
import Ritual from '../models/Ritual.js'
import { checkExistence } from './_routeHelpers.js'

const router = express.Router();


/* GET /rituals */
router.get('/', async (req, res, next) => {
// TODO: names query currently not working (partially due to not capitalizing)
    const ritual = await Ritual.find({...req.query})
    res.json({status: 200, result: ritual, query: req.query})
});


/* GET /rituals/:id */
router.get('/:id', async (req, res, next) => {
    try {
        const ritual = await Ritual.findById(req.params.id).exec()
        if (checkExistence(ritual, res, next)) {
          res.json({status: 200, result: ritual})
        }
      } catch (err) {
        res.status(500)
        next(err)
      }
});


export default router