module.exports = class ChatService {
  constructor(io) {
    this.io = io
    this.quantity = 0
  }

  start() {
    this.io.on('connection', socket => {
      console.log('People online:', ++this.quantity)

      socket.on('send-text-message', data => {
        socket.broadcast.emit('new-text-message', data)
      })

      socket.on('send-audio-message', data => {
        socket.broadcast.emit('new-audio-message', data)
      })

      socket.on('disconnect', () => {
        console.log('People online:', --this.quantity)
      })
    })
  }
}
