'use client';

// Task 1: SaaS Landing Page & Auth Script

// 1. Initialize Lucide Icons Safely
function initIcons() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// 2. Toast Notification Helper
window.showToast = function (message, type = 'success') {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `pointer-events-auto px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold flex items-center gap-2.5 transition-all duration-300 transform -translate-y-2 opacity-0 ${type === 'success'
            ? 'bg-slate-900 border-emerald-500/50 text-emerald-400 shadow-emerald-500/10'
            : 'bg-slate-900 border-rose-500/50 text-rose-400 shadow-rose-500/10'
        }`;

    const iconName = type === 'success' ? 'check-circle-2' : 'info';
    toast.innerHTML = `<i data-lucide="${iconName}" class="w-4 h-4 flex-shrink-0"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    initIcons();

    requestAnimationFrame(() => {
        toast.classList.remove('-translate-y-2', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
    });

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('-translate-y-2', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
};

// 3. Main Auth Checker Function
function checkAuthState() {
    const loggedOutActions = document.getElementById('loggedOutActions');
    const loggedInActions = document.getElementById('loggedInActions');
    const loggedOutActionsMobile = document.getElementById('loggedOutActionsMobile');
    const loggedInActionsMobile = document.getElementById('loggedInActionsMobile');

    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userAvatarMobile = document.getElementById('userAvatarMobile');
    const userNameMobile = document.getElementById('userNameMobile');
    const userEmailMobile = document.getElementById('userEmailMobile');

    // Retrieve localstorage session
    const savedUser = localStorage.getItem('nexus_user');
    const legacyLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const legacyEmail = localStorage.getItem('userEmail');

    let user = null;

    if (savedUser) {
        try {
            user = JSON.parse(savedUser);
        } catch (e) {
            console.error('Session JSON Parse Error', e);
        }
    } else if (legacyLoggedIn && legacyEmail) {
        const userNameRaw = legacyEmail.split('@')[0].replace(/[._]/g, ' ');
        const formattedName = userNameRaw.charAt(0).toUpperCase() + userNameRaw.slice(1);
        user = {
            name: formattedName,
            email: legacyEmail,
            avatar: formattedName.charAt(0).toUpperCase()
        };
    }

    // IF USER IS LOGGED IN
    if (user) {
        // Toggle Desktop Actions
        if (loggedOutActions) loggedOutActions.setAttribute('style', 'display: none !important');
        if (loggedInActions) loggedInActions.setAttribute('style', 'display: flex !important');

        // Toggle Mobile Actions
        if (loggedOutActionsMobile) loggedOutActionsMobile.setAttribute('style', 'display: none !important');
        if (loggedInActionsMobile) loggedInActionsMobile.setAttribute('style', 'display: flex !important');

        // Render Avatar Initial / Image
        const initial = user.avatar || (user.name ? user.name.charAt(0).toUpperCase() : 'U');

        if (user.photoUrl && user.photoUrl.startsWith('http')) {
            const imgHtml = `<img src="${user.photoUrl}" alt="${user.name}" class="w-full h-full object-cover" />`;
            if (userAvatar) userAvatar.innerHTML = imgHtml;
            if (userAvatarMobile) userAvatarMobile.innerHTML = imgHtml;
        } else {
            if (userAvatar) userAvatar.textContent = initial;
            if (userAvatarMobile) userAvatarMobile.textContent = initial;
        }

        if (userName) userName.textContent = user.name || 'User';
        if (userNameMobile) userNameMobile.textContent = user.name || 'User';
        if (userEmailMobile) userEmailMobile.textContent = user.email || '';

        // Toast Notification on Login
        if (sessionStorage.getItem('nexus_just_logged_in') === 'true') {
            sessionStorage.removeItem('nexus_just_logged_in');
            setTimeout(() => {
                showToast(`Welcome back, ${user.name}!`, 'success');
            }, 300);
        }
    }
    // IF USER IS LOGGED OUT
    else {
        if (loggedOutActions) loggedOutActions.setAttribute('style', 'display: flex !important');
        if (loggedInActions) loggedInActions.setAttribute('style', 'display: none !important');

        if (loggedOutActionsMobile) loggedOutActionsMobile.setAttribute('style', 'display: flex !important');
        if (loggedInActionsMobile) loggedInActionsMobile.setAttribute('style', 'display: none !important');
    }

    initIcons();
}

// 4. Sign Out Function
function handleSignOut() {
    localStorage.removeItem('nexus_user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    checkAuthState();
    showToast('Signed out successfully!', 'success');
}

// 5. Initialize Events
document.addEventListener('DOMContentLoaded', () => {
    checkAuthState();

    const signOutBtn = document.getElementById('signOutBtn');
    const signOutBtnMobile = document.getElementById('signOutBtnMobile');

    if (signOutBtn) signOutBtn.addEventListener('click', handleSignOut);
    if (signOutBtnMobile) signOutBtnMobile.addEventListener('click', handleSignOut);

    // Mobile Drawer Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // FAQ Accordion
    const faqToggles = document.querySelectorAll('.faq-toggle');
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const item = toggle.closest('.faq-item');
            if (!item) return;
            const answer = item.querySelector('.faq-answer');
            if (answer) answer.classList.toggle('hidden');
        });
    });
});

// Force Check Auth on Back/Forward Navigation & Redirects
window.addEventListener('pageshow', checkAuthState);
window.addEventListener('load', checkAuthState);