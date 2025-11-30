import mongoose, { Schema } from 'mongoose'

const recipeSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    ingredients: [String],
    image: {
      type: String,
      validate: {
        validator: function (url) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url)
        },
        message:
          'Image must be a valid URL pointing to an image file (jpg, jpeg, png, gif, or webp)',
      },
    },
  },
  { timestamps: true },
)

export const Recipe = mongoose.model('recipe', recipeSchema)
