module.exports = class ChatService {
  constructor(io) {
    this.io = io
  }

  start() {
    this.io.on('connection', socket => {
      console.log(`Someone connected with id ${socket.id}`)
    })
  }
}