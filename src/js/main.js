/**
 * LIFE X BtoB Presentation
 * Main JavaScript
 */

// ===================================
// Configuration
// ===================================
const CONFIG = {
    totalSections: 15,
    animationDuration: 0.6,
    imageBasePath: 'resources/image/gaikan/'
};

// ===================================
// State Management
// ===================================
const state = {
    currentSection: 1,
    galleryImages: [],
    filteredImages: [],
    currentImageIndex: 0,
    currentPage: 0,
    imagesPerPage: 18,
    filters: {
        size: 'all',
        direction: 'all'
    },
    isAnimating: false,
    slideshowInterval: null
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

    // Generic animation for all sections
    const cards = section.querySelectorAll('.spec-card, .option-pack, .equipment-card, .category-card, .support-category-card, .benefit-card, .approach-card, .philosophy-item');
    const items = section.querySelectorAll('.position-item, .plan-stat, .stat-card');

    if (cards.length > 0) {
        gsap.fromTo(cards,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out'
            }
        );
    }

    if (items.length > 0) {
        gsap.fromTo(items,
            { opacity: 0, scale: 0.9 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                stagger: 0.15,
                ease: 'back.out(1.2)'
            }
        );
    }

    // Specific animations for certain sections
    switch(sectionNumber) {
        case 1:
            animateOpening(section);
            break;
        case 5:
            // Gallery section
            animateGallery(section);
            break;
        case 13:
            // Profit simulation with numbers
            animateRevenue(section);
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

function animateGallery(section) {
    const gallery = section.querySelector('.gallery-container');
    const thumbnails = section.querySelectorAll('.gallery-thumbnail');

    if (gallery) {
        gsap.fromTo(gallery,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
        );
    }

    if (thumbnails.length) {
        gsap.fromTo(thumbnails,
            { opacity: 0, scale: 0.8 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                stagger: 0.05,
                delay: 0.3,
                ease: 'back.out(1.5)'
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
    // Get all images from the gaikan folder (40 images - excluding generic ones)
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

    state.filteredImages = [...state.galleryImages];

    initGalleryControls();
    renderGalleryThumbnails();
    updateGalleryInfo();
}

function initGalleryControls() {
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterType = btn.dataset.filterType;
            const filterValue = btn.dataset.filterValue;

            // Update active state for this filter group
            document.querySelectorAll(`[data-filter-type="${filterType}"]`).forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update filter state
            state.filters[filterType] = filterValue;
            applyFilters();
        });
    });

    // View toggle buttons
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const viewMode = btn.dataset.view;
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (viewMode === 'slideshow') {
                startSlideshow();
            } else {
                stopSlideshow();
            }
        });
    });

    // Navigation arrows
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    if (prevBtn) prevBtn.addEventListener('click', () => navigateGallery('prev'));
    if (nextBtn) nextBtn.addEventListener('click', () => navigateGallery('next'));

    // Pagination
    const paginationPrev = document.getElementById('pagination-prev');
    const paginationNext = document.getElementById('pagination-next');
    if (paginationPrev) paginationPrev.addEventListener('click', () => changePage('prev'));
    if (paginationNext) paginationNext.addEventListener('click', () => changePage('next'));

    // Fullscreen
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            const galleryMain = document.querySelector('.gallery-main');
            if (galleryMain.requestFullscreen) {
                galleryMain.requestFullscreen();
            }
        });
    }
}

function applyFilters() {
    const { size, direction } = state.filters;

    state.filteredImages = state.galleryImages.filter(imageName => {
        // Parse image filename: パース外観　28-40-N-12-001.jpg
        const match = imageName.match(/(\d+)-\d+-([NESW])-/);
        if (!match) return true; // Include generic images

        const imageSize = match[1];
        const imageDirection = match[2];

        const sizeMatch = size === 'all' || imageSize === size;
        const directionMatch = direction === 'all' || imageDirection === direction;

        return sizeMatch && directionMatch;
    });

    state.currentPage = 0;
    state.currentImageIndex = 0;
    renderGalleryThumbnails();
    updateMainImage();
    updateGalleryInfo();
    updatePagination();
}

