import  { Schema, model } from 'mongoose'

const professionSchema = new Schema({
    name: String,
    updatedAt: Date,
    createdAt: { 
        type: Date, 
        default: () => Date.now(), 
        immutable: true,
    },
  });

const Profession = model('Profession', professionSchema)

export default Profession