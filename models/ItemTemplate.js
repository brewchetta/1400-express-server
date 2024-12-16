import  { Schema, SchemaTypes, model } from 'mongoose'

const itemTemplateSchema = new Schema({
    key: { type: String, required: true },
    name: { type: String, required: true },
    durability: Number,
    maxDurability: Number,
    cost: { type: Number, default: 1 },
    tags: [ String ],
    special: String
  });

const ItemTemplate = model('ItemTemplate', itemTemplateSchema)

export default ItemTemplate