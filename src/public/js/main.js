const socketIoConnection = io('http://localhost:3000')
  
const txtMessage = document.querySelector('#txt-message')
const sendBtn = document.querySelector('#send')

txtMessage.addEventListener('input', () => {
  if (txtMessage.value.length > 0) {
    sendBtn.firstElementChild.src = '/img/send.svg'
    sendBtn.dataset.sendMethod = 'text'
  } else {
    sendBtn.firstElementChild.src = '/img/microphone.svg'
    sendBtn.dataset.sendMethod = 'audio'
  }
})

document.addEventListener('keyup', event => {
  if (event.key === 'Enter' && txtMessage.value.length > 0) {
    const date = new Date()
    const hours = `${date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`}`
    const minutes = `${date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`}`
    const formatedDate = `${hours}:${minutes}`

    const data = { body: txtMessage.value, createdAt: formatedDate }
    socketIoConnection.emit('new-text-message', data)
    
    txtMessage.value = ''
    sendBtn.firstElementChild.src = '/img/microphone.svg'
    sendBtn.dataset.sendMethod = 'audio'

    renderMessage(data,true)
  }
})

function renderMessage({ body, createdAt }, sended = false) {
  const message = document.createElement('div')
  message.classList.add('message')

  if (sended) {
    message.classList.add('sended')
  }

  const messageText = document.createElement('p')
  messageText.classList.add('message-text')
  messageText.innerText = body

  const messageHour = document.createElement('span')
  messageHour.classList.add('message-hour')
  messageHour.innerText = createdAt

  message.append(messageText, messageHour)

  document.querySelector('#messages').appendChild(message)
}
