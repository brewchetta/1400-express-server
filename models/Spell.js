import  { Schema, model } from 'mongoose'

const spellSchema = new Schema({
    key: { type: String, required: true},
    name: { type: String, required: true},
    cost: Number,
    rules: { type: String, default: "core" }
});

const Spell = model('Spell', spellSchema)

export default Spell