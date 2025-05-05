document.addEventListener('DOMContentLoaded', function() {
    initializeComponents();
    initializeAOS();
});

function initializeComponents() {
    try {
        setupBackToTopButton();
        setupSmoothScroll();
        setupFormValidation();
        setupDarkModeToggle();
        setupPreloader();
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: false, // Allow animations to retrigger on scroll
            easing: 'ease-in-out',
            offset: 120,
            delay: 100
        });
    } else {
        console.warn('AOS library not loaded');
    }
}

function setupBackToTopButton() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (!backToTopButton) {
        console.warn('Back to top button not found');
        return;
    }

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        toggleBackToTopButton(backToTopButton);
    });

    // Smooth scroll to top when clicked
    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function toggleBackToTopButton(button) {
    button.classList.toggle('show', window.pageYOffset > 300);
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL without jumping
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    } else {
                        location.hash = targetId;
                    }
                }
            }
        });
    });
}

function setupFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) {
        console.warn('Contact form not found');
        return;
    }

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            await submitForm(contactForm);
        }
    });
}

function validateForm() {
    let isValid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Reset validation states
    resetValidation();

    // Validate name
    if (!name.value.trim()) {
        markInvalid(name, 'Please enter your name');
        isValid = false;
    }

    // Validate email
    if (!emailRegex.test(email.value)) {
        markInvalid(email, 'Please enter a valid email');
        isValid = false;
    }

    // Validate message
    if (!message.value.trim()) {
        markInvalid(message, 'Please enter your message');
        isValid = false;
    }

    return isValid;
}

function markInvalid(field, message) {
    field.classList.add('is-invalid');
    
    // Create or update error message
    let errorElement = field.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('invalid-feedback')) {
        errorElement = document.createElement('div');
        errorElement.className = 'invalid-feedback';
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    errorElement.textContent = message;
}

function resetValidation() {
    document.querySelectorAll('.is-invalid').forEach(field => {
        field.classList.remove('is-invalid');
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('invalid-feedback')) {
            errorElement.textContent = '';
        }
    });
}

async function submitForm(form) {
    const formData = new FormData(form);
    const formStatus = document.getElementById('formStatus') || createFormStatusElement(form);

    try {
        formStatus.innerHTML = '<div class="alert alert-info">Sending your message...</div>';
        
        const response = await fetch(form.action, {
            method: form.method,
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            formStatus.innerHTML = '<div class="alert alert-success">Thank you! Your message has been sent.</div>';
            form.reset();
        } else {
            throw new Error('Server response was not OK');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        formStatus.innerHTML = '<div class="alert alert-danger">Oops! There was a problem. Please try again later.</div>';
    }
}

function createFormStatusElement(form) {
    const statusDiv = document.createElement('div');
    statusDiv.id = 'formStatus';
    form.parentNode.insertBefore(statusDiv, form.nextSibling);
    return statusDiv;
}

function setupDarkModeToggle() {
    const modeToggle = document.getElementById('modeToggle');
    const body = document.body;
    
    if (!modeToggle) {
        console.warn('Dark mode toggle not found');
        return;
    }

    const icon = modeToggle.querySelector('i');
    const darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';

    // Initialize dark mode state
    if (darkModeEnabled) {
        enableDarkMode(body, icon);
    }

    // Toggle dark mode on click
    modeToggle.addEventListener('click', () => {
        toggleDarkMode(body, icon);
    });
}

function toggleDarkMode(body, icon) {
    if (body.classList.contains('dark-mode')) {
        disableDarkMode(body, icon);
    } else {
        enableDarkMode(body, icon);
    }
}

function enableDarkMode(body, icon) {
    body.classList.add('dark-mode');
    icon.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('darkMode', 'enabled');
}

function disableDarkMode(body, icon) {
    body.classList.remove('dark-mode');
    icon.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('darkMode', null);
}

function setupPreloader() {
    const preloader = document.getElementById('preloader');
    const content = document.getElementById('content');
    
    if (!preloader || !content) {
        console.warn('Preloader or content element not found');
        return;
    }

    window.addEventListener('load', function() {
        // Minimum display time for preloader (1.5 seconds)
        setTimeout(() => {
            preloader.classList.add('fade-out');
            
            // Wait for fade out animation to complete
            setTimeout(() => {
                preloader.style.display = 'none';
                content.style.display = 'block';
                content.classList.add('fade-in');
            }, 500); 
        }, 1500);
    });
}

/**
 * Typed.js initialization for the hero section
 */
function initializeTypedJS() {
    if (typeof Typed !== 'undefined' && document.querySelector('.typed-text')) {
        new Typed('.typed-text', {
            strings: ['FUTURE...', 'FUTURE UI/UX DESIGNER', 'FUTURE CREATIVE CODER ', 'PROBLEM SOLVER '],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
}

// Initialize typed.js after everything is loaded
window.addEventListener('load', initializeTypedJS);