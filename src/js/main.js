/**
 * LIFE X BtoB Presentation
 * Main JavaScript
 */

// ===================================
// Configuration
// ===================================
const CONFIG = {
    totalSections: 7,
    animationDuration: 0.6,
    imageBasePath: 'resources/image/gaikan/'
};

// ===================================
// State Management
// ===================================
const state = {
    currentSection: 1,
    galleryImages: [],
    isAnimating: false
};

// ===================================
// DOM Elements
// ===================================
const DOM = {
    sections: null,
    btnPrev: null,
    btnNext: null,
    progressCurrent: null,
    progressTotal: null,
    galleryMain: null,
    galleryThumbnails: null
};

// ===================================
// Initialization
// ===================================
function init() {
    cacheDOMElements();
    initEventListeners();
    initGallery();
    updateProgress();
    updateButtonStates();

    // Show first section
    showSection(1);

    console.log('LIFE X Presentation initialized');
}

function cacheDOMElements() {
    DOM.sections = document.querySelectorAll('.section');
    DOM.btnPrev = document.getElementById('btn-prev');
    DOM.btnNext = document.getElementById('btn-next');
    DOM.progressCurrent = document.querySelector('.progress-current');
    DOM.progressTotal = document.querySelector('.progress-total');
    DOM.galleryMain = document.getElementById('gallery-main-image');
    DOM.galleryThumbnails = document.getElementById('gallery-thumbnails');
}

// ===================================
// Event Listeners
// ===================================
function initEventListeners() {
    // Navigation buttons
    DOM.btnPrev.addEventListener('click', () => navigateSection('prev'));
    DOM.btnNext.addEventListener('click', () => navigateSection('next'));

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);

    // Prevent accidental navigation away
    window.addEventListener('beforeunload', (e) => {
        if (state.currentSection > 1) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

function handleKeyboard(e) {
    if (state.isAnimating) return;

    switch(e.key) {
        case 'ArrowRight':
        case ' ':
            e.preventDefault();
            navigateSection('next');
            break;
        case 'ArrowLeft':
            e.preventDefault();
            navigateSection('prev');
            break;
        case 'Home':
            e.preventDefault();
            goToSection(1);
            break;
        case 'End':
            e.preventDefault();
            goToSection(CONFIG.totalSections);
            break;
    }
}

// ===================================
// Navigation
// ===================================
function navigateSection(direction) {
    if (state.isAnimating) return;

    let nextSection = state.currentSection;

    if (direction === 'next' && state.currentSection < CONFIG.totalSections) {
        nextSection = state.currentSection + 1;
    } else if (direction === 'prev' && state.currentSection > 1) {
        nextSection = state.currentSection - 1;
    }

    if (nextSection !== state.currentSection) {
        goToSection(nextSection);
    }
}

function goToSection(sectionNumber) {
    if (sectionNumber < 1 || sectionNumber > CONFIG.totalSections || state.isAnimating) return;

    state.isAnimating = true;

    // Hide current section
    const currentSectionEl = document.querySelector(`[data-section="${state.currentSection}"]`);
    if (currentSectionEl) {
        gsap.to(currentSectionEl, {
            opacity: 0,
            duration: CONFIG.animationDuration,
            onComplete: () => {
                currentSectionEl.classList.remove('active');
            }
        });
    }

    // Show next section
    const nextSectionEl = document.querySelector(`[data-section="${sectionNumber}"]`);
    if (nextSectionEl) {
        nextSectionEl.classList.add('active');
        gsap.fromTo(nextSectionEl,
            { opacity: 0 },
            {
                opacity: 1,
                duration: CONFIG.animationDuration,
                onComplete: () => {
                    state.isAnimating = false;
                    animateSectionContent(sectionNumber);
                }
            }
        );
    }

    state.currentSection = sectionNumber;
    updateProgress();
    updateButtonStates();

    // Scroll to top of section
    if (nextSectionEl) {
        nextSectionEl.scrollTop = 0;
    }
}

function showSection(sectionNumber) {
    const sectionEl = document.querySelector(`[data-section="${sectionNumber}"]`);
    if (sectionEl) {
        sectionEl.classList.add('active');
        gsap.fromTo(sectionEl,
            { opacity: 0 },
            { opacity: 1, duration: CONFIG.animationDuration }
        );
        animateSectionContent(sectionNumber);
    }
}

// ===================================
// Section Animations
// ===================================
function animateSectionContent(sectionNumber) {
    const section = document.querySelector(`[data-section="${sectionNumber}"]`);
    if (!section) return;

    switch(sectionNumber) {
        case 1:
            animateOpening(section);
            break;
        case 2:
            animateCrisis(section);
            break;
        case 3:
            animateProduct(section);
            break;
        case 4:
            animateRevenue(section);
            break;
        case 5:
            animateSupport(section);
            break;
        case 6:
            animateUrgency(section);
            break;
        case 7:
            animateClosing(section);
            break;
    }
}

function animateOpening(section) {
    const title = section.querySelector('.opening-title');
    const logo = section.querySelector('.opening-logo');

    if (title) {
        gsap.fromTo(title,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
        );
    }

    if (logo) {
        gsap.fromTo(logo,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 1, delay: 0.5, ease: 'power2.out' }
        );
    }
}

function animateCrisis(section) {
    const items = section.querySelectorAll('.crisis-item');

    gsap.fromTo(items,
        { opacity: 0, y: 30 },
        {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.2,
            ease: 'power2.out'
        }
    );
}

function animateProduct(section) {
    const gallery = section.querySelector('.product-gallery');
    const specs = section.querySelectorAll('.spec-item');

    if (gallery) {
        gsap.fromTo(gallery,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
        );
    }

    if (specs.length) {
        gsap.fromTo(specs,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.15,
                delay: 0.3,
                ease: 'power2.out'
            }
        );
    }
}

