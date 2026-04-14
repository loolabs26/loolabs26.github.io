// --- Age Calculator Logic ---

// Set the target date input to today's date by default on page load
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const targetDateInput = document.getElementById('targetDateInput');
    
    // Format to YYYY-MM-DD for the input value
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    targetDateInput.value = `${year}-${month}-${day}`;
});

function calculateAge() {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.style.display = 'none';

    const dobValue = document.getElementById('dobInput').value;
    const targetValue = document.getElementById('targetDateInput').value;

    if (!dobValue) {
        showError("Please select your Date of Birth.");
        return;
    }

    const dob = new Date(dobValue);
    const targetDate = targetValue ? new Date(targetValue) : new Date();

    if (dob > targetDate) {
        showError("Date of Birth cannot be after the Target Date.");
        return;
    }

    // Mathematical Date Variables
    let d1 = dob.getDate();
    let m1 = dob.getMonth() + 1;
    let y1 = dob.getFullYear();

    let d2 = targetDate.getDate();
    let m2 = targetDate.getMonth() + 1;
    let y2 = targetDate.getFullYear();

    let calcYears = y2 - y1;
    let calcMonths = 0;
    let calcDays = 0;

    // Calculate Months
    if (m2 >= m1) {
        calcMonths = m2 - m1;
    } else {
        calcYears--;
        calcMonths = 12 + m2 - m1;
    }

    // Calculate Days
    if (d2 >= d1) {
        calcDays = d2 - d1;
    } else {
        calcMonths--;
        calcDays = getDaysInMonth(y1, m1) + d2 - d1;
        
        if (calcMonths < 0) {
            calcMonths = 11;
            calcYears--;
        }
    }

    // Calculate Extra Stats (Total Days, Weeks, Months)
    const timeDiff = targetDate.getTime() - dob.getTime();
    const totalDays = Math.floor(timeDiff / (1000 * 3600 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = (calcYears * 12) + calcMonths;

    // Next Birthday Logic (Only relevant if target date is around today)
    const nextBday = new Date(dob);
    nextBday.setFullYear(targetDate.getFullYear());
    
    if (nextBday < targetDate) {
        nextBday.setFullYear(targetDate.getFullYear() + 1);
    }
    
    const timeToNextBday = nextBday.getTime() - targetDate.getTime();
    const daysToNextBday = Math.ceil(timeToNextBday / (1000 * 3600 * 24));
    
    let nextBdayString = "";
    if (daysToNextBday === 0 || daysToNextBday === 365) {
        nextBdayString = "Happy Birthday! 🎈";
    } else {
        nextBdayString = `Next birthday is in: ${daysToNextBday} Days`;
    }

    displayAgeResults(calcYears, calcMonths, calcDays, totalMonths, totalWeeks, totalDays, nextBdayString);
}

// Helper Function
function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

function showError(msg) {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.innerText = msg;
    errorMsg.style.display = 'block';
    document.getElementById('resultBox').style.display = 'none';
}

function displayAgeResults(years, months, days, tMonths, tWeeks, tDays, nextBdayStr) {
    document.getElementById('resYears').innerText = years;
    document.getElementById('resMonths').innerText = months;
    document.getElementById('resDays').innerText = days;

    document.getElementById('nextBirthdayText').innerText = nextBdayStr;

    document.getElementById('totMonths').innerText = tMonths.toLocaleString();
    document.getElementById('totWeeks').innerText = tWeeks.toLocaleString();
    document.getElementById('totDays').innerText = tDays.toLocaleString();

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
