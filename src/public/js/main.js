const socketIoConnection = io('https://34d8-2804-6b08-310-1c00-b624-e4f5-871f-d208.ngrok.io')
  
const txtMessage = document.querySelector('#txt-message')
const sendBtn = document.querySelector('#send')
const audioInputs = document.querySelector('#audio-inputs')

socketIoConnection.on('new-text-message', renderMessage)
socketIoConnection.on('new-audio-message', renderAudioMessage)

txtMessage.addEventListener('input', () => {
  if (txtMessage.value.length > 0) {
    sendBtn.firstElementChild.src = '/img/send.svg'
    sendBtn.dataset.sendMethod = 'text'
  } else {
    sendBtn.firstElementChild.src = '/img/microphone.svg'
    sendBtn.dataset.sendMethod = 'audio'
  }
})

sendBtn.addEventListener('click', async () => {
  if (sendBtn.dataset.sendMethod === 'text') {
    sendTextMessage()
  } else if (sendBtn.dataset.sendMethod === 'audio') {
    await recordAudioAndSend()
  }
})

document.addEventListener('keyup', event => {
  if (event.key === 'Enter') {
    sendTextMessage()
  }
})

/* send text message functions */

function sendTextMessage() {
  if (txtMessage.value.length > 0) {
    const data = { body: txtMessage.value, createdAt: createCreatedAt() }
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
  
  const messages = document.querySelector('#messages')
  messages.appendChild(message)
  messages.scrollBy(0, messages.scrollHeight)
}

/* send audio functions */

async function recordAudioAndSend() {
  txtMessage.classList.add('hide')
  audioInputs.classList.add('show-audio-inputs')

  const audioSend = document.querySelector('#audio-send')
  const audioCancel = document.querySelector('#audio-cancel')
  let canSend = undefined

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)

    mediaRecorder.start()

    mediaRecorder.addEventListener('dataavailable', ({ data }) => {
      if (canSend) {
        const blob = new Blob([data], { type: 'audio/ogg; codecs=opus' })

        const dataToSend = { blob, createdAt: createCreatedAt() }
        socketIoConnection.emit('send-audio-message', dataToSend)
        renderAudioMessage(dataToSend, true)
      }
    })

    audioSend.addEventListener('click', () => {
      if (mediaRecorder.state === 'recording') {
        canSend = true
        mediaRecorder.stop()
        hideAudioInputs()
      }
    })

    audioCancel.addEventListener('click', () => {
      if (mediaRecorder.state === 'recording') {
        canSend = false
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

function renderAudioMessage({ blob, createdAt }, sended = false) { // this function is only a prototype
  const newBlob = new Blob([blob], { type: 'audio/ogg; codecs=opus' })
  
  const message = document.createElement('div')
  message.classList.add('message')

  if (sended) {
    message.classList.add('sended')
  }

  const audio = document.createElement('audio')
  audio.controls = true

  const source = document.createElement('source')
  source.src = URL.createObjectURL(newBlob)
  source.type = 'audio/ogg'

  audio.appendChild(source)

  const messageHour = document.createElement('span')
  messageHour.classList.add('message-hour')
  messageHour.innerText = createdAt

  message.appendChild(audio)
  message.appendChild(messageHour)

  const messages = document.querySelector('#messages')
  messages.appendChild(message)
  messages.scrollBy(0, messages.scrollHeight)
}

/* util functions */

function createCreatedAt() {
  const date = new Date()
  const hours = `${date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`}`
  const minutes = `${date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`}`
  return `${hours}:${minutes}`
}
