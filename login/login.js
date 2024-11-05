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
    const input = document.getElementById(inputId);
    const icon = document.getElementById(`toggle${inputId}Icon`);

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}