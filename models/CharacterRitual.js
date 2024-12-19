import  { Schema, SchemaTypes, model } from 'mongoose'

const characterRitualSchema = new Schema({
    exhausted: { type: Boolean, default: false },
    ritualData: {
        type: SchemaTypes.ObjectId,
        ref: 'Ritual'
    }
});

const CharacterRitual = model('CharacterRitual', characterRitualSchema)

export default CharacterRitual