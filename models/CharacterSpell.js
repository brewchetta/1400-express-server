import  { Schema, SchemaTypes, model } from 'mongoose'

const characterSpellSchema = new Schema({
    exhausted: { type: Boolean, default: false },
    spellData: {
        type: SchemaTypes.ObjectId,
        ref: 'Spell'
    }
});

const CharacterSpell = model('CharacterSpell', characterSpellSchema)

export default CharacterSpell