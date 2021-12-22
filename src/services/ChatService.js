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

      socket.on('typing', () => {
        socket.broadcast.emit('someone-is-typing')
      })

      socket.on('typing-stopped', () => {
        socket.broadcast.emit('someone-stopped-typing')
      })

      socket.on('recording-audio', () => {
        socket.broadcast.emit('someone-is-recording-audio')
      })

      socket.on('stopped-audio-recording', () => {
        socket.broadcast.emit('someone-stopped-recording-audio')
      })

      socket.on('disconnect', () => {
        console.log('People online:', --this.quantity)
      })
    })
  }
}
