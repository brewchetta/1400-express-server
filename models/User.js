import  { Schema, SchemaTypes, model } from 'mongoose'
import bcrypt from 'bcrypt'

const saltRounds = 10

const userSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    email: { type: String, required: true, index: { unique: true } },
    profilePicURL: String,
    password: { type: String, required: true, select: false },
}, {timestamps: true});


/* PASSWORD MIDDLEWARE */

userSchema.pre('save', function(next) { 
    const user = this
    
    // ignore if password is unmodified
    if (!user.isModified('password')) return
    
    console.log("FIRING SAVE!")
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


/* PASSWORD METHODS */

userSchema.methods.comparePassword = async function(candidatePassword, cb) {
    await bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}
        

const User = model('User', userSchema)

export default User