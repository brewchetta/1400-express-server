import  { Schema, model } from 'mongoose'

const ancestrySchema = new Schema({
    name: { type: String, required: true},
    description: { type: String, required: true},
    specialText: String,
    skills: Number,
    spells: Number,
    tags: [ String ],
    rules: String,
});

const Ancestry = model('Ancestry', ancestrySchema)

export default Ancestry