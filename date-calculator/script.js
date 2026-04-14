// --- Date Calculator Logic ---

// Set today's date in inputs by default
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedToday = `${year}-${month}-${day}`;
    
    document.getElementById('diffStartDate').value = formattedToday;
    document.getElementById('addStartDate').value = formattedToday;
});

let currentMode = 'difference';

function switchMode(mode) {
    currentMode = mode;
    const btnDiff = document.getElementById('btnDiff');
    const btnAddSub = document.getElementById('btnAddSub');
    const diffInputs = document.getElementById('differenceInputs');
    const addSubInputs = document.getElementById('addSubInputs');
    
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('resultBox').style.display = 'none';

    if (mode === 'difference') {
        btnDiff.classList.add('active');
        btnAddSub.classList.remove('active');
        diffInputs.style.display = 'block';
        addSubInputs.style.display = 'none';
    } else {
        btnAddSub.classList.add('active');
        btnDiff.classList.remove('active');
        addSubInputs.style.display = 'block';
        diffInputs.style.display = 'none';
    }
}

function calculateDifference() {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.style.display = 'none';

    const startVal = document.getElementById('diffStartDate').value;
    const endVal = document.getElementById('diffEndDate').value;
    const includeEnd = document.getElementById('includeEndDate').checked;

    if (!startVal || !endVal) {
        showError("Please select both a Start Date and an End Date.");
        return;
    }

    let startDate = new Date(startVal);
    let endDate = new Date(endVal);

    // Swap if start is after end
    if (startDate > endDate) {
        const temp = startDate;
        startDate = endDate;
        endDate = temp;
    }

    let d1 = startDate.getDate();
    let m1 = startDate.getMonth() + 1;
    let y1 = startDate.getFullYear();

    let d2 = endDate.getDate();
    let m2 = endDate.getMonth() + 1;
    let y2 = endDate.getFullYear();

    let calcYears = y2 - y1;
    let calcMonths = 0;
    let calcDays = 0;

    if (m2 >= m1) {
        calcMonths = m2 - m1;
    } else {
        calcYears--;
        calcMonths = 12 + m2 - m1;
    }

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

    // Total flat days
    let timeDiff = endDate.getTime() - startDate.getTime();
    let totalDays = Math.floor(timeDiff / (1000 * 3600 * 24));
    
    if (includeEnd) {
        calcDays++;
        totalDays++;
        // Re-balance if adding a day pushes us into a new month
        if (calcDays > getDaysInMonth(endDate.getFullYear(), endDate.getMonth() + 1)) {
            calcDays = 1;
            calcMonths++;
            if (calcMonths === 12) {
                calcMonths = 0;
                calcYears++;
            }
        }
    }

    const totalWeeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;

    // Formatting Output
    let mainTextParts = [];
    if (calcYears > 0) mainTextParts.push(`${calcYears} Year${calcYears !== 1 ? 's' : ''}`);
    if (calcMonths > 0) mainTextParts.push(`${calcMonths} Month${calcMonths !== 1 ? 's' : ''}`);
    if (calcDays > 0 || mainTextParts.length === 0) mainTextParts.push(`${calcDays} Day${calcDays !== 1 ? 's' : ''}`);

    const mainResultText = mainTextParts.join(', ');

    document.getElementById('resultTitle').innerText = "Exact Difference";
    document.getElementById('mainResultText').innerText = mainResultText;

    const extraGrid = document.getElementById('extraStatsGrid');
    extraGrid.innerHTML = `
        <div class="date-box">
            <div class="stat-label">Total Days</div>
            <div class="stat-value">${totalDays.toLocaleString()} Days</div>
        </div>
        <div class="date-box">
            <div class="stat-label">Total Weeks</div>
            <div class="stat-value">${totalWeeks.toLocaleString()} Weeks, ${remainingDays} Days</div>
        </div>
    `;

    document.getElementById('resultBox').style.display = 'block';
}

function calculateAddSub() {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.style.display = 'none';

    const startVal = document.getElementById('addStartDate').value;
    const actionType = document.getElementById('actionType').value;
    
    const years = parseInt(document.getElementById('inputYears').value) || 0;
    const months = parseInt(document.getElementById('inputMonths').value) || 0;
    const weeks = parseInt(document.getElementById('inputWeeks').value) || 0;
    const days = parseInt(document.getElementById('inputDays').value) || 0;

    if (!startVal) {
        showError("Please select a Start Date.");
        return;
    }

    if (years === 0 && months === 0 && weeks === 0 && days === 0) {
        showError("Please enter at least one value (Years, Months, Weeks, or Days) to add or subtract.");
        return;
    }

    let targetDate = new Date(startVal);
    // JS dates created from "YYYY-MM-DD" assume UTC, fixing to local to avoid offset bugs
    targetDate = new Date(targetDate.getTime() + targetDate.getTimezoneOffset() * 60000);

    const multiplier = actionType === 'add' ? 1 : -1;

    // Apply Time
    targetDate.setFullYear(targetDate.getFullYear() + (years * multiplier));
    targetDate.setMonth(targetDate.getMonth() + (months * multiplier));
    targetDate.setDate(targetDate.getDate() + ((weeks * 7 + days) * multiplier));

    // Formatting Output Date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedTarget = targetDate.toLocaleDateString('en-US', options);

    document.getElementById('resultTitle').innerText = "Calculated Target Date";
    document.getElementById('mainResultText').innerText = formattedTarget;

    const extraGrid = document.getElementById('extraStatsGrid');
    extraGrid.innerHTML = `
        <div class="date-box">
            <div class="stat-label">Starting Date Was</div>
            <div class="stat-value" style="font-size: 18px;">${new Date(startVal + 'T00:00').toLocaleDateString('en-US', options)}</div>
        </div>
    `;

    document.getElementById('resultBox').style.display = 'block';
}

function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

function showError(msg) {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.innerText = msg;
    errorMsg.style.display = 'block';
    document.getElementById('resultBox').style.display = 'none';
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
