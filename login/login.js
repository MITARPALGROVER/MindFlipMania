function validateLogin() {
    const username = document.getElementById("username").value.trim(); // Using the correct ID for username
    const password = document.getElementById("password").value; // Using the correct ID for password
    const errorMsg = document.getElementById("errorMsg"); // Assuming this element is present for error messages

    errorMsg.style.display = "none"; // Hide error message initially
    errorMsg.style.border = "2px solid #58151c"; // Set error message border style

    // Check for empty fields
    if (username === "" || password === "") {
        errorMsg.textContent = "Both fields are required!"; // Error for empty fields
        errorMsg.style.display = "block"; // Show error message
        setTimeout(() => { errorMsg.style.display = "none"; }, 3000); // Hide after 3 seconds
        return;
    }

    // Retrieve users from local storage
    const users = JSON.parse(localStorage.getItem("users")) || {};
    
    // Check if username exists and password matches
    if (!users[username] || users[username].password !== password) {
        errorMsg.textContent = "Invalid username or password!"; // Error for invalid login
        errorMsg.style.display = "block"; // Show error message
        setTimeout(() => { errorMsg.style.display = "none"; }, 3000); // Hide after 3 seconds
        return;
    }

    // Redirect to game page upon successful login
    alert("Login successful! Redirecting to your game...");
    window.location.href = "../game/game.html"; // Change to your actual game page URL
}
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId); // Get the password input element by its ID
    const icon = document.getElementById(`toggle${inputId}Icon`); // Get the icon element associated with the input

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