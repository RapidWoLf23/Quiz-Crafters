document.addEventListener("DOMContentLoaded", function () {
    let slides = document.querySelectorAll(".slide");
    let currentSlide = 0;

    function showSlides() {
        slides.forEach((slide, index) => {
            slide.classList.remove("active");
            if (index === currentSlide) {
                slide.classList.add("active");
            }
        });
        currentSlide = (currentSlide + 1) % slides.length;
        setTimeout(showSlides, 3000);
    }

    showSlides();

    // Login/Signup Handling
    let loginTab = document.getElementById("loginSignup");
    let profileTab = document.getElementById("profile");

    if (localStorage.getItem("userLoggedIn")) {
        loginTab.classList.add("hidden");
        profileTab.classList.remove("hidden");
    }

    loginTab.addEventListener("click", function () {
        let username = prompt("Enter your username or email:");
        let password = prompt("Create a password:");

        if (username && password) {
            localStorage.setItem("userLoggedIn", true);
            localStorage.setItem("username", username);
            alert("Signup successful!");
            location.reload();
        }
    });

    profileTab.addEventListener("click", function () {
        alert("Welcome, " + localStorage.getItem("username"));
    });
});
