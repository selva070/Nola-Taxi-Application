const db = require("../models");
const taxiModel = db.taxi;
const bookModel = db.book;

const getAll = async function (req, res, next) {
    try {
        const response = await taxiModel.find({}, '-__v');

        res.status(200).json({ message: 'All Taxi List', data: response })

    } catch (error) {
        res.json(error.message)
    }
}

const deleteTaxi = async function (req, res, next) {
    try {

        const _id = req.params.id;

        const response = await taxiModel.deleteOne({ _id });

        if (response)
            res.status(200).json({ message: 'Taxi Deleted', data: [] })
        else
            res.status(200).json({ message: 'Taxi Deleted already', data: [] })

    } catch (error) {
        res.json(error.message)
    }
}

const createTaxi = async function (req, res, next) {
    try {

        const { name, lat, lon, available } = req.body;

        const taxi = new taxiModel({
            name,
            lat,
            lon,
            available
        })

        const response = await taxi.save();

        io.emit('broadcast', { message: "New Taxi has been added.", type: 'addMarker', data: response })

        res.status(201).json({ message: 'Taxi Created', data: response })

    } catch (error) {
        res.json(error.message)
    }
}

const getRides = async function (req, res, next) {
    try {

        const _id = req.params.id;

        const taxiDetails = await taxiModel.findById(_id);

        const bookingDetails = await bookModel.find({ taxi_id: _id }, '-__v');

        return res.status(200).json({ message: 'Taxi Details', data: { ride_history: bookingDetails, cab_details: taxiDetails } })

    } catch (error) {
        res.json(error.message)
    }
}
const delAllRides = async function (req, res, next) {
    try {
        await bookModel.deleteMany({});

        return res.status(200).json({ message: 'Deleted All Rides', data: [] })
    } catch (error) {
        console.log(error);

    }
}

module.exports = {
    getAll,
    createTaxi,
    deleteTaxi,
    getRides,
    delAllRides
}