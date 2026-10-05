import { heroDishes } from './data.js';

/* ==========================================================================
   STATE MANAGEMENT
   ========================================================================== */

const orderState = [];
let currentHeroIndex = 0;
let heroRotationInterval = null;
let toastTimeout = null;
let currentMenuIndex = 0;

const HERO_INTERVAL_MS = 3200;

/* ==========================================================================
   DOM ELEMENTS
   ========================================================================== */

// Navbar
const mobileMenuButton = document.getElementById('mobile-menu-btn');
const navigationBar = document.getElementById('navigation-bar');
const navBookBtn = document.getElementById('nav-book-btn');
const navReserveLinks = document.querySelectorAll('.nav-reserve-link, .footer-reserve-link');

// Hero
const heroDiv = document.getElementById('hero-div');

// Menu Carousel
const menuMain = document.getElementById('menu-main');
const menuViewport = document.getElementById('menu-container-viewport');
const leftButton = document.getElementById('left-menuu');
const rightButton = document.getElementById('right-menuu');
const carouselIndicator = document.getElementById('carousel-indicator');

// Bento
const bentoGrid = document.getElementById('bento-grid');

// Toast
const cartPopup = document.getElementById('cart-popup');
const cartPopupText = document.getElementById('cart-popup-text');

// Discount Popup
const discountOfferBtn = document.getElementById('discount-offer');
const discountPopup = document.getElementById('discount-popup');
const discountBackdrop = document.getElementById('discount-backdrop');
const discountCloseBtn = document.getElementById('discount-close');
const discountClaimBtn = document.getElementById('discount-claim');
const discountDesc = document.getElementById('discount-desc');

// Reservation Modal
const reservationModal = document.getElementById('reservation-modal');
const reservationModalClose = document.getElementById('reservation-modal-close');
const reservationFormContainer = document.getElementById('reservation-form-container');
const reservationForm = document.getElementById('reservation-form');
const reservationSuccessState = document.getElementById('reservation-success-state');
const reservationDoneBtn = document.getElementById('reservation-done-btn');
const resSummary = document.getElementById('reservation-summary');

// Newsletter
const newsletterForm = document.getElementById('newsletter-form');
const newsletterEmail = document.getElementById('newsletter-email');
const newsletterFeedback = document.getElementById('newsletter-feedback');


/* ==========================================================================
   1. NAVBAR & NAVIGATION
   ========================================================================== */

const toggleMobileMenu = () => {
    const isActive = navigationBar.classList.toggle('active');
    mobileMenuButton.setAttribute('aria-expanded', isActive ? 'true' : 'false');
};

const closeMobileMenu = () => {
    if (navigationBar.classList.contains('active')) {
        navigationBar.classList.remove('active');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
    }
};

if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });
}

// Close mobile menu on clicking any navigation link
if (navigationBar) {
    navigationBar.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMobileMenu);
    });
}

// Close mobile menu if clicked outside
document.addEventListener('click', (e) => {
    if (navigationBar && !navigationBar.contains(e.target) && !mobileMenuButton.contains(e.target)) {
        closeMobileMenu();
    }
});


/* ==========================================================================
   2. HERO SECTION & 3-SECOND ROTATION
   ========================================================================== */

const renderHero = (dish) => {
    const { name, category, rating, description, image } = dish;

    return `
        <div id="herojs">
            <img 
                src="${image}" 
                alt="${name}" 
                class="hero-product-img"
                id="hero-img"
            >

            <div class="hero-content">
                <div class="hero-text-container" id="hero-text-container">
                    <p class="hero-category" id="hero-category">${category}</p>
                    
                    <h1 class="hero-heading">
                        Delicious food for
                        <span class="span-hero">Every Mood</span>
                    </h1>

                    <h2 class="hero-name" id="hero-name">${name}</h2>

                    <p class="hero-des" id="hero-des">${description}</p>

                    <h4 class="hero-rating" id="hero-rating">★ ${rating}</h4>
                </div>

                <div class="hero-buttons">
                    <a href="#menu" class="hero-menu-button" id="hero-explore-btn">
                        Explore Menu
                    </a>

                    <button type="button" class="hero-book-button" id="hero-book-btn">
                        Book Table
                    </button>
                </div>
            </div>
        </div>
    `;
};

// Initial hero render
if (heroDiv && heroDishes.length > 0) {
    heroDiv.innerHTML = renderHero(heroDishes[0]);
}

