const mongoose = require("mongoose");

const taxi = mongoose.model(
    "taxi_details",
    new mongoose.Schema({
        name: String,
        lat: Number,
        lon: Number,
        available: Boolean
    }),
    "taxi_details"
);

module.exports = taxi;
