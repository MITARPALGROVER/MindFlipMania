// Store the token in localStorage
function storeToken(token) {
    localStorage.setItem("userToken", token)
  }
  
  // Get the token from localStorage
  function getToken() {
    return localStorage.getItem("userToken")
  }
  
  // Check if user is logged in
  function isLoggedIn() {
    return getToken() !== null
  }
  
  // Logout function
  function logout() {
    localStorage.removeItem("userToken")
    window.location.href = "../login/login.html"
  }
  
  // Validate login
  async function validateLogin() {
    const username = document.getElementById("username").value.trim()
    const password = document.getElementById("password").value
    const errorMsg = document.getElementById("errorMsg")
  
    errorMsg.style.display = "none"
    errorMsg.style.border = "2px solid #58151c"
  
    if (username === "" || password === "") {
      errorMsg.textContent = "Both fields are required!"
      errorMsg.style.display = "block"
      setTimeout(() => {
        errorMsg.style.display = "none"
      }, 3000)
      return
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        errorMsg.textContent = data.message || "Invalid username or password!"
        errorMsg.style.display = "block"
        setTimeout(() => {
          errorMsg.style.display = "none"
        }, 3000)
        return
      }
  
      // Store the token
      storeToken(data.token)
  
      // Store user info
      localStorage.setItem(
        "userData",
        JSON.stringify({
          id: data._id,
          username: data.username,
          email: data.email,
          points: data.points,
        }),
      )
  
      // Redirect to game
      window.location.href = "../game/game.html"
    } catch (error) {
      console.error("Error:", error)
      errorMsg.textContent = "Server error. Please try again later."
      errorMsg.style.display = "block"
      setTimeout(() => {
        errorMsg.style.display = "none"
      }, 3000)
    }
  }
  
  function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId)
    const icon = document.getElementById(`toggle${inputId}Icon`)
  
    if (input.type === "password") {
      input.type = "text"
      icon.classList.remove("fa-eye")
      icon.classList.add("fa-eye-slash")
    } else {
      input.type = "password"
      icon.classList.remove("fa-eye-slash")
      icon.classList.add("fa-eye")
    }
  }
  
  // Check if user is already logged in
  document.addEventListener("DOMContentLoaded", () => {
    if (isLoggedIn()) {
      window.location.href = "../game/game.html"
    }
  })
  