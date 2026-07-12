// --- Body Fat Calculator Logic (US Navy Method) ---

let currentUnit = 'imperial';

function toggleBFUnits(unit) {
    currentUnit = unit;
    
    const btnImp = document.getElementById('btnImperial');
    const btnMet = document.getElementById('btnMetric');
    const divImpHeight = document.getElementById('bfImperialHeight');
    const divMetHeight = document.getElementById('bfMetricHeight');
    const weightSym = document.getElementById('weightSym');
    const lenSyms = document.querySelectorAll('.lenSym');

    if (unit === 'imperial') {
        btnImp.classList.add('active');
        btnMet.classList.remove('active');
        
        // Colors specific to this tool
        btnImp.style.background = '#e17055';
        btnImp.style.color = 'white';
        btnMet.style.background = 'transparent';
        btnMet.style.color = 'var(--text-color)';

        divImpHeight.style.display = 'flex';
        divMetHeight.style.display = 'none';
        weightSym.innerText = 'lbs';
        lenSyms.forEach(el => el.innerText = 'in');
        
        // Convert existing inputs roughly for UX
        document.getElementById('bfWeight').value = Math.round(document.getElementById('bfWeight').value * 2.20462) || 180;
        document.getElementById('bfNeck').value = (document.getElementById('bfNeck').value / 2.54).toFixed(1) || 15.5;
        document.getElementById('bfWaist').value = (document.getElementById('bfWaist').value / 2.54).toFixed(1) || 34;
        document.getElementById('bfHip').value = (document.getElementById('bfHip').value / 2.54).toFixed(1) || 40;

    } else {
        btnMet.classList.add('active');
        btnImp.classList.remove('active');
        
        btnMet.style.background = '#e17055';
        btnMet.style.color = 'white';
        btnImp.style.background = 'transparent';
        btnImp.style.color = 'var(--text-color)';

        divMetHeight.style.display = 'block';
        divImpHeight.style.display = 'none';
        weightSym.innerText = 'kg';
        lenSyms.forEach(el => el.innerText = 'cm');
        
        // Convert existing inputs roughly for UX
        document.getElementById('bfWeight').value = Math.round(document.getElementById('bfWeight').value / 2.20462) || 80;
        document.getElementById('bfNeck').value = (document.getElementById('bfNeck').value * 2.54).toFixed(1) || 40;
        document.getElementById('bfWaist').value = (document.getElementById('bfWaist').value * 2.54).toFixed(1) || 86;
        document.getElementById('bfHip').value = (document.getElementById('bfHip').value * 2.54).toFixed(1) || 100;
    }
    
    calculateBodyFat();
}

function toggleGenderFields() {
    const gender = document.querySelector('input[name="bfGender"]:checked').value;
    const hipContainer = document.getElementById('hipContainer');
    
    if (gender === 'female') {
        hipContainer.style.display = 'block';
    } else {
        hipContainer.style.display = 'none';
    }
    calculateBodyFat();
}

function getACECategory(gender, bfPercent) {
    if (gender === 'male') {
        if (bfPercent >= 25) return "Obesity";
        if (bfPercent >= 18) return "Acceptable (Average)";
        if (bfPercent >= 14) return "Fitness";
        if (bfPercent >= 6) return "Athletes";
        if (bfPercent >= 2) return "Essential Fat";
        return "Dangerously Low";
    } else {
        if (bfPercent >= 32) return "Obesity";
        if (bfPercent >= 25) return "Acceptable (Average)";
        if (bfPercent >= 21) return "Fitness";
        if (bfPercent >= 14) return "Athletes";
        if (bfPercent >= 10) return "Essential Fat";
        return "Dangerously Low";
    }
}

