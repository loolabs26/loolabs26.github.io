function calculateTriangle() {
    const errorMsg = document.getElementById('errorMessageTri');
    errorMsg.style.display = 'none';

    const a = parseFloat(document.getElementById('sideA').value);
    const b = parseFloat(document.getElementById('sideB').value);
    const c = parseFloat(document.getElementById('sideC').value);

    // Basic Validation
    if (isNaN(a) || isNaN(b) || isNaN(c) || a <= 0 || b <= 0 || c <= 0) {
        showError("Please enter valid positive numbers for all three sides.");
        return;
    }

    // Triangle Inequality Theorem Validation
    if (a + b <= c || a + c <= b || b + c <= a) {
        showError("Invalid Triangle! The sum of any two sides must be greater than the third side.");
        return;
    }

    // 1. Calculate Perimeter and Semi-Perimeter
    const perimeter = a + b + c;
    const s = perimeter / 2;

    // 2. Calculate Area using Heron's Formula
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));

    // 3. Calculate Angles using Law of Cosines (in Radians, then convert to Degrees)
    const angleARad = Math.acos((Math.pow(b, 2) + Math.pow(c, 2) - Math.pow(a, 2)) / (2 * b * c));
    const angleBRad = Math.acos((Math.pow(a, 2) + Math.pow(c, 2) - Math.pow(b, 2)) / (2 * a * c));
    const angleCRad = Math.PI - angleARad - angleBRad; // Interior angles sum to Pi radians (180 deg)

    const angleADeg = angleARad * (180 / Math.PI);
    const angleBDeg = angleBRad * (180 / Math.PI);
    const angleCDeg = angleCRad * (180 / Math.PI);

    // 4. Determine Triangle Type
    let type = "Scalene"; // All sides different
    if (a === b && b === c) {
        type = "Equilateral";
    } else if (a === b || a === c || b === c) {
        type = "Isosceles";
    }

    // Check for Right Triangle (Accounting for floating point precision)
    if (Math.abs(Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)) < 0.0001 || 
        Math.abs(Math.pow(a, 2) + Math.pow(c, 2) - Math.pow(b, 2)) < 0.0001 || 
        Math.abs(Math.pow(b, 2) + Math.pow(c, 2) - Math.pow(a, 2)) < 0.0001) {
        type += " (Right)";
    }

    // Display Results cleanly
    document.getElementById('triArea').innerText = parseFloat(area.toFixed(4)).toLocaleString();
    document.getElementById('triPerimeter').innerText = parseFloat(perimeter.toFixed(4)).toLocaleString();
    document.getElementById('triSemi').innerText = parseFloat(s.toFixed(4)).toLocaleString();
    
    document.getElementById('angleA').innerText = parseFloat(angleADeg.toFixed(2));
    document.getElementById('angleB').innerText = parseFloat(angleBDeg.toFixed(2));
    document.getElementById('angleC').innerText = parseFloat(angleCDeg.toFixed(2));
    
    document.getElementById('triType').innerText = type;

    document.getElementById('resultBoxTri').style.display = 'block';
}

function showError(msg) {
    const errorMsg = document.getElementById('errorMessageTri');
    errorMsg.innerText = msg;
    errorMsg.style.display = 'block';
    document.getElementById('resultBoxTri').style.display = 'none';
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
