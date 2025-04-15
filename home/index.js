// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem("userToken") !== null
}

// Get user data from localStorage
function getUserData() {
  const userData = localStorage.getItem("userData")
  return userData ? JSON.parse(userData) : null
}

// Logout function
function logout() {
  localStorage.removeItem("userToken")
  localStorage.removeItem("userData")
  window.location.reload() // Reload the page to update UI
}

// Toggle dropdown visibility
function toggleDropdown() {
  document.getElementById("profileDropdown").classList.toggle("show")
}

// Close dropdown when clicking outside
window.onclick = (event) => {
  if (
    !event.target.matches(".user-profile") &&
    !event.target.matches(".material-symbols-outlined") &&
    !event.target.matches(".buttons")
  ) {
    const dropdowns = document.getElementsByClassName("profile-dropdown")
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i]
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show")
      }
    }

    // Also close settings panel if clicking outside
    if (
      !event.target.closest("#settings-panel") &&
      !event.target.matches("#settings-button") &&
      !event.target.closest("#settings-button")
    ) {
      toggleSettings(false)
    }
  }
}

// Get API URL based on environment
function getApiUrl() {
  const hostname = window.location.hostname
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:5000"
  } else {
    return "https://mindflipmania-backend.vercel.app" // Your deployed backend
  }
}

// Fetch user themes
async function fetchUserThemes() {
  try {
    const token = localStorage.getItem("userToken")

    if (!token) {
      throw new Error("No token found")
    }

    const response = await fetch(`${getApiUrl()}/api/themes`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch themes")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching themes:", error)
    return null
  }
}

// Apply theme to page
function applyTheme(themeName) {
  // Theme configurations
  const THEMES = {
    default: {
      background: "../home/images/theme_default.jpg",
      primaryColor: "#946599",
      textColor: "#ffb0a1",
      buttonColor: "#a38da6",
    },
    space: {
      background: "../rewards/images/space.webp",
      primaryColor: "#5d6e82",
      textColor: "#fef9ed",
      buttonColor: "#bd9c8e",
    },
    underwater: {
      background: "../rewards/images/underwater.webp",
      primaryColor: "#0277bd",
      textColor: "#b3e5fc",
      buttonColor: "#51a0c4",
    },
    jungle: {
      background: "../rewards/images/jungle.webp",
      primaryColor: "#2e7d32",
      textColor: "#c8e6c9",
      buttonColor: "#74a376",
    },
    desert: {
      background: "../rewards/images/desert.webp",
      primaryColor: "#845d4f",
      textColor: "#f2c693",
      buttonColor: "#877068",
    },
    city: {
      background: "../rewards/images/city.webp",
      primaryColor: "#37474f",
      textColor: "#cfd8dc",
      buttonColor: "#90a4ae",
    },
    fantasy: {
      background: "../rewards/images/fantacy.webp",
      primaryColor: "#417390",
      textColor: "#f8d5a1",
      buttonColor: "#6a8594",
    },
    cyberpunk: {
      background: "../rewards/images/cyberpunk.webp",
      primaryColor: "#d87697",
      textColor: "#75d4d0",
      buttonColor: "#ab8491",
    },

    winter: {
      background: "../rewards/images/winter.webp",
      primaryColor: "#90caf9",
      textColor: "#ffffff",
      buttonColor: "#64b5f6",
    },
  }

  const theme = THEMES[themeName] || THEMES.default

  // Apply background
  document.body.style.backgroundImage = `url('${theme.background}')`

  // Apply header colors
  const header = document.querySelector("header")
  if (header) {
    header.style.backgroundColor = theme.primaryColor
  }

  // Apply text colors
  const headings = document.querySelectorAll(".head")
  headings.forEach((heading) => {
    heading.style.color = theme.textColor
  })

  const diffHead = document.getElementById("diff-head")
  if (diffHead) {
    diffHead.style.color = theme.textColor
  }

  // Apply button colors
  const buttons = document.querySelectorAll(".options")
  buttons.forEach((button) => {
    button.style.backgroundColor = theme.primaryColor
    button.style.color = theme.textColor
  })

  // Apply icon colors
  const icons = document.querySelectorAll(".material-symbols-outlined")
  icons.forEach((icon) => {
    icon.style.color = theme.textColor
  })

  // Apply button background colors
  const iconButtons = document.querySelectorAll(".buttons")
  iconButtons.forEach((button) => {
    button.style.backgroundColor = theme.primaryColor
  })

  // Apply modal colors
  const modalContent = document.querySelector(".modal-content")
  if (modalContent) {
    modalContent.style.backgroundColor = theme.primaryColor
  }

  const modalButtons = document.querySelectorAll(".modal-content button")
  modalButtons.forEach((button) => {
    button.style.backgroundColor = theme.buttonColor
    button.style.color = theme.textColor
  })

  // Apply settings panel theme
  const settingsPanel = document.getElementById("settings-panel")
  if (settingsPanel) {
    const toggleSliders = document.querySelectorAll("input:checked + .toggle-slider")
    toggleSliders.forEach((slider) => {
      slider.style.backgroundColor = theme.textColor
    })

    const volumeSliders = document.querySelectorAll(".volume-slider")
    volumeSliders.forEach((slider) => {
      slider.style.setProperty("--thumb-color", theme.textColor)
    })
  }

  // Apply info modal theme
  const infoHeader = document.querySelector(".info-header h2")
  if (infoHeader) {
    infoHeader.style.color = theme.primaryColor
  }

  const infoSectionHeadings = document.querySelectorAll(".info-section h3")
  infoSectionHeadings.forEach((heading) => {
    heading.style.color = theme.primaryColor
  })

  // Store the theme colors in CSS variables for other pages to use
  document.documentElement.style.setProperty("--primary-color", theme.primaryColor)
  document.documentElement.style.setProperty("--text-color", theme.textColor)
  document.documentElement.style.setProperty("--button-color", theme.buttonColor)

  return theme
}

