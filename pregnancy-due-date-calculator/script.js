// --- Pregnancy Due Date Calculator Logic ---

function togglePregnancyInputs() {
    const method = document.getElementById('pregMethod').value;
    const label = document.getElementById('pregDateLabel');
    const cycleContainer = document.getElementById('cycleLengthContainer');

    if (method === 'lmp') {
        label.innerText = "First Day of Last Period";
        cycleContainer.style.display = 'block';
    } else {
        label.innerText = "Exact Date of Conception";
        cycleContainer.style.display = 'none';
    }
    
    calculateDueDate();
}

function calculateDueDate() {
    const method = document.getElementById('pregMethod').value;
    const dateInput = document.getElementById('pregDate').value;
    const cycleInput = parseInt(document.getElementById('pregCycle').value);

    const errorMsg = document.getElementById('errorMessage');
    errorMsg.style.display = 'none';

    if (!dateInput) {
        errorMsg.innerText = "Please select a valid date.";
        errorMsg.style.display = 'block';
        return;
    }

    if (method === 'lmp' && (isNaN(cycleInput) || cycleInput < 20 || cycleInput > 45)) {
        errorMsg.innerText = "Please enter a valid cycle length between 20 and 45 days.";
        errorMsg.style.display = 'block';
        return;
    }

    const inputDate = new Date(dateInput);
    let dueDate = new Date(inputDate);
    let conceptionDate = new Date();
    let lmpDate = new Date();

    // Clinical Logic
    if (method === 'lmp') {
        // Naegele's rule adjusted for cycle length: LMP + 280 days + (Cycle - 28)
        const cycleAdjustment = cycleInput - 28;
        dueDate.setDate(inputDate.getDate() + 280 + cycleAdjustment);
        
        conceptionDate = new Date(inputDate);
        conceptionDate.setDate(inputDate.getDate() + 14 + cycleAdjustment);
        
        lmpDate = new Date(inputDate);
    } else {
        // Conception: EDD is Conception + 266 days
        dueDate.setDate(inputDate.getDate() + 266);
        
        conceptionDate = new Date(inputDate);
        // Medical LMP is considered 14 days before conception
        lmpDate = new Date(inputDate);
        lmpDate.setDate(inputDate.getDate() - 14);
    }

    // Gestational Age Math
    const today = new Date();
    today.setHours(0,0,0,0);
    dueDate.setHours(0,0,0,0);
    lmpDate.setHours(0,0,0,0);

    const diffTime = today.getTime() - lmpDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    let weeks = Math.floor(diffDays / 7);
    let extraDays = diffDays % 7;
    let trimester = "";

    // Status logic
    if (diffDays < 0) {
        weeks = 0; extraDays = 0;
        trimester = "Not biologically pregnant yet.";
    } else if (diffDays > 294) { // Post 42 weeks
        weeks = 42; extraDays = 0;
        trimester = "Postterm (Overdue)";
    } else {
        if (weeks < 14) trimester = "First Trimester";
        else if (weeks < 28) trimester = "Second Trimester";
        else trimester = "Third Trimester";
    }

    // Milestones
    const endT1 = new Date(lmpDate); endT1.setDate(lmpDate.getDate() + (13 * 7) + 6);
    const endT2 = new Date(lmpDate); endT2.setDate(lmpDate.getDate() + (27 * 7) + 6);
    const fullTerm = new Date(lmpDate); fullTerm.setDate(lmpDate.getDate() + (39 * 7));

    // Formatter Helpers
    const fullDateOpt = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    const shortDateOpt = { month: 'long', day: 'numeric', year: 'numeric' };

    // Update UI
    document.getElementById('resDueDate').innerText = dueDate.toLocaleDateString('en-US', fullDateOpt);
    document.getElementById('resConception').innerText = conceptionDate.toLocaleDateString('en-US', shortDateOpt);
    document.getElementById('resTrimester').innerText = trimester;
    
    if (diffDays < 0) {
        document.getElementById('resGestationalAge').innerText = "Date indicates conception has not occurred yet.";
    } else {
        document.getElementById('resGestationalAge').innerText = `You are exactly ${weeks} Weeks and ${extraDays} Days pregnant.`;
    }

    // Table Updates
    document.getElementById('resEndT1').innerText = endT1.toLocaleDateString('en-US', shortDateOpt);
    document.getElementById('resEndT2').innerText = endT2.toLocaleDateString('en-US', shortDateOpt);
    document.getElementById('resFullTerm').innerText = fullTerm.toLocaleDateString('en-US', shortDateOpt);

    document.getElementById('resultBox').style.display = 'block';
}

// Global UI Logic (Dark Mode, Mobile Menu, Auto-Year, Default Dates)
document.addEventListener('DOMContentLoaded', () => {
    // 1. Live Year Badges
    const currentYear = new Date().getFullYear();
    const liveBadges = document.querySelectorAll('.live-year-badge');
    liveBadges.forEach(badge => { badge.innerText = `Updated for ${currentYear} Clinical Guidelines`; });
    
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

    // 4. Set Default Date to ~10 weeks ago so UI loads realistic "pregnant" data immediately
    const dateInput = document.getElementById('pregDate');
    if (dateInput) {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 70); // 10 weeks ago
        const yyyy = pastDate.getFullYear();
        const mm = String(pastDate.getMonth() + 1).padStart(2, '0');
        const dd = String(pastDate.getDate()).padStart(2, '0');
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }

    // 5. AUTO-LOAD RESULTS ON PAGE LOAD!
    calculateDueDate(); 
});
