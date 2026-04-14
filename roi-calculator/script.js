// --- ROI Calculator Logic ---

function calculateROI() {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.style.display = 'none';

    // Get input values
    const amountInvested = parseFloat(document.getElementById('amountInvested').value);
    const amountReturned = parseFloat(document.getElementById('amountReturned').value);
    const investmentTime = parseFloat(document.getElementById('investmentTime').value);

    // Validation
    if (isNaN(amountInvested) || amountInvested <= 0) {
        showError("Please enter a valid Amount Invested greater than 0.");
        return;
    }
    if (isNaN(amountReturned) || amountReturned < 0) {
        showError("Please enter a valid Amount Returned.");
        return;
    }

    // 1. Calculate Net Profit & Basic ROI
    const netProfit = amountReturned - amountInvested;
    const roiPercentage = (netProfit / amountInvested) * 100;

    // 2. Calculate Annualized ROI (CAGR) if time is provided
    let annualizedROI = null;
    if (!isNaN(investmentTime) && investmentTime > 0) {
        // Annualized ROI Formula: ((Final Value / Initial Value) ^ (1 / Years)) - 1
        annualizedROI = (Math.pow((amountReturned / amountInvested), (1 / investmentTime)) - 1) * 100;
    }

    displayROIResults(roiPercentage, netProfit, annualizedROI);
}

function showError(msg) {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.innerText = msg;
    errorMsg.style.display = 'block';
    document.getElementById('resultBox').style.display = 'none';
}

function displayROIResults(roiPct, netProfit, annualizedROI) {
    const resultBox = document.getElementById('resultBox');
    const roiMainBox = document.getElementById('roiMainBox');
    const netProfitEl = document.getElementById('netProfit');
    const roiPercentageEl = document.getElementById('roiPercentage');
    const annualizedEl = document.getElementById('annualizedROI');

    // Format currency and percentages
    const formatCurrency = (amount) => {
        // Handle negative signs correctly for currency: -$500 instead of $-500
        const isNegative = amount < 0;
        const absAmount = Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return isNegative ? `-$${absAmount}` : `$${absAmount}`;
    };

    const formatPct = (amount) => {
        return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
    };

    // Update Text
    roiPercentageEl.innerText = formatPct(roiPct);
    netProfitEl.innerText = formatCurrency(netProfit);

    if (annualizedROI !== null) {
        annualizedEl.innerText = formatPct(annualizedROI);
    } else {
        annualizedEl.innerText = "-";
    }

    // Apply Color Coding (Profit vs Loss)
    if (netProfit >= 0) {
        roiMainBox.classList.remove('loss');
        roiMainBox.classList.add('profit');
        netProfitEl.classList.remove('loss-text');
        netProfitEl.classList.add('profit-text');
    } else {
        roiMainBox.classList.remove('profit');
        roiMainBox.classList.add('loss');
        netProfitEl.classList.remove('profit-text');
        netProfitEl.classList.add('loss-text');
    }

    resultBox.style.display = 'block';
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
