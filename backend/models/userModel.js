const mongoose = require("mongoose");

const users = mongoose.model(
    "users",
    new mongoose.Schema({
        name: String,
        lat: Number,
        lon: Number,
        in_ride: Boolean
    }),
    "users"
);

module.exports = users;
