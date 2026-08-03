// Task 2: Interactive Registration Form Script

document.addEventListener('DOMContentLoaded', () => {
    // 1. Safe Initialize Lucide Icons
    const initIcons = () => {
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    };
    initIcons();
    window.addEventListener('load', initIcons);

    // Elements
    const form = document.getElementById('registrationForm');
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirmPassword');
    const termsCheck = document.getElementById('termsCheck');
    const togglePasswordBtn = document.getElementById('togglePasswordBtn');
    const eyeIcon = document.getElementById('eyeIcon');
    const eyeOffIcon = document.getElementById('eyeOffIcon');

    // Submit & Modal Elements
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnIcon = document.getElementById('btnIcon');
    const btnSpinner = document.getElementById('btnSpinner');
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const resetFormBtn = document.getElementById('resetFormBtn');

    // 2. Focus & Blur Glow Handlers for Input Wrappers
    const inputs = [fullnameInput, emailInput, phoneInput, passwordInput, confirmInput];
    inputs.forEach(input => {
        if (!input) return;
        const wrapper = input.closest('.input-wrapper');

        input.addEventListener('focus', () => {
            if (wrapper) wrapper.classList.add('focus-glow');
        });

        input.addEventListener('blur', () => {
            if (wrapper) wrapper.classList.remove('focus-glow');
            validateField(input);
        });

        input.addEventListener('input', () => {
            validateField(input);
        });
    });

    // 3. Validation Logic Functions
    function validateFullName(value) {
        const trimmed = value.trim();
        return trimmed.length >= 3 && /^[a-zA-Z\s'.-]+$/.test(trimmed);
    }

    function validateEmail(value) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value.trim());
    }

    function formatPhoneNumber(value) {
        // Strip non-digits
        const digits = value.replace(/\D/g, '');
        if (digits.length === 0) return '';
        if (digits.length <= 3) return `(${digits}`;
        if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }

    function validatePhone(value) {
        const digits = value.replace(/\D/g, '');
        return digits.length >= 10;
    }

    // Phone Auto-Formatter Listener
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            const formatted = formatPhoneNumber(e.target.value);
            e.target.value = formatted;
        });
    }

    // 4. Password Strength Meter & Checklist Logic
    function checkPasswordStrength(password) {
        let score = 0;
        const rules = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password)
        };

        // Update Checklist Icons UI
        updateRuleIcon('rule-length', rules.length);
        updateRuleIcon('rule-uppercase', rules.uppercase);
        updateRuleIcon('rule-number', rules.number);
        updateRuleIcon('rule-special', rules.special);

        if (rules.length) score++;
        if (rules.uppercase) score++;
        if (rules.number) score++;
        if (rules.special) score++;

        return { score, rules };
    }

    function updateRuleIcon(elementId, isMet) {
        const ruleElem = document.getElementById(elementId);
        if (!ruleElem) return;
        if (isMet) {
            ruleElem.classList.remove('text-slate-400');
            ruleElem.classList.add('text-emerald-400');
        } else {
            ruleElem.classList.remove('text-emerald-400');
            ruleElem.classList.add('text-slate-400');
        }
    }

    function updatePasswordMeter(password) {
        const { score } = checkPasswordStrength(password);
        const bars = [
            document.getElementById('bar-1'),
            document.getElementById('bar-2'),
            document.getElementById('bar-3'),
            document.getElementById('bar-4')
        ];
        const strengthText = document.getElementById('strengthText');

        // Reset bars
        bars.forEach(bar => {
            if (bar) bar.className = 'h-1.5 rounded-full bg-slate-800 transition-all duration-300 strength-bar';
        });

        if (!strengthText) return score;

        if (password.length === 0) {
            strengthText.textContent = 'Strength: Too Short';
            strengthText.className = 'text-[11px] font-semibold text-slate-500';
            return score;
        }

        const colors = [
            'bg-rose-500 shadow-sm shadow-rose-500/50',
            'bg-amber-500 shadow-sm shadow-amber-500/50',
            'bg-cyan-500 shadow-sm shadow-cyan-500/50',
            'bg-emerald-500 shadow-sm shadow-emerald-500/50'
        ];

        const textLabels = ['Weak', 'Fair', 'Good', 'Strong'];
        const textColors = ['text-rose-400', 'text-amber-400', 'text-cyan-400', 'text-emerald-400'];

        for (let i = 0; i < score; i++) {
            if (bars[i]) bars[i].classList.add(colors[score - 1]);
        }

        strengthText.textContent = `Strength: ${textLabels[score - 1] || 'Weak'}`;
        strengthText.className = `text-[11px] font-semibold ${textColors[score - 1] || 'text-rose-400'}`;

        return score;
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            updatePasswordMeter(e.target.value);
        });
    }

    // 5. Toggle Password Show / Hide
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            if (eyeIcon) eyeIcon.classList.toggle('hidden', isPassword);
            if (eyeOffIcon) eyeOffIcon.classList.toggle('hidden', !isPassword);
        });
    }

    // 6. Generic Field Validation Function
    function validateField(input) {
        if (!input) return false;
        const group = input.closest('.form-group');
        if (!group) return true;

        const wrapper = input.closest('.input-wrapper');
        const statusIcon = group.querySelector('.status-icon');
        const validIcon = group.querySelector('.valid-icon');
        const invalidIcon = group.querySelector('.invalid-icon');
        const errorMsg = group.querySelector('.error-msg');

        let isValid = false;

        if (input === fullnameInput) {
            isValid = validateFullName(input.value);
        } else if (input === emailInput) {
            isValid = validateEmail(input.value);
        } else if (input === phoneInput) {
            isValid = validatePhone(input.value);
        } else if (input === passwordInput) {
            const { score } = checkPasswordStrength(input.value);
            isValid = score >= 3;
        } else if (input === confirmInput) {
            isValid = input.value.length > 0 && passwordInput && input.value === passwordInput.value;
        }

        if (input.value.trim() === '') {
            // Empty field state
            wrapper?.classList.remove('valid-glow', 'invalid-glow');
            statusIcon?.classList.add('hidden');
            errorMsg?.classList.add('hidden');
            return false;
        }

        if (isValid) {
            wrapper?.classList.remove('invalid-glow');
            wrapper?.classList.add('valid-glow');
            statusIcon?.classList.remove('hidden');
            validIcon?.classList.remove('hidden');
            invalidIcon?.classList.add('hidden');
            errorMsg?.classList.add('hidden');
            group.classList.remove('animate-shake');
        } else {
            wrapper?.classList.remove('valid-glow');
            wrapper?.classList.add('invalid-glow');
            statusIcon?.classList.remove('hidden');
            validIcon?.classList.add('hidden');
            invalidIcon?.classList.remove('hidden');
            errorMsg?.classList.remove('hidden');
        }

        return isValid;
    }

    // Terms Checkbox Validation
    function validateTerms() {
        const termsGroup = document.getElementById('group-terms');
        if (!termsGroup || !termsCheck) return false;
        const errorMsg = termsGroup.querySelector('.error-msg');
        if (!termsCheck.checked) {
            if (errorMsg) errorMsg.classList.remove('hidden');
            return false;
        } else {
            if (errorMsg) errorMsg.classList.add('hidden');
            return true;
        }
    }

    if (termsCheck) {
        termsCheck.addEventListener('change', validateTerms);
    }

    // 7. Form Submission Handler
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validate all fields
            const isNameValid = validateField(fullnameInput);
            const isEmailValid = validateField(emailInput);
            const isPhoneValid = validateField(phoneInput);
            const isPasswordValid = validateField(passwordInput);
            const isConfirmValid = validateField(confirmInput);
            const isTermsValid = validateTerms();

            const allValid = isNameValid && isEmailValid && isPhoneValid && isPasswordValid && isConfirmValid && isTermsValid;

            if (!allValid) {
                // Shake invalid groups for feedback
                inputs.forEach(input => {
                    if (!input) return;
                    const group = input.closest('.form-group');
                    if (group && group.querySelector('.invalid-glow')) {
                        group.classList.add('animate-shake');
                        setTimeout(() => group.classList.remove('animate-shake'), 400);
                    }
                });
                return;
            }

            // Show Button Loading State
            if (btnText) btnText.textContent = 'Processing...';
            if (btnIcon) btnIcon.classList.add('hidden');
            if (btnSpinner) btnSpinner.classList.remove('hidden');
            if (submitBtn) submitBtn.disabled = true;

            // Simulate Async Server API Registration Call
            setTimeout(() => {
                // Reset button state
                if (btnText) btnText.textContent = 'Complete Registration';
                if (btnIcon) btnIcon.classList.remove('hidden');
                if (btnSpinner) btnSpinner.classList.add('hidden');
                if (submitBtn) submitBtn.disabled = false;

                // Populate Modal Summary Details
                const selectedRole = document.querySelector('input[name="accountRole"]:checked')?.value || 'Developer';
                const nameEl = document.getElementById('modalName');
                const emailEl = document.getElementById('modalEmail');
                const phoneEl = document.getElementById('modalPhone');
                const roleEl = document.getElementById('modalRole');

                if (nameEl) nameEl.textContent = fullnameInput ? fullnameInput.value.trim() : '';
                if (emailEl) emailEl.textContent = emailInput ? emailInput.value.trim() : '';
                if (phoneEl) phoneEl.textContent = phoneInput ? phoneInput.value.trim() : '';
                if (roleEl) roleEl.textContent = selectedRole;

                // Display Success Modal
                if (successModal) successModal.classList.remove('hidden');
            }, 1200);
        });
    }

    // 8. Modal Action Listeners
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (successModal) successModal.classList.add('hidden');
        });
    }

    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', () => {
            if (form) form.reset();
            inputs.forEach(input => {
                if (!input) return;
                const wrapper = input.closest('.input-wrapper');
                const group = input.closest('.form-group');
                wrapper?.classList.remove('valid-glow', 'invalid-glow', 'focus-glow');
                group?.querySelector('.status-icon')?.classList.add('hidden');
                group?.querySelector('.error-msg')?.classList.add('hidden');
            });
            updatePasswordMeter('');
            if (successModal) successModal.classList.add('hidden');
        });
    }
});