const updateHeroDish = (index) => {
    const nextDish = heroDishes[index];
    if (!nextDish) return;

    const heroImg = document.getElementById('hero-img');
    const textContainer = document.getElementById('hero-text-container');
    const heroCategory = document.getElementById('hero-category');
    const heroName = document.getElementById('hero-name');
    const heroDes = document.getElementById('hero-des');
    const heroRating = document.getElementById('hero-rating');

    if (!heroImg || !textContainer) return;

    // Preload image to avoid blank flash
    const preloader = new Image();
    preloader.src = nextDish.image;

    // Fade out text and image
    textContainer.classList.add('hero-fade-out');
    heroImg.style.opacity = '0.3';
    heroImg.style.transform = 'scale(1.03)';

    setTimeout(() => {
        heroImg.src = nextDish.image;
        heroImg.alt = nextDish.name;
        heroCategory.textContent = nextDish.category;
        heroName.textContent = nextDish.name;
        heroDes.textContent = nextDish.description;
        heroRating.textContent = `★ ${nextDish.rating}`;

        // Fade in
        heroImg.style.opacity = '1';
        heroImg.style.transform = 'scale(1)';
        textContainer.classList.remove('hero-fade-out');
    }, 320);
};

const nextHeroDish = () => {
    currentHeroIndex = (currentHeroIndex + 1) % heroDishes.length;
    updateHeroDish(currentHeroIndex);
};

const startHeroRotation = () => {
    if (!heroRotationInterval) {
        heroRotationInterval = setInterval(nextHeroDish, HERO_INTERVAL_MS);
    }
};

const pauseHeroRotation = () => {
    if (heroRotationInterval) {
        clearInterval(heroRotationInterval);
        heroRotationInterval = null;
    }
};

startHeroRotation();

// Pause hero rotation on user hover/touch to enhance UX
if (heroDiv) {
    heroDiv.addEventListener('mouseenter', pauseHeroRotation);
    heroDiv.addEventListener('mouseleave', startHeroRotation);
    heroDiv.addEventListener('touchstart', pauseHeroRotation, { passive: true });
    heroDiv.addEventListener('touchend', startHeroRotation, { passive: true });
}

// Hero button click delegation
if (heroDiv) {
    heroDiv.addEventListener('click', (e) => {
        if (e.target.closest('#hero-book-btn')) {
            openReservationModal();
        }
    });
}


/* ==========================================================================
   3. MENU CAROUSEL & CAROUSEL BOUNDARIES
   ========================================================================== */

const renderMenuItem = (dish) => {
    const { id, name, price, rating, description, image } = dish;

    return `
        <article class="menujs" data-id="${id}">
            <img 
                src="${image}"
                alt="${name}"
                class="menu-imgjs"
                loading="lazy"
            >

            <div class="menujs-text">
                <h3 class="menu-name">${name}</h3>
                <p class="menu-des">${description}</p>
                <div class="menu-rating" aria-label="Rating: ${rating} out of 5 stars">
                    <span>★</span> ${rating}
                </div>
            </div>

            <div class="menu-buttons">
                <span class="menu-price">$${price}</span>
                <button 
                    type="button" 
                    class="menu-button" 
                    data-id="${id}" 
                    data-name="${name}"
                    aria-label="Add ${name} to order"
                >
                    Add
                </button>
            </div>
        </article>
    `;
};

if (menuMain && heroDishes.length > 0) {
    menuMain.innerHTML = heroDishes.map(renderMenuItem).join('');
}

const getMoveAmount = () => {
    const card = document.querySelector('.menujs');
    if (!card) return 0;
    const cardWidth = card.offsetWidth;
    const styles = getComputedStyle(menuMain);
    const gap = parseFloat(styles.gap) || 22;
    return cardWidth + gap;
};

const getMaxIndex = () => {
    if (!menuMain || !menuViewport) return 0;
    const moveAmount = getMoveAmount();
    if (moveAmount === 0) return 0;

    const visibleWidth = menuViewport.clientWidth;
    const totalContentWidth = menuMain.scrollWidth;
    const maxScroll = Math.max(0, totalContentWidth - visibleWidth);

    return Math.max(0, Math.ceil(maxScroll / moveAmount));
};

const updateCarousel = () => {
    if (!menuMain) return;

    const maxIndex = getMaxIndex();

    // Clamp current index if window resized
    if (currentMenuIndex > maxIndex) {
        currentMenuIndex = maxIndex;
    }
    if (currentMenuIndex < 0) {
        currentMenuIndex = 0;
    }

    const moveAmount = getMoveAmount();
    const visibleWidth = menuViewport.clientWidth;
    const maxTranslate = Math.max(0, menuMain.scrollWidth - visibleWidth);
    const desiredTranslate = currentMenuIndex * moveAmount;
    const finalTranslate = Math.min(desiredTranslate, maxTranslate);

    menuMain.style.transform = `translateX(-${finalTranslate}px)`;

    // Update buttons disabled state
    if (leftButton) {
        leftButton.disabled = currentMenuIndex <= 0;
    }
    if (rightButton) {
        rightButton.disabled = currentMenuIndex >= maxIndex;
    }

    if (carouselIndicator) {
        carouselIndicator.textContent = `Showing dish ${currentMenuIndex + 1} of ${heroDishes.length}`;
    }
};

