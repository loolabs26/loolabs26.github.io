// Top 15 Currencies Static Dictionary (Base USD)
const exchangeRates = {
    USD: 1,           // US Dollar
    EUR: 0.92,        // Euro
    GBP: 0.79,        // British Pound
    INR: 83.30,       // Indian Rupee
    JPY: 150.20,      // Japanese Yen
    AUD: 1.53,        // Australian Dollar
    CAD: 1.35,        // Canadian Dollar
    CHF: 0.88,        // Swiss Franc
    CNY: 7.19,        // Chinese Yuan
    HKD: 7.82,        // Hong Kong Dollar
    NZD: 1.63,        // New Zealand Dollar
    SGD: 1.34,        // Singapore Dollar
    SEK: 10.45,       // Swedish Krona
    KRW: 1332.50,     // South Korean Won
    MXN: 17.10        // Mexican Peso
};

function swapCurr() {
    const fromSelect = document.getElementById('currFrom');
    const toSelect = document.getElementById('currTo');
    
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    
    calculateCurr();
}

function calculateCurr() {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.style.display = 'none';

    const amount = parseFloat(document.getElementById('currAmount').value);
    const fromCode = document.getElementById('currFrom').value;
    const toCode = document.getElementById('currTo').value;

    if(isNaN(amount) || amount <= 0) {
        errorMsg.innerText = "Please enter a valid amount greater than zero.";
        errorMsg.style.display = 'block';
        document.getElementById('resultBox').style.display = 'none';
        return;
    }

    // Calculate conversions using USD as the base pivot
    const fromRateToUSD = exchangeRates[fromCode];
    const toRateFromUSD = exchangeRates[toCode];

    // Convert input amount to USD, then to target currency
    const amountInUSD = amount / fromRateToUSD;
    const finalAmount = amountInUSD * toRateFromUSD;

    // Calculate direct 1-to-1 conversion rate for display
    const directRate = (1 / fromRateToUSD) * toRateFromUSD;

    // Formatting
    const formattedAmount = finalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    document.getElementById('resCurrTotal').innerText = `${formattedAmount} ${toCode}`;
    document.getElementById('resCurrRate').innerText = `1 ${fromCode} = ${directRate.toFixed(4)} ${toCode}`;
    
    document.getElementById('resultBox').style.display = 'block';
}

// Global UI Logic
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
        mobileMenuBtn.addEventListener('click', () => { desktopNav.classList.toggle('active'); });
    }
});
