function calculateSI() {
    const p = parseFloat(document.getElementById('siPrincipal').value);
    const r = parseFloat(document.getElementById('siRate').value) / 100;
    const timeValue = parseFloat(document.getElementById('siTime').value);
    const timeUnit = document.getElementById('siTimeUnit').value;
    
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.style.display = 'none';

    if(isNaN(p) || isNaN(r) || isNaN(timeValue) || p <= 0 || timeValue <= 0) {
        errorMsg.innerText = "Please enter valid positive numbers for all fields.";
        errorMsg.style.display = 'block';
        return;
    }

    // Convert time to Years based on unit
    let t = 0;
    if (timeUnit === 'years') {
        t = timeValue;
    } else if (timeUnit === 'months') {
        t = timeValue / 12;
    } else if (timeUnit === 'days') {
        t = timeValue / 365;
    }

    // I = P * r * t
    const interest = p * r * t;
    const total = p + interest;

    const fmt = (num) => '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    document.getElementById('resSITotal').innerText = fmt(total);
    document.getElementById('resSIInterest').innerText = "+" + fmt(interest);
    document.getElementById('resSIPrinc').innerText = fmt(p);
    
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
