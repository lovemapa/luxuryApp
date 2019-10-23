const socketController = require('../Socket/socketController')
const soc = new socketController();

module.exports = (io) => {
    var socketInfo = {};
    var rooms = [];
    var room_members = {}
    io.on('connection', function (socket) {
        console.log('Someone connected');

        socket.on('disconnect', function () {       //Disconnecting the socket
            delete socketInfo[socket.username];
            console.log(socketInfo);

        });


        soc.sendLiveLocation(socket, io, socketInfo)  // Drivers nearby Send Their Live location
        soc.addUsername(socket, io, socketInfo) //Add username to corresponding socketID
        soc.sendRequest(socket, io, socketInfo) // Send Request to Owner
        soc.acceptRequest(socket, io, socketInfo) // Response From Owner
        soc.createBooking(socket, io, socketInfo) // Booking request from user
    })

}




