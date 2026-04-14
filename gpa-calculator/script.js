// --- GPA Calculator Logic ---

// Variable to keep track of dynamic rows
let rowCount = 2;

// Standard HTML string for the grade dropdown to avoid repeating it
const gradeDropdownHTML = `
    <select class="tool-input course-grade">
        <option value="" disabled selected>Select</option>
        <option value="4.0">A+ (4.0)</option>
        <option value="4.0">A (4.0)</option>
        <option value="3.7">A- (3.7)</option>
        <option value="3.3">B+ (3.3)</option>
        <option value="3.0">B (3.0)</option>
        <option value="2.7">B- (2.7)</option>
        <option value="2.3">C+ (2.3)</option>
        <option value="2.0">C (2.0)</option>
        <option value="1.7">C- (1.7)</option>
        <option value="1.3">D+ (1.3)</option>
        <option value="1.0">D (1.0)</option>
        <option value="0.0">F (0.0)</option>
    </select>
`;

function addRow() {
    rowCount++;
    const container = document.getElementById('rowsContainer');
    
    const newRow = document.createElement('div');
    newRow.className = 'gpa-row';
    newRow.innerHTML = `
        <div class="input-group">
            <label>Course Name (Optional)</label>
            <input type="text" class="tool-input course-name" placeholder="Course ${rowCount}">
        </div>
        <div class="input-group">
            <label>Credits</label>
            <input type="number" class="tool-input course-credits" placeholder="e.g. 3" step="0.5">
        </div>
        <div class="input-group">
            <label>Grade</label>
            ${gradeDropdownHTML}
        </div>
        <button class="remove-btn" onclick="removeRow(this)" title="Remove Row"><i class="fas fa-trash"></i></button>
    `;
    
    container.appendChild(newRow);
}

function removeRow(buttonElement) {
    const rows = document.querySelectorAll('.gpa-row');
    if (rows.length <= 1) {
        showError("You must have at least one course to calculate your GPA.");
        return;
    }
    
    const row = buttonElement.parentElement;
    row.remove();
    
    document.getElementById('errorMessage').style.display = 'none';
}

function calculateGPA() {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.style.display = 'none';

    const creditInputs = document.querySelectorAll('.course-credits');
    const gradeInputs = document.querySelectorAll('.course-grade');

    let totalCredits = 0;
    let totalGradePoints = 0;
    let validRowsCount = 0;

    for (let i = 0; i < creditInputs.length; i++) {
        const creditsVal = creditInputs[i].value;
        const gradeVal = gradeInputs[i].value;

        // Skip if user completely left a row blank
        if (creditsVal === '' && gradeVal === '') {
            continue; 
        }

        const credits = parseFloat(creditsVal);
        const gradePoint = parseFloat(gradeVal);

        // Validation for partially filled rows
        if (isNaN(credits) || credits <= 0) {
            showError(`Please enter a valid number of credits for row ${i + 1}.`);
            return;
        }
        if (isNaN(gradePoint)) {
            showError(`Please select a valid Grade for row ${i + 1}.`);
            return;
        }

        totalCredits += credits;
        totalGradePoints += (credits * gradePoint);
        validRowsCount++;
    }

    if (validRowsCount === 0) {
        showError("Please fill out at least one course with Credits and a Grade.");
        return;
    }

    // Standard GPA formula: Total Grade Points / Total Credits
    const gpa = totalGradePoints / totalCredits;

    displayGPA(gpa, totalCredits, totalGradePoints);
}

function showError(msg) {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.innerText = msg;
    errorMsg.style.display = 'block';
    document.getElementById('resultBox').style.display = 'none';
}

function displayGPA(gpa, credits, gradePoints) {
    document.getElementById('finalGPA').innerText = gpa.toFixed(2);
    document.getElementById('totalCredits').innerText = credits.toLocaleString();
    document.getElementById('totalGradePoints').innerText = gradePoints.toFixed(2).toLocaleString();

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
