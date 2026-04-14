// --- TDEE Calculator Logic ---
let currentUnit = 'metric';

function switchUnit(unit) {
    currentUnit = unit;
    const btnMetric = document.getElementById('btnMetric');
    const btnUS = document.getElementById('btnUS');
    const metricInputs = document.getElementById('metricInputs');
    const usInputs = document.getElementById('usInputs');
    
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('resultBox').style.display = 'none';

    if (unit === 'metric') {
        btnMetric.classList.add('active');
        btnUS.classList.remove('active');
        metricInputs.style.display = 'flex';
        usInputs.style.display = 'none';
    } else {
        btnUS.classList.add('active');
        btnMetric.classList.remove('active');
        usInputs.style.display = 'flex';
        metricInputs.style.display = 'none';
    }
}

function calculateTDEE() {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.style.display = 'none';

    const age = parseFloat(document.getElementById('ageInput').value);
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const activityMultiplier = parseFloat(document.getElementById('activityLevel').value);
    
    let heightCm = 0;
    let weightKg = 0;

    if (isNaN(age) || age < 15 || age > 100) {
        showError("Please enter a valid age (15 - 100).");
        return;
    }

    if (currentUnit === 'metric') {
        heightCm = parseFloat(document.getElementById('heightCm').value);
        weightKg = parseFloat(document.getElementById('weightKg').value);

        if (isNaN(heightCm) || isNaN(weightKg) || heightCm <= 0 || weightKg <= 0) {
            showError("Please enter valid positive numbers for height and weight.");
            return;
        }
    } else {
        const heightFt = parseFloat(document.getElementById('heightFt').value) || 0;
        const heightIn = parseFloat(document.getElementById('heightIn').value) || 0;
        const weightLbs = parseFloat(document.getElementById('weightLbs').value);

        const totalInches = (heightFt * 12) + heightIn;

        if (totalInches <= 0 || isNaN(weightLbs) || weightLbs <= 0) {
            showError("Please enter valid positive numbers for height and weight.");
            return;
        }

        heightCm = totalInches * 2.54;
        weightKg = weightLbs * 0.453592;
    }

    // Mifflin-St Jeor Equation for BMR
    let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
    
    if (gender === 'male') {
        bmr += 5;
    } else {
        bmr -= 161;
    }

    // Calculate TDEE
    const tdee = bmr * activityMultiplier;

    displayTDEE(bmr, tdee);
}

function showError(msg) {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.innerText = msg;
    errorMsg.style.display = 'block';
    document.getElementById('resultBox').style.display = 'none';
}

function displayTDEE(bmr, tdee) {
    const roundedTDEE = Math.round(tdee);
    const roundedBMR = Math.round(bmr);
    
    document.getElementById('tdeeValue').innerText = roundedTDEE.toLocaleString();
    document.getElementById('bmrValue').innerHTML = `${roundedBMR.toLocaleString()} <span style="font-size: 14px; font-weight: 400; color: #888;">cals</span>`;
    
    // Cutting & Bulking estimations
    document.getElementById('cutValue').innerHTML = `${(roundedTDEE - 500).toLocaleString()} <span style="font-size: 14px; font-weight: 400; color: #888;">cals</span>`;
    document.getElementById('bulkValue').innerHTML = `${(roundedTDEE + 500).toLocaleString()} <span style="font-size: 14px; font-weight: 400; color: #888;">cals</span>`;

    document.getElementById('resultBox').style.display = 'block';
}

// --- Global UI Logic (Dark Mode & Mobile Menu) ---
document.addEventListener('DOMContentLoaded', () => {
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
