// --- 1. Math Logic for Percentage Calculator ---
function calculatePercentage() {
    const percentInput = document.getElementById("percentInput");
    const numberInput = document.getElementById("numberInput");
    const resultOutput = document.getElementById("resultOutput");

    let percent = parseFloat(percentInput.value);
    let number = parseFloat(numberInput.value);
    
    if (isNaN(percent) || isNaN(number)) {
        resultOutput.value = "Invalid Input";
        return;
    }

    let result = (percent / 100) * number;
    
    // Limits decimal places if it's not a whole number
    resultOutput.value = Number.isInteger(result) ? result : result.toFixed(4);
}

// --- 2. Global UI Logic (Dark Mode & Mobile Menu) ---
document.addEventListener('DOMContentLoaded', () => {
    
    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggleBtn.querySelector('i');

    // Load saved theme
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    // Mobile Menu Toggle Logic
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const desktopNav = document.querySelector('.desktop-nav');

    mobileMenuBtn.addEventListener('click', () => {
        desktopNav.classList.toggle('active');
    });
});
