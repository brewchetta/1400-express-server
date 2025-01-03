import express from 'express'
import Ancestry from '../models/Ancestry.js'
import ItemTemplate from '../models/ItemTemplate.js'
import Profession from '../models/Profession.js'
import Spell from '../models/Spell.js'
import Ritual from '../models/Ritual.js'
import Training from '../models/Training.js'

import Character from '../models/Character.js'

import { checkExistence, getCurrentUser } from './_routeHelpers.js';

const router = express.Router();


/* GET /characters/creation-options */
router.get('/creation-options', async (req, res, next) => {
  const ancestries = await Ancestry.find({})
  const items = await ItemTemplate.find({ 
    $and: [
      { tags: { $in: ["Tool", "Weapon", "Armour", "Supply" ] } },
      { tags: { $ne: "Magic Item" } }
    ]})
  const professions = await Profession.find({}).populate(['trainings', 'equipmentGuaranteed'])
  const spells = await Spell.find({})
  const rituals = await Ritual.find({})
  res.json({status: 200, result: { ancestries, professions, spells, rituals, skills: Character.acceptedSkillNames, items }})
})


/* GET /characters/level-up-options */
router.get('/level-up-options', async (req, res, next) => {
  const skills = Character.acceptedSkillNames
  const spells = await Spell.find({})
  const rituals = await Ritual.find({})
  const trainings = await Training.find({}).populate('prerequisites')
  res.json({status: 200, result: { spells, rituals, skills, trainings }})
})