// Controls
if (leftButton) {
    leftButton.addEventListener('click', () => {
        if (currentMenuIndex > 0) {
            currentMenuIndex -= 1;
            updateCarousel();
        }
    });
}

if (rightButton) {
    rightButton.addEventListener('click', () => {
        const maxIndex = getMaxIndex();
        if (currentMenuIndex < maxIndex) {
            currentMenuIndex += 1;
            updateCarousel();
        }
    });
}

// Window resize handler with debounce
let resizeTimer = null;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateCarousel, 120);
});

// Initial update
updateCarousel();


/* ==========================================================================
   4. MENU "ADD" BUTTON & TOAST NOTIFICATION
   ========================================================================== */

const showCartToast = (dishName) => {
    if (!cartPopup || !cartPopupText) return;

    cartPopupText.textContent = `${dishName} added to your order`;
    cartPopup.classList.add('show');

    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
        cartPopup.classList.remove('show');
    }, 2500);
};

if (menuMain) {
    menuMain.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.menu-button');
        if (!addBtn) return;

        const dishId = parseInt(addBtn.getAttribute('data-id'), 10);
        const dishName = addBtn.getAttribute('data-name');

        const foundDish = heroDishes.find((item) => item.id === dishId);
        if (foundDish) {
            orderState.push(foundDish);
        }

        showCartToast(dishName || 'Dish');
    });
}


/* ==========================================================================
   5. TOP RATED / BENTO GRID SECTION
   ========================================================================== */

const renderBentoCard = (dish) => {
    const { name, rating, image } = dish;

    return `
        <article class="bento-card" tabindex="0">
            <img
                src="${image}"
                alt="${name}"
                loading="lazy"
            >

            <div class="bento-content">
                <h3>${name}</h3>
                <p class="bento-rating" aria-label="Rating: ${rating} out of 5 stars">
                    ★ ${rating}
                </p>
            </div>
        </article>
    `;
};

if (bentoGrid && heroDishes.length > 0) {
    // Sort by rating descending and render top 4 dishes for the 2x2 / 4-card bento
    const topRatedDishes = [...heroDishes]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);

    bentoGrid.innerHTML = topRatedDishes.map(renderBentoCard).join('');
}


/* ==========================================================================
   6. RESERVATION MODAL
   ========================================================================== */

const openReservationModal = () => {
    if (!reservationModal) return;

    // Reset view
    if (reservationFormContainer) reservationFormContainer.style.display = 'block';
    if (reservationSuccessState) reservationSuccessState.style.display = 'none';

    // Set minimum date to today
    const dateInput = document.getElementById('res-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        if (!dateInput.value) {
            dateInput.value = today;
        }
    }

    reservationModal.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Focus first input
    const firstInput = document.getElementById('res-name');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 150);
    }
};

const closeReservationModal = () => {
    if (!reservationModal) return;
    reservationModal.classList.remove('show');
    document.body.style.overflow = '';
};

// Wire open triggers
if (navBookBtn) {
    navBookBtn.addEventListener('click', openReservationModal);
}

navReserveLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        openReservationModal();
    });
});

if (reservationModalClose) {
    reservationModalClose.addEventListener('click', closeReservationModal);
}

if (reservationDoneBtn) {
    reservationDoneBtn.addEventListener('click', () => {
        if (reservationForm) reservationForm.reset();
        closeReservationModal();
    });
}

// Close on clicking backdrop
if (reservationModal) {
    reservationModal.addEventListener('click', (e) => {
        if (e.target === reservationModal) {
            closeReservationModal();
        }
    });
}

