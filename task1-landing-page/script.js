// Task 1: SaaS Landing Page Script

document.addEventListener('DOMContentLoaded', () => {
    // 1. Safe Initialize Lucide Icons
    const initIcons = () => {
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    };
    initIcons();
    // Fallback if Lucide script loads asynchronously
    window.addEventListener('load', initIcons);

    // 2. Mobile Menu Toggle
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

        // Close mobile menu on clicking any navigation link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                if (menuIcon) menuIcon.classList.remove('hidden');
                if (closeIcon) closeIcon.classList.add('hidden');
            });
        });
    }

    // 3. Sticky Navbar & Active Section Highlight on Scroll
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        // Sticky shadow boost on scroll
        if (navbar) {
            if (window.scrollY > 40) {
                navbar.classList.add('shadow-xl', 'border-slate-800/80');
            } else {
                navbar.classList.remove('shadow-xl');
            }
        }

        // Active link highlighting based on current scroll position
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

    // 4. Dark Theme Enforced
    const htmlElement = document.documentElement;
    htmlElement.classList.add('dark');
    htmlElement.classList.remove('light');

    // 5. Interactive Feature Tabs Switcher
    const featureTabs = document.querySelectorAll('.feature-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    featureTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-target');

            // Deactivate all tabs
            featureTabs.forEach(t => t.classList.remove('active'));
            // Hide all tab contents
            tabContents.forEach(c => c.classList.add('hidden'));

            // Activate clicked tab
            tab.classList.add('active');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.remove('hidden');
            }
        });
    });

    // 6. Scroll Triggered Animated Metrics Counter
    const counters = document.querySelectorAll('.counter');
    let hasAnimatedCounters = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            if (isNaN(target)) return;
            const isFloat = target % 1 !== 0;
            const duration = 2000; // 2 seconds
            const steps = 50;
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
        }, { threshold: 0.3 });

        observer.observe(metricsSection);
    } else {
        animateCounters();
    }

    // 7. Pricing Billing Cycle Toggle (Monthly vs Annual)
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

    // 8. FAQ Accordion Toggle
    const faqToggles = document.querySelectorAll('.faq-toggle');

    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const item = toggle.closest('.faq-item');
            if (!item) return;
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.faq-icon');

            const isOpen = answer && !answer.classList.contains('hidden');

            // Close all other FAQs
            document.querySelectorAll('.faq-answer').forEach(a => a.classList.add('hidden'));
            document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotate-180'));

            if (!isOpen && answer) {
                answer.classList.remove('hidden');
                if (icon) icon.classList.add('rotate-180');
            }
        });
    });

    // 9. Newsletter Form Submission Handler
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterSuccess = document.getElementById('newsletterSuccess');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletterEmail');
            if (emailInput && emailInput.value) {
                newsletterForm.reset();
                if (newsletterSuccess) {
                    newsletterSuccess.classList.remove('hidden');
                    setTimeout(() => {
                        newsletterSuccess.classList.add('hidden');
                    }, 5000);
                }
            }
        });
    }

    // 10. Watch Demo Button Handler
    const watchDemoBtn = document.getElementById('watchDemoBtn');
    if (watchDemoBtn) {
        watchDemoBtn.addEventListener('click', () => {
            alert('🎥 Interactive Product Video Tour:\n\nNexusAI v2.5 live workflow engine is loading. Experience automated CI/CD and AI pipeline healing!');
        });
    }
});
