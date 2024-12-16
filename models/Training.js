import  { Schema, SchemaTypes, model } from 'mongoose'

const requiredString = { type: String, required: true }

const trainingSchema = new Schema({
    key: requiredString,
    name: requiredString,
    description: requiredString,
    prerequisites: [{
      type: SchemaTypes.ObjectId,
      ref: 'Training'
    }]
  });

const Training = model('Training', trainingSchema)

export default Training