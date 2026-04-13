// js/script.js

// --- DARK MODE TOGGLE ---
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;
const icon = themeToggleBtn.querySelector('i');

// Check local storage for theme preference
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    icon.classList.replace('fa-moon', 'fa-sun');
}

themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        localStorage.setItem('theme', 'light');
        icon.classList.replace('fa-sun', 'fa-moon');
    }
});

/* =========================================
   HOMEPAGE SCIENTIFIC CALCULATOR LOGIC
   ========================================= */
const display = document.getElementById('calc-display');

// Adds numbers and basic operators (+, -, *, /) to the screen
function appendVal(val) {
    if (!display) return;
    if (display.value === 'Error') display.value = '';
    display.value += val;
}

// Adds advanced math functions like sin(, cos(, tan(, sqrt(
function appendFunc(func) {
    if (!display) return;
    if (display.value === 'Error') display.value = '';
    display.value += func;
}

// Clears the entire screen (AC button)
function clearDisplay() {
    if (!display) return;
    display.value = '';
}

// Deletes just the last character typed (DEL button)
function deleteLast() {
    if (!display) return;
    if (display.value === 'Error') {
        display.value = '';
    } else {
        display.value = display.value.toString().slice(0, -1);
    }
}

// Runs the actual calculation when '=' is pressed
function calculate() {
    if (!display || display.value === '') return;
    
    try {
        // eval() reads the string on the screen and does the math
        let result = eval(display.value);
        
        // This prevents super long, ugly decimals (like 0.30000000000000004)
        if (result % 1 !== 0) {
            result = parseFloat(result.toFixed(8)); 
        }
        
        display.value = result;
    } catch (error) {
        // If the user types bad math like "5 ++ 5" or "Math.sin(90" without closing it
        display.value = 'Error';
    }
}
// --- MOBILE MENU TOGGLE ---
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.desktop-nav');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// --- GLOBAL LOGO HOME BUTTON LINK ---
// This finds the logo on any page and makes it click back to the homepage
const siteLogos = document.querySelectorAll('.logo');

siteLogos.forEach(logo => {
    logo.style.cursor = 'pointer'; // Makes it look clickable
    logo.addEventListener('click', () => {
        window.location.href = '/'; // Sends the user home
    });
});
