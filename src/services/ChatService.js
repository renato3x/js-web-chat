module.exports = class ChatService {
  constructor(io) {
    this.io = io
  }

  start() {
    console.log(this.io)
  }
}