// Initialize dropdown content based on login status
function initializeDropdown() {
  const dropdown = document.getElementById("profileDropdown")
  const loggedIn = isLoggedIn()

  // Clear existing content
  dropdown.innerHTML = ""

  if (loggedIn) {
    const userData = getUserData()
    const username = userData ? userData.username : "User"
    const points = userData ? userData.points : "Null"

    // Add username display
    const usernameDisplay = document.createElement("div")
    usernameDisplay.className = "dropdown-username"
    usernameDisplay.textContent = username
    dropdown.appendChild(usernameDisplay)

    // Add points display if available
    if (userData && userData.points !== undefined) {
      const pointsDisplay = document.createElement("div")
      pointsDisplay.className = "dropdown-points"
      pointsDisplay.textContent = `${points} MF Coins`
      dropdown.appendChild(pointsDisplay)
    }

    // Add divider
    const divider = document.createElement("div")
    divider.className = "dropdown-divider"
    dropdown.appendChild(divider)

    // Add shop link
    const shopLink = document.createElement("button")
    shopLink.textContent = "Theme Shop"
    shopLink.onclick = () => {
      window.location.href = "../rewards/shop.html"
    }
    dropdown.appendChild(shopLink)

    // Add logout button
    const logoutBtn = document.createElement("button")
    logoutBtn.textContent = "Sign Out"
    logoutBtn.onclick = logout
    dropdown.appendChild(logoutBtn)
  } else {
    // Add login link
    const loginLink = document.createElement("a")
    loginLink.href = "../login/login.html"
    loginLink.textContent = "Login"
    dropdown.appendChild(loginLink)

    // Add signup link
    const signupLink = document.createElement("a")
    signupLink.href = "../login/signup.html"
    signupLink.textContent = "Sign Up"
    dropdown.appendChild(signupLink)
  }
}

// Check authentication before starting game
function checkAuthAndStartGame(difficulty) {
  if (isLoggedIn()) {
    window.location.href = `../game/game.html?difficulty=${difficulty}`
  } else {
    // Store the intended destination
    localStorage.setItem("redirectAfterLogin", `../game/game.html?difficulty=${difficulty}`)
    window.location.href = "../login/login.html"
  }
}

