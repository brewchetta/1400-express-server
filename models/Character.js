import  { Schema, SchemaTypes, model } from 'mongoose'

const characterSchema = new Schema({
    user: {
      type: SchemaTypes.ObjectId,
      ref: 'User'
    },
    name: { type: String, required: true },
    quirk: String,
    history: String,
    injured: { type: Boolean, default: false },
    lucky: { type: Number, default: 1 },
    ancestry: {
      type: SchemaTypes.ObjectId,
      ref: 'Ancestry'
    },
    skills: [{
      name: { type: String, required: true },
      diceSize: { type: Number, required: true }
    }],
    spells: [{
      key: { type: String, required: true },
      name: { type: String, required: true },
      cost: Number
    }],
    rituals: [{
      key: { type: String, required: true },
      name: { type: String, required: true },
      cost: Number
    }],
    items: [{
      key: { type: String, required: true },
      name: { type: String, required: true },
      durability: Number,
      maxDurability: Number,
      cost: Number,
      tags: [ String ],
      special: String,
      rules: { type: String, default: 'core' }
    }],
    trainings: [{
      type: SchemaTypes.ObjectId,
      ref: 'Training'
    }]
  }, {timestamps: true});

const Character = model('Character', characterSchema)

Character.acceptedSkillNames = [
  "Arcane Lore",
  "Climbing",
  "Cooking",
  "Crafting",
  "Deception",
  "Disguise",
  "Engineering",
  "Foraging",
  "Handwriting",
  "Intimidation",
  "History Lore",
  "Medicine",
  "Melee Combat",
  "Nature Lore",
  "Navigation",
  "Performing",
  "Persuasion",
  "Ranged Combat",
  "Reading People",
  "Religious Lore",
  "Riding",
  "Running/Jumping",
  "Sailing",
  "Perception",
  "Sleight of Hand",
  "Sneaking",
  "Spellcasting",
  "Swimming",
  "Tracking",
  "Trapping",
]

export default Character