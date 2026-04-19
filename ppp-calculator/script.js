// --- Purchasing Power Parity (PPP) Logic ---

// World Bank Implied PPP Conversion Factors (Local Currency Units per International Dollar)
// The base is the United States (USD = 1.0)
// This data allows comparison of true cost of living across borders.
const pppData = {
    "US": { name: "United States", currency: "USD", flag: "🇺🇸", ppp: 1.0 },
    "IN": { name: "India", currency: "INR", flag: "🇮🇳", ppp: 23.83 },
    "GB": { name: "United Kingdom", currency: "GBP", flag: "🇬🇧", ppp: 0.69 },
    "DE": { name: "Germany", currency: "EUR", flag: "🇩🇪", ppp: 0.74 },
    "FR": { name: "France", currency: "EUR", flag: "🇫🇷", ppp: 0.73 },
    "CA": { name: "Canada", currency: "CAD", flag: "🇨🇦", ppp: 1.25 },
    "AU": { name: "Australia", currency: "AUD", flag: "🇦🇺", ppp: 1.45 },
    "JP": { name: "Japan", currency: "JPY", flag: "🇯🇵", ppp: 90.50 },
    "CN": { name: "China", currency: "CNY", flag: "🇨🇳", ppp: 4.18 },
    "BR": { name: "Brazil", currency: "BRL", flag: "🇧🇷", ppp: 2.50 },
    "MX": { name: "Mexico", currency: "MXN", flag: "🇲🇽", ppp: 9.60 },
    "ZA": { name: "South Africa", currency: "ZAR", flag: "🇿🇦", ppp: 7.20 },
    "KR": { name: "South Korea", currency: "KRW", flag: "🇰🇷", ppp: 870.0 },
    "CH": { name: "Switzerland", currency: "CHF", flag: "🇨🇭", ppp: 1.12 },
    "SG": { name: "Singapore", currency: "SGD", flag: "🇸🇬", ppp: 0.85 },
    "AE": { name: "United Arab Emirates", currency: "AED", flag: "🇦🇪", ppp: 2.10 },
    "SA": { name: "Saudi Arabia", currency: "SAR", flag: "🇸🇦", ppp: 1.60 },
    "MY": { name: "Malaysia", currency: "MYR", flag: "🇲🇾", ppp: 1.70 },
    "ID": { name: "Indonesia", currency: "IDR", flag: "🇮🇩", ppp: 4800.0 },
    "PH": { name: "Philippines", currency: "PHP", flag: "🇵🇭", ppp: 19.50 },
    "VN": { name: "Vietnam", currency: "VND", flag: "🇻🇳", ppp: 7500.0 },
    "NG": { name: "Nigeria", currency: "NGN", flag: "🇳🇬", ppp: 160.0 },
    "EG": { name: "Egypt", currency: "EGP", flag: "🇪🇬", ppp: 6.50 },
    "TR": { name: "Turkey", currency: "TRY", flag: "🇹🇷", ppp: 6.20 },
    "IT": { name: "Italy", currency: "EUR", flag: "🇮🇹", ppp: 0.65 },
    "ES": { name: "Spain", currency: "EUR", flag: "🇪🇸", ppp: 0.60 }
};

function populateDropdowns() {
    const fromSelect = document.getElementById('pppFrom');
    const toSelect = document.getElementById('pppTo');
    
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';
    
    // Sort alphabetically by country name
    const sortedKeys = Object.keys(pppData).sort((a, b) => pppData[a].name.localeCompare(pppData[b].name));
    
    sortedKeys.forEach(key => {
        const data = pppData[key];
        const optionHTML = `<option value="${key}">${data.flag} ${data.name} (${data.currency})</option>`;
        fromSelect.insertAdjacentHTML('beforeend', optionHTML);
        toSelect.insertAdjacentHTML('beforeend', optionHTML);
    });

    // Set Defaults
    fromSelect.value = "US";
    toSelect.value = "IN";
}

function swapPPP() {
    const fromSelect = document.getElementById('pppFrom');
    const toSelect = document.getElementById('pppTo');
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    calculatePPP();
}

function calculatePPP() {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.style.display = 'none';

    const amount = parseFloat(document.getElementById('pppAmount').value);
    const fromCode = document.getElementById('pppFrom').value;
    const toCode = document.getElementById('pppTo').value;

    if (isNaN(amount) || amount <= 0) {
        errorMsg.innerText = "Please enter a valid salary/amount greater than zero.";
        errorMsg.style.display = 'block';
        document.getElementById('resultBox').style.display = 'none';
        return;
    }

    const fromData = pppData[fromCode];
    const toData = pppData[toCode];

    // Equivalent Salary Formula: Amount * (Target PPP / Source PPP)
    const equivalentAmount = amount * (toData.ppp / fromData.ppp);
    
    // Cost of Living Difference (relative purchasing power ratio)
    let colText = "";
    const ratio = toData.ppp / fromData.ppp;
    
    // Calculate how much "cheaper" or "more expensive" the target country is relative to its currency base
    // To make this easily understandable for users, we simply compare the PPP ratio directly to 1 (parity)
    // Actually, comparing the ratio of PPPs tells us the multiplier.
    if (fromCode === toCode) {
        colText = "Cost of living is identical.";
    } else {
        colText = `${toData.name} requires a multiplier of ${ratio.toFixed(2)}x to maintain the same purchasing power as in ${fromData.name}.`;
    }

    // Format Outputs
    const fmtAmountOriginal = amount.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0});
    const fmtAmountTarget = equivalentAmount.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0});

    document.getElementById('resEquivalentTotal').innerHTML = `${toData.flag} ${fmtAmountTarget} <span style="font-size: 20px; opacity: 0.8;">${toData.currency}</span>`;
    document.getElementById('resCurrencyName').innerText = `Equivalent value in ${toData.name}`;
    
    document.getElementById('resColDiff').innerText = ratio.toFixed(2) + "x";
    document.getElementById('resFactor').innerText = `${toData.ppp} / ${fromData.ppp}`;

    document.getElementById('resSummaryText').innerHTML = `To have the exact same purchasing power as <strong>${fmtAmountOriginal} ${fromData.currency}</strong> in ${fromData.name}, you would need to earn exactly <strong>${fmtAmountTarget} ${toData.currency}</strong> in ${toData.name}.`;

    document.getElementById('resultBox').style.display = 'block';
}

// Global UI Logic & Initialization
document.addEventListener('DOMContentLoaded', () => {
    populateDropdowns();

    // Auto-update live year badges (The snippet we discussed!)
    const currentYear = new Date().getFullYear();
    const liveBadges = document.querySelectorAll('.live-year-badge');
    liveBadges.forEach(badge => { badge.innerText = `Updated for ${currentYear}`; });
    
    const copyrightElements = document.querySelectorAll('.copyright');
    copyrightElements.forEach(el => { el.innerHTML = `&copy; 2026 - ${currentYear} <a href="https://loolabs.xyz/">loolabs.xyz</a>`; });

    // Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    if(themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const icon = themeToggleBtn.querySelector('i');
            icon.classList.toggle('fa-moon');
            icon.classList.toggle('fa-sun');
        });
    }
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if(mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            document.querySelector('.desktop-nav').classList.toggle('active');
        });
    }
});
