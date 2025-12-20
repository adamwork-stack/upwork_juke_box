// Google Analytics Event Tracking
function trackFormEvent(eventName, eventCategory = 'Contact Form', eventLabel = '') {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            'event_category': eventCategory,
            'event_label': eventLabel
        });
    }
    // Fallback for other analytics implementations
    if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
            'event': eventName,
            'event_category': eventCategory,
            'event_label': eventLabel
        });
    }
}

// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const stickyBar = document.getElementById('stickyContactBar');

    // Handle form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Track form submission attempt
            trackFormEvent('form_submit_attempt', 'Contact Form', 'Contact Page');
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Check reCAPTCHA
            const recaptchaResponse = grecaptcha.getResponse();
            if (!recaptchaResponse) {
                trackFormEvent('form_submit_error', 'Contact Form', 'reCAPTCHA not completed');
                alert('Please complete the reCAPTCHA verification.');
                return;
            }
            
            // Validate form
            if (!name || !email || !message) {
                trackFormEvent('form_submit_error', 'Contact Form', 'Missing required fields');
                alert('Please fill in all required fields.');
                return;
            }
            
            // Track successful form submission
            trackFormEvent('form_submit_success', 'Contact Form', 'Contact Page');
            
            // Here you would typically send the form data to your server
            // For now, we'll just show a success message
            console.log('Form submitted:', { name, email, message, recaptchaResponse });
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();
            grecaptcha.reset();
            
            // Track form completion
            trackFormEvent('form_completed', 'Contact Form', 'Contact Page');
        });
        
        // Track form field interactions
        const formFields = contactForm.querySelectorAll('input, textarea');
        formFields.forEach(field => {
            field.addEventListener('focus', function() {
                trackFormEvent('form_field_focus', 'Contact Form', field.name || field.id);
            });
            
            field.addEventListener('blur', function() {
                if (field.value) {
                    trackFormEvent('form_field_completed', 'Contact Form', field.name || field.id);
                }
            });
        });
    }
    
    // Scroll to contact form function
    window.scrollToContact = function() {
        trackFormEvent('sticky_button_click', 'Mobile Contact', 'Sticky Bar');
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Focus on first input after scroll
            setTimeout(() => {
                const firstInput = contactForm.querySelector('input');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 500);
        }
    };
    
    // Track sticky bar visibility
    if (stickyBar) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    trackFormEvent('sticky_bar_viewed', 'Mobile Contact', 'Sticky Bar');
                }
            });
        }, { threshold: 0.5 });
        
        // Observe when sticky bar comes into view
        const formElement = document.getElementById('contactForm');
        if (formElement) {
            observer.observe(formElement);
        }
    }
    
    // Track page view
    trackFormEvent('page_view', 'Contact Page', 'Contact Page Load');
});

// Handle header CTA button clicks
document.addEventListener('DOMContentLoaded', function() {
    const headerCTA = document.querySelector('.header-cta');
    if (headerCTA) {
        headerCTA.addEventListener('click', function() {
            trackFormEvent('header_cta_click', 'Navigation', 'Header CTA');
            scrollToContact();
        });
    }

    const headerArrowBtn = document.querySelector('.header-arrow-btn');
    if (headerArrowBtn) {
        headerArrowBtn.addEventListener('click', function() {
            trackFormEvent('header_arrow_click', 'Navigation', 'Header Arrow');
            scrollToContact();
        });
    }

    // Handle footer CTA button click
    const footerCTA = document.querySelector('.footer-cta');
    if (footerCTA) {
        footerCTA.addEventListener('click', function() {
            trackFormEvent('footer_cta_click', 'Navigation', 'Footer CTA');
            scrollToContact();
        });
    }
});

// Scroll to top function
window.scrollToTop = function() {
    trackFormEvent('scroll_to_top_click', 'Navigation', 'Scroll to Top');
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// Prevent form scroll on mobile when keyboard appears
if (window.innerWidth <= 768) {
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
        } else {
            // Scrolling up
        }
        lastScrollTop = scrollTop;
    });
}

