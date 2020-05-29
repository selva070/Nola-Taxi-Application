const db = require("../models");
const userModel = db.user;
const ObjectId = require('mongodb').ObjectID;

const createUser = async function (req, res, next) {

    try {

        const { name, lat, lon, in_ride } = req.body;

        const userDetails = new userModel({
            name,
            lat,
            lon,
            in_ride
        })

        await userDetails.save()

        res.status(201).json({ message: 'New User has been created', data: [] })

    } catch (err) {
        return next(err)
    }
}

const getUsers = async function (req, res, next) {
    try {


        const getAllUsers = await userModel.find({}, '-__v');

        res.status(200).json({ message: 'Users List with status', data: getAllUsers })

    } catch (err) {
        return next(err)
    }
}

const userStatus = async function (req, res, next) {
    try {

        const userID = req.params.id;

        await userModel.updateOne({ _id: userID }, { in_ride: req.body.status });

        res.status(200).json({ message: 'User Updated', data: [] })

    } catch (err) {
        return next(err)
    }
}

module.exports = {
    createUser,
    getUsers,
    userStatus
}