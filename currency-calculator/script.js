// --- High-Performance Live Currency Calculator Logic ---

let apiData = null;
const API_URL = "https://open.er-api.com/v6/latest/USD";
const CACHE_KEY = "looLabsCurrencyCache";

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

async function fetchRates() {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const nowUnix = Math.floor(Date.now() / 1000);

    // 1. Check if we have cached data and if it is still valid
    if (cachedData) {
        const parsedCache = JSON.parse(cachedData);
        // If current time is LESS than the API's next update time, use the cache
        if (nowUnix < parsedCache.time_next_update_unix) {
            apiData = parsedCache;
            updateUIReady();
            return; // Exit function, no need to fetch!
        }
    }

    // 2. If no cache or cache is expired, fetch fresh data
    try {
        const response = await fetch(API_URL);
        apiData = await response.json();
        
        if (apiData && apiData.result === "success") {
            // Save to browser cache for next time
            localStorage.setItem(CACHE_KEY, JSON.stringify(apiData));
            updateUIReady();
        } else {
            throw new Error("API Response Error");
        }
    } catch (error) {
        // Fallback: If fetch fails but we have old cached data, use it anyway so the tool doesn't break
        if (cachedData) {
            apiData = JSON.parse(cachedData);
            updateUIReady();
            document.getElementById('loadingMsg').innerHTML = `<span style="color:#f39c12;">Warning: Using offline rates. Could not connect to live server.</span>`;
        } else {
            document.getElementById('loadingMsg').innerHTML = `<span style="color:red;">Error: Could not load live rates. Please check your internet connection.</span>`;
        }
    }
}

// Helper to remove loading state and run first calculation
function updateUIReady() {
    document.getElementById('loadingMsg').style.display = 'none';
    document.getElementById('resultBox').style.display = 'block';
    
    // Convert UTC string to local readable date
    const lastUpdateDate = new Date(apiData.time_last_update_utc).toLocaleDateString();
    document.getElementById('lastUpdate').innerText = lastUpdateDate;
    
    calculate();
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

    // Conversion logic
    const converted = (amount / usdToFrom) * usdToTarget;
    const directRate = (1 / usdToFrom) * usdToTarget;

    // Grab the Flag and Symbol
    const toFlag = currencyMeta[to] ? currencyMeta[to].flag : "";
    const toSymbol = currencyMeta[to] ? currencyMeta[to].symbol : "";
    const fromFlag = currencyMeta[from] ? currencyMeta[from].flag : "";

    // Format the number cleanly
    const formattedAmount = converted.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

    // Display Result
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
