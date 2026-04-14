// --- CGPA Calculator Logic ---

let rowCount = 2; // Starts with 2 rows by default

// Function to add a new semester row dynamically
function addRow() {
    rowCount++;
    const container = document.getElementById('rowsContainer');
    
    const newRow = document.createElement('div');
    newRow.className = 'cgpa-row';
    newRow.innerHTML = `
        <div class="input-group">
            <label>Semester / Course</label>
            <input type="text" class="tool-input sem-name" placeholder="Semester ${rowCount}">
        </div>
        <div class="input-group">
            <label>Credits</label>
            <input type="number" class="tool-input sem-credits" placeholder="e.g. 20" step="0.5">
        </div>
        <div class="input-group">
            <label>SGPA / GPA</label>
            <input type="number" class="tool-input sem-gpa" placeholder="e.g. 8.5" step="0.01">
        </div>
        <button class="remove-btn" onclick="removeRow(this)" title="Remove Row"><i class="fas fa-trash"></i></button>
    `;
    
    container.appendChild(newRow);
}

// Function to remove a semester row
function removeRow(buttonElement) {
    const rows = document.querySelectorAll('.cgpa-row');
    if (rows.length <= 1) {
        showError("You must have at least one semester to calculate CGPA.");
        return;
    }
    
    // Remove the specific row
    const row = buttonElement.parentElement;
    row.remove();
    
    // Hide errors if user is cleaning up the form
    document.getElementById('errorMessage').style.display = 'none';
}

function calculateCGPA() {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.style.display = 'none';

    const creditInputs = document.querySelectorAll('.sem-credits');
    const gpaInputs = document.querySelectorAll('.sem-gpa');

    let totalCredits = 0;
    let totalGradePoints = 0;
    let validRowsCount = 0;

    for (let i = 0; i < creditInputs.length; i++) {
        const creditsVal = creditInputs[i].value;
        const gpaVal = gpaInputs[i].value;

        // Skip completely empty rows
        if (creditsVal === '' && gpaVal === '') {
            continue; 
        }

        const credits = parseFloat(creditsVal);
        const gpa = parseFloat(gpaVal);

        // Validation for partially filled rows or invalid data
        if (isNaN(credits) || credits <= 0) {
            showError(`Please enter a valid number of credits for row ${i + 1}.`);
            return;
        }
        if (isNaN(gpa) || gpa < 0) {
            showError(`Please enter a valid GPA for row ${i + 1}.`);
            return;
        }

        totalCredits += credits;
        totalGradePoints += (credits * gpa);
        validRowsCount++;
    }

    if (validRowsCount === 0) {
        showError("Please fill out at least one semester with Credits and GPA.");
        return;
    }

    // Mathematical formula for CGPA
    const cgpa = totalGradePoints / totalCredits;

    displayCGPA(cgpa, totalCredits, totalGradePoints);
}

function showError(msg) {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.innerText = msg;
    errorMsg.style.display = 'block';
    document.getElementById('resultBox').style.display = 'none';
}

function displayCGPA(cgpa, credits, gradePoints) {
    // Format to 2 decimal places
    document.getElementById('finalCGPA').innerText = cgpa.toFixed(2);
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
