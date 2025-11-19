// Main JavaScript for Kommærsj website
document.addEventListener('DOMContentLoaded', function() {
    console.log('Kommærsj website initialized');
    
    // Initialize all components
    initializeLogoIntro();
    initializeNavigation();
    initializeMobileMenu();
    initializeScrollEffects();
    initializeFormHandling();
    initializeBackToTop();
    initializeScrollButtons();
    initializeServicesInteractions();
    initializeHorizontalTestimonialCarousel();
});

// Logo Intro Animation
function initializeLogoIntro() {
    const overlay = document.getElementById('logo-intro-overlay');
    if (overlay) {
        // Check if user has already seen the intro in this session
        const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
        
        if (hasSeenIntro) {
            // Skip animation - hide overlay immediately
            overlay.style.display = 'none';
            document.body.classList.remove('intro-active');
        } else {
            // Show animation and mark as seen
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.style.display = 'none';
                    document.body.classList.remove('intro-active');
                    // Mark intro as seen for this session
                    sessionStorage.setItem('hasSeenIntro', 'true');
                }, 500);
            }, 3500); // 3.5 seconds
        }
    }
}

// Navigation
function initializeNavigation() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    
                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobileMenu');
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        mobileMenu.classList.remove('active');
                        document.getElementById('mobileMenuOverlay').classList.remove('active');
                    }
                }
            }
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Mobile Menu
function initializeMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            mobileMenuOverlay.classList.add('active');
        });

        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
        });

        mobileMenuOverlay.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
        });
    }
}

// Scroll Effects
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate numbers
                if (entry.target.classList.contains('stat-number')) {
                    animateNumber(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.fade-in-left, .fade-in-right, .fade-in-up, .service-card, .review-card, .stat-number').forEach(el => {
        observer.observe(el);
    });
}

// Animate Numbers
function animateNumber(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasPercent = text.includes('%');
    const target = parseInt(text.replace(/[^0-9]/g, ''));
    
    if (isNaN(target)) return;
    
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target + (hasPlus ? '+' : '') + (hasPercent ? '%' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (hasPlus ? '+' : '') + (hasPercent ? '%' : '');
        }
    }, 16);
}

// Form Handling
function initializeFormHandling() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Toggle loading state on the submit button
            const submitBtn = form.querySelector('.submit-btn');
            if (submitBtn) submitBtn.classList.add('loading');
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // For now, just show success message
            // You can add email service integration later (EmailJS, Formspree, etc.)
            showNotification('Takk for din melding! Vi kommer tilbake til deg snart.', 'success');
            form.reset();

            // Remove loading state after brief delay
            setTimeout(() => {
                if (submitBtn) submitBtn.classList.remove('loading');
            }, 1200);
        });
    }
}

// Notification System
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles if not already present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--ferrari-black);
                color: var(--ferrari-white);
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                opacity: 0;
                transform: translateX(400px);
                transition: all 0.3s ease;
                border-left: 4px solid var(--main-gold);
                max-width: 400px;
            }
            .notification.success {
                border-left-color: var(--main-gold);
            }
            .notification.error {
                border-left-color: #dc3545;
            }
            .notification.show {
                opacity: 1;
                transform: translateX(0);
            }
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
            }
            .notification-close {
                background: none;
                border: none;
                color: var(--ferrari-white);
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Back to Top Button
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Scroll Buttons
function initializeScrollButtons() {
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// Services Card Interactions
function initializeServicesInteractions() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// Horizontal Testimonial Carousel with Auto-Scroll
function initializeHorizontalTestimonialCarousel() {
    const track = document.getElementById('testimonialCarouselTrack');
    if (!track) return;
    
    const slides = track.querySelectorAll('.testimonial-slide');
    const indicators = document.querySelectorAll('#testimonialIndicators .indicator');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    
    if (slides.length === 0) return;
    
    let currentIndex = 0;
    let autoScrollInterval;
    
    function scrollToSlide(index) {
        const slideWidth = slides[0].offsetWidth;
        track.style.transform = `translateX(-${index * slideWidth}px)`;
        
        // Update indicators
        indicators.forEach((indicator, i) => {
            if (i === index) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
        
        currentIndex = index;
    }
    
    function nextSlide() {
        const newIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
        scrollToSlide(newIndex);
    }
    
    function prevSlide() {
        const newIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
        scrollToSlide(newIndex);
    }
    
    // Auto-scroll functionality
    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            nextSlide();
        }, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
        }
    }
    
    function resetAutoScroll() {
        stopAutoScroll();
        startAutoScroll();
    }
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoScroll();
        });
    }
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoScroll();
        });
    }
    
    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            scrollToSlide(index);
            resetAutoScroll();
        });
    });
    
    // Pause auto-scroll on hover
    track.addEventListener('mouseenter', stopAutoScroll);
    track.addEventListener('mouseleave', startAutoScroll);
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            scrollToSlide(currentIndex);
        }, 250);
    });
    
    // Start auto-scrolling
    startAutoScroll();
    
    // Initialize first slide
    scrollToSlide(0);
}
