import express from 'express'
import GroupPlayer from '../models/GroupPlayer.js'
import StoryGroup from '../models/StoryGroup.js';
import { getCurrentUser } from './_routeHelpers.js'
import User from '../models/User.js';
import Ancestry from '../models/Ancestry.js';
import Character from '../models/Character.js';

const router = express.Router();


/* POST /story-players */
router.post('/', async (req, res, next) => {
    const currentUser = await getCurrentUser(req)
    if (!currentUser) {
        return res.status(401).json({error: "No authorized users logged in"})
    }

    const group = await StoryGroup.findById({ '_id': req.body.storyGroup }).exec()

    if (!group || !group.owner.equals(currentUser._id)) {
        return res.status(401).json({error: "You are not the owner of this group"})
    }

    const invitedUser = await User.findOne({ '$or': [
        { 'username': req.body.username },
        { 'email': req.body.username },
    ] })

    if (!invitedUser) {
        return res.status(404).json({error: "Could not find a player by that name or id"})
    }

    try {
        const groupPlayer = await GroupPlayer.create({ ...req.body, storyGroup: group._id, user: invitedUser._id })
        await groupPlayer.populate(['user', 'character'])
        res.status(201).json({ status: 201, result: groupPlayer })
    } catch (err) {
        res.status(400)
        next(err)
    }
})


/* PATCH /story-players/:id */
router.patch('/:id', async (req, res, next) => {
    const currentUser = await getCurrentUser(req)
    if (!currentUser) {
        return res.status(401).json({error: "No authorized users logged in"})
    }

    const groupPlayer = await GroupPlayer.findById({'_id': req.params.id}).exec()

    if (!groupPlayer || !currentUser._id.equals(groupPlayer.user)) {
        return res.status(401).json({error: "You don't have permission to edit this"})
    }

    try {
        Object.keys(req.body).forEach(key => groupPlayer[key] = req.body[key] )
        await groupPlayer.save()
        await groupPlayer.populate(['user', 'character', 'storyGroup'])
        res.status(202).json({ status: 202, result: groupPlayer })
    } catch (err) {
        res.status(400)
        next(err)
    }

})


/* PATCH /story-players/:id */
router.delete('/:id', async (req, res, next) => {
    const currentUser = await getCurrentUser(req)
    if (!currentUser) {
        return res.status(401).json({error: "No authorized users logged in"})
    }

    const groupPlayer = await GroupPlayer.findById({'_id': req.params.id}).exec()

    if (!groupPlayer || !currentUser._id.equals(groupPlayer.user)) {
        return res.status(401).json({error: "You don't have permission to delete this"})
    }

    try {
        const player = await GroupPlayer.findByIdAndDelete({'_id': req.params.id}).exec()
        res.status(202).json({ status: 202, result: player })
    } catch (err) {
        res.status(400)
        next(err)
    }

})


/* ADDITIONAL POST OPTIONS */


/* POST /story-players/:id/worldbuilding */
router.post('/:id/worldbuilding', async (req, res, next) => {
    const currentUser = await getCurrentUser(req)
    if (!currentUser) {
        return res.status(401).json({error: "No authorized users logged in"})
    }

    const groupPlayer = await GroupPlayer.findById({'_id': req.params.id}).exec()

    if (!groupPlayer || !currentUser._id.equals(groupPlayer.user)) {
        return res.status(401).json({error: "You don't have permission to edit this"})
    }

    try {
        const updatedQuestions = [
            ...groupPlayer?.worldbuildingQuestions || [], 
            { "question": req.body.question, "answer": req.body.answer }
        ]
        groupPlayer.worldbuildingQuestions = updatedQuestions
        await groupPlayer.save()
        await groupPlayer.populate(['user', 'character'])
        res.status(202).json({ status: 202, result: groupPlayer })
    } catch (err) {
        res.status(400)
        next(err)
    }

})


/* POST /story-players/:id/character */
router.post('/:id/characters', async (req, res, next) => {
    const currentUser = await getCurrentUser(req)
    if (!currentUser) {
        return res.status(401).json({error: "No authorized users logged in"})
    }

    const groupPlayer = await GroupPlayer.findById({'_id': req.params.id}).exec()

    if (!groupPlayer || !currentUser._id.equals(groupPlayer.user)) {
        return res.status(401).json({error: "You don't have permission to create a character for this group"})
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

        // attach character to player and populate
        groupPlayer.character = newChar._id
        await groupPlayer.save()
        await groupPlayer.populate(["user", "character"])

        res.status(201).json({ 
        status: 201, 
        message: "Success", 
        result: groupPlayer
        })

    } catch (err) {
        if (res.statusCode < 400) { res.status(400) }
        next(err)
    }

})


export default router