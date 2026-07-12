// --- Ideal Body Weight (IBW) Calculator Logic ---

let currentUnit = 'imperial';

function toggleUnits(unit) {
    currentUnit = unit;
    
    const btnImp = document.getElementById('btnImperial');
    const btnMet = document.getElementById('btnMetric');
    const divImp = document.getElementById('imperialInputs');
    const divMet = document.getElementById('metricInputs');

    if (unit === 'imperial') {
        btnImp.classList.add('active');
        btnMet.classList.remove('active');
        divImp.style.display = 'flex';
        divMet.style.display = 'none';
    } else {
        btnMet.classList.add('active');
        btnImp.classList.remove('active');
        divMet.style.display = 'flex';
        divImp.style.display = 'none';
    }
    
    calculateIdealWeight();
}

function calculateIdealWeight() {
    const gender = document.querySelector('input[name="ibwGender"]:checked').value;
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.style.display = 'none';

    let heightInches = 0;
    let heightCm = 0;

    if (currentUnit === 'imperial') {
        const ft = parseFloat(document.getElementById('ibwFt').value) || 0;
        const inc = parseFloat(document.getElementById('ibwIn').value) || 0;
        heightInches = (ft * 12) + inc;
        heightCm = heightInches * 2.54;
    } else {
        heightCm = parseFloat(document.getElementById('ibwCm').value) || 0;
        heightInches = heightCm / 2.54;
    }

    if (heightInches < 48 || heightInches > 96) {
        errorMsg.innerText = "Please enter a valid height (between 4'0\" and 8'0\"). Formulas only apply to adults.";
        errorMsg.style.display = 'block';
        document.getElementById('resultBox').style.display = 'none';
        return;
    }

    // Mathematical Constants for IBW Formulas
    // Base weight is given for exactly 5 feet (60 inches)
    const inchesOver5Ft = heightInches > 60 ? heightInches - 60 : 0;
    
    // Variables for Kg
    let robinsonKg, millerKg, devineKg, hamwiKg;

    if (gender === 'male') {
        robinsonKg = 52 + (1.9 * inchesOver5Ft);
        millerKg = 56.2 + (1.41 * inchesOver5Ft);
        devineKg = 50.0 + (2.3 * inchesOver5Ft);
        hamwiKg = 48.0 + (2.7 * inchesOver5Ft);
    } else {
        robinsonKg = 49 + (1.7 * inchesOver5Ft);
        millerKg = 53.1 + (1.36 * inchesOver5Ft);
        devineKg = 45.5 + (2.3 * inchesOver5Ft);
        hamwiKg = 45.5 + (2.2 * inchesOver5Ft);
    }

    // BMI Range Calculation (Healthy = 18.5 to 24.9)
    // Formula: Weight(kg) = BMI * (Height in m)^2
    const heightM = heightCm / 100;
    const minBmiKg = 18.5 * (heightM * heightM);
    const maxBmiKg = 24.9 * (heightM * heightM);

    // Format Outputs based on selected unit
    const formatWeight = (kg) => {
        if (currentUnit === 'imperial') {
            const lbs = kg * 2.20462;
            return `${lbs.toFixed(1)} lbs`;
        } else {
            return `${kg.toFixed(1)} kg`;
        }
    };

    // Update DOM
    document.getElementById('resBMIRange').innerText = `${formatWeight(minBmiKg)} - ${formatWeight(maxBmiKg)}`;
    
    document.getElementById('resRobinson').innerText = formatWeight(robinsonKg);
    document.getElementById('resMiller').innerText = formatWeight(millerKg);
    document.getElementById('resDevine').innerText = formatWeight(devineKg);
    document.getElementById('resHamwi').innerText = formatWeight(hamwiKg);

    document.getElementById('resultBox').style.display = 'block';
}

// Global UI Logic (Dark Mode, Mobile Menu, Auto-Year)
document.addEventListener('DOMContentLoaded', () => {
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
        });
    }

    // 3. Mobile Menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const desktopNav = document.querySelector('.desktop-nav');
    if(mobileMenuBtn && desktopNav) {
        mobileMenuBtn.addEventListener('click', () => { desktopNav.classList.toggle('active'); });
    }

    // 4. Inputs Event Listeners for real-time calculation
    document.getElementById('ibwFt').addEventListener('input', calculateIdealWeight);
    document.getElementById('ibwIn').addEventListener('input', calculateIdealWeight);
    document.getElementById('ibwCm').addEventListener('input', calculateIdealWeight);

    // 5. AUTO-LOAD RESULTS ON PAGE LOAD!
    calculateIdealWeight(); 
});
