module.exports = class ChatService {
  constructor(io) {
    this.io = io
  }

  start() {
    this.io.on('connection', socket => {
      socket.on('send-text-message', data => {
        socket.broadcast.emit('new-text-message', data)
      })
    })
  }
}
