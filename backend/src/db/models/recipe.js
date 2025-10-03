import mongoose, { Schema } from 'mongoose'

// Define recipe schema
const recipeSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    contents: String,
    tags: [String],
    image: String,
  },
  { timestamps: true },
)

export const Recipe = mongoose.model('recipe', recipeSchema)