function animateRevenue(section) {
    const cards = section.querySelectorAll('.revenue-card');

    gsap.fromTo(cards,
        { opacity: 0, scale: 0.9 },
        {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out(1.2)'
        }
    );

    // Animate numbers
    const bigNumbers = section.querySelectorAll('.big-number');
    bigNumbers.forEach(num => {
        gsap.fromTo(num,
            { opacity: 0, scale: 0.5 },
            { opacity: 1, scale: 1, duration: 0.8, delay: 0.5, ease: 'back.out(1.5)' }
        );
    });
}

function animateSupport(section) {
    const statItems = section.querySelectorAll('.stat-item');
    const supportItems = section.querySelectorAll('.support-item');

    if (statItems.length) {
        gsap.fromTo(statItems,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out'
            }
        );
    }

    if (supportItems.length) {
        gsap.fromTo(supportItems,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1,
                delay: 0.4,
                ease: 'power2.out'
            }
        );
    }
}

function animateUrgency(section) {
    const cards = section.querySelectorAll('.urgency-card');

    gsap.fromTo(cards,
        { opacity: 0, x: -30 },
        {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.2,
            ease: 'power2.out'
        }
    );
}

function animateClosing(section) {
    const title = section.querySelector('.closing-title');
    const message = section.querySelector('.closing-message');
    const cta = section.querySelector('.closing-cta');
    const company = section.querySelector('.closing-company');

    const timeline = gsap.timeline();

    if (title) {
        timeline.fromTo(title,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
        );
    }

    if (message) {
        timeline.fromTo(message,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
            '-=0.3'
        );
    }

    if (cta) {
        timeline.fromTo(cta,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.2)' },
            '-=0.2'
        );
    }

    if (company) {
        timeline.fromTo(company,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
            '-=0.2'
        );
    }
}

// ===================================
// Progress & Button States
// ===================================
function updateProgress() {
    if (DOM.progressCurrent) {
        DOM.progressCurrent.textContent = state.currentSection;
    }
    if (DOM.progressTotal) {
        DOM.progressTotal.textContent = CONFIG.totalSections;
    }
}

function updateButtonStates() {
    if (DOM.btnPrev) {
        DOM.btnPrev.disabled = state.currentSection === 1;
    }
    if (DOM.btnNext) {
        DOM.btnNext.disabled = state.currentSection === CONFIG.totalSections;
    }
}

