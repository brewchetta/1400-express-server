import express from 'express'
import Character from '../models/Character.js'

const router = express.Router();


function checkExistence(item, res, next) {
  try {
    if (!item) {
      throw Error('Not found')
    }
    return true
  } catch (err) {
    res.status(404)
    next(err)
  }
}


/* GET /characters/:id */
router.get('/:id', async (req, res, next) => {
  try {
    const character = await Character.findById(req.params.id).exec()
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
  const characters = await Character.find({})
  res.json(characters)
});


/* POST /characters */
router.post('/', async (req, res, next) => {
  const newChar = await Character.create(req.body)
  res.status(201).json({ message: "Working on it...", result: newChar })
})


/* PATCH /characters */
router.patch('/:id', async (req, res, next) => {
  const character = await Character.findById(req.params.id).exec()
  if (checkExistence(character, res, next)) {
    try {
      // iterate on keys and update
      Object.keys(req.body).forEach(key => character[key] = req.body[key] )
      // save and return
      await character.save()
      res.status(202).json(character)
    } catch (error) {
      res.status(400)
      next(error)
    }
  }

})


router.delete('/:id', async (req, res, next) => {
  const character = await Character.findById(req.params.id).exec()
  if (checkExistence(character, res, next)) {
    await Character.deleteOne({_id: req.params.id})
    res.status(202).json({status: 202, message: "Deleted", item: character})
  }
})


export default router