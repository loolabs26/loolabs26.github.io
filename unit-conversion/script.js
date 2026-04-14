// --- Unit Converter Logic Database ---
const unitData = {
    length: {
        base: 'meter',
        units: {
            meter: { name: 'Meter (m)', factor: 1 },
            kilometer: { name: 'Kilometer (km)', factor: 1000 },
            centimeter: { name: 'Centimeter (cm)', factor: 0.01 },
            millimeter: { name: 'Millimeter (mm)', factor: 0.001 },
            mile: { name: 'Mile (mi)', factor: 1609.344 },
            yard: { name: 'Yard (yd)', factor: 0.9144 },
            foot: { name: 'Foot (ft)', factor: 0.3048 },
            inch: { name: 'Inch (in)', factor: 0.0254 }
        }
    },
    weight: {
        base: 'kilogram',
        units: {
            kilogram: { name: 'Kilogram (kg)', factor: 1 },
            gram: { name: 'Gram (g)', factor: 0.001 },
            milligram: { name: 'Milligram (mg)', factor: 0.000001 },
            metric_ton: { name: 'Metric Ton (t)', factor: 1000 },
            pound: { name: 'Pound (lb)', factor: 0.45359237 },
            ounce: { name: 'Ounce (oz)', factor: 0.02834952 }
        }
    },
    temperature: {
        // Temperature requires formulas, handled specifically in logic
        units: {
            celsius: { name: 'Celsius (°C)' },
            fahrenheit: { name: 'Fahrenheit (°F)' },
            kelvin: { name: 'Kelvin (K)' }
        }
    },
    volume: {
        base: 'liter',
        units: {
            liter: { name: 'Liter (L)', factor: 1 },
            milliliter: { name: 'Milliliter (mL)', factor: 0.001 },
            cubic_meter: { name: 'Cubic Meter (m³)', factor: 1000 },
            us_gallon: { name: 'US Gallon (gal)', factor: 3.78541 },
            us_quart: { name: 'US Quart (qt)', factor: 0.946353 },
            us_pint: { name: 'US Pint (pt)', factor: 0.473176 },
            us_cup: { name: 'US Cup', factor: 0.24 },
            us_fluid_ounce: { name: 'US Fluid Ounce (fl oz)', factor: 0.0295735 }
        }
    },
    area: {
        base: 'square_meter',
        units: {
            square_meter: { name: 'Square Meter (m²)', factor: 1 },
            square_kilometer: { name: 'Square Kilometer (km²)', factor: 1000000 },
            hectare: { name: 'Hectare (ha)', factor: 10000 },
            acre: { name: 'Acre (ac)', factor: 4046.86 },
            square_mile: { name: 'Square Mile (mi²)', factor: 2589988 },
            square_yard: { name: 'Square Yard (yd²)', factor: 0.836127 },
            square_foot: { name: 'Square Foot (ft²)', factor: 0.092903 }
        }
    },
    data: {
        base: 'byte',
        units: {
            bit: { name: 'Bit (b)', factor: 0.125 },
            byte: { name: 'Byte (B)', factor: 1 },
            kilobyte: { name: 'Kilobyte (KB)', factor: 1024 },
            megabyte: { name: 'Megabyte (MB)', factor: 1048576 },
            gigabyte: { name: 'Gigabyte (GB)', factor: 1073741824 },
            terabyte: { name: 'Terabyte (TB)', factor: 1099511627776 }
        }
    }
};

// Initialize dropdowns on page load
document.addEventListener('DOMContentLoaded', () => {
    populateUnits();
    
    // Auto-calculate when input changes
    document.getElementById('inputValue').addEventListener('input', convertUnits);
    document.getElementById('fromUnit').addEventListener('change', convertUnits);
    document.getElementById('toUnit').addEventListener('change', convertUnits);
});

function populateUnits() {
    const category = document.getElementById('categorySelect').value;
    const fromSelect = document.getElementById('fromUnit');
    const toSelect = document.getElementById('toUnit');
    
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';
    
    const units = unitData[category].units;
    let i = 0;
    
    for (const key in units) {
        const option1 = document.createElement('option');
        option1.value = key;
        option1.text = units[key].name;
        fromSelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = key;
        option2.text = units[key].name;
        toSelect.appendChild(option2);
        
        // Select slightly different defaults
        if (i === 1) toSelect.value = key;
        i++;
    }
    
    // Hide results when changing category
    document.getElementById('resultBox').style.display = 'none';
    document.getElementById('outputValue').value = '';
    document.getElementById('errorMessage').style.display = 'none';
}

function swapUnits() {
    const fromSelect = document.getElementById('fromUnit');
    const toSelect = document.getElementById('toUnit');
    
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    
    convertUnits();
}

function convertUnits() {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.style.display = 'none';
    
    const category = document.getElementById('categorySelect').value;
    const inputValue = parseFloat(document.getElementById('inputValue').value);
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    
    if (isNaN(inputValue)) {
        document.getElementById('outputValue').value = '';
        document.getElementById('resultBox').style.display = 'none';
        return;
    }

    let result = 0;
    let formula = "";

    // Special Handling for Temperature
    if (category === 'temperature') {
        if (fromUnit === toUnit) {
            result = inputValue;
            formula = "Multiply by 1";
        } else if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
            result = (inputValue * 9/5) + 32;
            formula = `(${inputValue} °C × 9/5) + 32`;
        } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
            result = (inputValue - 32) * 5/9;
            formula = `(${inputValue} °F - 32) × 5/9`;
        } else if (fromUnit === 'celsius' && toUnit === 'kelvin') {
            result = inputValue + 273.15;
            formula = `${inputValue} °C + 273.15`;
        } else if (fromUnit === 'kelvin' && toUnit === 'celsius') {
            result = inputValue - 273.15;
            formula = `${inputValue} K - 273.15`;
        } else if (fromUnit === 'fahrenheit' && toUnit === 'kelvin') {
            result = (inputValue - 32) * 5/9 + 273.15;
            formula = `(${inputValue} °F - 32) × 5/9 + 273.15`;
        } else if (fromUnit === 'kelvin' && toUnit === 'fahrenheit') {
            result = (inputValue - 273.15) * 9/5 + 32;
            formula = `(${inputValue} K - 273.15) × 9/5 + 32`;
        }
    } 
    // Standard Ratio Conversion (Length, Weight, Volume, Area, Data)
    else {
        const fromFactor = unitData[category].units[fromUnit].factor;
        const toFactor = unitData[category].units[toUnit].factor;
        
        // Convert to base unit, then to target unit
        const inBase = inputValue * fromFactor;
        result = inBase / toFactor;
        
        formula = `Multiply by ${ (fromFactor / toFactor).toExponential(4).replace('e', ' x 10^') }`;
    }

    // Format Result (avoid deep scientific notation for normal numbers, clean trailing zeros)
    let formattedResult = result;
    if (Math.abs(result) < 0.000001 && result !== 0) {
        formattedResult = result.toExponential(6);
    } else {
        formattedResult = parseFloat(result.toFixed(6)); // limits to 6 decimal places cleanly
    }

    // Update Output Input box
    document.getElementById('outputValue').value = formattedResult;

    // Update Visual Result Box
    const fromName = unitData[category].units[fromUnit].name.split(' ')[0];
    const toName = unitData[category].units[toUnit].name.split(' ')[0];
    
    document.getElementById('mainResultText').innerHTML = `${inputValue} ${fromName} <br> <span style="font-size: 24px; color: #888;">=</span> <br> ${formattedResult} ${toName}`;
    document.getElementById('formulaText').innerText = `Logic: ${formula}`;
    
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
