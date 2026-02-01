// ===== COMMON PASSWORD & DICTIONARY LISTS =====
const COMMON_PASSWORDS = [
    '123456', 'password', '12345678', 'qwerty', '123456789', '12345', '1234', 
    '111111', '1234567', 'dragon', '123123', 'baseball', 'iloveyou', 'trustno1',
    'monkey', 'letmein', 'abc123', 'qwerty123', 'admin', 'welcome', 'login',
    'password123', 'p@ssw0rd', 'pass@123', 'admin123'
];

const DICTIONARY_WORDS = [
    'monkey', 'dragon', 'shadow', 'sunshine', 'princess', 'master', 'football',
    'soccer', 'baseball', 'summer', 'winter', 'hunter', 'freedom', 'whatever',
    'superman', 'batman', 'pokemon', 'starwars', 'ninja', 'coffee', 'pizza'
];

// ===== UTILITY FUNCTIONS =====
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// SHA-256 Hash Function
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ===== TAB NAVIGATION =====
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all tabs
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        // Add active class to clicked tab
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// ===== PASSWORD ASSESSOR =====
const passwordInput = document.getElementById('password-input');
const togglePassBtn = document.getElementById('toggle-pass');
const strengthBar = document.getElementById('strength-bar');
const strengthLabel = document.getElementById('strength-label');

// Toggle password visibility
togglePassBtn.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePassBtn.querySelector('.eye-icon').textContent = type === 'password' ? '👁️' : '🙈';
});

// Password assessment
passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    
    if (!password) {
        resetAssessor();
        return;
    }

    // Check requirements
    const checks = {
        length: password.length >= 12,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        digit: /\d/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    // Update checklist UI
    Object.keys(checks).forEach(key => {
        const checkItem = document.getElementById(`check-${key}`);
        const icon = checkItem.querySelector('.check-icon');
        
        if (checks[key]) {
            checkItem.classList.add('passed');
            checkItem.classList.remove('failed');
            icon.textContent = '✓';
        } else {
            checkItem.classList.add('failed');
            checkItem.classList.remove('passed');
            icon.textContent = '✗';
        }
    });

    // Calculate score
    let score = Object.values(checks).filter(Boolean).length;

    // Check for common passwords and dictionary words
    const lowerPassword = password.toLowerCase();
    const isCommon = COMMON_PASSWORDS.some(cp => lowerPassword.includes(cp)) ||
                     DICTIONARY_WORDS.some(dw => lowerPassword.includes(dw));

    if (isCommon) {
        strengthBar.style.width = '15%';
        strengthBar.style.background = '#ff2e63';
        strengthLabel.textContent = 'Common/Weak Password';
        strengthLabel.style.color = '#ff2e63';
        strengthLabel.style.background = 'rgba(255, 46, 99, 0.1)';
        return;
    }

    // Update strength meter
    const percentage = (score / 5) * 100;
    strengthBar.style.width = percentage + '%';

    if (score <= 2) {
        strengthBar.style.background = '#ff2e63';
        strengthLabel.textContent = 'Weak Password';
        strengthLabel.style.color = '#ff2e63';
        strengthLabel.style.background = 'rgba(255, 46, 99, 0.1)';
    } else if (score <= 4) {
        strengthBar.style.background = '#ffeb3b';
        strengthLabel.textContent = 'Moderate Password';
        strengthLabel.style.color = '#ffeb3b';
        strengthLabel.style.background = 'rgba(255, 235, 59, 0.1)';
    } else {
        strengthBar.style.background = '#00ff88';
        strengthLabel.textContent = 'Strong Password';
        strengthLabel.style.color = '#00ff88';
        strengthLabel.style.background = 'rgba(0, 255, 136, 0.1)';
    }
});

function resetAssessor() {
    strengthBar.style.width = '0';
    strengthLabel.textContent = 'Enter a password';
    strengthLabel.style.color = 'var(--text-secondary)';
    strengthLabel.style.background = 'transparent';
    
    document.querySelectorAll('.check-item').forEach(item => {
        item.classList.remove('passed', 'failed');
        item.querySelector('.check-icon').textContent = '○';
    });
}

// ===== PASSWORD GENERATOR =====
const lengthSlider = document.getElementById('password-length');
const lengthValue = document.getElementById('length-value');
const generateBtn = document.getElementById('generate-btn');
const generatedPassword = document.getElementById('generated-password');
const copyBtn = document.getElementById('copy-btn');
const hashOutput = document.getElementById('hash-output');

// Update length display
lengthSlider.addEventListener('input', () => {
    lengthValue.textContent = lengthSlider.value;
});

// Generate password
generateBtn.addEventListener('click', async () => {
    const length = parseInt(lengthSlider.value);
    
    const optUpper = document.getElementById('opt-upper').checked;
    const optLower = document.getElementById('opt-lower').checked;
    const optDigits = document.getElementById('opt-digits').checked;
    const optSpecial = document.getElementById('opt-special').checked;

    // Build character pool
    let chars = '';
    if (optUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (optLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (optDigits) chars += '0123456789';
    if (optSpecial) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) {
        showToast('Please select at least one character type');
        return;
    }

    // Generate password
    let password = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
        password += chars[array[i] % chars.length];
    }

    // Ensure at least one of each selected type
    if (optUpper && !/[A-Z]/.test(password)) {
        password = password.substring(0, length - 1) + 'A';
    }
    if (optLower && !/[a-z]/.test(password)) {
        password = password.substring(0, length - 1) + 'a';
    }
    if (optDigits && !/\d/.test(password)) {
        password = password.substring(0, length - 1) + '1';
    }
    if (optSpecial && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
        password = password.substring(0, length - 1) + '!';
    }

    // Display password
    generatedPassword.textContent = password;
    copyBtn.disabled = false;

    // Generate and display hash
    const hash = await sha256(password);
    hashOutput.textContent = hash;

    showToast('Password generated successfully!');
});

