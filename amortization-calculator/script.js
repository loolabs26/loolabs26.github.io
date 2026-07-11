// --- Amortization Calculator Logic with Chart.js ---

const fmt = (num) => '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
let amortizationChartInstance = null;
let scheduleData = []; // Store data for table toggling

// Initialize Date Picker to Current Month
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    const datePicker = document.getElementById('amrtStartDate');
    if (datePicker) {
        datePicker.value = `${yyyy}-${mm}`;
    }
});

function calculateAmortization() {
    const principalInput = parseFloat(document.getElementById('amrtPrincipal').value);
    const years = parseFloat(document.getElementById('amrtYears').value);
    const rate = parseFloat(document.getElementById('amrtRate').value);
    const extra = parseFloat(document.getElementById('amrtExtra').value) || 0;
    const startDateVal = document.getElementById('amrtStartDate').value;

    const errorMsg = document.getElementById('errorMessage');
    errorMsg.style.display = 'none';

    if (isNaN(principalInput) || isNaN(years) || isNaN(rate) || principalInput <= 0 || years <= 0) {
        errorMsg.innerText = "Please enter valid positive numbers for Loan Amount, Years, and Rate.";
        errorMsg.style.display = 'block';
        return;
    }

    // Mathematical Setup
    const p = principalInput;
    const r = (rate / 100) / 12; // Monthly interest rate
    const n = years * 12; // Total months

    // Standard Monthly Payment Formula
    // M = P [ r(1 + r)^n ] / [ (1 + r)^n - 1]
    let m = 0;
    if (r === 0) {
        m = p / n; // 0% interest edge case
    } else {
        m = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const actualMonthlyPayment = m + extra;
    let balance = p;
    let totalInterest = 0;
    
    // Setup Date Object
    let currentDate = new Date();
    if (startDateVal) {
        const parts = startDateVal.split('-');
        currentDate = new Date(parts[0], parts[1] - 1, 1);
    }

    // Reset Data Arrays
    scheduleData = [];
    const chartLabels = [];
    const chartBalanceData = [];
    const chartInterestData = [];

    // Loop through schedule
    let monthCount = 0;
    while (balance > 0.01 && monthCount < (n * 2)) { // Safe limit to prevent infinite loops on weird inputs
        monthCount++;
        
        let interestForMonth = balance * r;
        let principalForMonth = actualMonthlyPayment - interestForMonth;

        // Final payment edge case
        if (balance < principalForMonth) {
            principalForMonth = balance;
        }

        balance -= principalForMonth;
        totalInterest += interestForMonth;

        // Format Date
        const dateStr = currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        // Store Data
        scheduleData.push({
            monthNum: monthCount,
            dateStr: dateStr,
            year: currentDate.getFullYear(),
            payment: principalForMonth + interestForMonth,
            principal: principalForMonth,
            interest: interestForMonth,
            totalInterest: totalInterest,
            balance: balance > 0 ? balance : 0
        });

        // Add to Chart Data (Every 12 months or final month for cleaner graph)
        if (monthCount % 12 === 0 || balance <= 0) {
            chartLabels.push(currentDate.getFullYear());
            chartBalanceData.push(balance > 0 ? balance : 0);
            chartInterestData.push(totalInterest);
        }

        // Increment Date
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Render Outputs
    document.getElementById('resMonthlyPayment').innerText = fmt(m);
    
    if (extra > 0) {
        document.getElementById('resExtraNote').innerHTML = `+ ${fmt(extra)} extra = <strong>${fmt(m + extra)}/mo</strong>`;
    } else {
        document.getElementById('resExtraNote').innerHTML = "Pure Principal & Interest";
    }

    document.getElementById('resTotalPrincipal').innerText = fmt(p);
    document.getElementById('resTotalInterest').innerText = fmt(totalInterest);
    document.getElementById('resPayoffDate').innerText = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    renderChart(chartLabels, chartBalanceData, chartInterestData);
    renderTable(); // Renders HTML table

    document.getElementById('resultBox').style.display = 'block';
}

function renderChart(labels, balanceData, interestData) {
    const ctx = document.getElementById('amortizationChart').getContext('2d');
    
    // Check dark mode for text colors
    const isDark = document.body.classList.contains('dark-mode');
    const textColor = isDark ? '#ffffff' : '#333333';
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

    if (amortizationChartInstance) {
        amortizationChartInstance.destroy();
    }

    amortizationChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Remaining Balance',
                    data: balanceData,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Total Interest Paid',
                    data: interestData,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { labels: { color: textColor, font: { family: 'Poppins' } } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) { label += ': '; }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: { ticks: { color: textColor }, grid: { color: gridColor } },
                y: { 
                    ticks: { 
                        color: textColor,
                        callback: function(value) { return '$' + (value / 1000) + 'k'; }
                    }, 
                    grid: { color: gridColor } 
                }
            }
        }
    });
}

