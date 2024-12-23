import  { Schema, SchemaTypes, model } from 'mongoose'

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
      ref: 'CharacterSpell'
    }],
    rituals: [{
      type: SchemaTypes.ObjectId,
      ref: 'CharacterRitual'
    }],
    items: [{
      epochStamp: { type: String, default: () => Date.now() },
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
  "Swimming",
  "Tracking",
  "Trapping",
]

export default Character