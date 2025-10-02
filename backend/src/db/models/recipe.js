import mongoose, { Schema } from 'mongoose'

// Define recipe schema
const recipeSchema = new Schema(
  {
    title: { type: String, required: true },
    author: String,
    contents: String,
    tags: [String],
    image: String,
  },
  { timestamps: true },
)

export const Recipe = mongoose.model('recipe', recipeSchema)
