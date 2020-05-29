const mongoose = require("mongoose");

const book = mongoose.model(
    "booked_taxi",
    new mongoose.Schema({
        user_id: String,
        user_name: String,
        taxi_id: String,
        taxi_name: String,
        status: String
    }, {
        timestamps: true
    }),
    "booked_taxi"
);

module.exports = book;
