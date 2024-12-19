import  { Schema, SchemaTypes, model } from 'mongoose'

const characterSpellSchema = new Schema({
    enabled: { type: Boolean, default: true },
    spellData: {
        type: SchemaTypes.ObjectId,
        ref: 'Spell'
    }
});

const CharacterSpell = model('CharacterSpell', characterSpellSchema)

export default CharacterSpell