module.exports = class ChatService {
  constructor(io) {
    this.io = io
  }

  start() {
    this.io.on('connection', socket => {
      
    })
  }
}