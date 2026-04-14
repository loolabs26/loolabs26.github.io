// --- Calorie Calculator Logic ---
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

function calculateCalories() {
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
    // Men: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
    // Women: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
    
    let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
    
    if (gender === 'male') {
        bmr += 5;
    } else {
        bmr -= 161;
    }

    // TDEE (Maintenance Calories)
    const tdee = bmr * activityMultiplier;

    displayCalorieResults(tdee);
}

function showError(msg) {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.innerText = msg;
    errorMsg.style.display = 'block';
    document.getElementById('resultBox').style.display = 'none';
}

function displayCalorieResults(tdee) {
    const maintain = Math.round(tdee);
    
    document.getElementById('maintainCals').innerText = maintain.toLocaleString();
    document.getElementById('cals100').innerText = maintain.toLocaleString();
    
    // -250 cals (0.5 lb / week)
    document.getElementById('cals90').innerText = (maintain - 250).toLocaleString();
    
    // -500 cals (1 lb / week)
    document.getElementById('cals80').innerText = (maintain - 500).toLocaleString();
    
    // -1000 cals (2 lbs / week)
    let extreme = maintain - 1000;
    // Safety cap: don't recommend dropping below 1200 for women / 1500 for men usually, but we'll floor at 1000 to prevent negative numbers
    if (extreme < 1000) extreme = "Not Recommended"; 
    else extreme = extreme.toLocaleString();
    document.getElementById('cals60').innerText = extreme;
    
    // +500 cals (1 lb gain / week)
    document.getElementById('cals120').innerText = (maintain + 500).toLocaleString();

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
