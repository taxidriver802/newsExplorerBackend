const mongoose = require("mongoose");


const cardSchema = new mongoose.Schema({
    urlToImage: {
        type: String,
    },
    title: {
        type: String,
    },
    publishedAt: {
        type: Date,
    },
    description: {
        type: String,
    },
    sourceName: {
        type: String,
    },
    url: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    keyword: {
        type: String,
        required: true,
    },
});



module.exports = mongoose.model("card", cardSchema);
