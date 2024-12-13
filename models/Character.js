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
    updatedAt: Date,
    createdAt: { 
        type: Date, 
        default: () => Date.now(), 
        immutable: true,
    },
  });

const Character = model('Character', characterSchema)

Character.skills = [
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