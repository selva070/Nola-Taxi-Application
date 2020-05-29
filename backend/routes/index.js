const express = require('express');
const router = express.Router();

const booking = require('../controller/bookingController')
const cabs = require('../controller/cabsController')
const user = require('../controller/userController')

router.put('/book/:id', booking.book)
router.put('/unbook/:id', booking.unbook)

router.get('/cabs', cabs.getAll)
router.post('/cabs', cabs.createTaxi)
router.delete('/cabs/:id', cabs.deleteTaxi)

router.get('/rides/:id', cabs.getRides)
router.delete('/rides/', cabs.delAllRides)

router.get('/user', user.getUsers)
router.post('/user', user.createUser)
router.put('/user/:id', user.userStatus)

module.exports = router;