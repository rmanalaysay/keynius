# KeyNius Security Suite 🔐

A modern, cybersecurity-inspired web application featuring three powerful security tools built with vanilla HTML, CSS, and JavaScript.

🌐 **[Live Demo]** https://rmanalaysay.github.io/keynius/

## ✨ Features

### 🔒 Password Assessor
Evaluate password strength in real-time with visual feedback.

- **Real-time Analysis** - Instant strength evaluation as you type
- **Visual Strength Meter** - Color-coded progress bar (Red/Yellow/Green)
- **Requirements Checklist** - See which criteria are met
- **Common Password Detection** - Warns against commonly used passwords
- **Dictionary Word Detection** - Identifies weak dictionary-based passwords

** Requirements Checked: **
- ✓ Minimum 12 characters
- ✓ At least 1 uppercase letter
- ✓ At least 1 lowercase letter
- ✓ At least 1 digit
- ✓ At least 1 special character

### 🔑 Password Generator
Create cryptographically secure passwords with customizable options.

- **Cryptographic Security** - Uses `crypto.getRandomValues()` for true randomness
- **Customizable Length** - 8-32 characters via slider
- **Character Options** - Toggle uppercase, lowercase, digits, and symbols
- **SHA-256 Hashing** - Generates secure hash for each password
- **One-Click Copy** - Copy password to clipboard instantly
- **Visual Feedback** - Animated button with glow effects

### 📋 Form Validator & Sanitizer
Validate and sanitize user inputs to prevent security vulnerabilities.

- **Real-time Validation** - Instant error feedback
- **Input Sanitization** - Removes dangerous content
- **XSS Protection** - Encodes HTML tags
- **SQL Injection Prevention** - Detects and removes SQL keywords
- **Character Counting** - Live counter for message field (250 char limit)
- **Detailed Error Messages** - Clear guidance on fixing issues

** Validates: **
- Full Name (letters, spaces, hyphens, apostrophes only)
- Email (proper format with domain validation)
- Username (4-16 alphanumeric + underscores, can't start with number)
- Message (max 250 characters, no malicious HTML)

