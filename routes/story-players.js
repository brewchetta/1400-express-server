import express from 'express'
import GroupPlayer from '../models/GroupPlayer.js'
import StoryGroup from '../models/StoryGroup.js';
import { getCurrentUser } from './_routeHelpers.js'
import User from '../models/User.js';

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

    console.log(groupPlayer.user)
    console.log(currentUser._id)

    if (!groupPlayer || !currentUser._id.equals(groupPlayer.user)) {
        return res.status(401).json({error: "You don't have permission to edit this"})
    }

    try {
        Object.keys(req.body).forEach(key => groupPlayer[key] = req.body[key] )
        await groupPlayer.save()
        await groupPlayer.populate(['character'])
        res.status(202).json({ status: 202, result: groupPlayer })
    } catch (err) {
        res.status(400)
        next(err)
    }

})


export default router