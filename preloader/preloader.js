// Preloader functionality
class Preloader {
    constructor() {
      this.preloader = document.getElementById("preloader")
      this.progressBar = document.getElementById("preloader-progress-bar")
      this.progressMessage = document.getElementById("preloader-message")
      this.loadedCount = 0
      this.totalResources = 0
  
      // Get all resources to track
      this.images = Array.from(document.images)
      this.fonts = document.fonts
      this.audioElements = Array.from(document.getElementsByTagName("audio"))
      this.videoElements = Array.from(document.getElementsByTagName("video"))
  
      // Count total resources
      this.totalResources = this.images.length + 1 // +1 for fonts
      if (this.audioElements.length > 0) this.totalResources += this.audioElements.length
      if (this.videoElements.length > 0) this.totalResources += this.videoElements.length
  
      // Messages to display during loading
      this.loadingMessages = [
        "Shuffling memory cards...",
        "Preparing fun challenges...",
        "Loading Mind Flip Mania...",
        "Getting your game ready...",
        "Almost there...",
      ]
  
      this.init()
    }
  
    init() {
      // Show initial message
      this.updateMessage(this.loadingMessages[0])
  
      // Track when fonts are loaded
      this.fonts.ready
        .then(() => {
          this.resourceLoaded("fonts")
        })
        .catch((err) => {
          console.warn("Error loading fonts:", err)
          this.resourceLoaded("fonts")
        })
  
      // Track when images are loaded
      this.images.forEach((img) => {
        if (img.complete) {
          this.resourceLoaded("image")
        } else {
          img.addEventListener("load", () => this.resourceLoaded("image"))
          img.addEventListener("error", () => this.resourceLoaded("image"))
        }
      })
  
      // Track when audio elements are loaded
      this.audioElements.forEach((audio) => {
        if (audio.readyState >= 4) {
          this.resourceLoaded("audio")
        } else {
          audio.addEventListener("canplaythrough", () => this.resourceLoaded("audio"))
          audio.addEventListener("error", () => this.resourceLoaded("audio"))
        }
      })
  
      // Track when video elements are loaded
      this.videoElements.forEach((video) => {
        if (video.readyState >= 4) {
          this.resourceLoaded("video")
        } else {
          video.addEventListener("canplaythrough", () => this.resourceLoaded("video"))
          video.addEventListener("error", () => this.resourceLoaded("video"))
        }
      })
  
      // If no resources to track or timeout after 5 seconds
      setTimeout(() => {
        if (this.preloader && !this.preloader.classList.contains("hidden")) {
          this.hidePreloader()
        }
      }, 5000)
  
      // Force hide after maximum 8 seconds regardless of loading state
      setTimeout(() => {
        if (this.preloader && !this.preloader.classList.contains("hidden")) {
          this.hidePreloader()
        }
      }, 8000)
    }
  
    resourceLoaded(type) {
      this.loadedCount++
  
      // Calculate progress percentage
      const progress = Math.min((this.loadedCount / this.totalResources) * 100, 100)
  
      // Update progress bar
      if (this.progressBar) {
        this.progressBar.style.width = `${progress}%`
      }
  
      // Update loading message
      const messageIndex = Math.min(
        Math.floor((progress / 100) * this.loadingMessages.length),
        this.loadingMessages.length - 1,
      )
      this.updateMessage(this.loadingMessages[messageIndex])
  
      // Hide preloader when all resources are loaded
      if (progress >= 100) {
        this.hidePreloader()
      }
    }
  
    updateMessage(message) {
      if (this.progressMessage) {
        this.progressMessage.textContent = message
      }
    }
  
    hidePreloader() {
      if (this.preloader) {
        this.preloader.classList.add("hidden")
  
        // Remove preloader from DOM after transition
        setTimeout(() => {
          if (this.preloader && this.preloader.parentNode) {
            this.preloader.parentNode.removeChild(this.preloader)
          }
        }, 500)
      }
    }
  }
  
  // Initialize preloader when DOM is ready
  document.addEventListener("DOMContentLoaded", () => {
    // If the preloader element exists on the page
    if (document.getElementById("preloader")) {
      new Preloader()
    }
  })
  