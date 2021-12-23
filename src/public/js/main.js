const socketIoConnection = io('http://localhost:3000/')
  
const txtMessage = document.querySelector('#txt-message')
const sendBtn = document.querySelector('#send')
const audioInputs = document.querySelector('#audio-inputs')

/* socket io server events */

socketIoConnection.on('new-text-message', renderMessage)
socketIoConnection.on('new-audio-message', renderAudioMessage)

socketIoConnection.on('someone-is-typing', () => {
  const chatStatusAlreadyExists = document.querySelector('#chat-status')

  if (chatStatusAlreadyExists) {
    chatStatusAlreadyExists.innerText = 'Alguém está digitando...'
  } else {
    const chatStatus = document.querySelector('span')
    chatStatus.setAttribute('id', 'chat-status')
    chatStatus.innerText = 'Alguém está digitando...'
    
    const header = document.querySelector('#header')

    const h1 = header.firstElementChild
    header.replaceChild(chatStatus, h1)
    header.appendChild(h1)
  }
})

socketIoConnection.on('someone-stopped-typing', () => {
  const chatStatus = document.querySelector('#chat-status')
  chatStatus.innerText = ''
})

socketIoConnection.on('someone-is-recording-audio', () => {
  const chatStatusAlreadyExists = document.querySelector('#chat-status')

  if (chatStatusAlreadyExists) {
    chatStatusAlreadyExists.innerText = 'Alguém está gravando áudio...'
  } else {
    const chatStatus = document.querySelector('span')
    chatStatus.setAttribute('id', 'chat-status')
    chatStatus.innerText = 'Alguém está gravando áudio...'
    
    const header = document.querySelector('#header')

    const h1 = header.firstElementChild
    header.replaceChild(chatStatus, h1)
    header.appendChild(h1)
  }
})

socketIoConnection.on('someone-stopped-recording-audio', () => {
  const chatStatus = document.querySelector('#chat-status')
  chatStatus.innerText = ''
})

/* html events */

txtMessage.addEventListener('input', () => {
  if (txtMessage.value.length > 0) {
    sendBtn.firstElementChild.src = '/img/send.svg'
    sendBtn.dataset.sendMethod = 'text'
    socketIoConnection.emit('typing')
  } else {
    sendBtn.firstElementChild.src = '/img/microphone.svg'
    sendBtn.dataset.sendMethod = 'audio'
    socketIoConnection.emit('typing-stopped')
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
    socketIoConnection.emit('typing-stopped')

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

  if (!sended) {
    notify()
  }
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
    socketIoConnection.emit('recording-audio')

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
        socketIoConnection.emit('stopped-audio-recording')
      }
    })

    audioCancel.addEventListener('click', () => {
      if (mediaRecorder.state === 'recording') {
        canSend = false
        mediaRecorder.stop()
        hideAudioInputs()
        socketIoConnection.emit('stopped-audio-recording')
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

function renderAudioMessage({ blob, createdAt }, sended = false) {
  const newBlob = new Blob([blob], { type: 'audio/ogg; codecs=opus' })
  
  const message = document.createElement('div')
  message.classList.add('message')

  if (sended) {
    message.classList.add('sended')
  }

  // audio element creation
  const audio = document.createElement('audio')
  audio.src = URL.createObjectURL(newBlob)
  audio.type = 'audio/ogg'

  //audio controls creation
  const audioControls = document.createElement('div')
  audioControls.classList.add('audio-controls')

  //audio state creationg
  const audioState = document.createElement('button')
  audioState.classList.add('audio-state')

  //img creation
  const img = document.createElement('img')
  img.src = '/img/play.svg'

  //appending img in audioState
  audioState.appendChild(img)

  //audio progress creation
  const audioProgress = document.createElement('input')
  audioProgress.type = 'range'
  audioProgress.min = '0'
  audioProgress.max = '1'
  audioProgress.value = '0'
  audioProgress.step = '0.01'
  audioProgress.classList.add('audio-progress')

  //appending elements in audio controls
  audioControls.append(audioState, audioProgress)

  //audio infos creation
  const messageInfos = document.createElement('div')
  messageInfos.classList.add('message-infos')

  //audio time creation
  const audioTime = document.createElement('span')
  audioTime.classList.add('audio-time')
  audioTime.innerText = '00:00'

  //message hours creation
  const messageHours = document.createElement('span')
  messageHours.classList.add('message-hours')
  messageHours.innerText = createdAt

  messageInfos.append(audioTime, messageHours)

  message.append(audio, audioControls, messageInfos)

  const messages = document.querySelector('#messages')

  messages.appendChild(message)

  messages.scrollBy(0, messages.scrollHeight)

  setAudioPlayer(message)

  if (!sended) {
    notify()
  }
}

/* util functions */

function createCreatedAt() {
  const date = new Date()
  const hours = `${date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`}`
  const minutes = `${date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`}`
  return `${hours}:${minutes}`
}

function notify() {
  const audio = new Audio('/audio/notification_sound.mp3')
  audio.volume = 0.2
  audio.play()
}
