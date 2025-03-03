import express from 'express'
import Spell from '../models/Spell.js'
import { checkExistence } from './_routeHelpers.js'

const router = express.Router();


/* GET /spells */
router.get('/', async (req, res, next) => {
// TODO: names query currently not working (partially due to not capitalizing)
    const spell = await Spell.find({...req.query})
    res.json({status: 200, result: spell, query: req.query})
});


/* GET /spells/:id */
router.get('/:id', async (req, res, next) => {
    try {
        const spell = await Spell.findById(req.params.id).exec()
        if (checkExistence(spell, res, next)) {
          res.json({status: 200, result: spell})
        }
      } catch (err) {
        res.status(500)
        next(err)
      }
});


export default router