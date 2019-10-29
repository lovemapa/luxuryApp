const vehicleModel = require('../../models/vehicleModel')
const pickModel = require('../../models/pickupModel')
const bookingModel = require('../../models/bookingModel')
const userModel = require('../../models/userModel')
const ownerModel = require('../../models/ownerModel')
const commonController = require('../common/controllers/commonController')
const CONSTANT = require('../../constant')
const moment = require('moment')

class socketController {

    // Add a username to connected socket for Single chat

    addUsername(socket, io, socketInfo) {
        socket.on('add', (user) => {
            console.log('add');
            socket.username = user.userId
            socketInfo[user.userId] = socket.id;
            console.log(socketInfo);

        })
    }

    sendLiveLocation(socket, io, room_members) {
        socket.on('sendLocation', (data) => {
            socket.broadcast.emit('broadcast', { coordinates: [76.710064, 30.703453], socketId: socket.id, ownerId: data.ownerId });

        })

    }

    sendRequest(socket, io, room_members) {
        socket.on('sendRequest', (data) => {
            if (!data.vehicleId || !data.currentLat || !data.currentLong || !data.userId)
                io.to(socket.id).emit('createBooking', { status: CONSTANT.MISSINGVEHCILE });
            else {
                const bookingRegister = this.createBookingRegistration(data)

                bookingRegister.save().then((saveresult) => {
                    const pick = new pickModel({
                        bookingId: saveresult._id,
                        name: data.name,
                        contact: data.contact,
                        notes: data.notes,
                        specialRequest: data.specialRequest,
                        date: moment().valueOf()
                    })
                    saveresult.set('userId', data.userId, { strict: false })
                    pick.save({}).then(pickDetails => {

                    }).catch(err => {
                        console.log(err);

                    })
                    io.to(room_members[data.ownerId]).emit('acceptRequest', { status: 1, data: saveresult });
                }).catch(error => {
                    if (error.errors)
                        io.to(socket.id).emit('createBooking', { status: CONSTANT.FALSE, message: commonController.handleValidation(error) });


                    io.to(socket.id).emit('createBooking', { status: CONSTANT.FALSE, message: error });
                })

            }

        })

    }
    // --------Create Booking Registration Model------------
    createBookingRegistration(data) {
        var currentCoordinates = []
        if (data.currentLat && data.currentLong) {
            currentCoordinates.push(data.currentLong)
            currentCoordinates.push(data.currentLat)
        }

        let BookingRegistrationData = new bookingModel({

            // moment().add(1, "hour").add(10, "minute").valueOf()
            userId: data.userId,
            bookingDuration: data.bookingDuration,
            vehicleId: data.vehicleId,
            typeOfEvent: data.typeOfEvent,
            startTime: data.startTime,
            endTime: data.endTime,
            currentCoordinates: currentCoordinates,
            currentLat: data.currentLat,
            currentLong: data.currentLong,
            date: moment().valueOf()
        })
        return BookingRegistrationData;
    }

    acceptRequest(socket, io, room_members) {
        socket.on('acceptRequest', (data) => {
            var response;
            if (data.status === 1)
                response = 'active'
            else
                response = 'closed'
            bookingModel.findOneAndUpdate({ _id: data.bookingId }, { $set: { status: response } }, { new: true }).then(
                update => {

                    io.to(room_members[data.userId]).emit('sendRequest', { status: update });
                }
            ).catch(error => {
                if (error.errors)
                    io.to(socket.id).emit('acceptRequest', { status: CONSTANT.FALSE, message: commonController.handleValidation(error) });


                io.to(socket.id).emit('acceptRequest', { status: CONSTANT.FALSE, message: error });
            })
        })

    }



}

module.exports = socketController;