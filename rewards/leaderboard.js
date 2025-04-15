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

// Get API URL based on environment
function getApiUrl() {
  const hostname = window.location.hostname
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:5000"
  } else {
    return "https://mindflipmania-backend.vercel.app" // Your deployed backend
  }
}

// Initialize dropdown content for leaderboard page
function initializeLeaderboardDropdown() {
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

    // Add home button
    const homeBtn = document.createElement("button")
    homeBtn.textContent = "Return Home"
    homeBtn.onclick = () => {
      window.location.href = "../home/index.html"
    }
    dropdown.appendChild(homeBtn)

    // Add play game button
    const playBtn = document.createElement("button")
    playBtn.textContent = "Play Game"
    playBtn.onclick = () => {
      window.location.href = "../home/index.html"
    }
    dropdown.appendChild(playBtn)
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

// Fetch leaderboard data from the API
async function fetchLeaderboard() {
  try {
    const response = await fetch(`${getApiUrl()}/api/points/leaderboard`)

    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard data")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return null
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

  // Apply CSS variables
  document.documentElement.style.setProperty("--primary-color", theme.primaryColor)
  document.documentElement.style.setProperty("--text-color", theme.textColor)
  document.documentElement.style.setProperty("--button-color", theme.buttonColor)

  // Calculate RGB values for primary color for rgba usage
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : null
  }

  const primaryRgb = hexToRgb(theme.primaryColor)
  if (primaryRgb) {
    document.documentElement.style.setProperty(
      "--primary-color-rgb",
      `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`,
    )
  }

  // Update current user highlight color
  const currentUserRows = document.querySelectorAll(".current-user-row .player-column span")
  currentUserRows.forEach((span) => {
    span.style.color = theme.primaryColor
  })

  return theme
}

// Render the leaderboard with the fetched data
function renderLeaderboard(leaderboardData) {
  const leaderboardRows = document.getElementById("leaderboard-rows")

  // Clear loading message
  leaderboardRows.innerHTML = ""

  if (!leaderboardData || leaderboardData.length === 0) {
    leaderboardRows.innerHTML = '<div class="error-message">No leaderboard data available</div>'
    return
  }

  // Get current user data to highlight their row
  const currentUser = getUserData()
  const currentUserId = currentUser ? currentUser.id : null

  // Create rows for each player
  leaderboardData.forEach((player, index) => {
    const rank = index + 1
    const isCurrentUser = currentUserId && player._id === currentUserId

    // Create row element
    const row = document.createElement("div")
    row.className = "leaderboard-row"

    // Add special class for top 3 players
    if (rank === 1) {
      row.classList.add("gold-row")
    } else if (rank === 2) {
      row.classList.add("silver-row")
    } else if (rank === 3) {
      row.classList.add("bronze-row")
    }

    // Add class if this is the current user
    if (isCurrentUser) {
      row.classList.add("current-user-row")
    }

    // Create rank column with medal for top 3
    let rankDisplay
    if (rank === 1) {
      rankDisplay = '<div class="medal gold-medal"><i class="fas fa-trophy"></i></div>'
    } else if (rank === 2) {
      rankDisplay = '<div class="medal silver-medal"><i class="fas fa-medal"></i></div>'
    } else if (rank === 3) {
      rankDisplay = '<div class="medal bronze-medal"><i class="fas fa-medal"></i></div>'
    } else {
      rankDisplay = rank
    }

    // Create row content
    row.innerHTML = `
      <div class="rank-column">${rankDisplay}</div>
      <div class="player-column">${player.username}${isCurrentUser ? ' <span style="color: var(--primary-color);">(You)</span>' : ""}</div>
      <div class="points-column">${player.points || 0}</div>
    `

    leaderboardRows.appendChild(row)
  })
}

// Initialize the leaderboard page
async function initLeaderboard() {
  // Initialize profile dropdown
  const profileBtn = document.getElementById("profileBtn")
  if (profileBtn) {
    profileBtn.addEventListener("click", toggleDropdown)
    initializeLeaderboardDropdown()
  }

  // Apply active theme if user is logged in
  if (isLoggedIn()) {
    const userThemes = await fetchUserThemes()
    if (userThemes && userThemes.activeTheme) {
      applyTheme(userThemes.activeTheme)
    }
  }

  // Fetch and render leaderboard
  const leaderboardData = await fetchLeaderboard()
  renderLeaderboard(leaderboardData)
}

// Run initialization when the page loads
document.addEventListener("DOMContentLoaded", initLeaderboard)
