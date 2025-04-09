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
        pointsDisplay.textContent = `Points: ${userData.points}`
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
      const response = await fetch("http://localhost:5000/api/points/leaderboard")
  
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
        <div class="player-column">${player.username}${isCurrentUser ? ' <span style="color: #946599;">(You)</span>' : ""}</div>
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
  
    // Fetch and render leaderboard
    const leaderboardData = await fetchLeaderboard()
    renderLeaderboard(leaderboardData)
  }
  
  // Run initialization when the page loads
  document.addEventListener("DOMContentLoaded", initLeaderboard)
  