function renderTable() {
    const view = document.getElementById('tableViewToggle').value;
    const tbody = document.getElementById('scheduleBody');
    tbody.innerHTML = '';

    if (scheduleData.length === 0) return;

    if (view === 'monthly') {
        // Render every single month
        scheduleData.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.dateStr}</td>
                <td>${fmt(row.payment)}</td>
                <td>${fmt(row.principal)}</td>
                <td style="color: #e74c3c;">${fmt(row.interest)}</td>
                <td>${fmt(row.totalInterest)}</td>
                <td style="color: #3498db; font-weight: 700;">${fmt(row.balance)}</td>
            `;
            tbody.appendChild(tr);
        });
    } else {
        // Aggregate by Year
        let yearlyData = {};
        scheduleData.forEach(row => {
            if (!yearlyData[row.year]) {
                yearlyData[row.year] = { year: row.year, payment: 0, principal: 0, interest: 0, totalInterest: row.totalInterest, balance: row.balance };
            }
            yearlyData[row.year].payment += row.payment;
            yearlyData[row.year].principal += row.principal;
            yearlyData[row.year].interest += row.interest;
            yearlyData[row.year].totalInterest = row.totalInterest; // Takes last month of year
            yearlyData[row.year].balance = row.balance; // Takes last month of year
        });

        Object.values(yearlyData).forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.year}</td>
                <td>${fmt(row.payment)}</td>
                <td>${fmt(row.principal)}</td>
                <td style="color: #e74c3c;">${fmt(row.interest)}</td>
                <td>${fmt(row.totalInterest)}</td>
                <td style="color: #3498db; font-weight: 700;">${fmt(row.balance)}</td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// Global UI Logic (Dark Mode, Mobile Menu, Auto-Year)
document.addEventListener('DOMContentLoaded', () => {
    // 1. Live Year Badges
    const currentYear = new Date().getFullYear();
    const liveBadges = document.querySelectorAll('.live-year-badge');
    liveBadges.forEach(badge => { badge.innerText = `Updated for ${currentYear}`; });
    
    const copyrightElements = document.querySelectorAll('.copyright');
    copyrightElements.forEach(el => { el.innerHTML = `&copy; 2026 - ${currentYear} <a href="https://loolabs.xyz/">loolabs.xyz</a>`; });

    // 2. Theme Toggle (Will also re-render chart to update colors)
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
            // Re-render chart to fix grid/text colors if calculator has been run
            if (amortizationChartInstance) { calculateAmortization(); }
        });
    }

    // 3. Mobile Menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const desktopNav = document.querySelector('.desktop-nav');
    if(mobileMenuBtn && desktopNav) {
        mobileMenuBtn.addEventListener('click', () => { desktopNav.classList.toggle('active'); });
    }

    // 4. AUTO-LOAD RESULTS ON PAGE LOAD!
    calculateAmortization(); 
});
