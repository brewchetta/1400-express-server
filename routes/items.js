import express from 'express'
import ItemTemplate from '../models/ItemTemplate.js'
import { checkExistence } from './_routeHelpers.js'

const router = express.Router();


/* GET /items */
router.get('/', async (req, res, next) => {

  let items

  if (req.query.name) { // WITH QUERIES
    items = await ItemTemplate.find({ 
      name: { "$regex": '.*' + (req?.query?.name || '') + '.*', "$options": 'i' }
    }).limit(10)
  }

  else { // DEFAULT WITHOUT QUERIES
    items = await ItemTemplate.find({})
  }

  res.json({status: 200, result: items, query: req.query, categories: ItemTemplate.categories})
});


/* GET /items/:id */
router.get('/:id', async (req, res, next) => {
  try {
      const item = await ItemTemplate.findById(req.params.id).exec()
      if (checkExistence(item, res, next)) {
        res.json({status: 200, result: item})
      }
    } catch (err) {
      res.status(500)
      next(err)
    }
});


export default router