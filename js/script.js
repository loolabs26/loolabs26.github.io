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

// --- SCIENTIFIC CALCULATOR LOGIC ---
const display = document.getElementById('calc-display');
let currentExpression = "";

function appendVal(val) {
    currentExpression += val;
    display.value = currentExpression;
}

function appendFunc(funcName) {
    currentExpression += funcName;
    display.value = currentExpression.replace(/Math./g, ''); // Hide 'Math.' from user
}

function clearDisplay() {
    currentExpression = "";
    display.value = "";
}

function deleteLast() {
    currentExpression = currentExpression.slice(0, -1);
    display.value = currentExpression.replace(/Math./g, '');
}

function calculate() {
    try {
        // Evaluate the expression safely. 
        // Note: For a production math app, you might later upgrade this to Math.js library for complex parsing.
        let result = eval(currentExpression);
        
        // Handle floating point weirdness (e.g., 0.1 + 0.2 = 0.30000000000000004)
        result = Math.round(result * 100000000) / 100000000; 
        
        display.value = result;
        currentExpression = result.toString();
    } catch (error) {
        display.value = "Error";
        currentExpression = "";
    }
}
