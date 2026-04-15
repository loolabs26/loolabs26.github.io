function toggleAreaInputs() {
    const shape = document.getElementById('shapeSelect').value;
    document.querySelectorAll('.shape-inputs').forEach(el => el.classList.remove('active'));
    
    if(shape === 'rectangle') document.getElementById('rectInputs').classList.add('active');
    if(shape === 'square') document.getElementById('squareInputs').classList.add('active');
    if(shape === 'circle') document.getElementById('circleInputs').classList.add('active');
    if(shape === 'triangle') document.getElementById('triangleInputs').classList.add('active');
    if(shape === 'trapezoid') document.getElementById('trapezoidInputs').classList.add('active');

    document.getElementById('resultBoxArea').style.display = 'none';
    document.getElementById('errorMessageArea').style.display = 'none';
}

function calculateArea() {
    const shape = document.getElementById('shapeSelect').value;
    const errorMsg = document.getElementById('errorMessageArea');
    errorMsg.style.display = 'none';
    
    let area = 0;
    let formulaStr = "";

    const validate = (val) => !isNaN(val) && val >= 0;

    if (shape === 'rectangle') {
        const l = parseFloat(document.getElementById('rectL').value);
        const w = parseFloat(document.getElementById('rectW').value);
        if(!validate(l) || !validate(w)) return showError("Enter valid positive numbers for Length and Width.");
        area = l * w;
        formulaStr = `A = Length × Width<br>A = ${l} × ${w}`;
    } 
    else if (shape === 'square') {
        const s = parseFloat(document.getElementById('squareS').value);
        if(!validate(s)) return showError("Enter a valid positive number for the Side.");
        area = s * s;
        formulaStr = `A = a²<br>A = ${s}²`;
    }
    else if (shape === 'circle') {
        const r = parseFloat(document.getElementById('circleR').value);
        if(!validate(r)) return showError("Enter a valid positive number for the Radius.");
        area = Math.PI * r * r;
        formulaStr = `A = πr²<br>A = π × ${r}²`;
    }
    else if (shape === 'triangle') {
        const b = parseFloat(document.getElementById('triB').value);
        const h = parseFloat(document.getElementById('triH').value);
        if(!validate(b) || !validate(h)) return showError("Enter valid positive numbers for Base and Height.");
        area = 0.5 * b * h;
        formulaStr = `A = ½bh<br>A = ½ × ${b} × ${h}`;
    }
    else if (shape === 'trapezoid') {
        const a = parseFloat(document.getElementById('trapA').value);
        const b = parseFloat(document.getElementById('trapB').value);
        const h = parseFloat(document.getElementById('trapH').value);
        if(!validate(a) || !validate(b) || !validate(h)) return showError("Enter valid positive numbers for Bases and Height.");
        area = 0.5 * (a + b) * h;
        formulaStr = `A = ½(a + b)h<br>A = ½ × (${a} + ${b}) × ${h}`;
    }

    // Clean up decimals
    const finalArea = parseFloat(area.toFixed(4));
    document.getElementById('finalArea').innerText = finalArea.toLocaleString();
    document.getElementById('areaFormula').innerHTML = formulaStr;
    document.getElementById('resultBoxArea').style.display = 'block';
}

function showError(msg) {
    const errorMsg = document.getElementById('errorMessageArea');
    errorMsg.innerText = msg;
    errorMsg.style.display = 'block';
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
