import  { Schema, SchemaTypes, model } from 'mongoose'

const groupPlayerSchema = new Schema({
  user: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
    immutable: true
  },
  character: {
    type: SchemaTypes.ObjectId,
    ref: 'Character'
  },
  storyGroup: {
    type: SchemaTypes.ObjectId,
    ref: 'StoryGroup',
    immutable: true,
  },
  acceptedInvite: { 
    type: Boolean,
    default: false
  },
  storyNotes: {
    type: String,
    default: ''
  },
  worldbuildingQuestions: [
    { question: String, answer: String }
  ]
}, {timestamps: true});

const GroupPlayer = model('GroupPlayer', groupPlayerSchema)

export default GroupPlayer