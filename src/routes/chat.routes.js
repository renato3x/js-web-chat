const { Router } = require('express')
const router = Router()

//controller
const chatController = require('../controllers/chat.controller')

router.get('/', chatController.index)

module.exports = router