// Form validation & submission
if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('res-name');
        const dateInput = document.getElementById('res-date');
        const timeInput = document.getElementById('res-time');
        const guestsInput = document.getElementById('res-guests');

        const nameError = document.getElementById('res-name-error');
        const dateError = document.getElementById('res-date-error');
        const timeError = document.getElementById('res-time-error');
        const guestsError = document.getElementById('res-guests-error');

        // Reset errors
        [nameError, dateError, timeError, guestsError].forEach((el) => {
            if (el) el.textContent = '';
        });
        [nameInput, dateInput, timeInput, guestsInput].forEach((el) => {
            if (el) el.classList.remove('error-input');
        });

        let isValid = true;

        if (!nameInput.value.trim()) {
            nameError.textContent = 'Please enter your full name.';
            nameInput.classList.add('error-input');
            isValid = false;
        }

        if (!dateInput.value) {
            dateError.textContent = 'Please choose a reservation date.';
            dateInput.classList.add('error-input');
            isValid = false;
        }

        if (!timeInput.value) {
            timeError.textContent = 'Please choose a time.';
            timeInput.classList.add('error-input');
            isValid = false;
        }

        if (!guestsInput.value) {
            guestsError.textContent = 'Please select the number of guests.';
            guestsInput.classList.add('error-input');
            isValid = false;
        }

        if (!isValid) return;

        // Format date nicely
        const [year, month, day] = dateInput.value.split('-');
        const dateObj = new Date(year, month - 1, day);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        // Show success state
        if (resSummary) {
            resSummary.innerHTML = `
                <div><strong>Guest:</strong> ${nameInput.value.trim()}</div>
                <div><strong>Party:</strong> ${guestsInput.value}</div>
                <div><strong>When:</strong> ${formattedDate} at ${timeInput.value}</div>
                <div><strong>Confirmation:</strong> #APT-${Math.floor(100000 + Math.random() * 900000)}</div>
            `;
        }

        if (reservationFormContainer) reservationFormContainer.style.display = 'none';
        if (reservationSuccessState) reservationSuccessState.style.display = 'block';
    });
}


/* ==========================================================================
   7. DISCOUNT POPUP & LOCALSTORAGE
   ========================================================================== */

const DISCOUNT_STORAGE_KEY = 'apito_discount_handled';

const openDiscountPopup = () => {
    if (!discountPopup || !discountBackdrop) return;
    discountBackdrop.classList.add('show');
    discountPopup.classList.add('show');
};

const closeDiscountPopup = (markDismissed = true) => {
    if (!discountPopup || !discountBackdrop) return;
    discountBackdrop.classList.remove('show');
    discountPopup.classList.remove('show');

    if (markDismissed) {
        localStorage.setItem(DISCOUNT_STORAGE_KEY, 'dismissed');
    }
};

// Check localStorage and show after 5.5s delay if not already handled
const handledStatus = localStorage.getItem(DISCOUNT_STORAGE_KEY);
if (!handledStatus) {
    setTimeout(() => {
        const stillHandled = localStorage.getItem(DISCOUNT_STORAGE_KEY);
        if (!stillHandled) {
            openDiscountPopup();
        }
    }, 5500);
}

// Floating button opens discount popup anytime
if (discountOfferBtn) {
    discountOfferBtn.addEventListener('click', openDiscountPopup);
}

if (discountCloseBtn) {
    discountCloseBtn.addEventListener('click', () => closeDiscountPopup(true));
}

if (discountBackdrop) {
    discountBackdrop.addEventListener('click', () => closeDiscountPopup(true));
}

if (discountClaimBtn) {
    discountClaimBtn.addEventListener('click', () => {
        localStorage.setItem(DISCOUNT_STORAGE_KEY, 'claimed');
        if (discountDesc) {
            discountDesc.innerHTML = '🎉 <strong>Coupon APITO20 applied!</strong> Enjoy 20% off your dining experience.';
        }
        discountClaimBtn.textContent = 'Offer Activated ✓';
        discountClaimBtn.style.backgroundColor = '#355c12';

        setTimeout(() => {
            closeDiscountPopup(false);
        }, 1800);
    });
}


/* ==========================================================================
   8. FOOTER & NEWSLETTER FORM
   ========================================================================== */

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = newsletterEmail ? newsletterEmail.value.trim() : '';
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!isValidEmail) {
            if (newsletterFeedback) {
                newsletterFeedback.textContent = 'Please enter a valid email address.';
                newsletterFeedback.style.color = '#c0392b';
                newsletterFeedback.style.display = 'block';
            }
            return;
        }

        if (newsletterFeedback) {
            newsletterFeedback.textContent = '✓ Thank you for subscribing! Check your inbox soon.';
            newsletterFeedback.style.color = '#355c12';
            newsletterFeedback.style.display = 'block';
        }

        newsletterForm.reset();

        setTimeout(() => {
            if (newsletterFeedback) {
                newsletterFeedback.style.display = 'none';
            }
        }, 5000);
    });
}


/* ==========================================================================
   9. GLOBAL KEYBOARD ACCESSIBILITY (ESCAPE KEY)
   ========================================================================== */

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (reservationModal && reservationModal.classList.contains('show')) {
            closeReservationModal();
        }
        if (discountPopup && discountPopup.classList.contains('show')) {
            closeDiscountPopup(true);
        }
        closeMobileMenu();
    }
});