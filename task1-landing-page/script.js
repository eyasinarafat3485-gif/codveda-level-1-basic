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

    if (user) {
        if (loggedOutActions) {
            loggedOutActions.classList.add('hidden');
            loggedOutActions.style.setProperty('display', 'none', 'important');
        }
        if (loggedInActions) {
            loggedInActions.classList.remove('hidden');
            loggedInActions.classList.add('flex');
            loggedInActions.style.setProperty('display', 'flex', 'important');
        }

        if (loggedOutActionsMobile) {
            loggedOutActionsMobile.classList.add('hidden');
            loggedOutActionsMobile.style.setProperty('display', 'none', 'important');
        }
        if (loggedInActionsMobile) {
            loggedInActionsMobile.classList.remove('hidden');
            loggedInActionsMobile.classList.add('flex');
            loggedInActionsMobile.style.setProperty('display', 'flex', 'important');
        }

        const initial = user.avatar || (user.name ? user.name.charAt(0).toUpperCase() : 'U');
        const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || 'User')}`;
        const avatarUrl = (user.photoUrl && user.photoUrl.startsWith('http')) ? user.photoUrl : defaultAvatar;

        const imgHtml = `<img src="${avatarUrl}" alt="${user.name || 'User'}" class="w-full h-full object-cover rounded-full" onError="this.style.display='none'; this.nextElementSibling.style.display='flex';" /><span class="hidden w-full h-full items-center justify-center font-bold text-xs text-white">${initial}</span>`;

        if (userAvatar) userAvatar.innerHTML = imgHtml;
        if (userAvatarMobile) userAvatarMobile.innerHTML = imgHtml;

        if (userName) userName.textContent = user.name || 'User';
        if (userNameMobile) userNameMobile.textContent = user.name || 'User';
        if (userEmailMobile) userEmailMobile.textContent = user.email || '';

        if (sessionStorage.getItem('nexus_just_logged_in') === 'true') {
            sessionStorage.removeItem('nexus_just_logged_in');
            setTimeout(() => {
                if (window.showToast) showToast(`Welcome back, ${user.name}!`, 'success');
            }, 300);
        }
    } else {
        if (loggedOutActions) {
            loggedOutActions.classList.remove('hidden');
            loggedOutActions.style.setProperty('display', 'flex', 'important');
        }
        if (loggedInActions) {
            loggedInActions.classList.add('hidden');
            loggedInActions.style.setProperty('display', 'none', 'important');
        }

        if (loggedOutActionsMobile) {
            loggedOutActionsMobile.classList.remove('hidden');
            loggedOutActionsMobile.style.setProperty('display', 'flex', 'important');
        }
        if (loggedInActionsMobile) {
            loggedInActionsMobile.classList.add('hidden');
            loggedInActionsMobile.style.setProperty('display', 'none', 'important');
        }
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
    const menuIcon = document.getElementById('menuIcon');
    const closeIcon = document.getElementById('closeIcon');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            if (menuIcon) menuIcon.classList.toggle('hidden');
            if (closeIcon) closeIcon.classList.toggle('hidden');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                if (menuIcon) menuIcon.classList.remove('hidden');
                if (closeIcon) closeIcon.classList.add('hidden');
            });
        });
    }

    // Feature Tabs Toggle Logic
    const featureTabs = document.querySelectorAll(".feature-tab");
    const featureContents = document.querySelectorAll(".tab-content");

    featureTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const targetId = tab.getAttribute("data-target");

            featureTabs.forEach(t => {
                t.classList.remove("active", "bg-slate-800", "text-white");
                t.classList.add("text-slate-300");
            });

            tab.classList.add("active", "bg-slate-800", "text-white");
            tab.classList.remove("text-slate-300");

            featureContents.forEach(content => {
                content.classList.add("hidden");
                content.classList.remove("block");
            });

            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.remove("hidden");
                targetContent.classList.add("block");
            }
        });
    });

    // Pricing Monthly / Annual Toggle
    const pricingToggle = document.getElementById("pricingToggle");
    const toggleDot = document.getElementById("toggleDot");
    const monthlyLabel = document.getElementById("monthlyLabel");
    const annualLabel = document.getElementById("annualLabel");
    const priceValues = document.querySelectorAll(".price-value");

    let isAnnual = false;

    if (pricingToggle) {
        pricingToggle.addEventListener("click", () => {
            isAnnual = !isAnnual;

            if (isAnnual) {
                toggleDot.style.transform = "translateX(24px)";
                monthlyLabel.classList.replace("text-white", "text-slate-400");
                annualLabel.classList.replace("text-slate-400", "text-white");
            } else {
                toggleDot.style.transform = "translateX(0px)";
                monthlyLabel.classList.replace("text-slate-400", "text-white");
                annualLabel.classList.replace("text-white", "text-slate-400");
            }

            priceValues.forEach(price => {
                const monthlyPrice = price.getAttribute("data-monthly");
                const annualPrice = price.getAttribute("data-annual");
                price.textContent = `$${isAnnual ? annualPrice : monthlyPrice}`;
            });
        });
    }

    // Metrics Counters Animation
    const counters = document.querySelectorAll(".counter");
    let animated = false;

    const runCounters = () => {
        counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute("data-target"));
            let current = 0;
            const increment = target / 50;

            const updateCount = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Number.isInteger(target) ? Math.ceil(current) : current.toFixed(2);
                    setTimeout(updateCount, 30);
                } else {
                    counter.textContent = target;
                }
            };
            updateCount();
        });
    };

    const metricsSection = document.getElementById("metrics");
    if (metricsSection) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    runCounters();
                    animated = true;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(metricsSection);
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const toggleBtn = item.querySelector('.faq-toggle');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.querySelector('.faq-answer').classList.add('hidden');
                        const otherIcon = otherItem.querySelector('.faq-icon');
                        if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                    }
                });

                if (answer) answer.classList.toggle('hidden');
                if (icon) {
                    if (answer.classList.contains('hidden')) {
                        icon.style.transform = 'rotate(0deg)';
                    } else {
                        icon.style.transform = 'rotate(180deg)';
                    }
                }
            });
        }
    });

    // Newsletter Form
    const newsletterForm = document.getElementById("newsletterForm");
    const newsletterSuccess = document.getElementById("newsletterSuccess");

    if (newsletterForm) {
        newsletterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            newsletterForm.classList.add("hidden");
            if (newsletterSuccess) {
                newsletterSuccess.classList.remove("hidden");
            }
        });
    }
});

// Force Check Auth on Back/Forward Navigation & Redirects
window.addEventListener('pageshow', checkAuthState);
window.addEventListener('load', checkAuthState);