import express from 'express'
import Ancestry from '../models/Ancestry.js'
import { checkExistence } from '../helpers.js'

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


/* FORBIDDEN ROUTES */


/* POST /ancestries */
// router.post('/', async (req, res, next) => {
//   const newAncestry = await Ancestry.create(req.body)
//   res.status(201).json({ status: 201, message: "Success", result: newAncestry })
// })


// /* PATCH /ancestries */
// router.patch('/:name', async (req, res, next) => {
//   const ancestry = await Ancestry.findOne({name: req.params.name}).exec()
//   if (checkExistence(ancestry, res, next)) {
//     try {
//       // iterate on keys and update
//       Object.keys(req.body).forEach(key => ancestry[key] = req.body[key] )
//       // save and return
//       await ancestry.save()
//       res.status(202).json(ancestry)
//     } catch (error) {
//       res.status(400)
//       next(error)
//     }
//   }

// })


// router.delete('/:name', async (req, res, next) => {
//   const ancestry = await Ancestry.findOne({name: req.params.name}).exec()
//   if (checkExistence(ancestry, res, next)) {
//     await Ancestry.deleteOne({name: titleCase(req.params.name)})
//     res.status(202).json({status: 202, message: "Deleted", item: ancestry})
//   }
// })


export default router