function renderGalleryThumbnails() {
    if (!DOM.galleryThumbnails) return;

    DOM.galleryThumbnails.innerHTML = '';

    const startIndex = state.currentPage * state.imagesPerPage;
    const endIndex = Math.min(startIndex + state.imagesPerPage, state.filteredImages.length);
    const displayImages = state.filteredImages.slice(startIndex, endIndex);

    displayImages.forEach((imageName, index) => {
        const globalIndex = startIndex + index;
        const thumbnail = document.createElement('div');
        thumbnail.className = 'gallery-thumbnail';
        if (globalIndex === state.currentImageIndex) thumbnail.classList.add('active');

        const img = document.createElement('img');
        img.src = `${CONFIG.imageBasePath}${imageName}`;
        img.alt = `LIFE X Design ${globalIndex + 1}`;
        img.loading = 'lazy';

        thumbnail.appendChild(img);
        thumbnail.addEventListener('click', () => selectGalleryImage(globalIndex));

        DOM.galleryThumbnails.appendChild(thumbnail);
    });
}

function selectGalleryImage(index) {
    state.currentImageIndex = index;
    updateMainImage();
    updateGalleryInfo();

    // Update active thumbnail
    const allThumbnails = DOM.galleryThumbnails.querySelectorAll('.gallery-thumbnail');
    allThumbnails.forEach((thumb, i) => {
        const globalIndex = state.currentPage * state.imagesPerPage + i;
        thumb.classList.toggle('active', globalIndex === index);
    });
}

function updateMainImage() {
    if (!DOM.galleryMain) return;

    const imageName = state.filteredImages[state.currentImageIndex];
    if (!imageName) return;

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
}

function updateGalleryInfo() {
    const infoEl = document.getElementById('gallery-info');
    if (!infoEl) return;

    const imageName = state.filteredImages[state.currentImageIndex];
    const match = imageName?.match(/(\d+)-\d+-([NESW])-/);

    const numberSpan = infoEl.querySelector('.image-number');
    const specsSpan = infoEl.querySelector('.image-specs');

    if (numberSpan) {
        numberSpan.textContent = `${state.currentImageIndex + 1} / ${state.filteredImages.length}`;
    }

    if (specsSpan && match) {
        const size = match[1];
        const direction = match[2];
        const directionMap = { N: '北', E: '東', S: '南', W: '西' };
        specsSpan.textContent = `${size}坪 • ${directionMap[direction] || direction}向き`;
    }
}

function navigateGallery(direction) {
    if (direction === 'next' && state.currentImageIndex < state.filteredImages.length - 1) {
        state.currentImageIndex++;
    } else if (direction === 'prev' && state.currentImageIndex > 0) {
        state.currentImageIndex--;
    }

    // Check if need to change page
    const targetPage = Math.floor(state.currentImageIndex / state.imagesPerPage);
    if (targetPage !== state.currentPage) {
        state.currentPage = targetPage;
        renderGalleryThumbnails();
        updatePagination();
    }

    selectGalleryImage(state.currentImageIndex);
}

function changePage(direction) {
    const totalPages = Math.ceil(state.filteredImages.length / state.imagesPerPage);

    if (direction === 'next' && state.currentPage < totalPages - 1) {
        state.currentPage++;
    } else if (direction === 'prev' && state.currentPage > 0) {
        state.currentPage--;
    }

    renderGalleryThumbnails();
    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(state.filteredImages.length / state.imagesPerPage);
    const startIndex = state.currentPage * state.imagesPerPage + 1;
    const endIndex = Math.min((state.currentPage + 1) * state.imagesPerPage, state.filteredImages.length);

    const infoEl = document.getElementById('pagination-info');
    const prevBtn = document.getElementById('pagination-prev');
    const nextBtn = document.getElementById('pagination-next');

    if (infoEl) {
        infoEl.textContent = `${startIndex}-${endIndex} / ${state.filteredImages.length}`;
    }

    if (prevBtn) {
        prevBtn.disabled = state.currentPage === 0;
    }

    if (nextBtn) {
        nextBtn.disabled = state.currentPage === totalPages - 1;
    }
}

function startSlideshow() {
    stopSlideshow(); // Clear any existing interval
    state.slideshowInterval = setInterval(() => {
        navigateGallery('next');
        // Loop back to start
        if (state.currentImageIndex === state.filteredImages.length - 1) {
            state.currentImageIndex = 0;
            state.currentPage = 0;
            renderGalleryThumbnails();
            updatePagination();
            selectGalleryImage(0);
        }
    }, 3000); // Change image every 3 seconds
}

function stopSlideshow() {
    if (state.slideshowInterval) {
        clearInterval(state.slideshowInterval);
        state.slideshowInterval = null;
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
