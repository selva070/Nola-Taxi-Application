const db = require("../models");
const taxiModel = db.taxi;
const userModel = db.user;
const bookModel = db.book;
const ObjectId = require('mongodb').ObjectID;

const book = async function (req, res, next) {

    try {

        const taxiID = req.params.id;

        const userID = req.body.user_id;

        const userDetails = await userModel.findById(userID);

        if (!userDetails)
            return res.status(404).json({ message: "Invalid User Details" });

        if (userDetails.in_ride)
            return res.status(404).json({ message: "User is already in a ride." });

        if (!ObjectId.isValid(taxiID))
            return res.status(404).json({ message: "Invalid ID" });

        const response = await taxiModel.findById(taxiID);

        if (!response)
            return res.status(404).json({ message: "No Taxi found with the ID" });

        if (!response.available)
            return res.status(200).json({ message: "Taxi is already on ride. you can't book it." });

        const bookingDetails = new bookModel({
            user_id: userID,
            user_name: userDetails.name,
            taxi_id: taxiID,
            taxi_name: response.name,
            status: 'InRide'
        })
        const result = await bookingDetails.save();
        await userModel.findOneAndUpdate({ _id: bookingDetails.user_id }, { in_ride: true })
        let taxiDetails = await taxiModel.findOneAndUpdate({ _id: taxiID }, { available: false })

        let socketData = [];
        socketData.push(taxiDetails);
        socketData.push(userDetails)

        io.emit('broadcast', { message: "Taxi was booked", type: 'removeMarker', data: socketData })

        return res.status(200).json({ message: 'Taxi Has been booked', data: result })

    } catch (err) {
        return next(err)
    }
}

const unbook = async function (req, res, next) {
    try {

        const taxiID = req.params.id;

        if (!ObjectId.isValid(taxiID))
            return res.status(404).json({ message: "Invalid ID" });

        const response = await taxiModel.findById(taxiID);

        if (!response)
            return res.status(404).json({ message: "No Taxi found with the ID" });

        if (response.available)
            return res.status(200).json({ message: "This taxi is not booked. So you can't cancel it." });

        const bookingDetails = await bookModel.findOneAndUpdate({ taxi_id: taxiID, status: 'InRide' }, { status: 'completed' });
        let userDetails = await userModel.findOneAndUpdate({ _id: bookingDetails.user_id }, { in_ride: false })
        let taxiDetails = await taxiModel.findOneAndUpdate({ _id: taxiID }, { available: true })

        let socketData = [];
        taxiDetails.available = true;

        let newUserDetails = { ...userDetails._doc }
        newUserDetails.in_ride = false;
        newUserDetails.type = 'user';

        socketData.push(taxiDetails);
        socketData.push(newUserDetails)

        io.emit('broadcast', { message: "Taxi ride completed.", type: 'addMarker', data: socketData })

        res.status(200).json({ message: 'Taxi Has been unbooked', data: [] })

    } catch (err) {
        return next(err)
    }
}

module.exports = {
    book,
    unbook
}