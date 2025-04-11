// Get API URL based on environment
function getApiUrl() {
    const hostname = window.location.hostname
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5000"
    } else {
      return "https://mindflipmania-backend.vercel.app" // Your deployed backend
    }
  }
  
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
  
  // Check authentication
  function checkAuth() {
    if (!isLoggedIn()) {
      localStorage.setItem("redirectAfterLogin", window.location.href)
      window.location.href = "../login/login.html"
      return false
    }
    return true
  }
  
  // Toggle dropdown visibility
  function toggleDropdown() {
    document.getElementById("profileDropdown").classList.toggle("show")
  }
  
  // Initialize dropdown content
  function initializeDropdown() {
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
  
  // Show notification
  function showNotification(message, duration = 3000) {
    const notification = document.getElementById("notification")
    const notificationMessage = document.getElementById("notificationMessage")
  
    notificationMessage.textContent = message
    notification.classList.add("show")
  
    setTimeout(() => {
      notification.classList.remove("show")
    }, duration)
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
  
  // Purchase theme
  async function purchaseTheme(themeName, price) {
    try {
      const token = getToken()
  
      if (!token) {
        throw new Error("No token found")
      }
  
      const response = await fetch(`${getApiUrl()}/api/themes/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ themeName, price }),
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.msg || "Failed to purchase theme")
      }
  
      // Update user points in localStorage
      const userData = getUserData()
      if (userData) {
        userData.points = data.points
        localStorage.setItem("userData", JSON.stringify(userData))
      }
  
      return data
    } catch (error) {
      console.error("Error purchasing theme:", error)
      throw error
    }
  }
  
  // Activate theme
  async function activateTheme(themeName) {
    try {
      const token = getToken()
  
      if (!token) {
        throw new Error("No token found")
      }
  
      const response = await fetch(`${getApiUrl()}/api/themes/activate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ themeName }),
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.msg || "Failed to activate theme")
      }
  
      // Apply theme locally
      window.themeManager.applyTheme(themeName)
  
      return data
    } catch (error) {
      console.error("Error activating theme:", error)
      throw error
    }
  }
  
  // Render theme cards
  function renderThemeCards(userThemes) {
    const themeGrid = document.getElementById("theme-grid")
    const themes = window.themeManager.getAllThemes()
    const activeTheme = userThemes ? userThemes.activeTheme : "default"
  
    // Clear loading message
    themeGrid.innerHTML = ""
  
    // Create a card for each theme
    Object.entries(themes).forEach(([themeKey, theme]) => {
      const isPurchased = window.themeManager.isThemePurchased(themeKey, userThemes)
      const isActive = activeTheme === themeKey
  
      const themeCard = document.createElement("div")
      themeCard.className = "theme-card"
  
      themeCard.innerHTML = `
        <div class="theme-image">
          <img src="${theme.background}" alt="${theme.name} Theme">
        </div>
        <div class="theme-details">
          <h3 class="theme-name">${theme.name}</h3>
          <p class="theme-description">${theme.description}</p>
          <p class="theme-price">${theme.price} MF Coins</p>
          <div class="theme-actions">
            <button class="preview-btn" data-theme="${themeKey}">Preview</button>
            ${
              isPurchased
                ? isActive
                  ? '<span class="active-label">Active</span>'
                  : '<button class="activate-btn" data-theme="' + themeKey + '">Activate</button>'
                : '<button class="purchase-btn" data-theme="' +
                  themeKey +
                  '" data-price="' +
                  theme.price +
                  '">Purchase</button>'
            }
          </div>
        </div>
      `
  
      themeGrid.appendChild(themeCard)
    })
  
    // Add event listeners to buttons
    document.querySelectorAll(".preview-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const themeName = button.getAttribute("data-theme")
        openPreviewModal(themeName, userThemes)
      })
    })
  
    document.querySelectorAll(".purchase-btn").forEach((button) => {
      button.addEventListener("click", async () => {
        const themeName = button.getAttribute("data-theme")
        const price = Number.parseInt(button.getAttribute("data-price"))
  
        try {
          await purchaseTheme(themeName, price)
          showNotification(`${themes[themeName].name} theme purchased successfully!`)
  
          // Refresh the page to update theme cards
          location.reload()
        } catch (error) {
          showNotification(error.message || "Failed to purchase theme")
        }
      })
    })
  
    document.querySelectorAll(".activate-btn").forEach((button) => {
      button.addEventListener("click", async () => {
        const themeName = button.getAttribute("data-theme")
  
        try {
          await activateTheme(themeName)
          showNotification(`${themes[themeName].name} theme activated!`)
  
          // Refresh the page to update theme cards and apply theme
          location.reload()
        } catch (error) {
          showNotification(error.message || "Failed to activate theme")
        }
      })
    })
  }
  
  // Open preview modal
  function openPreviewModal(themeName, userThemes) {
    const modal = document.getElementById("previewModal")
    const theme = window.themeManager.getThemeData(themeName)
    const isPurchased = window.themeManager.isThemePurchased(themeName, userThemes)
    const isActive = userThemes && userThemes.activeTheme === themeName
  
    // Set modal content
    document.getElementById("previewName").textContent = theme.name
    document.getElementById("previewDescription").textContent = theme.description
    document.getElementById("previewImage").src = theme.gameBackground
    document.getElementById("previewPrice").textContent = theme.price
  
    // Set color samples
    document.getElementById("cardColor").style.backgroundColor = theme.cardColor
    document.getElementById("textColor").style.backgroundColor = theme.textColor
    document.getElementById("buttonColor").style.backgroundColor = theme.buttonColor
  
    // Set emojis
    const emojisContainer = document.getElementById("previewEmojis")
    emojisContainer.innerHTML = ""
    theme.emojis.forEach((emoji) => {
      const emojiSpan = document.createElement("span")
      emojiSpan.className = "emoji"
      emojiSpan.textContent = emoji
      emojisContainer.appendChild(emojiSpan)
    })
  
    // Configure buttons
    const purchaseBtn = document.getElementById("purchaseBtn")
    const activateBtn = document.getElementById("activateBtn")
  
    if (isPurchased) {
      purchaseBtn.style.display = "none"
  
      if (isActive) {
        activateBtn.textContent = "Currently Active"
        activateBtn.disabled = true
      } else {
        activateBtn.textContent = "Activate Theme"
        activateBtn.disabled = false
        activateBtn.onclick = async () => {
          try {
            await activateTheme(themeName)
            showNotification(`${theme.name} theme activated!`)
            closeModal()
  
            // Refresh the page to update theme cards and apply theme
            setTimeout(() => location.reload(), 1000)
          } catch (error) {
            showNotification(error.message || "Failed to activate theme")
          }
        }
      }
      activateBtn.style.display = "block"
    } else {
      purchaseBtn.style.display = "block"
      activateBtn.style.display = "none"
  
      purchaseBtn.onclick = async () => {
        try {
          await purchaseTheme(themeName, theme.price)
          showNotification(`${theme.name} theme purchased successfully!`)
          closeModal()
  
          // Refresh the page to update theme cards
          setTimeout(() => location.reload(), 1000)
        } catch (error) {
          showNotification(error.message || "Failed to purchase theme")
        }
      }
    }
  
    // Show modal
    modal.style.display = "block"
  }
  
  // Close modal
  function closeModal() {
    document.getElementById("previewModal").style.display = "none"
  }
  
  // Update coin balance display
  function updateCoinBalance() {
    const userData = getUserData()
    const coinBalance = document.getElementById("coin-balance")
  
    if (userData && userData.points !== undefined) {
      coinBalance.textContent = userData.points
    } else {
      coinBalance.textContent = "0"
    }
  }
  
  // Initialize the shop page
  async function initShop() {
    // Check if user is logged in
    if (!checkAuth()) return
  
    // Initialize profile dropdown
    const profileBtn = document.getElementById("profileBtn")
    if (profileBtn) {
      profileBtn.addEventListener("click", toggleDropdown)
      initializeDropdown()
    }
  
    // Update coin balance
    updateCoinBalance()
  
    // Fetch user themes
    const userThemes = await fetchUserThemes()
  
    // Render theme cards
    renderThemeCards(userThemes)
  
    // Apply active theme
    if (userThemes && userThemes.activeTheme) {
      window.themeManager.applyTheme(userThemes.activeTheme)
    }
  
    // Set up modal close button
    document.getElementById("closeModal").addEventListener("click", closeModal)
  
    // Close modal when clicking outside
    window.onclick = (event) => {
      const modal = document.getElementById("previewModal")
      if (event.target === modal) {
        closeModal()
      }
  
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
  }
  
  // Run initialization when the page loads
  document.addEventListener("DOMContentLoaded", initShop)
  