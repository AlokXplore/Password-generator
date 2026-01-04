document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const lengthSlider = document.getElementById('length-slider');
    const lengthValue = document.getElementById('length-value');
    const uppercaseCheckbox = document.getElementById('uppercase');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');
    const excludeAmbiguousCheckbox = document.getElementById('exclude-ambiguous');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const passwordDisplay = document.getElementById('password-display');
    const notification = document.getElementById('notification');
    
    // Update length value display
    lengthSlider.addEventListener('input', () => {
        lengthValue.textContent = lengthSlider.value;
    });
    
    // Generate password function
    async function generatePassword() {
        const length = parseInt(lengthSlider.value);
        const useUppercase = uppercaseCheckbox.checked;
        const useLowercase = lowercaseCheckbox.checked;
        const useNumbers = numbersCheckbox.checked;
        const useSymbols = symbolsCheckbox.checked;
        const excludeAmbiguous = excludeAmbiguousCheckbox.checked;
        
        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    length: length,
                    uppercase: useUppercase,
                    lowercase: useLowercase,
                    numbers: useNumbers,
                    symbols: useSymbols,
                    exclude_ambiguous: excludeAmbiguous
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                passwordDisplay.textContent = data.password;
            } else {
                passwordDisplay.textContent = data.error || 'Error generating password';
            }
        } catch (error) {
            passwordDisplay.textContent = 'Error: Could not connect to server';
        }
    }
    
    // Copy to clipboard function
    function copyToClipboard() {
        const text = passwordDisplay.textContent;
        if (text === 'Your password will appear here' || text.includes('Error')) {
            return;
        }
        
        navigator.clipboard.writeText(text).then(() => {
            // Show notification
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, 2000);
        });
    }
    
    // Event listeners
    generateBtn.addEventListener('click', generatePassword);
    copyBtn.addEventListener('click', copyToClipboard);
    
    // Generate initial password
    generatePassword();
});
