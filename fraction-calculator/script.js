// --- Math Logic for Fraction Calculator ---

// Helper function: Find the Greatest Common Divisor to simplify the fraction
function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    return b === 0 ? a : gcd(b, a % b);
}

function calculateFraction() {
    const num1 = parseInt(document.getElementById('num1').value);
    const den1 = parseInt(document.getElementById('den1').value);
    const num2 = parseInt(document.getElementById('num2').value);
    const den2 = parseInt(document.getElementById('den2').value);
    const operator = document.getElementById('operator').value;
    
    const resNumInput = document.getElementById('resNum');
    const resDenInput = document.getElementById('resDen');
    const decimalOutput = document.getElementById('decimalOutput');
    const resLine = document.getElementById('resLine');

    // Error Handling: Empty inputs or Division by Zero
    if (isNaN(num1) || isNaN(den1) || isNaN(num2) || isNaN(den2)) {
        resNumInput.value = "Error";
        resDenInput.value = "";
        resLine.style.display = "none";
        decimalOutput.innerText = "Please fill all fields.";
        return;
    }
    if (den1 === 0 || den2 === 0) {
        resNumInput.value = "Div by 0";
        resDenInput.value = "";
        resLine.style.display = "none";
        decimalOutput.innerText = "Denominator cannot be zero.";
        return;
    }

    let finalNum = 0;
    let finalDen = 1;

    // Execute the correct math operation
    switch (operator) {
        case "+":
            finalNum = (num1 * den2) + (num2 * den1);
            finalDen = den1 * den2;
            break;
        case "-":
            finalNum = (num1 * den2) - (num2 * den1);
            finalDen = den1 * den2;
            break;
        case "*":
            finalNum = num1 * num2;
            finalDen = den1 * den2;
            break;
        case "/":
            // Division by zero in fraction 2 check
            if (num2 === 0) {
                resNumInput.value = "Div by 0";
                resDenInput.value = "";
                resLine.style.display = "none";
                decimalOutput.innerText = "Cannot divide by a zero fraction.";
                return;
            }
            finalNum = num1 * den2;
            finalDen = den1 * num2;
            break;
    }

    // Simplify the result
    const commonDivisor = gcd(finalNum, finalDen);
    let simNum = finalNum / commonDivisor;
    let simDen = finalDen / commonDivisor;

    // Handle Negative signs (keep them on the numerator)
    if (simDen < 0) {
        simNum = simNum * -1;
        simDen = simDen * -1;
    }

    // Display the Results
    if (simDen === 1 || simNum === 0) {
        // If it's a whole number, hide the bottom part of the fraction
        resNumInput.value = simNum;
        resDenInput.value = "";
        resDenInput.style.display = "none";
        resLine.style.display = "none";
    } else {
        // Display full fraction
        resNumInput.value = simNum;
        resDenInput.value = simDen;
        resDenInput.style.display = "block";
        resLine.style.display = "block";
    }

    // Calculate Decimal value
    const decimalValue = finalNum / finalDen;
    // Format decimal to 4 places max if it's a long string
    const formattedDecimal = Number.isInteger(decimalValue) ? decimalValue : decimalValue.toFixed(4).replace(/\.?0+$/, '');
    
    decimalOutput.innerText = `Decimal format: ${formattedDecimal}`;
}

// --- Global UI Logic (Dark Mode & Mobile Menu) ---
document.addEventListener('DOMContentLoaded', () => {
    
    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggleBtn.querySelector('i');

    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    if(themeToggleBtn) {
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

    // Mobile Menu Toggle Logic
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const desktopNav = document.querySelector('.desktop-nav');

    if(mobileMenuBtn && desktopNav) {
        mobileMenuBtn.addEventListener('click', () => {
            desktopNav.classList.toggle('active');
        });
    }
});
