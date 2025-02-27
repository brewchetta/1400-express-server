import express from 'express'
import Training from '../models/Training.js'
import { checkExistence } from './_routeHelpers.js'

const router = express.Router();


/* GET /trainings */
router.get('/', async (req, res, next) => {
// TODO: names query currently not working (partially due to not capitalizing)
    const training = await Training.find({...req.query}).populate('prerequisites')
    res.json({status: 200, result: training, query: req.query})
});


/* GET /trainings/:id */
router.get('/:id', async (req, res, next) => {
    try {
        const training = await Training.findById(req.params.id).populate('prerequisites').exec()
        if (checkExistence(training, res, next)) {
          res.json({status: 200, result: training})
        }
      } catch (err) {
        res.status(500)
        next(err)
      }
});


export default router