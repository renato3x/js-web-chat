const socketIoConnection = io('http://localhost:3000')
  
const txtMessage = document.querySelector('#txt-message')
const sendBtn = document.querySelector('#send')
const audioInputs = document.querySelector('#audio-inputs')

socketIoConnection.on('new-text-message', renderMessage)

txtMessage.addEventListener('input', () => {
  if (txtMessage.value.length > 0) {
    sendBtn.firstElementChild.src = '/img/send.svg'
    sendBtn.dataset.sendMethod = 'text'
  } else {
    sendBtn.firstElementChild.src = '/img/microphone.svg'
    sendBtn.dataset.sendMethod = 'audio'
  }
})

sendBtn.addEventListener('click', () => {
  if (sendBtn.dataset.sendMethod === 'text') {
    sendTextMessage()
  } else if (sendBtn.dataset.sendMethod === 'audio') {
    recordAudio()
  }
})

document.addEventListener('keyup', event => {
  if (event.key === 'Enter') {
    sendTextMessage()
  }
})

function sendTextMessage() {
  if (txtMessage.value.length > 0) {
    const date = new Date()
    const hours = `${date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`}`
    const minutes = `${date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`}`
    const formatedDate = `${hours}:${minutes}`
  
    const data = { body: txtMessage.value, createdAt: formatedDate }
    socketIoConnection.emit('send-text-message', data)
    
    txtMessage.value = ''
    sendBtn.firstElementChild.src = '/img/microphone.svg'
    sendBtn.dataset.sendMethod = 'audio'
  
    renderMessage(data,true)
  }
}

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

async function recordAudio() {
  txtMessage.classList.add('hide')
  audioInputs.classList.add('show-audio-inputs')

  const audioSend = document.querySelector('#audio-send')
  const audioCancel = document.querySelector('#audio-cancel')

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)

    mediaRecorder.start()

    audioCancel.addEventListener('click', () => {
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop()
        hideAudioInputs()
      }
    })
  } catch (error) {
    hideAudioInputs()
  }
}

function hideAudioInputs() {
  audioInputs.classList.remove('show-audio-inputs')
  setTimeout(() => {
    txtMessage.classList.remove('hide')
  }, 200)
}
