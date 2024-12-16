import express from 'express'
import ItemTemplate from '../models/ItemTemplate.js'
import { checkExistence } from '../helpers.js'

const router = express.Router();


/* GET /items */
router.get('/', async (req, res, next) => {
// TODO: names query currently not working (partially due to not capitalizing)
    const items = await ItemTemplate.find({...req.query})
    res.json({result: items, query: req.query})
});


/* GET /items/:id */
router.get('/:id', async (req, res, next) => {
    try {
        const item = await ItemTemplate.findById(req.params.id).exec()
        if (checkExistence(item, res, next)) {
          res.json(item)
        }
      } catch (err) {
        res.status(500)
        next(err)
      }
});


export default router