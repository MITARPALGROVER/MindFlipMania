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
  
  // Initialize dropdown content based on login status
  function initializeDropdown() {
    const dropdown = document.getElementById("profileDropdown")
    const loggedIn = isLoggedIn()
  
    // Clear existing content
    dropdown.innerHTML = ""
  
    if (loggedIn) {
      const userData = getUserData()
      const username = userData ? userData.username : "User"
  
      const profilePoints = document.createElement("div")
      profilePoints.className = "profile-points"
      profilePoints.onclick = function() {
        window.location.href = "../profile/profile.html"; // change to your desired path
      }
      dropdown.appendChild(profilePoints)

      // Add username display
      const usernameDisplay = document.createElement("div")
      usernameDisplay.className = "dropdown-username"
      usernameDisplay.textContent = username
      
      profilePoints.appendChild(usernameDisplay)
  
      // Add points display if available
      if (userData && userData.points !== undefined) {
        const pointsDisplay = document.createElement("div")
        pointsDisplay.className = "dropdown-points"
        pointsDisplay.textContent = `${userData.points} MF Coins`
        profilePoints.appendChild(pointsDisplay)
      }
  
      // Add divider
      const divider = document.createElement("div")
      divider.className = "dropdown-divider"
      dropdown.appendChild(divider)
  
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
  
  // Add click event to profile button
  document.addEventListener("DOMContentLoaded", () => {
    const profileBtn = document.getElementById("profileBtn")
    if (profileBtn) {
      profileBtn.addEventListener("click", toggleDropdown)
      initializeDropdown()
    }
  
    // Update the shop function if needed
    window.shop = () => {
      if (isLoggedIn()) {
        window.location.href = "../rewards/index.html"
      } else {
        localStorage.setItem("redirectAfterLogin", "../rewards/index.html")
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
  })
  