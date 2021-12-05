const express = require('express')
const app = express()
const http = require('http').createServer(app)
const { cyan } = require('chalk')
const path = require('path')
const ChatService = require('./services/ChatService')
const { Server } = require('socket.io')

//Chat Service instance
const io = new Server(http) 
new ChatService(io).start()

//routes
const chatRoutes = require('./routes/chat.routes')

//body parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//static folders
app.use(express.static(path.join(__dirname, 'public')))

//routes
app.use(chatRoutes)

//server start
http.listen(3000, () => {
  console.log(`Server open in ${cyan('http://localhost:3000/')}`)
})
