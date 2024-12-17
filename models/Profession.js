import  { Schema, SchemaTypes, model } from 'mongoose'

const professionSchema = new Schema({
  key: { type: String, required: true },
  name: { type: String, required: true },
  coreskill: String,
  skills: [ String ],
  skillSlots: Number,
  spells: Number,
  equipmentGuaranteed: [{
    type: SchemaTypes.ObjectId,
    ref: 'EquipmentTemplate'
  }],
  equipmentGroups: [ String ],
  description: String,
  specialText: String,
  expertise: Number,
  trainings: [{
    type: SchemaTypes.ObjectId,
    ref: 'Training'
  }]
});

const Profession = model('Profession', professionSchema)

export default Profession