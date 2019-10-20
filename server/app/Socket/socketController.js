

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
            console.log('SEND_LOCATION', room_members);

            socket.broadcast.emit('broadcast', { coordinates: [76.710064, 30.703453], socketId: socket.id, driverId: data.ownerId });

        })

    }

    sendRequest(socket, io, room_members) {
        socket.on('sendRequest', (data) => {
            console.log('SEND_REQUEST', room_members);
            io.to(room_members[data.driverId]).emit('acceptRequest', { status: 1, userId: socket.id });

        })

    }

    acceptRequest(socket, io, room_members) {
        socket.on('acceptRequest', (data) => {
            console.log('ACCEPT_REQUEST', room_members);

            io.to(room_members[data.userId]).emit('sendRequest', { status: data.status });

        })

    }
}

module.exports = socketController;