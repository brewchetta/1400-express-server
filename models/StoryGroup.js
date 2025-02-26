import  { Schema, SchemaTypes, model } from 'mongoose'

const storyGroupSchema = new Schema({
    owner: {
        type: SchemaTypes.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    description: String,
}, {timestamps: true});

const StoryGroup = model('StoryGroup', storyGroupSchema)

export default StoryGroup