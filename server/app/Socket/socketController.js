const vehicleModel = require('../../models/vehicleModel')
const pickModel = require('../../models/pickupModel')
const bookingModel = require('../../models/bookingModel')
const userModel = require('../../models/userModel')
const ownerModel = require('../../models/ownerModel')
const CONSTANT = require('../../constant')

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
            socket.broadcast.emit('broadcast', { coordinates: [76.710064, 30.703453], socketId: socket.id, driverId: data.ownerId });

        })

    }

    sendRequest(socket, io, room_members) {
        socket.on('sendRequest', (data) => {
            io.to(room_members[data.driverId]).emit('acceptRequest', { status: 1, userId: socket.id });

        })

    }

    acceptRequest(socket, io, room_members) {
        socket.on('acceptRequest', (data) => {
            io.to(room_members[data.userId]).emit('sendRequest', { status: data.status });

        })

    }


    createBooking(socket, io, room_members) {
        socket.on('createBooking', (data) => {
            if (!data.vehicleId || !data.currentLat || !data.currentLong || !data.userId)
                io.to(socket.id).emit('createBooking', { status: CONSTANT.MISSINGVEHCILE });
            else {

                const bookingRegister = this.createBookingRegistration(data)
                // console.log((data.endTime - data.startTime) / 86400000);


                bookingRegister.save().then((saveresult) => {
                    const pick = new pickModel({
                        bookingId: saveresult._id,
                        name: data.name,
                        contact: data.contact,
                        notes: data.notes,
                        specialRequest: data.specialRequest,
                        date: moment().valueOf()
                    })
                    pick.save({}).then(pickDetails => {

                    }).catch(err => {
                        console.log(err);

                    })
                    resolve(saveresult)
                }).catch(error => {
                    if (error.errors)
                        return reject(commonController.handleValidation(error))

                    return reject(error)
                })
            }

        })

    }
}

module.exports = socketController;