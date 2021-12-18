document.querySelectorAll('.message.audio')
.forEach(audioMessage => {
  const audio = audioMessage.firstElementChild
  const audioStateButton = audioMessage.children[1].firstElementChild
  const audioRange = audioMessage.children[1].lastElementChild
  const audioTime = audioMessage.lastElementChild.firstElementChild

  audio.addEventListener('canplay', () => {
    audioTime.innerHTML = moment.utc(audio.duration * 1000).format('mm:ss')
  })

  audio.addEventListener('play', () => {
    const audioPlaying = document.querySelector('audio[data-playing="true"]')

    if (audioPlaying != null) {
      audioPlaying.dataset.playing = undefined
      audioPlaying.pause()

      audioPlaying
      .parentElement
      .children[1]
      .firstElementChild
      .firstElementChild.src = '/img/play.svg'
    }

    audio.dataset.playing = true
  })

  audio.addEventListener('timeupdate', () => {
    if (audio.ended) {
      audioStateButton.firstElementChild.src = '/img/play.svg'
      audioRange.value = parseFloat(0)
    }

    const { currentTime } = audio
    audioTime.innerHTML = moment.utc(currentTime * 1000).format('mm:ss')
    audioRange.value = (currentTime / audio.duration).toFixed(2)
  })

  audioStateButton.addEventListener('click', () => {
    if (audio.paused) {
      audio.play()
      audioStateButton.firstElementChild.src = '/img/pause.svg'
    } else {
      audio.pause()
      audioStateButton.firstElementChild.src = '/img/play.svg'
    }
  })

  audioRange.addEventListener('change', () => {
    audio.currentTime = audioRange.value * audio.duration
  })
})