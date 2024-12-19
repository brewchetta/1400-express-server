import express from 'express'
import Ancestry from '../models/Ancestry.js'
import Character from '../models/Character.js'
import CharacterSpell from '../models/CharacterSpell.js'
import CharacterRitual from '../models/CharacterRitual.js'
import Spell from '../models/Spell.js'
import Ritual from '../models/Ritual.js'
import { checkExistence, getCurrentUser } from './_routeHelpers.js';

const router = express.Router();


/* GET /characters/:id */
router.get('/:id', async (req, res, next) => {
  try {
    const character = await Character.findById(req.params.id)
    .populate([
      'ancestry', 
      'trainings', 
      'spells',
      { path: 'spells', model: 'CharacterSpell', populate: { path: 'spellData', model: 'Spell' }}, 
      { path: 'rituals', model: 'CharacterRitual', populate: { path: 'ritualData', model: 'Ritual' }}, 
    ])
    .exec()

    if (checkExistence(character, res, next)) {
      res.json(character)
    }
  } catch (err) {
    res.status(500)
    next(err)
  }
});


/* GET /characters */
// all characters for current user
router.get('/', async (req, res, next) => {
  const currentUser = await getCurrentUser(req)
  if (!currentUser) {
    return res.status(401).json({error: "No authorized users logged in"})
  }

  const characters = await Character.find({user: currentUser._id})
  .populate([
    'ancestry', 
    'trainings', 
    'spells',
    { path: 'spells', model: 'CharacterSpell', populate: { path: 'spellData', model: 'Spell' }}, 
    { path: 'rituals', model: 'CharacterRitual', populate: { path: 'ritualData', model: 'Ritual' }}, 
  ])

  res.json(characters)
});


/* POST /characters */
router.post('/', async (req, res, next) => {
  const currentUser = await getCurrentUser(req)
  if (!currentUser) {
    return res.status(401).json({error: "No authorized users logged in"})
  }
  try {
    // handle find ancestries
    const ancestryName = req.body.ancestry
      const foundAncestry = await Ancestry.findOne({name: ancestryName})
    if (!foundAncestry) { throw Error('Ancestry must exist') }
  
    req.body.ancestry = foundAncestry._id

    const newChar = await Character.create({...req.body, user: currentUser._id})
    res.status(201).json({ 
      status: 201, 
      message: "Success", 
      result: newChar.populate(['ancestry', 'trainings', 'spells', 'rituals']) 
    })

  } catch (err) {
    if (res.statusCode < 400) { res.status(400) }
    next(err)
  }
})


/* PATCH /characters */
router.patch('/:id', async (req, res, next) => {
  const currentUser = await getCurrentUser(req)
  if (!currentUser) {
    return res.status(401).json({error: "No authorized users logged in"})
  }
  const character = await Character.findById(req.params.id).populate(['ancestry', 'trainings', 'spells', 'rituals']) .exec()
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
  const currentUser = await getCurrentUser(req)
  if (!currentUser) {
    return res.status(401).json({error: "No authorized users logged in"})
  }
  const character = await Character.findById(req.params.id).populate(['ancestry', 'trainings', 'spells', 'rituals']) .exec()
  if (checkExistence(character, res, next)) {
    await Character.deleteOne({_id: req.params.id})
    res.status(202).json({status: 202, message: "Success", result: character})
  }
})


export default router