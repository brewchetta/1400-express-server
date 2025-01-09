import express from 'express'
import GroupPlayer from '../models/GroupPlayer.js'
import { getCurrentUser } from './_routeHelpers.js'

const router = express.Router();


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