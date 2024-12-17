import  { Schema, SchemaTypes, model } from 'mongoose'
import bcrypt from 'bcrypt'

const saltRounds = 10

const userSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    email: { type: String, required: true, index: { unique: true } },
    profilePicURL: String,
    password: { type: String, required: true },
}, {timestamps: true});


/* PASSWORD MIDDLEWARE */

UserSchema.pre('save', () => { 
    const user = this

    // move to next if password is unmodified
    if (!user.isModified('password')) return next()
    
    // otherwise generate salt and apply to password hash
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) return next(err)
    
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err)
    
            user.password = hash;
            next()
        })
    })

})
        

const User = model('User', userSchema)

export default User