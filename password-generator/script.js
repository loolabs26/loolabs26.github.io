// --- Password Generator Logic ---

const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowerChars = "abcdefghijklmnopqrstuvwxyz";
const numberChars = "0123456789";
const symbolChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

// Sync Slider and Number Input
function syncLength(source) {
    const slider = document.getElementById('lengthSlider');
    const input = document.getElementById('lengthInput');
    
    if (source === 'slider') {
        input.value = slider.value;
    } else {
        // Validation for manual input
        let val = parseInt(input.value);
        if (val < 6) val = 6;
        if (val > 64) val = 64;
        slider.value = val;
    }
}

function generatePassword() {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.style.display = 'none';

    const length = parseInt(document.getElementById('lengthSlider').value);
    const useUpper = document.getElementById('chkUpper').checked;
    const useLower = document.getElementById('chkLower').checked;
    const useNumbers = document.getElementById('chkNumbers').checked;
    const useSymbols = document.getElementById('chkSymbols').checked;

    if (!useUpper && !useLower && !useNumbers && !useSymbols) {
        showError("You must select at least one character type.");
        return;
    }

    let charPool = "";
    let guaranteedChars = [];

    // Ensure at least one of each selected type is included
    if (useUpper) {
        charPool += upperChars;
        guaranteedChars.push(upperChars[Math.floor(Math.random() * upperChars.length)]);
    }
    if (useLower) {
        charPool += lowerChars;
        guaranteedChars.push(lowerChars[Math.floor(Math.random() * lowerChars.length)]);
    }
    if (useNumbers) {
        charPool += numberChars;
        guaranteedChars.push(numberChars[Math.floor(Math.random() * numberChars.length)]);
    }
    if (useSymbols) {
        charPool += symbolChars;
        guaranteedChars.push(symbolChars[Math.floor(Math.random() * symbolChars.length)]);
    }

    let password = "";
    
    // Fill the rest of the password
    const remainingLength = length - guaranteedChars.length;
    for (let i = 0; i < remainingLength; i++) {
        password += charPool[Math.floor(Math.random() * charPool.length)];
    }

    // Combine and shuffle to prevent predictable patterns (like guaranteed chars always being first)
    password = password + guaranteedChars.join('');
    password = password.split('').sort(() => 0.5 - Math.random()).join('');

    document.getElementById('passwordOutput').innerText = password;
    document.getElementById('passwordOutput').style.color = "var(--text-color)";
    
    calculateStrength(length, useUpper, useLower, useNumbers, useSymbols);
}

function copyPassword() {
    const pwdText = document.getElementById('passwordOutput').innerText;
    
    if (pwdText === "Click Generate..." || pwdText === "") return;

    navigator.clipboard.writeText(pwdText).then(() => {
        const feedback = document.getElementById('copyFeedback');
        const icon = document.querySelector('#copyBtn i');
        
        feedback.style.opacity = '1';
        icon.className = 'fas fa-check';
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            icon.className = 'far fa-copy';
        }, 2000);
    });
}

function calculateStrength(length, upper, lower, numbers, symbols) {
    const bars = [
        document.getElementById('bar1'),
        document.getElementById('bar2'),
        document.getElementById('bar3'),
        document.getElementById('bar4')
    ];
    const strengthText = document.getElementById('strengthText');
    
    // Reset bars
    bars.forEach(bar => bar.style.background = 'rgba(150, 150, 150, 0.2)');

    let score = 0;
    
    // Points for length
    if (length > 8) score += 1;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;

    // Points for variety
    let varietyCount = 0;
    if (upper) varietyCount++;
    if (lower) varietyCount++;
    if (numbers) varietyCount++;
    if (symbols) varietyCount++;

    if (varietyCount === 3) score += 1;
    if (varietyCount === 4) score += 1;

    // Determine final strength visuals
    if (score <= 1) {
        strengthText.innerText = "Weak";
        strengthText.style.color = "#e74c3c";
        bars[0].style.background = "#e74c3c";
    } else if (score === 2 || score === 3) {
        strengthText.innerText = "Fair";
        strengthText.style.color = "#f39c12";
        bars[0].style.background = "#f39c12";
        bars[1].style.background = "#f39c12";
    } else if (score === 4) {
        strengthText.innerText = "Good";
        strengthText.style.color = "#3498db";
        bars[0].style.background = "#3498db";
        bars[1].style.background = "#3498db";
        bars[2].style.background = "#3498db";
    } else {
        strengthText.innerText = "Strong";
        strengthText.style.color = "#2ecc71";
        bars.forEach(bar => bar.style.background = "#2ecc71");
    }
}

function showError(msg) {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.innerText = msg;
    errorMsg.style.display = 'block';
}

// Generate an initial password on page load
document.addEventListener('DOMContentLoaded', () => {
    generatePassword();

    // Global UI Logic (Dark Mode & Mobile Menu)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    if(themeToggleBtn) {
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
    }

    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const desktopNav = document.querySelector('.desktop-nav');

    if(mobileMenuBtn && desktopNav) {
        mobileMenuBtn.addEventListener('click', () => {
            desktopNav.classList.toggle('active');
        });
    }
});