// Copy password
copyBtn.addEventListener('click', () => {
    const password = generatedPassword.textContent;
    navigator.clipboard.writeText(password).then(() => {
        showToast('Password copied to clipboard!');
    });
});

// ===== FORM VALIDATOR & SANITIZER =====
const validationForm = document.getElementById('validation-form');
const messageField = document.getElementById('message');
const charCount = document.getElementById('char-count');
const validationResult = document.getElementById('validation-result');

// Character counter
messageField.addEventListener('input', () => {
    const count = messageField.value.length;
    charCount.textContent = count;
    
    if (count > 250) {
        charCount.style.color = 'var(--accent-red)';
    } else {
        charCount.style.color = 'var(--text-muted)';
    }
});

// Form validation
validationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(msg => {
        msg.classList.remove('show');
        msg.textContent = '';
    });
    document.querySelectorAll('input, textarea').forEach(field => {
        field.classList.remove('error');
    });

    const formData = {
        fullName: document.getElementById('full-name').value,
        email: document.getElementById('email').value,
        username: document.getElementById('username').value,
        message: document.getElementById('message').value
    };

    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
        // Show errors
        Object.keys(errors).forEach(field => {
            const errorMsg = document.getElementById(`error-${field}`);
            const inputField = document.getElementById(field.replace('Name', '-name'));
            
            errorMsg.textContent = errors[field];
            errorMsg.classList.add('show');
            inputField.classList.add('error');
        });

        validationResult.className = 'result-display error';
        validationResult.innerHTML = `
            <h3 style="color: var(--accent-red); margin-bottom: 1rem; font-family: 'Orbitron', sans-serif;">
                ⚠️ Validation Failed
            </h3>
            <p>Please fix the errors above and try again.</p>
        `;
        return;
    }

    // Sanitize data
    const sanitized = sanitizeForm(formData);

    // Show success
    validationResult.className = 'result-display success';
    validationResult.innerHTML = `
        <h3 style="color: var(--accent-green); margin-bottom: 1rem; font-family: 'Orbitron', sans-serif;">
            ✓ Validation Successful
        </h3>
        <div style="margin-top: 1rem;">
            <strong>Sanitized Data:</strong>
            <div style="margin-top: 0.5rem; padding: 1rem; background: var(--dark-surface); border-radius: 6px; font-family: 'Inconsolata', monospace;">
                <div><strong>Full Name:</strong> ${sanitized.fullName}</div>
                <div><strong>Email:</strong> ${sanitized.email}</div>
                <div><strong>Username:</strong> ${sanitized.username}</div>
                <div><strong>Message:</strong> ${sanitized.message}</div>
            </div>
        </div>
        ${sanitized.notes.length > 0 ? `
            <div style="margin-top: 1rem;">
                <strong style="color: var(--accent-yellow);">⚠️ Sanitization Notes:</strong>
                <ul style="margin-top: 0.5rem; padding-left: 1.5rem;">
                    ${sanitized.notes.map(note => `<li>${note}</li>`).join('')}
                </ul>
            </div>
        ` : ''}
    `;

    showToast('Form validated and sanitized successfully!');
});

// Validation function
function validateForm(data) {
    const errors = {};

    // Full Name validation
    if (!data.fullName) {
        errors.name = 'Full Name is required.';
    } else if (data.fullName.length < 2) {
        errors.name = 'Full Name must be at least 2 characters.';
    } else if (!/^[A-Za-z\s\-']+$/.test(data.fullName)) {
        errors.name = 'Invalid characters in Full Name.';
    }

    // Email validation
    if (!data.email) {
        errors.email = 'Email is required.';
    } else if (/^[!@#$%^&*()]/.test(data.email)) {
        errors.email = 'Email cannot start with special characters.';
    } else if (data.email.includes(' ')) {
        errors.email = 'Email must not contain spaces.';
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(data.email)) {
        errors.email = 'Invalid email format.';
    }

    // Username validation
    if (!data.username) {
        errors.username = 'Username is required.';
    } else if (/^\d/.test(data.username)) {
        errors.username = 'Username cannot start with a number.';
    } else if (!/^[A-Za-z0-9_]{4,16}$/.test(data.username)) {
        errors.username = 'Username must be 4-16 characters (letters, numbers, underscores only).';
    }

    // Message validation
    if (!data.message) {
        errors.message = 'Message cannot be empty.';
    } else if (data.message.length > 250) {
        errors.message = 'Message should not exceed 250 characters.';
    } else if (/<script>/i.test(data.message) || /<img/i.test(data.message)) {
        errors.message = 'Prohibited HTML tags detected.';
    }

    return errors;
}

// Sanitization function
function sanitizeForm(data) {
    const notes = [];
    
    // Sanitize Full Name
    const fullName = data.fullName.replace(/[^A-Za-z\s\-']/g, '');
    
    // Sanitize Email
    const email = data.email.replace(/\s/g, '');
    
    // Sanitize Username
    const username = data.username.replace(/[^A-Za-z0-9_]/g, '');
    
    // Sanitize Message
    let message = data.message;
    const originalMessage = message;
    
    // HTML encoding
    message = message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // SQL keyword removal
    const sqlPattern = /\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|OR|CREATE|ALTER)\b/gi;
    message = message.replace(sqlPattern, '[REMOVED]');
    
    if (message !== originalMessage) {
        notes.push('Message: Unsafe content sanitized (HTML tags encoded, SQL keywords removed)');
    }

    return {
        fullName,
        email,
        username,
        message,
        notes
    };
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('KeyNius Security Suite initialized');
    
    // Add some entrance animations
    document.querySelectorAll('.card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});
