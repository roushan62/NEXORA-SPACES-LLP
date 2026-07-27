/* ===================================
   NEXORA SPACES - JAVASCRIPT
   All Interactive Functionality
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initScrollProgress();
    initNavbar();
    initMobileMenu();
    initStatCounters();
    initCalculator();
    initPortfolioFilter();
    initTestimonialCarousel();
    initFAQ();
    initProcessTabs();
    initCalcTabs();
    initLightbox();
    initBackToTop();
    initSmoothScroll();
    initAnimations();
    initBreakdownBars();
});

/* ===================================
   SCROLL PROGRESS
   =================================== */
function initScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    
    if (!scrollProgress) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.width = progress + '%';
    });
}

/* ===================================
   NAVBAR SCROLL EFFECT
   =================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ===================================
   MOBILE MENU
   =================================== */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (!mobileMenuBtn || !navLinks) return;
    
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        
        if (navLinks.classList.contains('active')) {
            icon.setAttribute('data-lucide', 'x');
        } else {
            icon.setAttribute('data-lucide', 'menu');
        }
        
        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });
}

/* ===================================
   STAT COUNTERS ANIMATION
   =================================== */
function initStatCounters() {
    const statItems = document.querySelectorAll('.stat-item');
    
    if (statItems.length === 0) return;
    
    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 60;
        const duration = 2000;
        const stepTime = duration / 60;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, stepTime);
    };
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                const targetCount = parseInt(entry.target.dataset.count);
                
                if (statNumber && targetCount) {
                    animateCounter(statNumber, targetCount);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statItems.forEach(item => observer.observe(item));
}

/* ===================================
   CALCULATOR FUNCTIONALITY
   =================================== */
