// --- Period & Ovulation Calculator Logic ---

function calculatePeriod() {
    const lastDateInput = document.getElementById('perLastDate').value;
    const cycle = parseInt(document.getElementById('perCycle').value);
    const duration = parseInt(document.getElementById('perDuration').value);

    const errorMsg = document.getElementById('errorMessage');
    errorMsg.style.display = 'none';

    // Validation
    if (!lastDateInput || isNaN(cycle) || isNaN(duration) || cycle < 20 || cycle > 45 || duration < 1 || duration > 14) {
        errorMsg.innerText = "Please enter valid dates and typical cycle parameters (Cycle: 20-45 days, Period: 1-14 days).";
        errorMsg.style.display = 'block';
        return;
    }

    const lastPeriodDate = new Date(lastDateInput);
    
    // 1. Calculate Next Period Start
    const nextPeriodStart = new Date(lastPeriodDate);
    nextPeriodStart.setDate(lastPeriodDate.getDate() + cycle);

    // 2. Calculate Next Period End
    const nextPeriodEnd = new Date(nextPeriodStart);
    nextPeriodEnd.setDate(nextPeriodStart.getDate() + duration - 1); 

    // 3. Calculate Ovulation (Luteal phase is consistently ~14 days before next period)
    const ovulationDate = new Date(nextPeriodStart);
    ovulationDate.setDate(nextPeriodStart.getDate() - 14);

    // 4. Calculate Fertile Window (5 days before ovulation to 1 day after)
    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(ovulationDate.getDate() - 5);
    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(ovulationDate.getDate() + 1);

    // Formatter helpers
    const fullDateOpt = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    const shortDateOpt = { month: 'short', day: 'numeric' };

    // Update DOM UI
    document.getElementById('resNextPeriod').innerText = nextPeriodStart.toLocaleDateString('en-US', fullDateOpt);
    document.getElementById('resPeriodEnd').innerText = nextPeriodEnd.toLocaleDateString('en-US', fullDateOpt);
    
    document.getElementById('resOvulation').innerText = ovulationDate.toLocaleDateString('en-US', shortDateOpt);
    document.getElementById('resFertile').innerText = `${fertileStart.toLocaleDateString('en-US', shortDateOpt)} to ${fertileEnd.toLocaleDateString('en-US', shortDateOpt)}`;

    document.getElementById('resultBox').style.display = 'block';
}

// Global UI Logic (Dark Mode, Mobile Menu, Auto-Year)
document.addEventListener('DOMContentLoaded', () => {
    // 1. Live Year Badges
    const currentYear = new Date().getFullYear();
    const liveBadges = document.querySelectorAll('.live-year-badge');
    liveBadges.forEach(badge => { badge.innerText = `Updated for ${currentYear}`; });
    
    const copyrightElements = document.querySelectorAll('.copyright');
    copyrightElements.forEach(el => { el.innerHTML = `&copy; 2026 - ${currentYear} <a href="https://loolabs.xyz/">loolabs.xyz</a>`; });

    // 2. Theme Toggle
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

    // 3. Mobile Menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const desktopNav = document.querySelector('.desktop-nav');
    if(mobileMenuBtn && desktopNav) {
        mobileMenuBtn.addEventListener('click', () => { desktopNav.classList.toggle('active'); });
    }

    // 4. Set Default Date to roughly 20 days ago so the outputs look realistic today
    const dateInput = document.getElementById('perLastDate');
    if (dateInput) {
        const today = new Date();
        today.setDate(today.getDate() - 20); // Simulates a period 3 weeks ago
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }

    // 5. AUTO-LOAD RESULTS ON PAGE LOAD!
    calculatePeriod(); 
});
