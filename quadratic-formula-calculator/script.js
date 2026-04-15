// --- Quadratic Formula Calculator Logic ---

function calculateQuadratic() {
    const errorMsg = document.getElementById('errorMessageQuad');
    errorMsg.style.display = 'none';

    const a = parseFloat(document.getElementById('inputA').value);
    const b = parseFloat(document.getElementById('inputB').value) || 0; // default to 0 if left blank
    const c = parseFloat(document.getElementById('inputC').value) || 0; // default to 0 if left blank

    if (isNaN(a)) {
        showError("Please enter a value for 'a'.");
        return;
    }
    
    if (a === 0) {
        showError("The value of 'a' cannot be zero. If 'a' is zero, it is a linear equation, not quadratic.");
        return;
    }

    // Generate Dynamic Equation Display
    let eqStr = "";
    eqStr += (a === 1) ? "x²" : (a === -1) ? "-x²" : `${a}x²`;
    
    if (b > 0) eqStr += ` + ${b === 1 ? 'x' : b + 'x'}`;
    else if (b < 0) eqStr += ` - ${Math.abs(b) === 1 ? 'x' : Math.abs(b) + 'x'}`;

    if (c > 0) eqStr += ` + ${c}`;
    else if (c < 0) eqStr += ` - ${Math.abs(c)}`;
    
    eqStr += " = 0";
    document.getElementById('equationDisplay').innerText = eqStr;

    // 1. Calculate Discriminant
    const discriminant = Math.pow(b, 2) - (4 * a * c);
    
    let root1, root2;
    let rootText = "";
    let rootType = "";

    // Helper for formatting decimals safely
    const fmt = (num) => parseFloat(num.toFixed(4));

    // 2. Logic based on Discriminant
    if (discriminant > 0) {
        // Two real distinct roots
        root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        rootText = `x₁ = ${fmt(root1)}<br>x₂ = ${fmt(root2)}`;
        rootType = "Two real, distinct roots. (Δ > 0)";
        
    } else if (discriminant === 0) {
        // One real root
        root1 = -b / (2 * a);
        rootText = `x = ${fmt(root1)}`;
        rootType = "One real, repeating root. (Δ = 0)";
        
    } else {
        // Complex / Imaginary roots
        const realPart = fmt(-b / (2 * a));
        const imaginaryPart = fmt(Math.sqrt(Math.abs(discriminant)) / (2 * a));
        
        // Handle positive/negative properly for display
        const imgDisplay = Math.abs(imaginaryPart);
        
        rootText = `x₁ = ${realPart} + ${imgDisplay}i<br>x₂ = ${realPart} - ${imgDisplay}i`;
        rootType = "Two complex (imaginary) roots. (Δ < 0)";
    }

    // 3. Additional Properties
    const vertexX = -b / (2 * a);
    const vertexY = a * Math.pow(vertexX, 2) + b * vertexX + c;

    // Output Display
    document.getElementById('rootsDisplay').innerHTML = rootText;
    document.getElementById('rootTypeText').innerText = rootType;
    document.getElementById('resDiscriminant').innerText = fmt(discriminant);
    document.getElementById('resVertex').innerText = `(${fmt(vertexX)}, ${fmt(vertexY)})`;
    document.getElementById('resYInt').innerText = `(0, ${fmt(c)})`;

    document.getElementById('resultBoxQuad').style.display = 'block';
}

function showError(msg) {
    const errorMsg = document.getElementById('errorMessageQuad');
    errorMsg.innerText = msg;
    errorMsg.style.display = 'block';
    document.getElementById('resultBoxQuad').style.display = 'none';
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
