import express from 'express'
import StoryGroup from '../models/StoryGroup.js'
import GroupPlayer from '../models/GroupPlayer.js'
import { getCurrentUser } from './_routeHelpers.js'

const router = express.Router();


/* GET /story-groups */
router.get('/', async (req, res, next) => {
    const currentUser = await getCurrentUser(req)
    if (!currentUser) {
        return res.status(401).json({error: "No authorized users logged in"})
    }
    
    const ownedGroups = await StoryGroup.find({ 'owner': currentUser._id })
    const playerRoles = await GroupPlayer.find({ 'user': currentUser._id }).populate(['character', 'storyGroup'])

    res.json({ status: 200, result: { ownedGroups, playerRoles } })
});


/* GET /story-groups/:id */
router.get('/:id', async (req, res, next) => {
    const currentUser = await getCurrentUser(req)
    if (!currentUser) {
        return res.status(401).json({error: "No authorized users logged in"})
    }
    
    const group = await StoryGroup.findById({ '_id': req.params.id }).exec()
    const groupPlayers = await GroupPlayer.find({ storyGroup: req.params.id }).populate(['user', 'character'])

    const groupExists = !!group
    const isGroupOwner = !!group?.owner?.equals(currentUser._id)
    const isGroupPlayer = !!groupPlayers.find(gp => gp.user.equals(currentUser._id))

    // check if user should have access to group
    if ( !groupExists || (!isGroupOwner && !isGroupPlayer) ) {
        return res.status(401).json({error: "You are not part of this group"})
    }

    await group.populate('owner')

    res.json({ status: 200, result: { storyGroup: group, players: groupPlayers, isOwner: isGroupOwner } })
});


/* POST /story-groups */
router.post('/', async (req, res, next) => {
    const currentUser = await getCurrentUser(req)
    if (!currentUser) {
        return res.status(401).json({error: "No authorized users logged in"})
    }

    try {
        const newGroup = await StoryGroup.create({...req.body, owner: currentUser._id})
        res.status(201).json({ status: 201, result: newGroup })
    } catch (err) {
        res.status(400)
        next(err)
    }
})



export default router