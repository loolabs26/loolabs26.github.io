// --- Math Logic for Random Number Generator ---

function generateRandom() {
    const minInput = document.getElementById('minInput').value;
    const maxInput = document.getElementById('maxInput').value;
    const countInput = document.getElementById('countInput').value;
    const allowDuplicates = document.getElementById('allowDuplicates').checked;
    
    const errorMsg = document.getElementById('errorMessage');
    const resultOutput = document.getElementById('resultOutput');

    // Reset error UI
    errorMsg.style.display = 'none';
    errorMsg.innerText = '';
    
    // Parse to Integers
    const min = parseInt(minInput);
    const max = parseInt(maxInput);
    let count = parseInt(countInput);

    // Validation
    if (isNaN(min) || isNaN(max) || isNaN(count)) {
        showError("Please enter valid numbers in all fields.");
        return;
    }

    if (min > max) {
        showError("Minimum value cannot be greater than the Maximum value.");
        return;
    }

    if (count < 1) {
        showError("You must generate at least 1 number.");
        return;
    }
    
    // Cap the generation to prevent browser freezing
    if (count > 10000) {
        count = 10000;
        document.getElementById('countInput').value = 10000;
    }

    // Logic for Unique Numbers
    if (!allowDuplicates) {
        const rangeSize = (max - min) + 1;
        if (count > rangeSize) {
            showError(`Cannot generate ${count} unique numbers in a range of ${rangeSize}. Please allow duplicates or expand your range.`);
            return;
        }

        // Generate unique set
        let uniqueNumbers = new Set();
        while (uniqueNumbers.size < count) {
            const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
            uniqueNumbers.add(randomNum);
        }
        
        // Convert Set to Array for display
        const resultArray = Array.from(uniqueNumbers);
        displayResults(resultArray);
        
    } else {
        // Generate with duplicates allowed
        let results = [];
        for (let i = 0; i < count; i++) {
            const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
            results.push(randomNum);
        }
        displayResults(results);
    }
}

// Helper to handle the UI display
function displayResults(numbersArray) {
    const resultOutput = document.getElementById('resultOutput');
    
    // If it's a huge list, shrink the font so it fits better
    if (numbersArray.length > 5) {
        resultOutput.style.fontSize = "20px";
        resultOutput.style.textAlign = "left";
    } else {
        resultOutput.style.fontSize = "32px";
        resultOutput.style.textAlign = "center";
    }

    // Join the numbers with a comma and space
    resultOutput.innerText = numbersArray.join(', ');
}

function showError(msg) {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.innerText = msg;
    errorMsg.style.display = 'block';
    document.getElementById('resultOutput').innerText = 'Error';
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