function initCalculator() {
    // Residential Calculator
    const citySelect = document.getElementById('citySelect');
    const propertyType = document.getElementById('propertyType');
    const carpetArea = document.getElementById('carpetArea');
    const areaValue = document.getElementById('areaValue');
    const packageBtns = document.querySelectorAll('.package-btn');
    const roomCheckboxes = document.querySelectorAll('input[name="rooms"]');
    
    // Result elements
    const minPriceEl = document.getElementById('minPrice');
    const maxPriceEl = document.getElementById('maxPrice');
    const furnitureCostEl = document.getElementById('furnitureCost');
    const civilCostEl = document.getElementById('civilCost');
    const electricalCostEl = document.getElementById('electricalCost');
    const finishesCostEl = document.getElementById('finishesCost');
    
    // City base rates (per sq.ft)
    const cityRates = {
        'bangalore': 950,
        'mumbai': 1100,
        'delhi': 1050,
        'hyderabad': 850,
        'chennai': 900,
        'pune': 880,
        'kolkata': 780,
        'ahmedabad': 750
    };
    
    // Property multipliers
    const propertyMultipliers = {
        '1bhk': 0.85,
        '2bhk': 1.0,
        '3bhk': 1.1,
        '4bhk': 1.25,
        '5bhk': 1.4
    };
    
    // Package multipliers
    const packageMultipliers = {
        'essential': 1.0,
        'premium': 1.35,
        'luxury': 1.85
    };
    
    // Room weights
    const roomWeights = {
        'kitchen': 1.3,
        'living': 1.0,
        'master-bedroom': 1.1,
        'bedroom2': 0.9,
        'bedroom3': 0.85,
        'bathrooms': 0.4
    };
    
    let selectedPackage = 'premium';
    let selectedRooms = ['kitchen', 'living', 'master-bedroom'];
    
    // Update area display
    if (carpetArea && areaValue) {
        carpetArea.addEventListener('input', () => {
            areaValue.textContent = carpetArea.value;
            calculateResidentialCost();
        });
    }
    
    // Package selection
    packageBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            packageBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedPackage = btn.dataset.tier;
            calculateResidentialCost();
        });
    });
    
    // Room checkboxes
    roomCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            selectedRooms = Array.from(roomCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            calculateResidentialCost();
        });
    });
    
    // City and property type change
    if (citySelect) {
        citySelect.addEventListener('change', calculateResidentialCost);
    }
    
    if (propertyType) {
        propertyType.addEventListener('change', calculateResidentialCost);
    }
    
    // Main calculation function
    function calculateResidentialCost() {
        const city = citySelect ? citySelect.value : 'bangalore';
        const property = propertyType ? propertyType.value : '2bhk';
        const area = carpetArea ? parseInt(carpetArea.value) : 850;
        
        const baseRate = cityRates[city] || 950;
        const propertyMult = propertyMultipliers[property] || 1.0;
        const packageMult = packageMultipliers[selectedPackage] || 1.35;
        
        // Calculate room factor
        let roomFactor = 0;
        selectedRooms.forEach(room => {
            roomFactor += roomWeights[room] || 1;
        });
        const roomFactorNorm = roomFactor / 5.7; // Normalize based on typical selection
        
        // Calculate total
        const baseCost = baseRate * area * propertyMult * packageMult;
        const totalMin = Math.round(baseCost * 0.85 * roomFactorNorm);
        const totalMax = Math.round(baseCost * 1.05 * roomFactorNorm);
        
        // Update display with animation
        animateValue(minPriceEl, totalMin);
        animateValue(maxPriceEl, totalMax);
        
        // Calculate breakdown
        const furniture = Math.round(totalMin * 0.42);
        const civil = Math.round(totalMin * 0.25);
        const electrical = Math.round(totalMin * 0.16);
        const finishes = Math.round(totalMin * 0.17);
        
        animateValue(furnitureCostEl, furniture);
        animateValue(civilCostEl, civil);
        animateValue(electricalCostEl, electrical);
        animateValue(finishesCostEl, finishes);
        
        // Update breakdown bars
        updateBreakdownBars();
    }
    
    // Animate number display
    function animateValue(element, value) {
        if (!element) return;
        
        const formatted = formatCurrency(value);
        element.textContent = formatted;
    }
    
    // Format currency
    function formatCurrency(value) {
        if (value >= 10000000) {
            return (value / 10000000).toFixed(2) + ' Cr';
        } else if (value >= 100000) {
            return (value / 100000).toFixed(2) + ' L';
        } else if (value >= 1000) {
            return Math.round(value / 1000) + ',000';
        }
        return value.toLocaleString('en-IN');
    }
    
    // Initialize with proper format
    function initCalcValues() {
        if (minPriceEl) minPriceEl.textContent = '11,50,000';
        if (maxPriceEl) maxPriceEl.textContent = '14,20,000';
    }
    
    initCalcValues();
    calculateResidentialCost();
    
    // Commercial Calculator
    const commArea = document.getElementById('commArea');
    const commAreaValue = document.getElementById('commAreaValue');
    const spaceType = document.getElementById('spaceType');
    const commScopeCheckboxes = document.querySelectorAll('input[name="comm-scope"]');
    const commMinPriceEl = document.getElementById('commMinPrice');
    const commMaxPriceEl = document.getElementById('commMaxPrice');
    
    if (commArea && commAreaValue) {
        commArea.addEventListener('input', () => {
            commAreaValue.textContent = commArea.value;
            calculateCommercialCost();
        });
    }
    
    if (spaceType) {
        spaceType.addEventListener('change', calculateCommercialCost);
    }
    
    commScopeCheckboxes.forEach(cb => {
        cb.addEventListener('change', calculateCommercialCost);
    });
    
    function calculateCommercialCost() {
        const area = commArea ? parseInt(commArea.value) : 2000;
        const scope = spaceType ? spaceType.value : 'office';
        
        // Count selected scopes
        let scopeCount = 1;
        commScopeCheckboxes.forEach(cb => {
            if (cb.checked) scopeCount++;
        });
        
        // Base consultancy fee per sq.ft
        let baseRate = 125;
        
        // Space type adjustments
        const spaceRates = {
            'office': 125,
            'retail': 100,
            'restaurant': 150,
            'hotel': 175,
            'clinic': 130,
            'other': 110
        };
        
        baseRate = spaceRates[scope] || 125;
        
        // Calculate fee
        const baseFee = baseRate * area;
        const scopeMultiplier = 0.15 * scopeCount;
        
        const minFee = Math.round(baseFee * (0.8 + scopeMultiplier) / 1000) * 1000;
        const maxFee = Math.round(baseFee * (1.2 + scopeMultiplier) / 1000) * 1000;
        
        if (commMinPriceEl) commMinPriceEl.textContent = formatCurrency(minFee);
        if (commMaxPriceEl) commMaxPriceEl.textContent = formatCurrency(maxFee);
    }
    
    calculateCommercialCost();
}

/* ===================================
   BREAKDOWN BARS ANIMATION
   =================================== */