function calculateBodyFat() {
    const gender = document.querySelector('input[name="bfGender"]:checked').value;
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.style.display = 'none';

    let weight = parseFloat(document.getElementById('bfWeight').value);
    let heightInches = 0;
    let neckInches = 0;
    let waistInches = 0;
    let hipInches = 0;

    // Normalize inputs to Imperial for the US Navy Math Formula
    if (currentUnit === 'imperial') {
        const ft = parseFloat(document.getElementById('bfFt').value) || 0;
        const inc = parseFloat(document.getElementById('bfIn').value) || 0;
        heightInches = (ft * 12) + inc;
        
        neckInches = parseFloat(document.getElementById('bfNeck').value);
        waistInches = parseFloat(document.getElementById('bfWaist').value);
        hipInches = parseFloat(document.getElementById('bfHip').value);
    } else {
        heightInches = parseFloat(document.getElementById('bfCm').value) / 2.54;
        neckInches = parseFloat(document.getElementById('bfNeck').value) / 2.54;
        waistInches = parseFloat(document.getElementById('bfWaist').value) / 2.54;
        hipInches = parseFloat(document.getElementById('bfHip').value) / 2.54;
    }

    if (isNaN(weight) || weight <= 0 || isNaN(heightInches) || heightInches <= 0 || isNaN(neckInches) || isNaN(waistInches)) {
        errorMsg.innerText = "Please enter valid positive numbers for all required fields.";
        errorMsg.style.display = 'block';
        return;
    }

    let bfPercent = 0;

    // US Navy Formulas (Requires log10)
    if (gender === 'male') {
        const diff = waistInches - neckInches;
        if (diff <= 0) {
            errorMsg.innerText = "Waist measurement must be larger than neck measurement.";
            errorMsg.style.display = 'block';
            return;
        }
        bfPercent = 86.010 * Math.log10(diff) - 70.041 * Math.log10(heightInches) + 36.76;
    } else {
        if (isNaN(hipInches)) {
            errorMsg.innerText = "Hip measurement is required for female calculation.";
            errorMsg.style.display = 'block';
            return;
        }
        const diff = waistInches + hipInches - neckInches;
        if (diff <= 0) {
            errorMsg.innerText = "Invalid measurements. Please check your inputs.";
            errorMsg.style.display = 'block';
            return;
        }
        bfPercent = 163.205 * Math.log10(diff) - 97.684 * Math.log10(heightInches) - 78.387;
    }

    // Edge Cases
    if (bfPercent < 1 || bfPercent > 70) {
        errorMsg.innerText = "Calculated percentage is outside realistic human ranges. Please double-check tape measurements.";
        errorMsg.style.display = 'block';
        document.getElementById('resultBox').style.display = 'none';
        return;
    }

    // Mass Calculations
    const fatMass = weight * (bfPercent / 100);
    const leanMass = weight - fatMass;
    const category = getACECategory(gender, bfPercent);

    // Format Outputs
    const weightSuffix = currentUnit === 'imperial' ? 'lbs' : 'kg';
    
    document.getElementById('resBFPercentage').innerText = bfPercent.toFixed(1) + "%";
    document.getElementById('resCategory').innerText = category;
    document.getElementById('resFatMass').innerText = `${fatMass.toFixed(1)} ${weightSuffix}`;
    document.getElementById('resLeanMass').innerText = `${leanMass.toFixed(1)} ${weightSuffix}`;

    document.getElementById('resultBox').style.display = 'block';
}

// Global UI Logic (Dark Mode, Mobile Menu, Auto-Year)
document.addEventListener('DOMContentLoaded', () => {
    // Styling Init for Buttons
    const btnImp = document.getElementById('btnImperial');
    btnImp.style.background = '#e17055';
    btnImp.style.color = 'white';

    // 1. Live Year Badges
    const currentYear = new Date().getFullYear();
    const liveBadges = document.querySelectorAll('.live-year-badge');
    liveBadges.forEach(badge => { badge.innerText = `Updated for ${currentYear}`; });
    
    const copyrightElements = document.querySelectorAll('.copyright');
    copyrightElements.forEach(el => { el.innerHTML = `&copy; 2026 - ${currentYear} <a href="https://loolabs.xyz/">loolabs.xyz</a>`; });

    // 2. Theme Toggle
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
            // Fix button text color on toggle for inactive unit
            if (currentUnit === 'imperial') {
                document.getElementById('btnMetric').style.color = body.classList.contains('dark-mode') ? '#f1f1f1' : '#333';
            } else {
                document.getElementById('btnImperial').style.color = body.classList.contains('dark-mode') ? '#f1f1f1' : '#333';
            }
        });
    }

    // 3. Mobile Menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const desktopNav = document.querySelector('.desktop-nav');
    if(mobileMenuBtn && desktopNav) {
        mobileMenuBtn.addEventListener('click', () => { desktopNav.classList.toggle('active'); });
    }

    // 4. Attach Live Calculation Listeners
    const inputs = document.querySelectorAll('.tool-input');
    inputs.forEach(input => {
        input.addEventListener('input', calculateBodyFat);
    });

    // 5. AUTO-LOAD RESULTS ON PAGE LOAD!
    calculateBodyFat(); 
});
