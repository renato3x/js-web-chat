function setAudioPlayer(audioMessage = HTMLDivElement.prototype) {
  const audio = audioMessage.querySelector('audio')
  const btnAudioState = audioMessage.querySelector('.audio-state')
  const audioProgress = audioMessage.querySelector('.audio-progress')
  const audioTime = audioMessage.querySelector('.audio-time')

  audio.addEventListener('canplay', () => {
    audioTime.innerText = formatAudioTime(audio.duration * 1000)

    btnAudioState.addEventListener('click', () => {
      if (audio.paused) {
        audio.play()
        btnAudioState.firstElementChild.src = '/img/pause.svg'
      } else {
        audio.pause()
        btnAudioState.firstElementChild.src = '/img/play.svg'
      }
    })

    audio.addEventListener('ended', () => {
      audioTime.innerText = formatAudioTime(audio.duration * 1000)
      btnAudioState.firstElementChild.src = '/img/play.svg'
      audioProgress.value = 0
    })

    audio.addEventListener('timeupdate', () => {
      const { currentTime, duration } = audio

      audioTime.innerText = formatAudioTime(currentTime * 1000)
      audioProgress.value = currentTime / duration
    })

    audioProgress.addEventListener('input', () => {
      audio.currentTime = audioProgress.value * audio.duration
    })
  })
}

function formatAudioTime(duration) {
  const time = new Date(duration)
  const min = time.getMinutes() > 9 ? time.getMinutes() : `0${time.getMinutes()}`
  const sec = time.getSeconds() > 9 ? time.getSeconds() : `0${time.getSeconds()}`
  return `${min}:${sec}`
}
