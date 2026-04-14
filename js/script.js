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

/* =========================================
   LIVE AUTOCOMPLETE SEARCH LOGIC
   ========================================= */
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// Master dictionary of your calculators
const calculators = [
    { name: "Mortgage Calculator", url: "/mortgage-calculator" },
    { name: "Auto Loan Calculator", url: "/auto-loan-calculator" },
    { name: "Salary Calculator", url: "/salary-calculator" },
    { name: "ROI Calculator", url: "/roi-calculator" },
    { name: "Discount Calculator", url: "/discount-calculator" },
    { name: "BMI Calculator", url: "/bmi-calculator" },
    { name: "Calorie Calculator", url: "/calorie-calculator" },
    { name: "BMR Calculator", url: "/bmr-calculator" },
    { name: "TDEE Calculator", url: "/tdee-calculator" },
    { name: "Macro Calculator", url: "/macro-calculator" },
    { name: "Percentage Calculator", url: "/percentage-calculator" },
    { name: "Scientific Calculator", url: "/scientific-calculator" },
    { name: "Fraction Calculator", url: "/fraction-calculator" },
    { name: "Standard Deviation Calculator", url: "/standard-deviation" },
    { name: "Random Number Generator", url: "/random-number" },
    { name: "Age Calculator", url: "/age-calculator" },
    { name: "GPA Calculator", url: "/gpa-calculator" },
    { name: "Date Calculator", url: "/date-calculator" },
    { name: "Password Generator", url: "/password-generator" },
    { name: "Unit Conversion Calculator", url: "/unit-conversion" }
];

if (searchInput && searchResults) {
    // Listen for every keystroke
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        searchResults.innerHTML = ''; // Clear previous results
        
        if (query.length > 0) {
            // Find calculators that match the typed letters
            const filtered = calculators.filter(calc => calc.name.toLowerCase().includes(query));
            
            if (filtered.length > 0) {
                // Display the matches
                filtered.forEach(calc => {
                    const a = document.createElement('a');
                    a.href = calc.url;
                    a.className = 'search-result-item';
                    a.textContent = calc.name;
                    searchResults.appendChild(a);
                });
                searchResults.style.display = 'block';
            } else {
                // Display a "Not found" message
                const div = document.createElement('div');
                div.className = 'search-result-item';
                div.textContent = 'No calculators found...';
                div.style.color = '#888';
                div.style.cursor = 'default';
                searchResults.appendChild(div);
                searchResults.style.display = 'block';
            }
        } else {
            // Hide dropdown if search bar is empty
            searchResults.style.display = 'none';
        }
    });

    // Hide dropdown if the user clicks anywhere else on the screen
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}