function initBreakdownBars() {
    const bars = document.querySelectorAll('.bar-fill');
    
    if (bars.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.dataset.width;
                setTimeout(() => {
                    entry.target.style.width = width + '%';
                }, 300);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    bars.forEach(bar => observer.observe(bar));
}

/* ===================================
   PORTFOLIO FILTER
   =================================== */
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterBtns.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter items
            portfolioItems.forEach(item => {
                const category = item.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* ===================================
   TESTIMONIAL CAROUSEL
   =================================== */
function initTestimonialCarousel() {
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');
    
    if (!track) return;
    
    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    let cardsPerView = 3;
    
    // Adjust cards per view based on screen size
    function updateCardsPerView() {
        if (window.innerWidth <= 768) {
            cardsPerView = 1;
        } else if (window.innerWidth <= 1024) {
            cardsPerView = 2;
        } else {
            cardsPerView = 3;
        }
    }
    
    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    
    // Create dots
    const totalDots = Math.ceil(cards.length / cardsPerView);
    
    if (dotsContainer) {
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];
    
    function updateCarousel() {
        const cardWidth = cards[0].offsetWidth + 24; // Including gap
        track.style.transform = `translateX(-${currentIndex * cardWidth * cardsPerView}px)`;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    function goToSlide(index) {
        const maxIndex = Math.max(0, cards.length - cardsPerView);
        currentIndex = Math.min(index, maxIndex);
        updateCarousel();
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = Math.max(0, currentIndex - 1);
            updateCarousel();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const maxIndex = Math.max(0, cards.length - cardsPerView);
            currentIndex = Math.min(currentIndex + 1, maxIndex);
            updateCarousel();
        });
    }
    
    // Auto-scroll
    let autoScrollInterval = setInterval(() => {
        const maxIndex = Math.max(0, cards.length - cardsPerView);
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
        updateCarousel();
    }, 5000);
    
    // Pause on hover
    track.addEventListener('mouseenter', () => {
        clearInterval(autoScrollInterval);
    });
    
    track.addEventListener('mouseleave', () => {
        autoScrollInterval = setInterval(() => {
            const maxIndex = Math.max(0, cards.length - cardsPerView);
            currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
            updateCarousel();
        }, 5000);
    });
    
    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Swipe left - next
                nextBtn?.click();
            } else {
                // Swipe right - prev
                prevBtn?.click();
            }
        }
    }
}

/* ===================================
   FAQ ACCORDION
   =================================== */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                // Close other items
                faqItems.forEach(other => {
                    if (other !== item && other.classList.contains('active')) {
                        other.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
}

/* ===================================
   PROCESS TABS
   =================================== */
function initProcessTabs() {
    const tabs = document.querySelectorAll('.process-tab');
    const contents = document.querySelectorAll('.process-content');
    
    if (tabs.length === 0) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const process = tab.dataset.process;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update content
            contents.forEach(content => {
                content.classList.remove('active');
                if (content.id === process + 'Process') {
                    content.classList.add('active');
                }
            });
        });
    });
}

/* ===================================
   CALCULATOR TABS
   =================================== */
function initCalcTabs() {
    const tabs = document.querySelectorAll('.calc-tab');
    const panels = document.querySelectorAll('.calculator-panel');
    
    if (tabs.length === 0) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const calc = tab.dataset.calc;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update content
            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === calc + 'Calc') {
                    panel.classList.add('active');
                }
            });
            
            // Re-initialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    });
}

/* ===================================
   PROJECT LIGHTBOX
   =================================== */
