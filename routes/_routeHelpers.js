import User from "../models/User.js"
import jwt from 'jsonwebtoken'

/* returns true or undefined, sets next to 404 with error 'Not found' */
/* item=entity that either exists or doesn't */
/* res=res from route */
/* next=next from route */
export function checkExistence(item, res, next) {
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


/* returns either currently logged in user based on session or undefined */
/* req=req from route */
export async function getCurrentUser(req) {
    const { token } = req.session
    if ( !token ) return
    const decodedToken = jwt.verify( token, process.env.SECRET_KEY )
    return await User.findById({_id: decodedToken._id}).exec()
}


/* generates and signs new jwt token */
/* _id=user id */
/* expiresIn=time until token expires */
export function generateToken(_id, expiresIn='24h') {
    return jwt.sign(
        { _id }, 
        process.env.SECRET_KEY,
        { expiresIn }
    ) 
}