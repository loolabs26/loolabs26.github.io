// --- Auto Loan Calculator Logic ---

function calculateAutoLoan() {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.style.display = 'none';

    // Get input values
    const vehiclePrice = parseFloat(document.getElementById('autoPrice').value);
    const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
    const tradeIn = parseFloat(document.getElementById('tradeIn').value) || 0;
    const loanTermMonths = parseInt(document.getElementById('loanTerm').value);
    const annualInterestRate = parseFloat(document.getElementById('interestRate').value);
    const salesTaxRate = parseFloat(document.getElementById('salesTax').value) || 0;

    // Validation
    if (isNaN(vehiclePrice) || vehiclePrice <= 0) {
        showError("Please enter a valid Vehicle Price.");
        return;
    }
    if ((downPayment + tradeIn) >= vehiclePrice) {
        showError("Down payment and Trade-in combined cannot be greater than or equal to the vehicle price.");
        return;
    }
    if (isNaN(annualInterestRate) || annualInterestRate < 0) {
        showError("Please enter a valid Interest Rate.");
        return;
    }

    // 1. Calculate Taxable Amount
    // Most states deduct the trade-in value before applying sales tax
    let taxableAmount = vehiclePrice - tradeIn;
    if (taxableAmount < 0) taxableAmount = 0;
    
    const totalSalesTax = taxableAmount * (salesTaxRate / 100);

    // 2. Calculate Total Loan Principal
    // Assuming taxes are rolled into the loan
    const loanPrincipal = vehiclePrice + totalSalesTax - downPayment - tradeIn;

    // 3. Math Engine for Monthly Payment
    let monthlyPayment = 0;
    let totalInterest = 0;

    if (annualInterestRate === 0) {
        // Edge case: 0% APR financing
        monthlyPayment = loanPrincipal / loanTermMonths;
        totalInterest = 0;
    } else {
        // Standard Amortization Formula
        const monthlyInterestRate = (annualInterestRate / 100) / 12;
        const compoundFactor = Math.pow(1 + monthlyInterestRate, loanTermMonths);
        
        monthlyPayment = loanPrincipal * ((monthlyInterestRate * compoundFactor) / (compoundFactor - 1));
        
        const totalPaidOnLoan = monthlyPayment * loanTermMonths;
        totalInterest = totalPaidOnLoan - loanPrincipal;
    }

    // 4. Calculate Total Cost of the Car
    // (Down Payment + Trade In + Total Principal Paid + Total Interest Paid)
    const totalCostOfVehicle = downPayment + tradeIn + loanPrincipal + totalInterest;

    displayAutoResults(monthlyPayment, loanPrincipal, totalInterest, totalSalesTax, totalCostOfVehicle);
}

function showError(msg) {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.innerText = msg;
    errorMsg.style.display = 'block';
    document.getElementById('resultBox').style.display = 'none';
}

function displayAutoResults(monthlyPayment, principal, totalInterest, totalSalesTax, totalCost) {
    // Format as currency
    const formatCurrency = (amount) => {
        return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    document.getElementById('monthlyPayment').innerText = formatCurrency(monthlyPayment);
    document.getElementById('totalLoanAmount').innerText = formatCurrency(principal);
    document.getElementById('totalInterest').innerText = formatCurrency(totalInterest);
    document.getElementById('totalSalesTax').innerText = formatCurrency(totalSalesTax);
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
