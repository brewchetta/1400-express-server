import  { Schema, SchemaTypes, model } from 'mongoose'

const characterSchema = new Schema({
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
      name: String,
      diceSize: Number
    }],
    spells: [ String ],
    rituals: [ String ],
    items: [{
      key: String,
      name: String,
      durability: Number,
      maxDurability: Number,
      tags: [ String ],
      special: String
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