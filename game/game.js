// Get user data from localStorage
function getUserData() {
  const userData = localStorage.getItem("userData")
  return userData ? JSON.parse(userData) : null
}

// Get token from localStorage
function getToken() {
  return localStorage.getItem("userToken")
}

// Check if user is logged in
function isLoggedIn() {
  return getToken() !== null
}

function checkAuth() {
  if (!isLoggedIn()) {
    // Store the current page to redirect back after login
    localStorage.setItem("redirectAfterLogin", window.location.href)
    window.location.href = "../login/login.html"
    return false
  }
  return true
}

function getApiUrl() {
  const hostname = window.location.hostname
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:5000"
  } else {
    return "https://mindflipmania-backend.vercel.app" // Your deployed backend
  }
}

// Update points in the backend
async function updatePoints(points) {
  try {
    const token = getToken()

    if (!token) {
      console.error("No token found")
      return
    }

    const response = await fetch(`${getApiUrl()}/api/points/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ points }),
    })

    if (!response.ok) {
      throw new Error("Failed to update points")
    }

    const data = await response.json()

    // Update local storage with new points
    const userData = getUserData()
    if (userData) {
      userData.points = data.points
      localStorage.setItem("userData", JSON.stringify(userData))
    }

    return data
  } catch (error) {
    console.error("Error updating points:", error)
  }
}

// Get points from the backend
async function getPoints() {
  try {
    const token = getToken()

    if (!token) {
      console.error("No token found")
      return 0
    }

    const response = await fetch(`${getApiUrl()}/api/points`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to get points")
    }

    const data = await response.json()

    // Update local storage with fetched points
    const userData = getUserData()
    if (userData) {
      userData.points = data.points
      localStorage.setItem("userData", JSON.stringify(userData))
    }

    return data.points
  } catch (error) {
    console.error("Error getting points:", error)
    return 0
  }
}

// Fetch user themes
async function fetchUserThemes() {
  try {
    const token = getToken()

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

// Toggle dropdown visibility
function toggleDropdown() {
  document.getElementById("profileDropdown").classList.toggle("show")
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

// Close dropdown when clicking outside
window.onclick = (event) => {
  if (!event.target.matches(".user-profile")) {
    const dropdowns = document.getElementsByClassName("profile-dropdown")
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i]
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show")
      }
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

// Initialize dropdown content for game page
function initializeGameDropdown() {
  const dropdown = document.getElementById("profileDropdown")
  const loggedIn = isLoggedIn()

  // Clear existing content
  dropdown.innerHTML = ""

  if (loggedIn) {
    const userData = getUserData()
    const username = userData ? userData.username : "User"

    // Add username display
    const usernameDisplay = document.createElement("div")
    usernameDisplay.className = "dropdown-username"
    usernameDisplay.textContent = username
    dropdown.appendChild(usernameDisplay)

    // Add points display if available
    if (userData && userData.points !== undefined) {
      const pointsDisplay = document.createElement("div")
      pointsDisplay.className = "dropdown-points"
      pointsDisplay.textContent = `${userData.points} MF Coins`
      dropdown.appendChild(pointsDisplay)
    }

    // Add divider
    const divider = document.createElement("div")
    divider.className = "dropdown-divider"
    dropdown.appendChild(divider)

    // Add restart button
    const restartBtn = document.createElement("button")
    restartBtn.textContent = "Restart Game"
    restartBtn.onclick = restartGame
    dropdown.appendChild(restartBtn)

    // Add home button
    const homeBtn = document.createElement("button")
    homeBtn.textContent = "Return Home"
    homeBtn.onclick = () => {
      window.location.href = "../home/index.html"
    }
    dropdown.appendChild(homeBtn)

    // Add shop button
    const shopBtn = document.createElement("button")
    shopBtn.textContent = "Theme Shop"
    shopBtn.onclick = () => {
      window.location.href = "../rewards/shop.html"
    }
    dropdown.appendChild(shopBtn)
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

// Theme configurations
const THEMES = {
  default: {
    name: "Default",
    background: "../game/images/gamebg.jpg",
    cardColor: "#946599",
    textColor: "#ffb0a1",
    buttonColor: "#a38da6",
    emojis: ["🙈", "🐼", "🦁", "🐶", "🐮", "🐸", "🐱", "🐭", "🐰", "🦊", "🐻", "🐨"],
  },
  space: {
    name: "Space",
    background: "../rewards/images/space-game.webp",
    cardColor: "#5d6e82",
    textColor: "#fef9ed",
    buttonColor: "#bd9c8e",
    emojis: ["🚀", "🛸", "🌠", "🌌", "🪐", "👽", "🌕", "🌑", "☄️", "🌟", "👨‍🚀", "🛰️"],
  },
  underwater: {
    name: "Underwater",
    background: "../rewards/images/underwater-game.webp",
    cardColor: "#0277bd",
    textColor: "#b3e5fc",
    buttonColor: "#51a0c4",
    emojis: ["🐠", "🐙", "🐬", "🐋", "🦈", "🐡", "🦑", "🐚", "🧜‍♀️", "🐟", "🦐", "🦞"],
  },
  jungle: {
    name: "Jungle",
    background: "../rewards/images/jungle-game.webp",
    cardColor: "#2e7d32",
    textColor: "#c8e6c9",
    buttonColor: "#74a376",
    emojis: ["🐒", "🦁", "🐯", "🐘", "🦓", "🦒", "🦏", "🐊", "🦍", "🦜", "🦚", "🐍"],
  },
  desert: {
    name: "Desert",
    background: "../rewards/images/desert-game.webp",
    cardColor: "#845d4f",
    textColor: "#f2c693",
    buttonColor: "#877068",
    emojis: ["🏜️", "🌵", "🐪", "🦂", "🦎", "🐍", "🌞", "🔥", "⛺", "🧿", "🕌", "🧩"],
  },
  city: {
    name: "City",
    background: "../rewards/images/city-game.webp",
    cardColor: "#37474f",
    textColor: "#cfd8dc",
    buttonColor: "#90a4ae",
    emojis: ["🏙️", "🚗", "🚕", "🚌", "🏢", "🚇", "🚦", "🚲", "🛴", "🏭", "🌃", "🌉"],
  },
  fantasy: {
    name: "Fantasy",
    background: "../rewards/images/fantacy-game.webp",
    cardColor: "#417390",
    textColor: "#f8d5a1",
    buttonColor: "#6a8594",
    emojis: ["🧙‍♂️", "🧝‍♀️", "🧚‍♂️", "🐉", "🦄", "🏰", "⚔️", "🛡️", "🧪", "🔮", "📜", "💎"],
  },
  cyberpunk: {
    name: "Cyberpunk",
    background: "../rewards/images/cyberpunk-game.webp",
    cardColor: "#d87697",
    textColor: "#75d4d0",
    buttonColor: "#ab8491",
    emojis: ["🤖", "💾", "🕶️", "🧬", "💡", "🌃", "🛸", "🚨", "📟", "🕹️", "📡", "⚡"],
  },

  winter: {
    name: "Winter",
    background: "../rewards/images/winter-game.webp",
    cardColor: "#90caf9",
    textColor: "#ffffff",
    buttonColor: "#64b5f6",
    emojis: ["❄️", "☃️", "🌨️", "⛷️", "🏂", "🧤", "🧣", "🌬️", "🦌", "🎿", "🌁", "🥶"],
  },
}

// Get theme data
function getThemeData(themeName) {
  return THEMES[themeName] || THEMES.default
}

// Apply theme to game
function applyTheme(themeName) {
  const theme = getThemeData(themeName)

  // Apply background
  document.body.style.backgroundImage = `url('${theme.background}')`

  // Apply CSS variables
  document.documentElement.style.setProperty("--primary-color", theme.cardColor)
  document.documentElement.style.setProperty("--text-color", theme.textColor)
  document.documentElement.style.setProperty("--button-color", theme.buttonColor)

  // Apply header colors
  const header = document.querySelector("header")
  if (header) {
    header.style.backgroundColor = theme.cardColor
  }

  // Apply text colors
  const headings = document.querySelectorAll(".head")
  headings.forEach((heading) => {
    heading.style.color = theme.textColor
  })

  // Apply stats container colors
  const statsContainer = document.querySelector(".stats-container")
  if (statsContainer) {
    statsContainer.style.color = theme.textColor
  }

  const difficultyBadge = document.querySelector(".difficulty-badge")
  if (difficultyBadge) {
    difficultyBadge.style.backgroundColor = theme.cardColor
  }

  // Apply control button colors
  const controlButtons = document.querySelectorAll(".control-button")
  controlButtons.forEach((button) => {
    button.style.backgroundColor = theme.cardColor
    button.querySelector(".material-symbols-outlined").style.color = theme.textColor
  })

  return theme
}

// Game Configuration
const DIFFICULTY_CONFIG = {
  easy: {
    pairs: 6,
    columns: 4,
    maxFlips: 22,
    pointsPerPair: 2,
  },
  medium: {
    pairs: 9,
    columns: 6,
    maxFlips: 28,
    pointsPerPair: 3,
  },
  hard: {
    pairs: 12,
    columns: 8,
    maxFlips: 40,
    pointsPerPair: 4,
  },
}

// Responsive columns configuration
const RESPONSIVE_COLUMNS = {
  easy: {
    default: 4, // Default columns for easy mode
    tablet: 3, // Columns for tablet
    mobile: 3, // Columns for mobile
  },
  medium: {
    default: 6,
    tablet: 6,
    mobile: 3,
  },
  hard: {
    default: 8,
    tablet: 4,
    mobile: 3,
  },
}

// Game Variables
let difficulty = "easy" // Default difficulty
let cards = []
let hasFlippedCard = false
let firstCard, secondCard
let lockBoard = false
let flipCount = 0
let maxFlips = 14 // Default for easy
let matchedPairs = 0
let totalPairs = 4 // Default for easy
let pointsPerPair = 2 // Default for easy
let activeTheme = "default" // Default theme
let themeEmojis = THEMES.default.emojis // Default emojis

// Declare SoundManager
let soundManager

// Initialize the game
document.addEventListener("DOMContentLoaded", async () => {
  // Check if user is logged in
  if (!checkAuth()) return

  // Initialize settings
  initializeSettings()

  // Set up settings button
  document.getElementById("settings-button").addEventListener("click", () => toggleSettings())

  // Set up restart button
  document.getElementById("restart-game").addEventListener("click", restartGame)

  // Set up home button
  document.getElementById("home-button").addEventListener("click", () => {
    window.location.href = "../home/index.html"
  })

  // Get difficulty from URL parameter
  const urlParams = new URLSearchParams(window.location.search)
  difficulty = urlParams.get("difficulty") || "easy"

  // Apply difficulty settings
  const config = DIFFICULTY_CONFIG[difficulty]
  totalPairs = config.pairs
  maxFlips = config.maxFlips
  pointsPerPair = config.pointsPerPair

  // Update UI with difficulty
  document.getElementById("difficulty-level").innerHTML = `
    <span class="difficulty-badge">${difficulty.toUpperCase()}</span>
  `

  // Update flip count display
  updateFlipCount()

  // Fetch user themes
  const userThemes = await fetchUserThemes()

  // Apply active theme if available
  if (userThemes && userThemes.activeTheme) {
    activeTheme = userThemes.activeTheme
    const theme = applyTheme(activeTheme)
    themeEmojis = theme.emojis
  }

  // Generate the game grid
  generateGameGrid()

  // Add resize event listener to handle responsive layout
  window.addEventListener("resize", adjustGridLayout)

  // Initialize profile dropdown
  const profileBtn = document.getElementById("profileBtn")
  if (profileBtn) {
    profileBtn.addEventListener("click", toggleDropdown)
    initializeGameDropdown()
  }

  // Fetch latest points
  await getPoints()
})

// Get the appropriate number of columns based on screen width
function getResponsiveColumns() {
  const width = window.innerWidth
  const columnsConfig = RESPONSIVE_COLUMNS[difficulty]

  if (width <= 576) {
    return columnsConfig.mobile
  } else if (width <= 992) {
    return columnsConfig.tablet
  } else {
    return columnsConfig.default
  }
}

// Adjust grid layout based on screen size
function adjustGridLayout() {
  const gameGrid = document.getElementById("game-grid")
  if (!gameGrid) return

  const columns = getResponsiveColumns()

  // Get appropriate card size based on screen width
  let cardSize
  const width = window.innerWidth

  if (width <= 400) {
    cardSize = 70
  } else if (width <= 576) {
    cardSize = 80
  } else if (width <= 768) {
    cardSize = 80
  } else if (width <= 992) {
    cardSize = 100
  } else if (width <= 1200) {
    cardSize = 120
  } else {
    cardSize = 150
  }

  // Update grid template columns
  gameGrid.style.gridTemplateColumns = `repeat(${columns}, ${cardSize}px)`

  // Update card height
  const cardElements = document.querySelectorAll(".card")
  cardElements.forEach((card) => {
    card.style.height = `${cardSize}px`
  })

  // Adjust font size for card content
  const cardFronts = document.querySelectorAll(".card-front")
  const cardBacks = document.querySelectorAll(".card-back")

  const fontSize = Math.max(cardSize * 0.4, 16) // Minimum font size of 16px

  cardFronts.forEach((front) => {
    front.style.fontSize = `${fontSize * 0.8}px`
  })

  cardBacks.forEach((back) => {
    back.style.fontSize = `${fontSize}px`
  })
}

// Generate the game grid based on difficulty
function generateGameGrid() {
  const gameGrid = document.getElementById("game-grid")
  const config = DIFFICULTY_CONFIG[difficulty]

  // Set the grid columns based on difficulty
  // gameGrid.style.gridTemplateColumns = `repeat(${config.columns}, 150px)`

  // Clear existing cards
  gameGrid.innerHTML = ""

  // Create card pairs
  const symbols = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]
  const emojis = themeEmojis || THEMES.default.emojis
  const cardPairs = []

  // Create pairs based on difficulty
  for (let i = 0; i < config.pairs; i++) {
    cardPairs.push({
      symbol: symbols[i],
      emoji: emojis[i],
      image: `../game/images/image${(i % 4) + 1}.jpg`,
    })
  }

  // Double the cards to create pairs and shuffle
  const cardDeck = [...cardPairs, ...cardPairs].sort(() => Math.random() - 0.5)

  // Create card elements
  cardDeck.forEach((card) => {
    const cardElement = document.createElement("div")
    cardElement.className = "card"
    cardElement.dataset.symbol = card.symbol

    cardElement.innerHTML = `
      <div class="card-inner">
        <div class="card-front">MFM</div>
        <div class="card-back">${card.emoji}</div>
      </div>
    `

    cardElement.addEventListener("click", flipCard)
    gameGrid.appendChild(cardElement)
  })

  // Update cards reference
  cards = document.querySelectorAll(".card")

  // Apply theme colors to cards
  const theme = getThemeData(activeTheme)
  const cardFronts = document.querySelectorAll(".card-front")
  cardFronts.forEach((front) => {
    front.style.backgroundColor = theme.cardColor
    front.style.color = theme.textColor
  })

  const cardBacks = document.querySelectorAll(".card-back")
  cardBacks.forEach((back) => {
    back.style.backgroundColor = theme.textColor
    back.style.color = theme.cardColor
  })

  // Apply responsive layout
  adjustGridLayout()
}

// Update flip count display
function updateFlipCount() {
  const flipCountDisplay = document.getElementById("flip-count")
  flipCountDisplay.textContent = `Flips: ${flipCount}/${maxFlips}`
}

// Flip card function
function flipCard() {
  if (lockBoard || this === firstCard || flipCount >= maxFlips) return

  // Play flip sound
  if (window.soundManager) {
    window.soundManager.playFlip()
  }

  this.classList.add("flip")
  flipCount++
  updateFlipCount()

  if (!hasFlippedCard) {
    // First card flipped
    hasFlippedCard = true
    firstCard = this
  } else {
    // Second card flipped
    hasFlippedCard = false
    secondCard = this

    checkForMatch()

    // Check if max flips reached after this turn
    if (flipCount >= maxFlips) {
      setTimeout(() => {
        endGame(false)
      }, 1000)
    }
  }
}

// Check for match
function checkForMatch() {
  const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol

  if (isMatch) {
    // Play match sound
    if (window.soundManager) {
      window.soundManager.playMatch()
    }
    disableCards()
  } else {
    unflipCards()
  }
}

// Disable cards when matched
function disableCards() {
  firstCard.removeEventListener("click", flipCard)
  secondCard.removeEventListener("click", flipCard)

  matchedPairs++

  // Check if all pairs are matched
  if (matchedPairs === totalPairs) {
    setTimeout(() => {
      endGame(true)
    }, 500)
  }

  resetBoard()
}

// Unflip cards when not matched
function unflipCards() {
  lockBoard = true

  setTimeout(() => {
    firstCard.classList.remove("flip")
    secondCard.classList.remove("flip")

    resetBoard()
  }, 1000)
}

// Reset board for next turn
function resetBoard() {
  ;[hasFlippedCard, lockBoard] = [false, false]
  ;[firstCard, secondCard] = [null, null]
}

// End game function
async function endGame(isWin) {
  const modal = document.getElementById("gameOverModal")
  const titleElement = document.getElementById("gameResultTitle")
  const scoreElement = document.getElementById("finalScore")
  const messageElement = document.getElementById("resultMessage")

  // Calculate points earned
  const pointsEarned = isWin ? totalPairs * pointsPerPair : matchedPairs * pointsPerPair

  // Set title based on win/lose
  titleElement.textContent = isWin ? "Congratulations!" : "Game Over"

  // Display final score
  scoreElement.innerHTML = `You used ${flipCount} out of ${maxFlips} flips.<br>You matched ${matchedPairs} ${matchedPairs === 1 ? "pair" : "pairs"}.`

  // Set result message
  messageElement.textContent = `You scored ${pointsEarned} MF coins!!`

  // Play win/lose sound
  if (window.soundManager) {
    if (isWin) {
      window.soundManager.playWin()
    } else {
      window.soundManager.playLose()
    }
  }

  // Update points in the backend
  await updateUserPoints(pointsEarned)

  // Show the modal
  modal.style.display = "flex"

  // Update dropdown points display
  const userData = getUserData()
  if (userData) {
    const pointsDisplay = document.querySelector(".dropdown-points")
    if (pointsDisplay) {
      pointsDisplay.textContent = `${userData.points} MF Coins`
    }
  }
}

// Update user points in the backend
async function updateUserPoints(newPoints) {
  try {
    const userData = getUserData()
    if (!userData) return

    // Calculate new total points
    const currentPoints = userData.points || 0
    const totalPoints = currentPoints + newPoints

    // Update points in the backend
    const token = getToken()

    if (!token) {
      console.error("No token found")
      return
    }

    const response = await fetch(`${getApiUrl()}/api/points/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ points: totalPoints }),
    })

    if (!response.ok) {
      throw new Error("Failed to update points")
    }

    const data = await response.json()

    // Update local storage with new points
    userData.points = data.points
    localStorage.setItem("userData", JSON.stringify(userData))

    return data
  } catch (error) {
    console.error("Error updating points:", error)
  }
}

// Restart game function
function restartGame() {
  location.reload()
}
