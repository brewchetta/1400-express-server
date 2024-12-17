import express from 'express'
import Character from '../models/Character.js'
import User from '../models/User.js'
import { checkExistence } from '../helpers.js';
import jwt from 'jsonwebtoken'

const router = express.Router()

async function getCurrentUser(req) {
    const token = req.headers.authorization.split(' ')[1]
    if (token) {
        const decodedToken = jwt.verify( token, process.env.SECRET_KEY )
        return await User.findById({_id: decodedToken.id}).exec()
    }
}


/* GET /users/current */
router.get('/current', async (req, res, next) => {
    try {
        const user = await getCurrentUser(req)
        if (checkExistence(user, res, next)) {
            const characters = Character.find({user_id: user._id})
            user.characters = characters
            res.json(user)
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
        const characters = Character.find({user_id: user._id})
        user.characters = characters
        res.json(user)
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
    // TODO: Find way to remove password field from returned user without finding again
    const filteredUser = await User.findById({_id: newUser.id})
    const token = jwt.sign(
        { id: filteredUser._id }, 
        process.env.SECRET_KEY,
        { expiresIn: "24h" }) 
    res.status(201).json({ status: 201, message: "Success", result: filteredUser, token })

  } catch (err) {
    res.status(400)
    next(err)
  }
})


/* POST /users/login */
router.post('/login', async(req, res, next) => {
    const { username, password } = req.body
    const user = await User.findOne({ username }).select('+password').exec()

    if ( checkExistence(user, res, next) ) {
        user.comparePassword(password, async (error, isMatch) => {
            
            if (error) return next(error)

            if (!isMatch) {
                res.status(401)
                return next( Error("Invalid username or password") )
            }

            // TODO: Find way to remove password field from returned user without finding again
            const validatedUser = await User.findById({ _id: user._id }).exec()

            const token = jwt.sign(
                { _id: validatedUser._id, username: validatedUser.username }, 
                process.env.SECRET_KEY,
                { expiresIn: "24h" }
            )
            res.json({ success: true, validatedUser, token })
        })
    }
})


/* PATCH /users/:id */
router.patch('/:id', async (req, res, next) => {
    const user = await User.findById(req.params.id).exec()
    if (checkExistence(user, res, next)) {
        try {
            // iterate on keys and update
            Object.keys(req.body).forEach(key => user[key] = req.body[key] )

            // save and return
            await user.save()
            res.status(202).json({status: 202, message: "Success", result: user})
        } catch (error) {
            res.status(400)
            next(error)
        }
    }
})


/* DELETE /users/:id */
router.delete('/:id', async (req, res, next) => {
  const user = await User.findById(req.params.id).exec()
  if (checkExistence(user, res, next)) {
    await User.deleteOne({_id: req.params.id})
    res.status(202).json({status: 202, message: "Success", result: user})
  }
})


export default router