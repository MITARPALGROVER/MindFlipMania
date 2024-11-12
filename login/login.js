function validateLogin() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("errorMsg");
    errorMsg.style.display = "none";
    errorMsg.style.border = "2px solid #58151c";
    if (username === "" || password === "") {
        errorMsg.textContent = "Both fields are required!";
        errorMsg.style.display = "block";
        setTimeout(() => { errorMsg.style.display = "none"; }, 3000);
        return;
    }
    const users = JSON.parse(localStorage.getItem("users")) || {};
    if (!users[username] || users[username].password !== password) {
        errorMsg.textContent = "Invalid username or password!";
        errorMsg.style.display = "block";
        setTimeout(() => { errorMsg.style.display = "none"; }, 3000);
        return;
    }
    alert("Login successful! Redirecting to your game...");
    window.location.href = "../game/game.html";
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
