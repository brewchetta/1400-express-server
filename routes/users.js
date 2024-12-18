import express from 'express'
import User from '../models/User.js'
import { checkExistence, getCurrentUser, generateToken } from './_routeHelpers.js';

const router = express.Router()


/* GET /users/current */
router.get('/current', async (req, res, next) => {
    try {
        const user = await getCurrentUser(req)
        if (user) {
            const serializedUser = await user.serialize()
            res.json(serializedUser)
        } else {
            res.status(204).json({})
        }
    } catch (err) {
        res.status(500)
        next(err)
    }
})


/* GET /users/:id */
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).exec()
    if (checkExistence(user, res, next)) {
        const serializedUser = await user.serialize()
        res.json(serializedUser)
    }
  } catch (err) {
    res.status(500)
    next(err)
  }
});


/* POST /users */
router.post('/', async (req, res, next) => {
  try {
    const newUser = await User.create(req.body)
    const serializedUser = await newUser.serialize()
    req.session.token = generateToken(newUser._id)
    res.status(201).json({ status: 201, message: "Success", result: serializedUser })

  } catch (err) {
    res.status(400)
    next(err)
  }
})


/* POST /users/login */
router.post('/login', async(req, res, next) => {
    const { username, password } = req.body
    const user = await User.findOne({ username }).select('+password').exec()

    if ( user ) {
        user.comparePassword(password, async (error, isMatch) => {
            
            if (error) return next(error)

            if (!isMatch) {
                res.status(401)
                return next( Error("Invalid username or password") )
            }

            // TODO: Find way to remove password field from returned user without finding again
            req.session.token = generateToken(user._id)
            const serializedUser = await user.serialize()
            res.json({ success: true, serializedUser })
        })
    } else {
        res.status(401)
        return next( Error("Invalid username or password") )
    }
})


/* DELETE /users/logout */
router.delete('/logout', async(req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            res.status(500).json({error: err.message})
        } else {
            res.status(204).json({})
        }
    })
})


/* PATCH /users/current */
router.patch('/current', async (req, res, next) => {
    const user = await getCurrentUser(req)
    if (checkExistence(user, res, next)) {
        try {
            // iterate on keys and update
            Object.keys(req.body).forEach(key => user[key] = req.body[key] )

            // save and return
            await user.save()
            const serializedUser = user.serialize()
            res.status(202).json({status: 202, message: "Success", result: serializedUser})
        } catch (error) {
            res.status(400)
            next(error)
        }
    }
})


/* DELETE /users/current */
router.delete('/current', async (req, res, next) => {
  const user = await getCurrentUser(req)
  if (checkExistence(user, res, next)) {
    await User.deleteOne({_id: req.params.id})
    res.status(202).json({status: 202, message: "Success", result: user})
  }
})


export default router