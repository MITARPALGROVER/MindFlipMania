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
    window.location.reload(); // Reload the page to update UI
}

// Toggle dropdown visibility
function toggleDropdown() {
    document.getElementById("profileDropdown").classList.toggle("show");
}

// Close dropdown when clicking outside
window.onclick = function(event) {
    if (!event.target.matches('.user-profile')) {
        const dropdowns = document.getElementsByClassName("profile-dropdown");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

// Initialize dropdown content based on login status
function initializeDropdown() {
    const dropdown = document.getElementById("profileDropdown");
    const loggedIn = isLoggedIn();
    
    // Clear existing content
    dropdown.innerHTML = '';
    
    if (loggedIn) {
        const userData = getUserData();
        const username = userData ? userData.username : 'User';
        
        // Add profile link
        const profileLink = document.createElement('a');
        profileLink.href = '../profile/profile.html';
        profileLink.textContent = 'My Profile';
        dropdown.appendChild(profileLink);
        
        // Add divider
        const divider = document.createElement('div');
        divider.className = 'dropdown-divider';
        dropdown.appendChild(divider);
        
        // Add logout button
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Sign Out';
        logoutBtn.onclick = logout;
        dropdown.appendChild(logoutBtn);
    } else {
        // Add login link
        const loginLink = document.createElement('a');
        loginLink.href = '../login/login.html';
        loginLink.textContent = 'Login';
        dropdown.appendChild(loginLink);
        
        // Add signup link
        const signupLink = document.createElement('a');
        signupLink.href = '../signup/signup.html';
        signupLink.textContent = 'Sign Up';
        dropdown.appendChild(signupLink);
    }
}

// Add click event to profile button
document.addEventListener('DOMContentLoaded', function() {
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', toggleDropdown);
        initializeDropdown();
    }
});