// ===================================
// Gallery
// ===================================
async function initGallery() {
    // Get all images from the gaikan folder (57 images total)
    state.galleryImages = [
        'パース外観　28-40-N-12-001.jpg',
        'パース外観　28-45-E-12-002.jpg',
        'パース外観　28-50-S-12-003.jpg',
        'パース外観　28-54-N-12-004.jpg',
        'パース外観　28-59-E-11-005.jpg',
        'パース外観　28-63-S-22-006.jpg',
        'パース外観　28-68-N-22-007.jpg',
        'パース外観　30-40-S-22-008.jpg',
        'パース外観　30-45-S-12-009.jpg',
        'パース外観　30-50-W-11-010.jpg',
        'パース外観　30-50-S-22-011.jpg',
        'パース外観　30-54-N-12-012.jpg',
        'パース外観　30-54-E-22-013.jpg',
        'パース外観　30-54-S-12-014.jpg',
        'パース外観　30-59-N-22-015.jpg',
        'パース外観　30-63-W-12-016.jpg',
        'パース外観　30-63-S-22-017.jpg',
        'パース外観　30-68-N-12-018.jpg',
        'パース外観　33-40-N-22-021.jpg',
        'パース外観　33-45-W-22-022.jpg',
        'パース外観　33-50-S-22-023.jpg',
        'パース外観　33-50-N-22-024.jpg',
        'パース外観　33-50-W-12-025.jpg',
        'パース外観　33-54-S-22-026.jpg',
        'パース外観　33-59-N-11-027.jpg',
        'パース外観　33-59-E-12-028.jpg',
        'パース外観　33-63-S-22-029.jpg',
        'パース外観　33-63-N-22-030.jpg',
        'パース外観　33-68-E-11-031.jpg',
        'パース外観　33-72-S-12-032.jpg',
        'パース外観　35-72-N-12-033.jpg',
        'パース外観　35-54-N-12-034.jpg',
        'パース外観　35-59-E-22-035.jpg',
        'パース外観　35-63-S-11-036.jpg',
        'パース外観　35-68-N-22-037.jpg',
        'パース外観　35-72-E-22-038.jpg',
        'パース外観　35-77-S-22-039.jpg',
        '外観.jpg',
        '外観2.jpg',
        '外観3.jpg'
    ];

    renderGalleryThumbnails();
}

function renderGalleryThumbnails() {
    if (!DOM.galleryThumbnails) return;

    // Clear existing thumbnails
    DOM.galleryThumbnails.innerHTML = '';

    // Create thumbnails (show first 12)
    const displayImages = state.galleryImages.slice(0, 12);

    displayImages.forEach((imageName, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'gallery-thumbnail';
        if (index === 0) thumbnail.classList.add('active');

        const img = document.createElement('img');
        img.src = `${CONFIG.imageBasePath}${imageName}`;
        img.alt = `LIFE X Design ${index + 1}`;
        img.loading = 'lazy';

        thumbnail.appendChild(img);
        thumbnail.addEventListener('click', () => selectGalleryImage(imageName, thumbnail));

        DOM.galleryThumbnails.appendChild(thumbnail);
    });
}

function selectGalleryImage(imageName, thumbnailEl) {
    if (!DOM.galleryMain) return;

    // Update main image
    gsap.to(DOM.galleryMain, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
            DOM.galleryMain.src = `${CONFIG.imageBasePath}${imageName}`;
            gsap.to(DOM.galleryMain, {
                opacity: 1,
                duration: 0.3
            });
        }
    });

    // Update active thumbnail
    const allThumbnails = DOM.galleryThumbnails.querySelectorAll('.gallery-thumbnail');
    allThumbnails.forEach(thumb => thumb.classList.remove('active'));
    if (thumbnailEl) {
        thumbnailEl.classList.add('active');
    }
}

// ===================================
// Utility Functions
// ===================================
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

// ===================================
// Start Application
// ===================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export for debugging
window.LIFEX = {
    state,
    goToSection,
    CONFIG
};
