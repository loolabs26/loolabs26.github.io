function clearFields() {
    document.getElementById('rtSideA').value = '';
    document.getElementById('rtSideB').value = '';
    document.getElementById('rtSideC').value = '';
    document.getElementById('rtAngleA').value = '';
    document.getElementById('rtAngleB').value = '';
    document.getElementById('resultBoxRt').style.display = 'none';
    document.getElementById('errorMessageRt').style.display = 'none';
}

function calculateRightTriangle() {
    const errorMsg = document.getElementById('errorMessageRt');
    errorMsg.style.display = 'none';

    // Parse inputs (NaN if empty)
    let a = parseFloat(document.getElementById('rtSideA').value);
    let b = parseFloat(document.getElementById('rtSideB').value);
    let c = parseFloat(document.getElementById('rtSideC').value);
    let angleA = parseFloat(document.getElementById('rtAngleA').value);
    let angleB = parseFloat(document.getElementById('rtAngleB').value);

    // Count how many valid inputs we have
    let inputs = [a, b, c, angleA, angleB].filter(val => !isNaN(val));
    
    if (inputs.length !== 2) {
        showError("Please enter EXACTLY two values to calculate the triangle.");
        return;
    }

    // Validation
    if (!isNaN(angleA) && (angleA <= 0 || angleA >= 90)) return showError("Angle A must be between 0 and 90 degrees.");
    if (!isNaN(angleB) && (angleB <= 0 || angleB >= 90)) return showError("Angle B must be between 0 and 90 degrees.");
    if (!isNaN(a) && a <= 0) return showError("Side lengths must be positive.");
    if (!isNaN(b) && b <= 0) return showError("Side lengths must be positive.");
    if (!isNaN(c) && c <= 0) return showError("Side lengths must be positive.");
    if (!isNaN(a) && !isNaN(c) && a >= c) return showError("Hypotenuse (c) must be strictly greater than Leg a.");
    if (!isNaN(b) && !isNaN(c) && b >= c) return showError("Hypotenuse (c) must be strictly greater than Leg b.");
    if (!isNaN(angleA) && !isNaN(angleB) && (Math.abs(angleA + angleB - 90) > 0.1)) return showError("In a right triangle, Angle A + Angle B must equal 90 degrees. We cannot solve for the sides with only angles.");

    const degToRad = (deg) => deg * (Math.PI / 180);
    const radToDeg = (rad) => rad * (180 / Math.PI);

    // MATH ENGINE: Determine which 2 variables we have and solve the rest
    
    // Scenario 1: Given a and b
    if (!isNaN(a) && !isNaN(b)) {
        c = Math.sqrt(a*a + b*b);
        angleA = radToDeg(Math.atan(a / b));
        angleB = 90 - angleA;
    }
    // Scenario 2: Given a and c
    else if (!isNaN(a) && !isNaN(c)) {
        b = Math.sqrt(c*c - a*a);
        angleA = radToDeg(Math.asin(a / c));
        angleB = 90 - angleA;
    }
    // Scenario 3: Given b and c
    else if (!isNaN(b) && !isNaN(c)) {
        a = Math.sqrt(c*c - b*b);
        angleA = radToDeg(Math.acos(b / c));
        angleB = 90 - angleA;
    }
    // Scenario 4: Given a and Angle A
    else if (!isNaN(a) && !isNaN(angleA)) {
        angleB = 90 - angleA;
        c = a / Math.sin(degToRad(angleA));
        b = a / Math.tan(degToRad(angleA));
    }
    // Scenario 5: Given a and Angle B
    else if (!isNaN(a) && !isNaN(angleB)) {
        angleA = 90 - angleB;
        c = a / Math.cos(degToRad(angleB));
        b = a * Math.tan(degToRad(angleB));
    }
    // Scenario 6: Given b and Angle A
    else if (!isNaN(b) && !isNaN(angleA)) {
        angleB = 90 - angleA;
        c = b / Math.cos(degToRad(angleA));
        a = b * Math.tan(degToRad(angleA));
    }
    // Scenario 7: Given b and Angle B
    else if (!isNaN(b) && !isNaN(angleB)) {
        angleA = 90 - angleB;
        c = b / Math.sin(degToRad(angleB));
        a = b / Math.tan(degToRad(angleB));
    }
    // Scenario 8: Given c and Angle A
    else if (!isNaN(c) && !isNaN(angleA)) {
        angleB = 90 - angleA;
        a = c * Math.sin(degToRad(angleA));
        b = c * Math.cos(degToRad(angleA));
    }
    // Scenario 9: Given c and Angle B
    else if (!isNaN(c) && !isNaN(angleB)) {
        angleA = 90 - angleB;
        a = c * Math.cos(degToRad(angleB));
        b = c * Math.sin(degToRad(angleB));
    } else {
        return showError("Cannot solve with the provided inputs. Please provide at least one side length.");
    }

    const area = 0.5 * a * b;

    // Display Results cleanly
    document.getElementById('resA').innerText = parseFloat(a.toFixed(4)).toLocaleString();
    document.getElementById('resB').innerText = parseFloat(b.toFixed(4)).toLocaleString();
    document.getElementById('resC').innerText = parseFloat(c.toFixed(4)).toLocaleString();
    
    document.getElementById('resAngleA').innerText = parseFloat(angleA.toFixed(2));
    document.getElementById('resAngleB').innerText = parseFloat(angleB.toFixed(2));
    
    document.getElementById('resArea').innerText = parseFloat(area.toFixed(4)).toLocaleString();

    document.getElementById('resultBoxRt').style.display = 'block';
}

function showError(msg) {
    const errorMsg = document.getElementById('errorMessageRt');
    errorMsg.innerText = msg;
    errorMsg.style.display = 'block';
    document.getElementById('resultBoxRt').style.display = 'none';
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
