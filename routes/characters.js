import express from 'express'
import Character from '../models/Character.js'
import Ancestry from '../models/Ancestry.js'
import { checkExistence } from '../helpers.js';

const router = express.Router();


/* GET /characters/:id */
router.get('/:id', async (req, res, next) => {
  try {
    const character = await Character.findById(req.params.id).populate('ancestry').populate('trainings').exec()
    if (checkExistence(character, res, next)) {
      res.json(character)
    }
  } catch (err) {
    res.status(500)
    next(err)
  }
});


/* GET /characters */
router.get('/', async (req, res, next) => {
  const characters = await Character.find({}).populate('ancestry')
  res.json(characters)
});


/* POST /characters */
router.post('/', async (req, res, next) => {
  try {
    // handle find ancestries
    const ancestryName = req.body.ancestry
      const foundAncestry = await Ancestry.findOne({name: ancestryName})
    if (!foundAncestry) { throw Error('Ancestry must exist') }
  
    req.body.ancestry = foundAncestry._id

    const newChar = await Character.create(req.body)
    res.status(201).json({ status: 201, message: "Success", result: newChar.populate('ancestry') })

  } catch (err) {
    if (res.statusCode < 400) { res.status(400) }
    next(err)
  }
})


/* PATCH /characters */
router.patch('/:id', async (req, res, next) => {
  const character = await Character.findById(req.params.id).populate('ancestry').exec()
  if (checkExistence(character, res, next)) {
    try {
      // iterate on keys and update
      Object.keys(req.body).forEach(key => character[key] = req.body[key] )

      // save and return
      await character.save()
      res.status(202).json({status: 202, message: "Success", result: character})
    } catch (error) {
      res.status(400)
      next(error)
    }
  }

})


router.delete('/:id', async (req, res, next) => {
  const character = await Character.findById(req.params.id).populate('ancestry').exec()
  if (checkExistence(character, res, next)) {
    await Character.deleteOne({_id: req.params.id})
    res.status(202).json({status: 202, message: "Success", result: character})
  }
})


export default router