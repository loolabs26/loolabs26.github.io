// --- 1. Math Logic for Scientific Calculator ---
const display = document.getElementById('calc-display');

// Append a standard number or operator to the screen
function appendVal(value) {
    // If screen shows 'Error', clear it first
    if (display.value === 'Error') {
        display.value = '';
    }
    
    // Replace visual symbols with math operators for the engine
    let evalValue = value;
    if (value === '×') evalValue = '*';
    if (value === '÷') evalValue = '/';
    if (value === '−') evalValue = '-';
    
    display.value += evalValue;
}

// Append a Math function (like sin, cos, tan, sqrt)
function appendFunc(funcStr) {
    if (display.value === 'Error' || display.value === '0') {
        display.value = '';
    }
    display.value += funcStr;
}

// Clear the entire display (AC)
function clearDisplay() {
    display.value = '';
}

// Delete the last character (DEL)
function deleteLast() {
    if (display.value === 'Error') {
        display.value = '';
    } else {
        display.value = display.value.slice(0, -1);
    }
}

// Calculate the final result (=)
function calculate() {
    try {
        // Prevent empty evaluation
        if(display.value.trim() === '') return;
        
        // Evaluate the string expression
        let result = eval(display.value);
        
        // Handle floating point weirdness (e.g., 0.1 + 0.2 = 0.30000000000000004)
        if (!Number.isInteger(result)) {
            result = parseFloat(result.toFixed(8));
        }
        
        display.value = result;
    } catch (error) {
        // Catch syntax errors (like forgetting a closing parenthesis)
        display.value = "Error";
    }
}


// --- 2. Global UI Logic (Dark Mode & Mobile Menu) ---
document.addEventListener('DOMContentLoaded', () => {
    
    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggleBtn.querySelector('i');

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

    if(mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            desktopNav.classList.toggle('active');
        });
    }
});
