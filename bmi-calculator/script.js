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

function calculateBMI() {
    let bmi = 0;
    let heightM = 0;
    let weightKg = 0;
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.style.display = 'none';

    if (currentUnit === 'metric') {
        const heightCm = parseFloat(document.getElementById('heightCm').value);
        weightKg = parseFloat(document.getElementById('weightKg').value);

        if (isNaN(heightCm) || isNaN(weightKg) || heightCm <= 0 || weightKg <= 0) {
            showError("Please enter valid positive numbers for height and weight.");
            return;
        }

        heightM = heightCm / 100;
        bmi = weightKg / (heightM * heightM);

    } else {
        const heightFt = parseFloat(document.getElementById('heightFt').value) || 0;
        const heightIn = parseFloat(document.getElementById('heightIn').value) || 0;
        const weightLbs = parseFloat(document.getElementById('weightLbs').value);

        const totalInches = (heightFt * 12) + heightIn;

        if (totalInches <= 0 || isNaN(weightLbs) || weightLbs <= 0) {
            showError("Please enter valid positive numbers for height and weight.");
            return;
        }

        heightM = totalInches * 0.0254; // Convert inches to meters
        weightKg = weightLbs * 0.453592; // Convert lbs to kg
        bmi = 703 * (weightLbs / (totalInches * totalInches));
    }

    displayAdvancedResult(bmi, heightM, weightKg);
}

function showError(msg) {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.innerText = msg;
    errorMsg.style.display = 'block';
    document.getElementById('resultBox').style.display = 'none';
}

function displayAdvancedResult(bmi, heightM, weightKg) {
    const resultBox = document.getElementById('resultBox');
    const bmiValueEl = document.getElementById('bmiValue');
    const bmiCategoryEl = document.getElementById('bmiCategory');
    const bmiMarker = document.getElementById('bmiMarker');

    // 1. Set BMI and Category
    const finalBMI = bmi.toFixed(1);
    bmiValueEl.innerText = finalBMI;

    let category = "";
    let bgColor = "";

    if (finalBMI < 18.5) {
        category = "Underweight";
        bgColor = "#3498db";
    } else if (finalBMI >= 18.5 && finalBMI < 25) {
        category = "Normal Weight";
        bgColor = "#2ecc71";
    } else if (finalBMI >= 25 && finalBMI < 30) {
        category = "Overweight";
        bgColor = "#f39c12";
    } else {
        category = "Obesity";
        bgColor = "#e74c3c";
    }

    bmiCategoryEl.innerText = category;
    bmiCategoryEl.style.backgroundColor = bgColor;

    // 2. Animate the Marker on the Visual Scale
    // Scale ranges: Under (0-18.5)=25%, Normal (18.5-25)=25%, Over (25-30)=25%, Obese (30-40+)=25%
    let markerPercent = 0;
    if (bmi <= 15) {
        markerPercent = 0;
    } else if (bmi > 15 && bmi <= 18.5) {
        markerPercent = ((bmi - 15) / 3.5) * 25;
    } else if (bmi > 18.5 && bmi <= 25) {
        markerPercent = 25 + (((bmi - 18.5) / 6.5) * 25);
    } else if (bmi > 25 && bmi <= 30) {
        markerPercent = 50 + (((bmi - 25) / 5) * 25);
    } else if (bmi > 30 && bmi <= 40) {
        markerPercent = 75 + (((bmi - 30) / 10) * 25);
    } else {
        markerPercent = 100;
    }
    
    // Slight delay to allow display block to render before animating
    resultBox.style.display = 'block';
    setTimeout(() => {
        bmiMarker.style.left = `${markerPercent}%`;
    }, 50);

    // 3. Calculate Extra Stats
    // Healthy Weight Range (BMI 18.5 to 25)
    const minWeightKg = 18.5 * (heightM * heightM);
    const maxWeightKg = 25 * (heightM * heightM);
    
    let weightString = "";
    if (currentUnit === 'metric') {
        weightString = `${minWeightKg.toFixed(1)} kg - ${maxWeightKg.toFixed(1)} kg`;
    } else {
        const minWeightLbs = minWeightKg / 0.453592;
        const maxWeightLbs = maxWeightKg / 0.453592;
        weightString = `${minWeightLbs.toFixed(1)} lbs - ${maxWeightLbs.toFixed(1)} lbs`;
    }

    // BMI Prime (BMI / 25)
    const bmiPrime = (bmi / 25).toFixed(2);

    // Ponderal Index (Weight in kg / Height in meters cubed)
    const ponderalIndex = (weightKg / Math.pow(heightM, 3)).toFixed(1);

    // Update the DOM
    document.getElementById('healthyWeightText').innerHTML = `Healthy weight for your height: <strong>${weightString}</strong>`;
    document.getElementById('bmiPrimeText').innerHTML = `BMI Prime: <strong>${bmiPrime}</strong>`;
    document.getElementById('ponderalIndexText').innerHTML = `Ponderal Index: <strong>${ponderalIndex} kg/m³</strong>`;
}

// --- Global UI Logic ---
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
