// --- Discount Calculator Logic ---

function calculateDiscount() {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.style.display = 'none';

    // Get input values
    const originalPrice = parseFloat(document.getElementById('originalPrice').value);
    const discountPercent = parseFloat(document.getElementById('discountPercent').value) || 0;
    const taxPercent = parseFloat(document.getElementById('taxPercent').value) || 0;

    // Validation
    if (isNaN(originalPrice) || originalPrice <= 0) {
        showError("Please enter a valid Original Price greater than 0.");
        return;
    }
    if (discountPercent < 0 || discountPercent > 100) {
        showError("Please enter a valid Discount percentage between 0 and 100.");
        return;
    }
    if (taxPercent < 0) {
        showError("Sales tax cannot be negative.");
        return;
    }

    // 1. Calculate the Savings and New Price
    const amountSaved = originalPrice * (discountPercent / 100);
    const discountedPrice = originalPrice - amountSaved;

    // 2. Apply Sales Tax to the Discounted Price
    const taxAmount = discountedPrice * (taxPercent / 100);
    const finalPrice = discountedPrice + taxAmount;

    displayDiscountResults(finalPrice, amountSaved, discountedPrice, taxAmount);
}

function showError(msg) {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.innerText = msg;
    errorMsg.style.display = 'block';
    document.getElementById('resultBox').style.display = 'none';
}

function displayDiscountResults(finalPrice, amountSaved, discountedPrice, taxAmount) {
    const resultBox = document.getElementById('resultBox');

    // Format currency helper
    const formatCurrency = (amount) => {
        return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Update Text Elements
    document.getElementById('finalPrice').innerText = formatCurrency(finalPrice);
    document.getElementById('amountSaved').innerText = formatCurrency(amountSaved);
    document.getElementById('discountedPrice').innerText = formatCurrency(discountedPrice);
    document.getElementById('taxAmount').innerText = formatCurrency(taxAmount);

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
