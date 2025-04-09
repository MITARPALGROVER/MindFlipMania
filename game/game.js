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
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return "http://localhost:5000";
    } else {
      return "https://mindflipmania-backend.vercel.app"; // Your deployed backend
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
  
      const response = await fetch("/api/points", {
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
  
  // Toggle dropdown visibility
  function toggleDropdown() {
    document.getElementById("profileDropdown").classList.toggle("show")
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
  
  // Game Configuration
  const DIFFICULTY_CONFIG = {
    easy: {
      pairs: 4,
      columns: 4,
      maxFlips: 14,
      pointsPerPair: 2,
    },
    medium: {
      pairs: 5,
      columns: 5,
      maxFlips: 16,
      pointsPerPair: 3,
    },
    hard: {
      pairs: 6,
      columns: 6,
      maxFlips: 18,
      pointsPerPair: 4,
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
  
  // Initialize the game
  document.addEventListener("DOMContentLoaded", async () => {
    // Check if user is logged in
    if (!checkAuth()) return
  
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
  
    // Generate the game grid
    generateGameGrid()
  
    // Initialize profile dropdown
    const profileBtn = document.getElementById("profileBtn")
    if (profileBtn) {
      profileBtn.addEventListener("click", toggleDropdown)
      initializeGameDropdown()
    }
  
    // Fetch latest points
    await getPoints()
  })
  
  // Generate the game grid based on difficulty
  function generateGameGrid() {
    const gameGrid = document.getElementById("game-grid")
    const config = DIFFICULTY_CONFIG[difficulty]
  
    // Set the grid columns based on difficulty
    gameGrid.style.gridTemplateColumns = `repeat(${config.columns}, 150px)`
  
    // Clear existing cards
    gameGrid.innerHTML = ""
  
    // Create card pairs
    const symbols = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]
    const emojis = ["🙈", "🐼", "🦁", "🐶", "🐮", "🐸", "🐱", "🐭", "🐰", "🦊", "🐻", "🐨"]
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
          <div class="card-front"></div>
          <div class="card-back" style="background-image: url('${card.image}');">${card.emoji}</div>
        </div>
      `
  
      cardElement.addEventListener("click", flipCard)
      gameGrid.appendChild(cardElement)
    })
  
    // Update cards reference
    cards = document.querySelectorAll(".card")
  }
  
  // Update flip count display
  function updateFlipCount() {
    const flipCountDisplay = document.getElementById("flip-count")
    flipCountDisplay.textContent = `Flips: ${flipCount}/${maxFlips}`
  }
  
  // Flip card function
  function flipCard() {
    if (lockBoard || this === firstCard || flipCount >= maxFlips) return
  
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
  
    isMatch ? disableCards() : unflipCards()
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
    scoreElement.textContent = `You used ${flipCount} out of ${maxFlips} flips.`
  
    // Set result message
    messageElement.textContent = `You scored ${pointsEarned} MF coins!!`
  
    // Update points in the backend
    await updateUserPoints(pointsEarned)
  
    // Show the modal
    modal.style.display = "flex"
  
    // Update dropdown points display
    const userData = getUserData()
    if (userData) {
      const pointsDisplay = document.querySelector(".dropdown-points")
      if (pointsDisplay) {
        pointsDisplay.textContent = `Points: ${userData.points}`
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
  