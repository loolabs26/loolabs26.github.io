function toggleVolumeInputs() {
    const shape = document.getElementById('shapeSelect').value;
    document.querySelectorAll('.shape-inputs').forEach(el => el.classList.remove('active'));
    
    if(shape === 'cube') document.getElementById('cubeInputs').classList.add('active');
    if(shape === 'box') document.getElementById('boxInputs').classList.add('active');
    if(shape === 'cylinder') document.getElementById('cylinderInputs').classList.add('active');
    if(shape === 'sphere') document.getElementById('sphereInputs').classList.add('active');
    if(shape === 'cone') document.getElementById('coneInputs').classList.add('active');

    document.getElementById('resultBoxVol').style.display = 'none';
    document.getElementById('errorMessageVol').style.display = 'none';
}

function calculateVolume() {
    const shape = document.getElementById('shapeSelect').value;
    const errorMsg = document.getElementById('errorMessageVol');
    errorMsg.style.display = 'none';
    
    let vol = 0;
    let formulaStr = "";

    const validate = (val) => !isNaN(val) && val >= 0;

    if (shape === 'cube') {
        const a = parseFloat(document.getElementById('cubeA').value);
        if(!validate(a)) return showError("Enter a valid positive number for the Edge Length.");
        vol = Math.pow(a, 3);
        formulaStr = `V = a³<br>V = ${a}³`;
    } 
    else if (shape === 'box') {
        const l = parseFloat(document.getElementById('boxL').value);
        const w = parseFloat(document.getElementById('boxW').value);
        const h = parseFloat(document.getElementById('boxH').value);
        if(!validate(l) || !validate(w) || !validate(h)) return showError("Enter valid positive numbers for Length, Width, and Height.");
        vol = l * w * h;
        formulaStr = `V = lwh<br>V = ${l} × ${w} × ${h}`;
    }
    else if (shape === 'cylinder') {
        const r = parseFloat(document.getElementById('cylR').value);
        const h = parseFloat(document.getElementById('cylH').value);
        if(!validate(r) || !validate(h)) return showError("Enter valid positive numbers for Radius and Height.");
        vol = Math.PI * Math.pow(r, 2) * h;
        formulaStr = `V = πr²h<br>V = π × ${r}² × ${h}`;
    }
    else if (shape === 'sphere') {
        const r = parseFloat(document.getElementById('sphereR').value);
        if(!validate(r)) return showError("Enter a valid positive number for the Radius.");
        vol = (4/3) * Math.PI * Math.pow(r, 3);
        formulaStr = `V = ⁴/₃πr³<br>V = ⁴/₃ × π × ${r}³`;
    }
    else if (shape === 'cone') {
        const r = parseFloat(document.getElementById('coneR').value);
        const h = parseFloat(document.getElementById('coneH').value);
        if(!validate(r) || !validate(h)) return showError("Enter valid positive numbers for Radius and Height.");
        vol = (1/3) * Math.PI * Math.pow(r, 2) * h;
        formulaStr = `V = ¹/₃πr²h<br>V = ¹/₃ × π × ${r}² × ${h}`;
    }

    const finalVol = parseFloat(vol.toFixed(4));
    document.getElementById('finalVolume').innerText = finalVol.toLocaleString();
    document.getElementById('volumeFormula').innerHTML = formulaStr;
    document.getElementById('resultBoxVol').style.display = 'block';
}

function showError(msg) {
    const errorMsg = document.getElementById('errorMessageVol');
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
