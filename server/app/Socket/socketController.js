

class socketController {

    // track Service
    trackService(socket, io) {
        socket.on('trackService', (data) => {
            console.log('Being Hit');

        })

    }

}

module.exports = socketController;