// --- Statistics Calculator Logic ---

function calculateStatistics() {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.style.display = 'none';

    const rawInput = document.getElementById('dataInput').value;

    // 1. Parse Input: Split by commas, spaces, or newlines
    // Filter out empty strings, then convert to Number, then filter out NaNs
    let dataArray = rawInput
        .split(/[\s,]+/)
        .filter(item => item.trim() !== '')
        .map(Number)
        .filter(num => !isNaN(num));

    if (dataArray.length === 0) {
        showError("Please enter at least one valid number.");
        return;
    }

    // Sort the array in ascending order for Median, Range, Min, Max
    dataArray.sort((a, b) => a - b);
    const count = dataArray.length;

    // 2. Calculate Sum & Mean
    const sum = dataArray.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;

    // 3. Calculate Median
    let median = 0;
    const midIndex = Math.floor(count / 2);
    if (count % 2 === 0) {
        // Even number of items: average the two middle numbers
        median = (dataArray[midIndex - 1] + dataArray[midIndex]) / 2;
    } else {
        // Odd number of items: take the middle number
        median = dataArray[midIndex];
    }

    // 4. Calculate Mode using a frequency map
    const frequencyMap = {};
    let maxFreq = 0;

    dataArray.forEach(num => {
        frequencyMap[num] = (frequencyMap[num] || 0) + 1;
        if (frequencyMap[num] > maxFreq) {
            maxFreq = frequencyMap[num];
        }
    });

    let modes = [];
    for (const key in frequencyMap) {
        if (frequencyMap[key] === maxFreq) {
            modes.push(Number(key)); // Convert key back to number
        }
    }

    // If every number appears exactly the same amount of times (e.g., once), there is no true mode
    let modeString = "";
    if (modes.length === count) {
        modeString = "None";
    } else {
        // Sort modes for clean display and join with commas
        modeString = modes.sort((a, b) => a - b).join(", ");
    }

    // 5. Calculate Min, Max, Range
    const min = dataArray[0];
    const max = dataArray[count - 1];
    const range = max - min;

    // Display Results
    displayResults(mean, median, modeString, range, count, sum, min, max, dataArray);
}

function showError(msg) {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.innerText = msg;
    errorMsg.style.display = 'block';
    document.getElementById('resultBox').style.display = 'none';
}

function displayResults(mean, median, mode, range, count, sum, min, max, sortedArr) {
    // Format helper to limit deep decimals to max 4 places cleanly
    const formatNum = (num) => {
        return Number.isInteger(num) ? num : parseFloat(num.toFixed(4));
    };

    document.getElementById('resMean').innerText = formatNum(mean);
    document.getElementById('resMedian').innerText = formatNum(median);
    document.getElementById('resMode').innerText = mode;
    document.getElementById('resRange').innerText = formatNum(range);
    
    document.getElementById('resCount').innerText = count;
    document.getElementById('resSum').innerText = formatNum(sum);
    document.getElementById('resMinMax').innerText = `${formatNum(min)} / ${formatNum(max)}`;
    
    document.getElementById('resSortedData').innerText = sortedArr.join(", ");

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
