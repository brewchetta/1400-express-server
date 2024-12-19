import  { Schema, SchemaTypes, model } from 'mongoose'

const characterRitualSchema = new Schema({
    enabled: { type: Boolean, default: true },
    ritualData: {
        type: SchemaTypes.ObjectId,
        ref: 'Ritual'
    }
});

const CharacterRitual = model('CharacterRitual', characterRitualSchema)

export default CharacterRitual