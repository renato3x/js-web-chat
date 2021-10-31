const express = require('express')
const app = express()
const { cyan } = require('chalk')
const path = require('path')

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
app.listen(3000, () => {
  console.log(`Server open in ${cyan('http://localhost:3000/')}`)
})
