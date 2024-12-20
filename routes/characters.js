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
      res.json({ status: 200, result: character})
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

  res.json({status: 200, result: characters})
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


/* PATCH /characters/:id */
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


/* DELETE /characters/:id */
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


/* CHARACTER SPELLS */


/* POST /characters/:id/spells */
// RETURNS UPDATED LIST OF CHARACTER SPELLS
router.post('/:id/spells', async (req, res, next) => {
  const currentUser = await getCurrentUser(req)
  if (!currentUser) {
    return res.status(401).json({error: "No authorized users logged in"})
  }
  const character = await Character.findById(req.params.id).exec()
  const characterExists = checkExistence(character, res, next)  
  if (characterExists) {
    try {
      const charSpell = await CharacterSpell.create({spellData: {_id: req.body._id}})
      character.spells.push(charSpell._id)
      await character.save()
      await character.populate({path: 'spells', populate: ['spellData']})
      res.status(202).json({status: 202, message: "Success", result: character.spells})
    } catch (error) {
      res.status(400)
      next(error)
    }
  } else {
    res.status(400).json({status: 400, error: 'Unable to add spell'})
  }
  
})


/* PATCH /characters/:id/spells/:spellID */
// RETURNS UPDATED LIST OF CHARACTER SPELLS
router.patch('/:id/spells/:spellID', async (req, res, next) => {
  const currentUser = await getCurrentUser(req)
  if (!currentUser) {
    return res.status(401).json({error: "No authorized users logged in"})
  }
  const character = await Character.findById(req.params.id).exec()
  const characterExists = checkExistence(character, res, next)
  const spellInCharacterList = character.spells.includes(req.params.spellID)
  if (characterExists && spellInCharacterList) {
    try {
      const charSpell = await CharacterSpell.findById({_id: req.params.spellID})
      // iterate on keys and update
      Object.keys(req.body).forEach(key => charSpell[key] = req.body[key] )
      // save and return
      await charSpell.save()
      await character.populate({path: 'spells', model: 'CharacterSpell', populate: ['spellData']})
      res.status(202).json({status: 202, message: "Success", result: character.spells})
    } catch (error) {
      res.status(400)
      next(error)
    }
  } else {
    res.status(400).json({status: 400, error: 'Unable to patch spell'})
  }
  
})


/* DELETE /characters/:id/spells/:spellID */
// RETURNS UPDATED LIST OF CHARACTER SPELLS
router.delete('/:id/spells/:spellID', async (req, res, next) => {
  const currentUser = await getCurrentUser(req)
  if (!currentUser) {
    return res.status(401).json({error: "No authorized users logged in"})
  }
  const character = await Character.findById(req.params.id).exec()
  const characterExists = checkExistence(character, res, next)
  const spellInCharacterList = character.spells.includes(req.params.spellID)
  if (characterExists && spellInCharacterList) {
    try {
      await CharacterSpell.deleteOne({_id: req.params.spellID})
      await character.populate({path: 'spells', populate: ['spellData']})
      res.status(202).json({status: 202, message: "Success", result: character.spells})
    } catch (error) {
      res.status(400)
      next(error)
    }
  } else {
    res.status(400).json({status: 400, error: 'Unable to delete spell'})
  }

})


/* CHARACTER RITUALS */


/* POST /characters/:id/rituals */
// RETURNS UPDATED LIST OF CHARACTER RITUALS
router.post('/:id/rituals', async (req, res, next) => {
  const currentUser = await getCurrentUser(req)
  if (!currentUser) {
    return res.status(401).json({error: "No authorized users logged in"})
  }
  const character = await Character.findById(req.params.id).exec()
  const characterExists = checkExistence(character, res, next)  
  if (characterExists) {
    try {
      const charSpell = await CharacterRitual.create({ritualData: {_id: req.body._id}})
      character.rituals.push(charRitual._id)
      await character.save()
      await character.populate({path: 'rituals', populate: ['ritualData']})
      res.status(202).json({status: 202, message: "Success", result: character.rituals})
    } catch (error) {
      res.status(400)
      next(error)
    }
  } else {
    res.status(400).json({status: 400, error: 'Unable to add ritual'})
  }
  
})


/* PATCH /characters/:id/rituals/:ritualID */
// RETURNS UPDATED LIST OF CHARACTER RITUALS
router.patch('/:id/rituals/:ritualID', async (req, res, next) => {
  const currentUser = await getCurrentUser(req)
  if (!currentUser) {
    return res.status(401).json({error: "No authorized users logged in"})
  }
  const character = await Character.findById(req.params.id).exec()
  const characterExists = checkExistence(character, res, next)
  const ritualInCharacterList = character.rituals.includes(req.params.ritualID)
  if (characterExists && ritualInCharacterList) {
    try {
      const charRitual = await CharacterRitual.findById({_id: req.params.ritualID})
      // iterate on keys and update
      Object.keys(req.body).forEach(key => charRitual[key] = req.body[key] )
      // save and return
      await charRitual.save()
      await character.populate({path: 'rituals', model: 'CharacterRitual', populate: ['ritualData']})
      res.status(202).json({status: 202, message: "Success", result: character.rituals})
    } catch (error) {
      res.status(400)
      next(error)
    }
  } else {
    res.status(400).json({status: 400, error: 'Unable to patch ritual'})
  }
  
})


/* DELETE /characters/:id/rituals/:ritualID */
// RETURNS UPDATED LIST OF CHARACTER RITUALS
router.delete('/:id/rituals/:ritualID', async (req, res, next) => {
  const currentUser = await getCurrentUser(req)
  if (!currentUser) {
    return res.status(401).json({error: "No authorized users logged in"})
  }
  const character = await Character.findById(req.params.id).exec()
  const characterExists = checkExistence(character, res, next)
  const ritualInCharacterList = character.rituals.includes(req.params.ritualID)
  if (characterExists && ritualInCharacterList) {
    try {
      await CharacterRitual.deleteOne({_id: req.params.ritualID})
      await character.populate({path: 'rituals', populate: ['ritualData']})
      res.status(202).json({status: 202, message: "Success", result: character.rituals})
    } catch (error) {
      res.status(400)
      next(error)
    }
  } else {
    res.status(400).json({status: 400, error: 'Unable to delete ritual'})
  }

})


export default router