/* GET /characters/:id */
router.get('/:id', async (req, res, next) => {
  try {
    const character = await Character.findById(req.params.id)
    .populate([
      'ancestry', 
      'trainings', 
      'spells',
      'rituals', 
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
    'rituals', 
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
    const ancestryId = req.body.ancestry
      const foundAncestry = await Ancestry.findById({_id: ancestryId})
    if (!foundAncestry) { throw Error('Ancestry must exist') }
  
    req.body.ancestry = foundAncestry._id

    const newChar = await Character.create({...req.body, user: currentUser._id})
    await newChar.populate([
      'ancestry', 
      'trainings', 
      'spells', 
      'rituals'
    ])

    // handle lucky training
    if (newChar.trainings.find(t => t.key === 'lucky')) {
      newChar.luckyMaximum = 2
      newChar.lucky = 2
      await newChar.save()
    }

    res.status(201).json({ 
      status: 201, 
      message: "Success", 
      result: newChar
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
  const character = await Character.findById(req.params.id).exec()

    if (checkExistence(character, res, next)) {
    try {
      // iterate on keys and update
      Object.keys(req.body).forEach(key => character[key] = req.body[key] )

      // save and return
      await character.save()
      await character.populate([
        'ancestry',
        'trainings', 
        'spells',
        'rituals'
      ])

      // handle lucky training
      if (character.trainings.find(t => t.key === 'lucky')) {
        console.log('FOUND LUCKY')
        character.luckyMaximum = 2
      } else {
        character.luckyMaximum = 1
      }
      
      // handle magic training
      if (character.trainings.find(t => t.key === 'magicInitiate')) {
        console.log('FOUND MAGIC INITIAITE')
        character.spellsMax = 5
      }
      if (character.trainings.find(t => t.key === 'magicAdept')) {
        console.log('FOUND MAGIC ADEPT')
        character.spellsMax = 8
      }
      if (character.trainings.find(t => t.key === 'magicAscendant')) {
        console.log('FOUND MAGIC ASENDANT')
        character.spellsMax = 100
      }

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
  const character = await Character.findById(req.params.id).exec()
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
      character.spells.push(req.body._id)
      console.log(req.body.cost)
      if (req.body.cost) {
        character.gold -= req.body.cost
      }
      await character.save()
      await character.populate('spells')
      res.status(202).json({status: 202, message: "Success", result: character.spells})
    } catch (error) {
      res.status(400)
      next(error)
    }
  } else {
    res.status(400).json({status: 400, error: 'Unable to add spell'})
  }
  
})


// /* PATCH /characters/:id/spells/:spellID */
// // RETURNS UPDATED LIST OF CHARACTER SPELLS
// router.patch('/:id/spells/:spellID', async (req, res, next) => {
//   const currentUser = await getCurrentUser(req)
//   if (!currentUser) {
//     return res.status(401).json({error: "No authorized users logged in"})
//   }
//   const character = await Character.findById(req.params.id).exec()
//   const characterExists = checkExistence(character, res, next)
//   const spellInCharacterList = character.spells.includes(req.params.spellID)
//   if (characterExists && spellInCharacterList) {
//     try {
//       const charSpell = await CharacterSpell.findById({_id: req.params.spellID})
//       // iterate on keys and update
//       Object.keys(req.body).forEach(key => charSpell[key] = req.body[key] )
//       // save and return
//       await charSpell.save()
//       await character.populate({path: 'spells', model: 'CharacterSpell', populate: ['spellData']})
//       res.status(202).json({status: 202, message: "Success", result: character.spells})
//     } catch (error) {
//       res.status(400)
//       next(error)
//     }
//   } else {
//     res.status(400).json({status: 400, error: 'Unable to patch spell'})
//   }
  
// })


/* DELETE /characters/:id/spells/:spellID */
// RETURNS UPDATED LIST OF CHARACTER SPELLS
router.delete('/:id/spells/:spellID', async (req, res, next) => {
  const currentUser = await getCurrentUser(req)
  if (!currentUser) {
    return res.status(401).json({error: "No authorized users logged in"})
  }
  try {
    const character = await Character.findOneAndUpdate(
      {_id: req.params.id, user: currentUser._id},
      {'$pull': {'spells': req.params.spellID }},
      { new: true }
    )
    console.log(character.spells)
    // const character = await Character.findOne({_id: req.params.id, user: currentUser._id}).exec()
    await character.populate('spells')
    console.log(character.spells)
    res.status(202).json({status: 202, message: "Success", result: character.spells})
  } catch (error) {
    res.status(400)
    next(error)
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
      character.rituals.push(req.body._id)
      if (req.body.cost) {
        character.gold -= req.body.cost
      }
      await character.save()
      await character.populate('rituals')
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
// router.patch('/:id/rituals/:ritualID', async (req, res, next) => {
//   const currentUser = await getCurrentUser(req)
//   if (!currentUser) {
//     return res.status(401).json({error: "No authorized users logged in"})
//   }
//   const character = await Character.findById(req.params.id).exec()
//   const characterExists = checkExistence(character, res, next)
//   const ritualInCharacterList = character.rituals.includes(req.params.ritualID)
//   if (characterExists && ritualInCharacterList) {
//     try {
//       const charRitual = await CharacterRitual.findById({_id: req.params.ritualID})
//       // iterate on keys and update
//       Object.keys(req.body).forEach(key => charRitual[key] = req.body[key] )
//       // save and return
//       await charRitual.save()
//       await character.populate({path: 'rituals', model: 'CharacterRitual', populate: ['ritualData']})
//       res.status(202).json({status: 202, message: "Success", result: character.rituals})
//     } catch (error) {
//       res.status(400)
//       next(error)
//     }
//   } else {
//     res.status(400).json({status: 400, error: 'Unable to patch ritual'})
//   }
  
// })


/* DELETE /characters/:id/rituals/:ritualID */
// RETURNS UPDATED LIST OF CHARACTER SPELLS
router.delete('/:id/rituals/:ritualID', async (req, res, next) => {
  const currentUser = await getCurrentUser(req)
  if (!currentUser) {
    return res.status(401).json({error: "No authorized users logged in"})
  }
  try {
    const character = await Character.findOneAndUpdate(
      {_id: req.params.id, user: currentUser._id},
      {'$pull': {'rituals': req.params.ritualID }},
      { new: true }
    )
    console.log(character.rituals)
    // const character = await Character.findOne({_id: req.params.id, user: currentUser._id}).exec()
    await character.populate('rituals')
    console.log(character.rituals)
    res.status(202).json({status: 202, message: "Success", result: character.rituals})
  } catch (error) {
    res.status(400)
    next(error)
  }
})


/* CHARACTER ITEMS */


/* POST /characters/:id/items */
// RETURNS UPDATED LIST OF CHARACTER ITEMS
router.post('/:id/items', async (req, res, next) => {
  const currentUser = await getCurrentUser(req)
  if (!currentUser) {
    return res.status(401).json({error: "No authorized users logged in"})
  }
  const character = await Character.findById(req.params.id).exec()
  const characterExists = checkExistence(character, res, next)  
  if (characterExists) {
    try {
      character.items.push(req.body)
      await character.save()
      res.status(202).json({status: 202, message: "Success", result: character.items})
    } catch (error) {
      res.status(400)
      next(error)
    }
  }
  
})


/* POST /characters/:id/items/buy */
// RETURNS UPDATED CHARACTER
router.post('/:id/items/buy', async (req, res, next) => {
  const currentUser = await getCurrentUser(req)
  if (!currentUser) {
    return res.status(401).json({error: "No authorized users logged in"})
  }
  const character = await Character.findById(req.params.id).exec()
  const characterExists = checkExistence(character, res, next)  
  if (characterExists) {
    try {
      character.items.push(req.body)
      character.gold -= (req.body.cost || 1)
      await character.save()
      res.status(202).json({status: 202, message: "Success", result: {items: character.items, gold: character.gold}})
    } catch (error) {
      res.status(400)
      next(error)
    }
  }
  
})


/* PATCH /characters/:id/items/:epochStamp */
// RETURNS UPDATED LIST OF CHARACTER ITEMS
router.patch('/:id/items/:epochStamp', async (req, res, next) => {
  const currentUser = await getCurrentUser(req)
  if (!currentUser) {
    return res.status(401).json({error: "No authorized users logged in"})
  }
  const character = await Character.findById(req.params.id).exec()
  const characterExists = checkExistence(character, res, next)
  if (characterExists) {
    try {
      const item = character.items.find(item => item.epochStamp === req.params.epochStamp)
      // iterate on keys and update
      Object.keys(req.body).forEach(key => item[key] = req.body[key] )
      // save character and return
      await character.save()
      res.status(202).json({status: 202, message: "Success", result: character.items})
    } catch (error) {
      res.status(400)
      next(error)
    }
  }
  
})


/* DELETE /characters/:id/items/:epochStamp */
// RETURNS UPDATED LIST OF CHARACTER ITEMS
router.delete('/:id/items/:epochStamp', async (req, res, next) => {
  const currentUser = await getCurrentUser(req)
  if (!currentUser) {
    return res.status(401).json({error: "No authorized users logged in"})
  }
  const character = await Character.findById(req.params.id).exec()
  const characterExists = checkExistence(character, res, next)
  if (characterExists) {
    try {
      character.items = character.items.filter(item => item.epochStamp !== req.params.epochStamp)
      await character.save()
      res.status(202).json({status: 202, message: "Success", result: character.items})
    } catch (error) {
      res.status(400)
      next(error)
    }
  }

})


export default router