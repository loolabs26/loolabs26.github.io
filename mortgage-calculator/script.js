// --- Mortgage Calculator Logic ---

function calculateMortgage() {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.style.display = 'none';

    const homePrice = parseFloat(document.getElementById('homePrice').value);
    const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
    const loanTermYears = parseFloat(document.getElementById('loanTerm').value);
    const annualInterestRate = parseFloat(document.getElementById('interestRate').value);

    // Validation
    if (isNaN(homePrice) || homePrice <= 0) {
        showError("Please enter a valid Home Price.");
        return;
    }
    if (downPayment >= homePrice) {
        showError("Down payment cannot be greater than or equal to the home price.");
        return;
    }
    if (isNaN(loanTermYears) || loanTermYears <= 0) {
        showError("Please enter a valid Loan Term in years.");
        return;
    }
    if (isNaN(annualInterestRate) || annualInterestRate < 0) {
        showError("Please enter a valid Interest Rate.");
        return;
    }

    // Math Engine
    const principal = homePrice - downPayment;
    const numberOfPayments = loanTermYears * 12;
    let monthlyPayment = 0;
    let totalInterest = 0;
    let totalCost = 0;

    if (annualInterestRate === 0) {
        // Edge case: 0% interest loan
        monthlyPayment = principal / numberOfPayments;
        totalInterest = 0;
        totalCost = principal;
    } else {
        // Standard Amortization Formula
        const monthlyInterestRate = (annualInterestRate / 100) / 12;
        const compoundFactor = Math.pow(1 + monthlyInterestRate, numberOfPayments);
        
        monthlyPayment = principal * ((monthlyInterestRate * compoundFactor) / (compoundFactor - 1));
        
        const totalPaid = monthlyPayment * numberOfPayments;
        totalInterest = totalPaid - principal;
        totalCost = principal + totalInterest;
    }

    displayResults(monthlyPayment, principal, totalInterest, totalCost);
}

function showError(msg) {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.innerText = msg;
    errorMsg.style.display = 'block';
    document.getElementById('resultBox').style.display = 'none';
}

function displayResults(monthlyPayment, principal, totalInterest, totalCost) {
    // Format as currency
    const formatCurrency = (amount) => {
        return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    document.getElementById('monthlyPayment').innerText = formatCurrency(monthlyPayment);
    document.getElementById('principalAmount').innerText = formatCurrency(principal);
    document.getElementById('totalInterest').innerText = formatCurrency(totalInterest);
    document.getElementById('totalCost').innerText = formatCurrency(totalCost);

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
