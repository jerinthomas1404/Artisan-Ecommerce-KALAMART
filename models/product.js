const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
        id: {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        },
        username: String
    },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
  },
  reviews: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Review"
        }
    ],
  created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Product', productSchema);