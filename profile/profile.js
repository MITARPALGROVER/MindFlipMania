// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem("userToken") !== null;
}

// Get user data from localStorage
function getUserData() {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
}

// Logout function
function logout() {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    window.location.href = "../home/index.html"; // Redirect to home page
}

// Load user profile data
function loadProfileData() {
    if (!isLoggedIn()) {
        // Redirect to login page if not logged in
        window.location.href = "../login/login.html";
        return;
    }
    
    const userData = getUserData();
    if (userData) {
        document.getElementById("username").textContent = userData.username || "N/A";
        document.getElementById("email").textContent = userData.email || "N/A";
        document.getElementById("points").textContent = userData.points || "0";
    } else {
        document.getElementById("username").textContent = "Error loading data";
        document.getElementById("email").textContent = "Error loading data";
        document.getElementById("points").textContent = "Error loading data";
    }
}

// Initialize page
document.addEventListener("DOMContentLoaded", function() {
    loadProfileData();
    
    // Add logout event listener
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }
});