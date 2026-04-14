// --- Salary Calculator Logic ---

function calculateSalary() {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.style.display = 'none';

    // Get input values
    const payAmount = parseFloat(document.getElementById('payAmount').value);
    const payPeriod = document.getElementById('payPeriod').value;
    const hoursPerWeek = parseFloat(document.getElementById('hoursPerWeek').value);
    const daysPerWeek = parseFloat(document.getElementById('daysPerWeek').value);

    // Validation
    if (isNaN(payAmount) || payAmount <= 0) {
        showError("Please enter a valid Pay Amount.");
        return;
    }
    if (isNaN(hoursPerWeek) || hoursPerWeek <= 0 || hoursPerWeek > 168) {
        showError("Please enter valid working Hours per Week (max 168).");
        return;
    }
    if (isNaN(daysPerWeek) || daysPerWeek <= 0 || daysPerWeek > 7) {
        showError("Please enter valid working Days per Week (1 - 7).");
        return;
    }

    // 1. Convert any input to an Annual Base Salary
    let annualSalary = 0;
    const weeksInYear = 52;
    
    switch (payPeriod) {
        case 'annually':
            annualSalary = payAmount;
            break;
        case 'monthly':
            annualSalary = payAmount * 12;
            break;
        case 'semi-monthly':
            annualSalary = payAmount * 24;
            break;
        case 'bi-weekly':
            annualSalary = payAmount * 26;
            break;
        case 'weekly':
            annualSalary = payAmount * weeksInYear;
            break;
        case 'daily':
            annualSalary = payAmount * daysPerWeek * weeksInYear;
            break;
        case 'hourly':
            annualSalary = payAmount * hoursPerWeek * weeksInYear;
            break;
    }

    // 2. Break down the Annual Salary into all other periods
    const monthly = annualSalary / 12;
    const semiMonthly = annualSalary / 24;
    const biWeekly = annualSalary / 26;
    const weekly = annualSalary / weeksInYear;
    const daily = weekly / daysPerWeek;
    const hourly = weekly / hoursPerWeek;

    displaySalaryResults(annualSalary, monthly, semiMonthly, biWeekly, weekly, daily, hourly);
}

function showError(msg) {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.innerText = msg;
    errorMsg.style.display = 'block';
    document.getElementById('resultBox').style.display = 'none';
}

function displaySalaryResults(annual, monthly, semiMonthly, biWeekly, weekly, daily, hourly) {
    // Helper function to format currency
    const formatCurrency = (amount) => {
        return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    document.getElementById('annualSalaryResult').innerText = formatCurrency(annual);
    document.getElementById('resMonthly').innerText = formatCurrency(monthly);
    document.getElementById('resSemiMonthly').innerText = formatCurrency(semiMonthly);
    document.getElementById('resBiWeekly').innerText = formatCurrency(biWeekly);
    document.getElementById('resWeekly').innerText = formatCurrency(weekly);
    document.getElementById('resDaily').innerText = formatCurrency(daily);
    document.getElementById('resHourly').innerText = formatCurrency(hourly);

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