function initLightbox() {
    const lightbox = document.getElementById('projectLightbox');
    const closeBtn = document.getElementById('lightboxClose');
    const viewBtns = document.querySelectorAll('.portfolio-view');
    
    if (!lightbox) return;
    
    // Project data
    const projectData = {
        1: {
            title: 'Modern Minimalist 3BHK',
            location: 'Whitefield, Bangalore',
            area: '1,250 sq.ft',
            package: 'Premium',
            duration: '65 days',
            description: 'A complete interior transformation featuring a contemporary design with warm wood tones, smart storage solutions, and a modular kitchen that maximizes every inch of space. The living room showcases a feature wall with recessed lighting and a custom TV unit with integrated storage.',
            client: 'Priya Sharma',
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80'
        },
        2: {
            title: 'Scandinavian 2BHK',
            location: 'Koramangala, Bangalore',
            area: '850 sq.ft',
            package: 'Essential',
            duration: '48 days',
            description: 'A bright and airy Scandinavian-inspired home featuring light oak furniture, white walls, and strategic use of greenery. The open-plan living and dining area feels spacious despite the compact footprint.',
            client: 'Arjun Reddy',
            image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80'
        },
        3: {
            title: 'Contemporary 4BHK',
            location: 'Indiranagar, Bangalore',
            area: '2,200 sq.ft',
            package: 'Luxury',
            duration: '85 days',
            description: 'This stunning 4BHK features a blend of contemporary and traditional elements. Highlights include a library wall in the living room, a wine bar in the dining area, and a luxurious master bedroom with a walk-in closet.',
            client: 'Vikram Mehta',
            image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=80'
        },
        4: {
            title: 'Modular Kitchen',
            location: 'HSR Layout, Bangalore',
            area: '180 sq.ft',
            package: 'Premium',
            duration: '25 days',
            description: 'A stunning L-shaped modular kitchen with premium finishings, soft-close cabinets, built-in appliances, and intelligent storage solutions. The quartz countertop adds a touch of elegance.',
            client: 'Resident',
            image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80'
        },
        5: {
            title: '5 BHK Villa',
            location: 'Sarjapur, Bangalore',
            area: '4,500 sq.ft',
            package: 'Luxury',
            duration: '120 days',
            description: 'An expansive villa transformation including a home theater, bar area, gaming zone, and multiple living spaces. Every room tells a unique story with custom-designed furniture and statement pieces.',
            client: 'Meera Joshi',
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80'
        },
        6: {
            title: 'Smart 1BHK',
            location: 'Electronic City, Bangalore',
            area: '550 sq.ft',
            package: 'Essential',
            duration: '35 days',
            description: 'A smart and efficient 1BHK designed for a young professional. Smart home integration, space-saving furniture, and clever storage make this compact home feel spacious and functional.',
            client: 'Software Professional',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80'
        }
    };
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = btn.dataset.project;
            const project = projectData[projectId];
            
            if (project) {
                document.getElementById('lightboxTitle').textContent = project.title;
                document.getElementById('lightboxLocation').textContent = project.location;
                document.getElementById('lightboxArea').textContent = project.area;
                document.getElementById('lightboxPackage').textContent = project.package;
                document.getElementById('lightboxDuration').textContent = project.duration;
                document.getElementById('lightboxDescription').textContent = project.description;
                document.getElementById('lightboxClient').textContent = project.client;
                document.getElementById('lightboxImage').src = project.image;
                
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* ===================================
   BACK TO TOP BUTTON
   =================================== */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (!backToTop) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ===================================
   SMOOTH SCROLL
   =================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const navHeight = document.getElementById('navbar')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ===================================
   SCROLL ANIMATIONS
   =================================== */
function initAnimations() {
    const animatedElements = document.querySelectorAll(
        '.service-card, .trust-card, .package-card, .style-card, .highlight-item, .stat-item'
    );
    
    if (animatedElements.length === 0) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/* ===================================
   PARALLAX EFFECT (SUBTLE)
   =================================== */
function initParallax() {
    const heroImage = document.querySelector('.hero-image');
    
    if (!heroImage) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        
        if (scrolled < window.innerHeight) {
            heroImage.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Initialize parallax
initParallax();

/* ===================================
   FORM HANDLING (IF FORMS EXIST)
   =================================== */
function handleFormSubmit(form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Create mailto link
        const subject = encodeURIComponent('New Inquiry from Nexora Spaces Website');
        const body = encodeURIComponent(
            `Name: ${data.name || 'N/A'}\n` +
            `Email: ${data.email || 'N/A'}\n` +
            `Phone: ${data.phone || 'N/A'}\n` +
            `City: ${data.city || 'N/A'}\n` +
            `Property Type: ${data.property || 'N/A'}\n` +
            `Message: ${data.message || 'N/A'}`
        );
        
        window.location.href = `mailto:hello@nexoraspaces.com?subject=${subject}&body=${body}`;
        
        // Show success message
        alert('Thank you for your inquiry! We will contact you shortly.');
        form.reset();
    });
}

// Initialize form handlers
document.querySelectorAll('form').forEach(handleFormSubmit);

/* ===================================
   UTILITY FUNCTIONS
   =================================== */

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Lazy load images
function initLazyLoad() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy load
initLazyLoad();

/* ===================================
   CONSOLE BRANDING
   =================================== */
console.log(
    '%c NEXORA SPACES LLP ',
    'background: linear-gradient(135deg, #B8860B, #D4AF37, #F4E5A1); color: #1E1E1E; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 5px;'
);
console.log('%c Design · Build · Deliver ', 'color: #D4AF37; font-size: 12px;');
console.log('%c Premium Residential Interior Fit-Out Company ', 'color: #6B6B63; font-size: 11px;');
