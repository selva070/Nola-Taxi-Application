const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const db = {};

db.mongoose = mongoose;

db.book = require("./bookingModel");
db.taxi = require("./taxiModel");
db.user = require("./userModel");

module.exports = db;