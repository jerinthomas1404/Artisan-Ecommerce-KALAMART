var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var profileSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    description: String,
      imageUrl: String,
      rating: Number,
      reviews: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "Review"
            }
        ]
});

profileSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Profile", profileSchema);