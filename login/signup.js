async function validateForm() {
    const username = document.getElementById("username").value.trim()
    const email = document.getElementById("email").value.trim()
    const password = document.getElementById("password").value
    const confirmPassword = document.getElementById("confirmPassword").value
    const errorMsg = document.getElementById("errorMsg")
  
    errorMsg.style.display = "none"
    errorMsg.style.border = "2px solid #58151c"
  
    if (username === "" || email === "" || password === "" || confirmPassword === "") {
      errorMsg.textContent = "All fields are required!"
      errorMsg.style.display = "block"
      setTimeout(() => {
        errorMsg.style.display = "none"
      }, 3000)
      return
    }
  
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      errorMsg.textContent = "Please enter a valid email address!"
      errorMsg.style.display = "block"
      setTimeout(() => {
        errorMsg.style.display = "none"
      }, 3000)
      return
    }
  
    if (password.length < 8) {
      errorMsg.textContent = "Password must be at least 8 characters long!"
      errorMsg.style.display = "block"
      setTimeout(() => {
        errorMsg.style.display = "none"
      }, 3000)
      return
    }
  
    if (password !== confirmPassword) {
      errorMsg.textContent = "Passwords do not match!"
      errorMsg.style.display = "block"
      setTimeout(() => {
        errorMsg.style.display = "none"
      }, 3000)
      return
    }
  
    try {
      const response = await fetch("https://mindflipmania.vercel.app/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        errorMsg.textContent = data.message || "Registration failed!"
        errorMsg.style.display = "block"
        setTimeout(() => {
          errorMsg.style.display = "none"
        }, 3000)
        return
      }
  
      // Registration successful
      // alert("Signup successful! Redirecting to login page...")
      window.location.href = "../login/login.html"
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
  