// --- Live Currency Calculator Logic ---

let apiData = null;
const API_URL = "https://open.er-api.com/v6/latest/USD"; // Reliable open-access API

// Currency Metadata Dictionary (Flags & Symbols)
const currencyMeta = {
    USD: { flag: "🇺🇸", symbol: "$" },
    EUR: { flag: "🇪🇺", symbol: "€" },
    GBP: { flag: "🇬🇧", symbol: "£" },
    INR: { flag: "🇮🇳", symbol: "₹" },
    JPY: { flag: "🇯🇵", symbol: "¥" },
    AUD: { flag: "🇦🇺", symbol: "A$" },
    CAD: { flag: "🇨🇦", symbol: "C$" },
    AED: { flag: "🇦🇪", symbol: "د.إ" },
    SAR: { flag: "🇸🇦", symbol: "﷼" },
    MYR: { flag: "🇲🇾", symbol: "RM" },
    SGD: { flag: "🇸🇬", symbol: "S$" },
    CNY: { flag: "🇨🇳", symbol: "¥" }
};

// Fetch rates once when the page loads
async function fetchRates() {
    try {
        const response = await fetch(API_URL);
        apiData = await response.json();
        
        if (apiData && apiData.result === "success") {
            document.getElementById('loadingMsg').style.display = 'none';
            document.getElementById('resultBox').style.display = 'block';
            document.getElementById('lastUpdate').innerText = new Date(apiData.time_last_update_utc).toLocaleDateString();
            
            // Initial Calculation
            calculate();
        } else {
            throw new Error("API Response Error");
        }
    } catch (error) {
        document.getElementById('loadingMsg').innerHTML = `<span style="color:red;">Error: Could not load live rates. Please refresh.</span>`;
        console.error("Currency Fetch Error:", error);
    }
}

function calculate() {
    if (!apiData) return;

    const amount = parseFloat(document.getElementById('currAmount').value);
    const from = document.getElementById('currFrom').value;
    const to = document.getElementById('currTo').value;

    if (isNaN(amount) || amount <= 0) {
        document.getElementById('resConvertedAmount').innerText = "0.00";
        return;
    }

    // Get rates relative to USD
    const usdToFrom = apiData.rates[from];
    const usdToTarget = apiData.rates[to];

    // Conversion: (Amount / RateFrom) * RateTo
    const converted = (amount / usdToFrom) * usdToTarget;
    const directRate = (1 / usdToFrom) * usdToTarget;

    // Grab the Flag and Symbol for the targeted currency
    const toFlag = currencyMeta[to] ? currencyMeta[to].flag : "";
    const toSymbol = currencyMeta[to] ? currencyMeta[to].symbol : "";
    const fromFlag = currencyMeta[from] ? currencyMeta[from].flag : "";

    // Format the number cleanly
    const formattedAmount = converted.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

    // Display Result with Icons and Symbols
    document.getElementById('resConvertedAmount').innerHTML = `${toFlag} ${toSymbol}${formattedAmount} <span style="font-size: 20px; opacity: 0.8;">${to}</span>`;
    document.getElementById('resExchangeRate').innerText = `${fromFlag} 1 ${from} = ${toFlag} ${directRate.toFixed(4)} ${to}`;
}

function swapCurrencies() {
    const fromSelect = document.getElementById('currFrom');
    const toSelect = document.getElementById('currTo');
    
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    
    calculate();
}

// Event Listeners
document.getElementById('currAmount').addEventListener('input', calculate);
document.getElementById('currFrom').addEventListener('change', calculate);
document.getElementById('currTo').addEventListener('change', calculate);

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    fetchRates();

    // Standard Theme/Mobile Logic
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
