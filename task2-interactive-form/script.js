'use client';

// Task 2: Interactive Auth & Registration Form Script

document.addEventListener('DOMContentLoaded', () => {
    // 1. Safe Initialize Lucide Icons
    const initIcons = () => {
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    };
    initIcons();
    window.addEventListener('load', initIcons);

    // 2. Toast Notification Helper
    window.showToast = (message, type = 'success') => {
        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.className = 'fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = `pointer-events-auto px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold flex items-center gap-2.5 transition-all duration-300 transform translate-y-[-10px] opacity-0 ${
            type === 'success'
                ? 'bg-slate-900 border-emerald-500/50 text-emerald-400 shadow-emerald-500/10'
                : 'bg-slate-900 border-rose-500/50 text-rose-400 shadow-rose-500/10'
        }`;

        const iconName = type === 'success' ? 'check-circle-2' : 'alert-triangle';
        toast.innerHTML = `<i data-lucide="${iconName}" class="w-4 h-4 flex-shrink-0"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);

        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-[-10px]', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');
        });

        // Remove after 3.5 seconds
        setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('translate-y-[-10px]', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    };

    // Mode Tab Buttons & Containers
    const tabRegisterBtn = document.getElementById('tabRegisterBtn');
    const tabSigninBtn = document.getElementById('tabSigninBtn');
    const registerFormContainer = document.getElementById('registerFormContainer');
    const signinFormContainer = document.getElementById('signinFormContainer');
    const linkToSignin = document.getElementById('linkToSignin');
    const linkToRegister = document.getElementById('linkToRegister');

    function switchMode(mode) {
        if (mode === 'signin') {
            tabSigninBtn?.classList.add('bg-slate-800', 'text-white');
            tabSigninBtn?.classList.remove('text-slate-400');
            tabRegisterBtn?.classList.remove('bg-slate-800', 'text-white');
            tabRegisterBtn?.classList.add('text-slate-400');

            registerFormContainer?.classList.add('hidden');
            signinFormContainer?.classList.remove('hidden');
        } else {
            tabRegisterBtn?.classList.add('bg-slate-800', 'text-white');
            tabRegisterBtn?.classList.remove('text-slate-400');
            tabSigninBtn?.classList.remove('bg-slate-800', 'text-white');
            tabSigninBtn?.classList.add('text-slate-400');

            signinFormContainer?.classList.add('hidden');
            registerFormContainer?.classList.remove('hidden');
        }
    }

    if (tabRegisterBtn) tabRegisterBtn.addEventListener('click', () => switchMode('register'));
    if (tabSigninBtn) tabSigninBtn.addEventListener('click', () => switchMode('signin'));
    if (linkToSignin) linkToSignin.addEventListener('click', () => switchMode('signin'));
    if (linkToRegister) linkToRegister.addEventListener('click', () => switchMode('register'));

    // Check URL Query Param ?mode=signin
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'signin') {
        switchMode('signin');
    }

    // Elements for Registration
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
    const proceedToSigninModalBtn = document.getElementById('proceedToSigninModalBtn');

    // Elements for Sign In
    const signinForm = document.getElementById('signinForm');
    const signinEmail = document.getElementById('signinEmail');
    const signinPassword = document.getElementById('signinPassword');
    const signinBtn = document.getElementById('signinBtn');
    const signinBtnText = document.getElementById('signinBtnText');
    const signinBtnIcon = document.getElementById('signinBtnIcon');
    const signinSpinner = document.getElementById('signinSpinner');

    // Focus & Blur Glow Handlers for Input Wrappers
    const inputs = [fullnameInput, emailInput, phoneInput, passwordInput, confirmInput, signinEmail, signinPassword];
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

    // Validation Functions
    function validateFullName(value) {
        const trimmed = value.trim();
        return trimmed.length >= 3 && /^[a-zA-Z\s'.-]+$/.test(trimmed);
    }

    function validateEmail(value) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value.trim());
    }

    function formatPhoneNumber(value) {
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

    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            const formatted = formatPhoneNumber(e.target.value);
            e.target.value = formatted;
        });
    }

    // Password Strength
    function checkPasswordStrength(password) {
        let score = 0;
        const rules = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password)
        };

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

    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            if (eyeIcon) eyeIcon.classList.toggle('hidden', isPassword);
            if (eyeOffIcon) eyeOffIcon.classList.toggle('hidden', !isPassword);
        });
    }

    // Generic Field Validation
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
        } else if (input === emailInput || input === signinEmail) {
            isValid = validateEmail(input.value);
        } else if (input === phoneInput) {
            isValid = validatePhone(input.value);
        } else if (input === passwordInput) {
            const { score } = checkPasswordStrength(input.value);
            isValid = score >= 3;
        } else if (input === confirmInput) {
            isValid = input.value.length > 0 && passwordInput && input.value === passwordInput.value;
        } else if (input === signinPassword) {
            isValid = input.value.length >= 6;
        }

        if (input.value.trim() === '') {
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

    // REGISTRATION FORM SUBMISSION
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const isNameValid = validateField(fullnameInput);
            const isEmailValid = validateField(emailInput);
            const isPhoneValid = validateField(phoneInput);
            const isPasswordValid = validateField(passwordInput);
            const isConfirmValid = validateField(confirmInput);
            const isTermsValid = validateTerms();

            const allValid = isNameValid && isEmailValid && isPhoneValid && isPasswordValid && isConfirmValid && isTermsValid;

            if (!allValid) {
                inputs.forEach(input => {
                    if (!input) return;
                    const group = input.closest('.form-group');
                    if (group && group.querySelector('.invalid-glow')) {
                        group.classList.add('animate-shake');
                        setTimeout(() => group.classList.remove('animate-shake'), 400);
                    }
                });
                showToast('Please fix the highlighted errors before submitting.', 'error');
                return;
            }

            if (btnText) btnText.textContent = 'Creating Account...';
            if (btnIcon) btnIcon.classList.add('hidden');
            if (btnSpinner) btnSpinner.classList.remove('hidden');
            if (submitBtn) submitBtn.disabled = true;

            setTimeout(() => {
                if (btnText) btnText.textContent = 'Complete Registration';
                if (btnIcon) btnIcon.classList.remove('hidden');
                if (btnSpinner) btnSpinner.classList.add('hidden');
                if (submitBtn) submitBtn.disabled = false;

                const selectedRole = document.querySelector('input[name="accountRole"]:checked')?.value || 'Developer';
                const nameEl = document.getElementById('modalName');
                const emailEl = document.getElementById('modalEmail');
                const phoneEl = document.getElementById('modalPhone');
                const roleEl = document.getElementById('modalRole');

                if (nameEl) nameEl.textContent = fullnameInput ? fullnameInput.value.trim() : '';
                if (emailEl) emailEl.textContent = emailInput ? emailInput.value.trim() : '';
                if (phoneEl) phoneEl.textContent = phoneInput ? phoneInput.value.trim() : '';
                if (roleEl) roleEl.textContent = selectedRole;

                if (signinEmail && emailInput) {
                    signinEmail.value = emailInput.value.trim();
                }

                showToast('Registration successful! Please sign in.', 'success');
                if (successModal) successModal.classList.remove('hidden');
            }, 1000);
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (successModal) successModal.classList.add('hidden');
            switchMode('signin');
        });
    }

    if (proceedToSigninModalBtn) {
        proceedToSigninModalBtn.addEventListener('click', () => {
            if (successModal) successModal.classList.add('hidden');
            switchMode('signin');
        });
    }

    // SIGN IN FORM SUBMISSION
    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const isEmailValid = validateField(signinEmail);
            const isPasswordValid = validateField(signinPassword);

            if (!isEmailValid || !isPasswordValid) {
                showToast('Please enter valid email and password.', 'error');
                return;
            }

            if (signinBtnText) signinBtnText.textContent = 'Signing In...';
            if (signinBtnIcon) signinBtnIcon.classList.add('hidden');
            if (signinSpinner) signinSpinner.classList.remove('hidden');
            if (signinBtn) signinBtn.disabled = true;

            setTimeout(() => {
                const userEmail = signinEmail.value.trim();
                const photoUrlInput = document.getElementById('photoUrl');
                const userName = userEmail.split('@')[0].replace(/[._]/g, ' ');
                const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);

                const userSession = {
                    name: formattedName,
                    email: userEmail,
                    photoUrl: photoUrlInput ? photoUrlInput.value.trim() : '',
                    avatar: formattedName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                };

                // Store logged in user session
                localStorage.setItem('nexus_user', JSON.stringify(userSession));

                showToast(`Welcome back, ${userSession.name}! Redirecting to home...`, 'success');

                setTimeout(() => {
                    if (window.location.pathname.includes('task1-landing-page')) {
                        window.location.href = 'index.html';
                    } else {
                        window.location.href = '../task1-landing-page/index.html';
                    }
                }, 1000);
            }, 1000);
        });
    }
});
