import  { Schema, model } from 'mongoose'

const ritualSchema = new Schema({
    key: { type: String, required: true},
    name: { type: String, required: true},
    cost: Number,
    rules: { type: String, default: "core" }
});

const Ritual = model('Ritual', ritualSchema)

export default Ritual