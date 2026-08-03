'use client';

// Task 1: SaaS Landing Page Script

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

        const iconName = type === 'success' ? 'check-circle-2' : 'info';
        toast.innerHTML = `<i data-lucide="${iconName}" class="w-4 h-4 flex-shrink-0"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);

        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }

        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-[-10px]', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');
        });

        setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('translate-y-[-10px]', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    };

    // 3. User Authentication State & Navbar Management
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

        const savedUser = localStorage.getItem('nexus_user');

        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                if (loggedOutActions) loggedOutActions.classList.add('hidden');
                if (loggedInActions) loggedInActions.classList.remove('hidden');
                if (loggedOutActionsMobile) loggedOutActionsMobile.classList.add('hidden');
                if (loggedInActionsMobile) loggedInActionsMobile.classList.remove('hidden');

                if (user.photoUrl && user.photoUrl.startsWith('http')) {
                    if (userAvatar) userAvatar.innerHTML = `<img src="${user.photoUrl}" alt="${user.name}" class="w-7 h-7 rounded-full object-cover" />`;
                    if (userAvatarMobile) userAvatarMobile.innerHTML = `<img src="${user.photoUrl}" alt="${user.name}" class="w-8 h-8 rounded-full object-cover" />`;
                } else {
                    if (userAvatar) userAvatar.textContent = user.avatar || user.name.charAt(0).toUpperCase();
                    if (userAvatarMobile) userAvatarMobile.textContent = user.avatar || user.name.charAt(0).toUpperCase();
                }
                if (userName) userName.textContent = user.name;
                if (userNameMobile) userNameMobile.textContent = user.name;
                if (userEmailMobile) userEmailMobile.textContent = user.email || '';
            } catch (e) {
                console.error('Failed to parse user session', e);
            }
        } else {
            if (loggedOutActions) loggedOutActions.classList.remove('hidden');
            if (loggedInActions) loggedInActions.classList.add('hidden');
            if (loggedOutActionsMobile) loggedOutActionsMobile.classList.remove('hidden');
            if (loggedInActionsMobile) loggedInActionsMobile.classList.add('hidden');
        }
    }

    checkAuthState();

    // Sign Out Handlers
    const signOutBtn = document.getElementById('signOutBtn');
    const signOutBtnMobile = document.getElementById('signOutBtnMobile');

    function handleSignOut() {
        localStorage.removeItem('nexus_user');
        checkAuthState();
        showToast('Signed out successfully!', 'success');
    }

    if (signOutBtn) signOutBtn.addEventListener('click', handleSignOut);
    if (signOutBtnMobile) signOutBtnMobile.addEventListener('click', handleSignOut);

    // 4. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');
    const closeIcon = document.getElementById('closeIcon');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = !mobileMenu.classList.contains('hidden');
            if (isOpen) {
                mobileMenu.classList.add('hidden');
                if (menuIcon) menuIcon.classList.remove('hidden');
                if (closeIcon) closeIcon.classList.add('hidden');
            } else {
                mobileMenu.classList.remove('hidden');
                if (menuIcon) menuIcon.classList.add('hidden');
                if (closeIcon) closeIcon.classList.remove('hidden');
            }
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                if (menuIcon) menuIcon.classList.remove('hidden');
                if (closeIcon) closeIcon.classList.add('hidden');
            });
        });
    }

    // 5. Sticky Navbar & Active Section Highlight on Scroll
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 40) {
                navbar.classList.add('shadow-xl', 'border-slate-800/80');
            } else {
                navbar.classList.remove('shadow-xl');
            }
        }

        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // 6. Interactive Feature Tabs Switcher
    const featureTabs = document.querySelectorAll('.feature-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    featureTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-target');

            featureTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.add('hidden'));

            tab.classList.add('active');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.remove('hidden');
            }
        });
    });

    // 7. Scroll Triggered Animated Metrics Counter (API & Dynamic Count Fix)
    const counters = document.querySelectorAll('.counter');
    let hasAnimatedCounters = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const targetAttr = counter.getAttribute('data-target');
            const target = parseFloat(targetAttr);
            if (isNaN(target)) return;

            const isFloat = target % 1 !== 0;
            const duration = 1800;
            const steps = 40;
            const stepTime = duration / steps;
            let current = 0;
            const increment = target / steps;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = isFloat ? current.toFixed(2) : Math.floor(current);
            }, stepTime);
        });
    };

    const metricsSection = document.getElementById('metrics');
    if (metricsSection && window.IntersectionObserver) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasAnimatedCounters) {
                hasAnimatedCounters = true;
                animateCounters();
            }
        }, { threshold: 0.1 });

        observer.observe(metricsSection);
    }
    
    // Fallback trigger to guarantee counters never stay at 0 on live site
    setTimeout(() => {
        if (!hasAnimatedCounters) {
            hasAnimatedCounters = true;
            animateCounters();
        }
    }, 1200);

    // 8. Pricing Billing Cycle Toggle (Monthly vs Annual)
    const pricingToggle = document.getElementById('pricingToggle');
    const toggleDot = document.getElementById('toggleDot');
    const monthlyLabel = document.getElementById('monthlyLabel');
    const annualLabel = document.getElementById('annualLabel');
    const priceValues = document.querySelectorAll('.price-value');
    let isAnnual = false;

    if (pricingToggle) {
        pricingToggle.addEventListener('click', () => {
            isAnnual = !isAnnual;

            if (isAnnual) {
                if (toggleDot) {
                    toggleDot.classList.remove('translate-x-0');
                    toggleDot.classList.add('translate-x-6');
                }
                if (monthlyLabel) {
                    monthlyLabel.classList.remove('text-white');
                    monthlyLabel.classList.add('text-slate-400');
                }
                if (annualLabel) {
                    annualLabel.classList.remove('text-slate-400');
                    annualLabel.classList.add('text-white');
                }
            } else {
                if (toggleDot) {
                    toggleDot.classList.remove('translate-x-6');
                    toggleDot.classList.add('translate-x-0');
                }
                if (annualLabel) {
                    annualLabel.classList.remove('text-white');
                    annualLabel.classList.add('text-slate-400');
                }
                if (monthlyLabel) {
                    monthlyLabel.classList.remove('text-slate-400');
                    monthlyLabel.classList.add('text-white');
                }
            }

            priceValues.forEach(price => {
                const val = isAnnual ? price.getAttribute('data-annual') : price.getAttribute('data-monthly');
                if (val !== null) {
                    price.textContent = `$${val}`;
                }
            });
        });
    }

    // 9. FAQ Accordion Toggle
    const faqToggles = document.querySelectorAll('.faq-toggle');

    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const item = toggle.closest('.faq-item');
            if (!item) return;
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.faq-icon');

            const isOpen = answer && !answer.classList.contains('hidden');

            document.querySelectorAll('.faq-answer').forEach(a => a.classList.add('hidden'));
            document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotate-180'));

            if (!isOpen && answer) {
                answer.classList.remove('hidden');
                if (icon) icon.classList.add('rotate-180');
            }
        });
    });

    // 10. Newsletter Form Submission Handler
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterSuccess = document.getElementById('newsletterSuccess');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletterEmail');
            if (emailInput && emailInput.value) {
                newsletterForm.reset();
                showToast('Thank you for subscribing! Check your inbox for updates.', 'success');
                if (newsletterSuccess) {
                    newsletterSuccess.classList.remove('hidden');
                    setTimeout(() => {
                        newsletterSuccess.classList.add('hidden');
                    }, 5000);
                }
            }
        });
    }
});
