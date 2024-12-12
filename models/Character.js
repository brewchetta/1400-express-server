import  { Schema, model } from 'mongoose'

const characterSchema = new Schema({
    name: String,
    quirk: String,
    history: String,
    injured: { type: Boolean, default: false },
    lucky: { type: Number, default: 1 },
    updatedAt: Date,
    createdAt: { 
        type: Date, 
        default: () => Date.now(), 
        immutable: true,
    },
  });

const Character = model('Character', characterSchema)

export default Character