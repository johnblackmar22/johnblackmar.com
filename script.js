// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav a');
    const header = document.querySelector('header');
    
    // Feature detection for iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                 (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    if (isIOS) {
        document.documentElement.classList.add('ios-device');
        
        // Fix for iOS Safari 100vh issue
        const fixVh = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        fixVh();
        window.addEventListener('resize', fixVh);
        window.addEventListener('orientationchange', fixVh);
    }
    
    // Ensure all images are loaded correctly on iOS
    const allImages = document.querySelectorAll('img');
    if (allImages && allImages.length > 0) {
        allImages.forEach(img => {
            // Force load images that might be lazy loaded
            if (img && !img.complete) {
                img.onload = function() {
                    // Trigger layout recalculation after image loads
                    if (isIOS) {
                        setTimeout(() => {
                            window.dispatchEvent(new Event('resize'));
                        }, 300);
                    }
                };
                
                // If there's a data-src, ensure it's loaded
                if (img.getAttribute('data-src')) {
                    img.src = img.getAttribute('data-src');
                }
                
                // If image fails to load, provide a fallback
                img.onerror = function() {
                    console.warn('Image failed to load:', img.src);
                    // Don't set a placeholder - just make it visible
                    img.style.display = 'block';
                    img.style.opacity = '1';
                    img.style.visibility = 'visible';
                };
            }
        });
    }
    
    // Initialize and add reveal animations
    initRevealAnimations();
    
    // Initialize logo behavior
    initLogoScroll();
    
    // Mobile menu toggle
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            mobileMenuToggle.setAttribute('aria-expanded', 
                this.classList.contains('active').toString());
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (nav && nav.classList.contains('active') && !event.target.closest('nav') && !event.target.closest('.mobile-menu-toggle')) {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('menu-open');
            }
        });
        
        // Close mobile menu when clicking on a nav link
        if (navLinks && navLinks.length > 0) {
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    if (nav) {
                        nav.classList.remove('active');
                        if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }
                });
            });
        }
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (anchor) {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (!targetId || targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without scrolling
                    history.pushState(null, '', targetId);
                }
            });
        }
    });
    
    // Header scroll effect
    if (header) {
        const scrollThreshold = 100;
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Initialize scrollReveal if present
    if (typeof ScrollReveal === 'function') {
        try {
            const sr = ScrollReveal({
                distance: '30px',
                duration: 1000,
                easing: 'ease-in-out',
                reset: false
            });
            
            sr.reveal('.about-content, .logo-grid, .contact-form-container', {
                origin: 'bottom',
                interval: 200
            });
        } catch (e) {
            console.error('ScrollReveal error:', e);
        }
    }
    
    // Performance Optimizations
    
    // 1. Lazy load images - Fixed to prevent undefined errors
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if (lazyImages && lazyImages.length > 0) {
        lazyImages.forEach(img => {
            // Safety check - only set if both img and dataset exist
            if (img && img.dataset && typeof img.dataset.src === 'string' && img.dataset.src.trim() !== '') {
                img.src = img.dataset.src;
            }
        });
    }
    
    // 2. Defer non-critical CSS
    const loadDeferredStyles = function() {
        const deferredStyles = document.querySelectorAll('link[rel="stylesheet"][media="print"][onload]');
        if (deferredStyles && deferredStyles.length > 0) {
            deferredStyles.forEach(link => {
                if (link) link.media = 'all';
            });
        }
    };
    
    // Apply deferred styles after page load
    if (window.addEventListener) {
        window.addEventListener('load', loadDeferredStyles);
    } else if (window.attachEvent) {
        window.attachEvent('onload', loadDeferredStyles);
    }
    
    // Form validation and submission handling
    const contactForm = document.querySelector('form[name="contact"]');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            let isValid = true;
            const formElements = contactForm.elements;
            
            // Basic form validation
            for (let i = 0; formElements && i < formElements.length; i++) {
                const element = formElements[i];
                if (element && element.hasAttribute && element.hasAttribute('required') && (!element.value || !element.value.trim())) {
                    isValid = false;
                    element.classList.add('error');
                } else if (element && element.type === 'email' && element.value && !isValidEmail(element.value)) {
                    isValid = false;
                    element.classList.add('error');
                } else if (element) {
                    element.classList.remove('error');
                }
            }
            
            if (!isValid) {
                e.preventDefault();
                showFormStatus('Please fill in all required fields correctly.', 'error');
            }
        });
        
        // Remove error class on input
        const formInputs = contactForm.querySelectorAll('input, textarea');
        if (formInputs && formInputs.length > 0) {
            formInputs.forEach(input => {
                if (input) {
                    input.addEventListener('input', function() {
                        this.classList.remove('error');
                        const formStatus = document.querySelector('.form-status');
                        if (formStatus) {
                            formStatus.remove();
                        }
                    });
                }
            });
        }
    }
    
    // Fix iOS-specific issues
    if (isIOS) {
        // Fix for iOS input focus issues
        const inputs = document.querySelectorAll('input, textarea');
        if (inputs && inputs.length > 0) {
            inputs.forEach(input => {
                if (input) {
                    input.addEventListener('focus', function() {
                        setTimeout(function() {
                            window.scrollTo(0, window.pageYOffset + 1);
                            window.scrollTo(0, window.pageYOffset - 1);
                        }, 100);
                    });
                }
            });
        }
    }
    
    // Helper functions
    function isValidEmail(email) {
        if (!email || typeof email !== 'string') return false;
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function showFormStatus(message, type) {
        if (!contactForm) return;
        
        let formStatus = document.querySelector('.form-status');
        if (!formStatus) {
            formStatus = document.createElement('div');
            formStatus.className = 'form-status';
            contactForm.appendChild(formStatus);
        }
        
        formStatus.textContent = message || '';
        formStatus.className = 'form-status ' + (type || '');
        
        // Safely scroll into view
        try {
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'end' });
        } catch (e) {
            // Fallback if scrollIntoView fails
            window.scrollTo(0, formStatus.offsetTop);
        }
    }
    
    // Initialize testimonial slider
    initTestimonialSlider();
    
    // Initialize back to top button
    initBackToTop();

    // Intersection Observer for section animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Handle escape key for accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            nav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

