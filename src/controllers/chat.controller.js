const { request: req, response: res } = require('express')
const path = require('path')

module.exports = {
  async index(request = req, response = res) {
    return response.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
  }
}
