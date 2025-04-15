// Sound Manager for MindFlipMania
class SoundManager {
  constructor() {
    // Initialize audio elements
    this.backgroundMusic = null
    this.sfxFlip = null
    this.sfxMatch = null
    this.sfxWin = null
    this.sfxLose = null

    // Settings
    this.musicVolume = localStorage.getItem("musicVolume")
      ? Number.parseFloat(localStorage.getItem("musicVolume"))
      : 0.5
    this.sfxVolume = localStorage.getItem("sfxVolume") ? Number.parseFloat(localStorage.getItem("sfxVolume")) : 0.7
    this.musicEnabled = localStorage.getItem("musicEnabled") !== "false" // Default to true
    this.sfxEnabled = localStorage.getItem("sfxEnabled") !== "false" // Default to true

    // Initialize audio elements
    this.initAudio()
  }

  // Initialize audio elements
  initAudio() {
    // Background music
    this.backgroundMusic = document.getElementById("background-audio")

    if (!this.backgroundMusic) {
      this.backgroundMusic = new Audio("../home/Audio/bg-audio.mp3")
      this.backgroundMusic.id = "background-audio"
      document.body.appendChild(this.backgroundMusic)
    }

    this.backgroundMusic.loop = true
    this.backgroundMusic.volume = this.musicVolume

    // Sound effects
    this.sfxFlip = new Audio("../home/Audio/card-flip.mp3")
    this.sfxMatch = new Audio("../home/Audio/card-match.mp3")
    this.sfxWin = new Audio("../home/Audio/game-win.mp3")
    this.sfxLose = new Audio("../home/Audio/game-lose.mp3")

    // Set volumes for sound effects
    this.sfxFlip.volume = this.sfxVolume
    this.sfxMatch.volume = this.sfxVolume
    this.sfxWin.volume = this.sfxVolume
    this.sfxLose.volume = this.sfxVolume
  }

  // Play background music
  playMusic() {
    if (this.musicEnabled && this.backgroundMusic) {
      // Try to play music - this might fail due to browser autoplay restrictions
      this.backgroundMusic.play().catch((error) => {
        console.log("Auto-play prevented by browser:", error)

        // Add a click event listener to the document to enable audio on user interaction
        const enableAudio = () => {
          this.backgroundMusic.play()
          document.removeEventListener("click", enableAudio)
        }
        document.addEventListener("click", enableAudio)
      })
    }
  }

  // Stop background music
  stopMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause()
      this.backgroundMusic.currentTime = 0
    }
  }

  // Toggle background music
  toggleMusic() {
    this.musicEnabled = !this.musicEnabled
    localStorage.setItem("musicEnabled", this.musicEnabled)

    if (this.musicEnabled) {
      this.playMusic()
    } else {
      this.stopMusic()
    }

    return this.musicEnabled
  }

  // Set music volume
  setMusicVolume(volume) {
    this.musicVolume = volume
    localStorage.setItem("musicVolume", volume)

    if (this.backgroundMusic) {
      this.backgroundMusic.volume = volume
    }
  }

  // Set SFX volume
  setSfxVolume(volume) {
    this.sfxVolume = volume
    localStorage.setItem("sfxVolume", volume)

    this.sfxFlip.volume = volume
    this.sfxMatch.volume = volume
    this.sfxWin.volume = volume
    this.sfxLose.volume = volume
  }

  // Toggle sound effects
  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled
    localStorage.setItem("sfxEnabled", this.sfxEnabled)
    return this.sfxEnabled
  }

  // Play card flip sound
  playFlip() {
    if (this.sfxEnabled) {
      this.sfxFlip.currentTime = 0
      this.sfxFlip.play().catch((e) => console.log("Error playing sound:", e))
    }
  }

  // Play card match sound
  playMatch() {
    if (this.sfxEnabled) {
      this.sfxMatch.currentTime = 0
      this.sfxMatch.play().catch((e) => console.log("Error playing sound:", e))
    }
  }

  // Play win sound
  playWin() {
    if (this.sfxEnabled) {
      this.sfxWin.currentTime = 0
      this.sfxWin.play().catch((e) => console.log("Error playing sound:", e))
    }
  }

  // Play lose sound
  playLose() {
    if (this.sfxEnabled) {
      this.sfxLose.currentTime = 0
      this.sfxLose.play().catch((e) => console.log("Error playing sound:", e))
    }
  }
}

// Create global sound manager instance
window.soundManager = new SoundManager()

// Auto-start music when the page loads
document.addEventListener("DOMContentLoaded", () => {
  window.soundManager.playMusic()
})
