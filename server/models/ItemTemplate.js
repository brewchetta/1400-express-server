import  { Schema, SchemaTypes, model } from 'mongoose'

const itemTemplateSchema = new Schema({
    key: { type: String, required: true },
    name: { type: String, required: [true, 'Item must be named'], minLength: [2, 'Item must have a name of two character or more'] },
    durability: { type: Number, min: [1, 'Item must have a durability of at least 1'] },
    maxDurability: { type: Number, min: [1, 'Item must have a durability of at least 1'] },
    cost: { type: Number, default: 1, min: [1, 'An item must cost something'] },
    tags: [ String ],
    special: String,
    rules: { type: String, default: "core" }
  });

const ItemTemplate = model('ItemTemplate', itemTemplateSchema)

ItemTemplate.categories = [
  'Weapon', 'Armour', 'Tool', 'Supply', 'Vehicle', 'Animal Companion', 'Magic Companion', 
]

export default ItemTemplate