// Open difficulty modal
function openDifficultyModal() {
  document.getElementById("difficulty-modal").style.display = "flex"
}

// Close difficulty modal
function closeDifficultyModal() {
  document.getElementById("difficulty-modal").style.display = "none"
}

// Start game with selected difficulty
function startGame(difficulty) {
  checkAuthAndStartGame(difficulty)
  closeDifficultyModal()
}

// Toggle settings panel
function toggleSettings(show) {
  const settingsPanel = document.getElementById("settings-panel")
  if (show === undefined) {
    settingsPanel.classList.toggle("show")
  } else if (show) {
    settingsPanel.classList.add("show")
  } else {
    settingsPanel.classList.remove("show")
  }
}

// Toggle info modal
function toggleInfo(show) {
  const infoModal = document.getElementById("info-modal")
  if (show === undefined) {
    infoModal.style.display = infoModal.style.display === "flex" ? "none" : "flex"
  } else if (show) {
    infoModal.style.display = "flex"
  } else {
    infoModal.style.display = "none"
  }
}

// Initialize settings controls
function initializeSettings() {
  // Get elements
  const musicToggle = document.getElementById("music-toggle")
  const sfxToggle = document.getElementById("sfx-toggle")
  const musicVolume = document.getElementById("music-volume")
  const sfxVolume = document.getElementById("sfx-volume")

  // Set initial values from sound manager
  musicToggle.checked = window.soundManager.musicEnabled
  sfxToggle.checked = window.soundManager.sfxEnabled
  musicVolume.value = window.soundManager.musicVolume
  sfxVolume.value = window.soundManager.sfxVolume

  // Add event listeners
  musicToggle.addEventListener("change", function () {
    const isEnabled = this.checked
    window.soundManager.musicEnabled = isEnabled
    localStorage.setItem("musicEnabled", isEnabled)

    if (isEnabled) {
      window.soundManager.playMusic()
    } else {
      window.soundManager.stopMusic()
    }
  })

  sfxToggle.addEventListener("change", function () {
    const isEnabled = this.checked
    window.soundManager.sfxEnabled = isEnabled
    localStorage.setItem("sfxEnabled", isEnabled)
  })

  musicVolume.addEventListener("input", function () {
    window.soundManager.setMusicVolume(this.value)
  })

  sfxVolume.addEventListener("input", function () {
    window.soundManager.setSfxVolume(this.value)
  })
}

// Initialize the home page
async function initHome() {
  // Initialize settings
  initializeSettings()

  // Add click event to profile button
  const profileBtn = document.getElementById("profileBtn")
  if (profileBtn) {
    profileBtn.addEventListener("click", toggleDropdown)
    initializeDropdown()
  }

  // Add click events to bottom buttons
  document.getElementById("info-button").addEventListener("click", () => toggleInfo())
  document.getElementById("settings-button").addEventListener("click", () => toggleSettings())

  // Update the shop function if needed
  window.shop = () => {
    if (isLoggedIn()) {
      window.location.href = "../rewards/shop.html"
    } else {
      localStorage.setItem("redirectAfterLogin", "../rewards/shop.html")
      window.location.href = "../login/login.html"
    }
  }

  // Update the difficulty buttons
  window.startGame1 = () => {
    startGame("easy")
  }

  window.startGame2 = () => {
    startGame("medium")
  }

  window.startGame3 = () => {
    startGame("hard")
  }

  // Handle leaderboard link
  const leaderboardLink = document.getElementById("leaderboardLink")
  if (leaderboardLink) {
    leaderboardLink.addEventListener("click", (e) => {
      e.preventDefault()
      window.location.href = "../rewards/leaderboard.html"
    })
  }

  // Apply active theme if user is logged in
  if (isLoggedIn()) {
    const userThemes = await fetchUserThemes()
    if (userThemes && userThemes.activeTheme) {
      applyTheme(userThemes.activeTheme)
    }
  }
}

// Run initialization when the page loads
document.addEventListener("DOMContentLoaded", initHome)
