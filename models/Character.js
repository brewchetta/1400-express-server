import  { Schema, SchemaTypes, model } from 'mongoose'
import { v4 as uuid } from 'uuid'

const characterSchema = new Schema({
    user: {
      type: SchemaTypes.ObjectId,
      ref: 'User'
    },
    name: { type: String, required: true },
    quirk: { type: String, default: '' },
    history: { type: String, default: '' },
    injured: { type: Boolean, default: false },
    lucky: { type: Number, default: 1 },
    luckyMaximum: { type: Number, default: 1 },
    hindered: { type: Boolean, default: false },
    helped: { type: Boolean, default: false },
    profession: {
      type: SchemaTypes.ObjectId,
      ref: 'Profession'
    },
    ancestry: {
      type: SchemaTypes.ObjectId,
      ref: 'Ancestry'
    },
    skills: [{
      name: { type: String, required: true },
      diceSize: { type: Number, required: true }
    }],
    spells: [{
      type: SchemaTypes.ObjectId,
      ref: 'Spell'
    }],
    spellsMax: {
      type: Number,
      default: 3
    },
    rituals: [{
      type: SchemaTypes.ObjectId,
      ref: 'Ritual'
    }],
    items: [{
      epochStamp: { type: String, default: () => uuid() },
      key: { type: String, required: true },
      name: { type: String, required: true },
      durability: Number,
      maxDurability: Number,
      cost: Number,
      tags: [ String ],
      special: String,
      rules: { type: String, default: 'core' }
    }],
    gold: { type: Number, default: 0 },
    trainings: [{
      type: SchemaTypes.ObjectId,
      ref: 'Training'
    }],
    notes: {
      type: String,
      default: ''
    }
  }, {timestamps: true});

const Character = model('Character', characterSchema)

Character.acceptedSkillNames = [
  // ACTION SKILLS
  "Melee Combat",
  "Navigation",
  "Perception",
  "Ranged Combat",
  "Ride",
  "Run/Jump",
  "Sail",
  "Sleight of Hand",
  "Sneak",
  "Swim",
  "Track",
  "Trap",
  // SOCIAL SKILLS
  "Deception",
  "Intimidation",
  "Perform",
  "Persuasion",
  "Read People",
  // LORE SKILLS
  "Arcane Lore",
  "History Lore",
  "Nature Lore",
  "Religious Lore",
  // CRAFT SKILLS
  "Alchemistry",
  "Build",
  "Cook",
  "Climb",
  "Engineer",
  "Forage",
  "Medicine",
  "Metalwork",
  "Tailor",
]

export default Character