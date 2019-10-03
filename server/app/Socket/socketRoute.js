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
        });

        soc.trackService(socket, io, socketInfo, room_members) // Track Service


    })

}