// Utility Functions
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function initRevealAnimations() {
    const elements = document.querySelectorAll('.reveal-element');
    const aboutBio = document.querySelector('.about-bio');
    
    if (elements && elements.length > 0) {
        elements.forEach(element => {
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
            }
        });
    }
    
    const revealOnScroll = throttle(function() {
        if (elements && elements.length > 0) {
            elements.forEach(element => {
                if (!element) return;
                
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('active');
                }
            });
        }
        
        // Add reveal for about section text
        if (aboutBio) {
            const bioTop = aboutBio.getBoundingClientRect().top;
            const bioVisible = 150;
            
            if (bioTop < window.innerHeight - bioVisible) {
                aboutBio.classList.add('reveal-active');
            }
        }
    }, 100);
    
    window.addEventListener('scroll', revealOnScroll);
    
    // Initial check
    setTimeout(revealOnScroll, 500);
}

// Initialize logo behavior
function initLogoScroll() {
    const logoGrid = document.querySelector('.logo-grid');
    const logoItems = document.querySelectorAll('.logo-item');
    
    if (!logoGrid || !logoItems || logoItems.length === 0) return;
    
    // Add reveal animation to logos instead of auto-scroll
    logoItems.forEach((item, index) => {
        // Set initial state
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        // Add animation with staggered delay
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        }, 300 + (index * 150)); // Stagger the animations
    });
    
    // Add hover effect for desktop
    if (window.innerWidth > 768) {
        logoItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'scale(1.05)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'scale(1)';
            });
        });
    }
}

// Initialize testimonial slider
function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    
    if (!slides.length || !dots.length) return;
    
    let currentSlide = 0;
    let slideInterval;
    
    // Function to show a specific slide
    const showSlide = (index) => {
        // Reset active class
        slides.forEach(slide => {
            slide.style.transform = `translateX(-${index * 100}%)`;
        });
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentSlide = index;
    };
    
    // Auto advance slides
    const startSlideShow = () => {
        slideInterval = setInterval(() => {
            let nextSlide = (currentSlide + 1) % slides.length;
            showSlide(nextSlide);
        }, 5000); // Change slide every 5 seconds
    };
    
    // Set up click events for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            showSlide(index);
            startSlideShow();
        });
    });
    
    // Initialize slider
    showSlide(0);
    startSlideShow();
}

// Back to Top Button Functionality
function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (!backToTopButton) return;
    
    // Show button when user scrolls down 300px
    const toggleBackToTopButton = () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    };
    
    // Smooth scroll to top when clicked
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Check scroll position on load
    toggleBackToTopButton();
    
    // Add scroll event listener
    window.addEventListener('scroll', throttle(toggleBackToTopButton, 200));
} 