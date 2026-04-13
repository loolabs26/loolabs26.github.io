// --- Math Logic for Standard Deviation ---

function calculateStats() {
    const rawInput = document.getElementById('dataInput').value;
    const calcType = document.getElementById('calcType').value;
    const errorMsg = document.getElementById('errorMessage');
    
    // UI Elements for output
    const resStdDev = document.getElementById('resStdDev');
    const resVariance = document.getElementById('resVariance');
    const resMean = document.getElementById('resMean');
    const resCount = document.getElementById('resCount');

    // Reset error message
    errorMsg.style.display = "none";
    errorMsg.innerText = "";

    // 1. Parse the input string into an array of numbers
    // This regex splits by commas, spaces, or both, and filters out empty strings
    let dataStrArray = rawInput.split(/[\s,]+/).filter(item => item.trim() !== '');
    
    let dataArray = dataStrArray.map(Number);

    // 2. Validate the data
    if (dataArray.length === 0) {
        showError("Please enter some numbers.");
        return;
    }
    
    if (dataArray.some(isNaN)) {
        showError("Invalid input detected. Please ensure you only enter numbers.");
        return;
    }

    const n = dataArray.length;

    if (calcType === 'sample' && n <= 1) {
        showError("A Sample calculation requires at least 2 numbers.");
        return;
    }

    // 3. Calculate Mean
    const sum = dataArray.reduce((acc, val) => acc + val, 0);
    const mean = sum / n;

    // 4. Calculate Variance (Sum of squared differences)
    let sumOfSquares = 0;
    for (let i = 0; i < n; i++) {
        sumOfSquares += Math.pow((dataArray[i] - mean), 2);
    }

    // Adjust denominator based on Population vs Sample
    const denominator = calcType === 'sample' ? (n - 1) : n;
    const variance = sumOfSquares / denominator;

    // 5. Calculate Standard Deviation
    const stdDev = Math.sqrt(variance);

    // 6. Output formatted results (round to 4 decimal places max)
    resStdDev.innerText = formatNumber(stdDev);
    resVariance.innerText = formatNumber(variance);
    resMean.innerText = formatNumber(mean);
    resCount.innerText = n;
}

// Helper to limit decimals to keep UI clean
function formatNumber(num) {
    if (Number.isInteger(num)) return num;
    return parseFloat(num.toFixed(4));
}

// Helper to show errors safely
function showError(msg) {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.innerText = msg;
    errorMsg.style.display = "block";
    
    document.getElementById('resStdDev').innerText = "0";
    document.getElementById('resVariance').innerText = "0";
    document.getElementById('resMean').innerText = "0";
    document.getElementById('resCount').innerText = "0";
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
