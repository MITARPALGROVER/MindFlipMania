function validateForm() {
    const username = document.getElementById("username").value.trim(); // Using the correct ID for username
    const email = document.getElementById("email").value.trim(); // Using the correct ID for email
    const password = document.getElementById("password").value; // Using the correct ID for password
    const confirmPassword = document.getElementById("confirmPassword").value; // Using the correct ID for confirm password
    const errorMsg = document.getElementById("errorMsg"); // Assuming this element is present for error messages

    errorMsg.style.display = "none"; // Hide error message initially
    errorMsg.style.border = "2px solid #58151c"; // Set error message border style

    // Validate empty fields
    if (username === "" || email === "" || password === "" || confirmPassword === "") {
        errorMsg.textContent = "All fields are required!"; // Error for empty fields
        errorMsg.style.display = "block"; // Show error message
        setTimeout(() => { errorMsg.style.display = "none"; }, 3000); // Hide after 3 seconds
        return;
    }

    // Email validation using regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        errorMsg.textContent = "Please enter a valid email address!"; // Error for invalid email
        errorMsg.style.display = "block"; // Show error message
        setTimeout(() => { errorMsg.style.display = "none"; }, 3000); // Hide after 3 seconds
        return;
    }

    // Password length validation
    if (password.length < 8) {
        errorMsg.textContent = "Password must be at least 8 characters long!"; // Error for short password
        errorMsg.style.display = "block"; // Show error message
        setTimeout(() => { errorMsg.style.display = "none"; }, 3000); // Hide after 3 seconds
        return;
    }

    // Password match validation
    if (password !== confirmPassword) {
        errorMsg.textContent = "Passwords do not match!"; // Error for password mismatch
        errorMsg.style.display = "block"; // Show error message
        setTimeout(() => { errorMsg.style.display = "none"; }, 3000); // Hide after 3 seconds
        return;
    }

    // Check if user already exists in local storage
    let users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[username] || users[email]) {
        errorMsg.textContent = "User already exists! Try logging in."; // Error for existing user
        errorMsg.style.display = "block"; // Show error message
        setTimeout(() => { errorMsg.style.display = "none"; }, 3000); // Hide after 3 seconds
        return;
    }

    // Store user details in local storage
    users[username] = { username: username, password: password }; // Store user info
    localStorage.setItem("users", JSON.stringify(users)); // Save users to local storage

    alert("Signup successful! Redirecting to login page..."); // Alert for successful signup
    window.location.href = "../login/login.html"; // Redirect to login page
}


function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId); // Get the password input field by its ID
    const icon = document.getElementById(`toggle${inputId}Icon`); // Get the icon element associated with the input field

    if (input.type === "password") { // Check if the input type is password
        input.type = "text"; // Change the input type to text to show the password
        icon.classList.remove("fa-eye"); // Remove the eye icon class
        icon.classList.add("fa-eye-slash"); // Add the eye-slash icon class
    } else { // If the input type is not password
        input.type = "password"; // Change the input type back to password to hide the password
        icon.classList.remove("fa-eye-slash"); // Remove the eye-slash icon class
        icon.classList.add("fa-eye"); // Add the eye icon class
    }
}