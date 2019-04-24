var mongoose = require("mongoose");

var reviewSchema = mongoose.Schema({
    text: String,
    rating: Number,
    author: {
        id: {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        },
        username: String
    },
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Review", reviewSchema);