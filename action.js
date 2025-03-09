document.addEventListener('DOMContentLoaded', function() {
    // Page preloader - ensures images load completely
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="spinner"></div>
        <div class="preloader-text">K & M</div>
    `;
    document.body.appendChild(preloader);
    
    // Remove preloader when page is fully loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('preloader-hidden');
            setTimeout(() => {
                preloader.remove();
                // Add animation to hero content after preloader is gone
                document.querySelector('.hero-content').classList.add('animate-in');
                
                // Initialize full screen sections after preloader is gone
                initFullScreenSections();
            }, 500);
        }, 800);
    });

    // Enhanced navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Full screen sections initialization
    function initFullScreenSections() {
        const sections = document.querySelectorAll('section');
        const totalSections = sections.length;
        let currentSection = 0;
        let isScrolling = false;
        let touchStartY = 0;
        let touchEndY = 0;
        
        // Add scroll-section class to all sections
        sections.forEach((section, index) => {
            section.classList.add('scroll-section');
            section.setAttribute('data-index', index);
            
            // Create navigation indicators
            const indicator = document.createElement('div');
            indicator.classList.add('section-indicator');
            indicator.setAttribute('data-section', index);
            document.querySelector('.section-indicators') || createIndicators();
            document.querySelector('.section-indicators').appendChild(indicator);
        });
        
        // Create section indicators container
        function createIndicators() {
            const indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'section-indicators';
            document.body.appendChild(indicatorsContainer);
        }
        
        // Update active section indicator
        function updateIndicators(index) {
            const indicators = document.querySelectorAll('.section-indicator');
            indicators.forEach((indicator, i) => {
                if (i === index) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }
        
        // Navigate to section
        function goToSection(index) {
            if (isScrolling) return;
            isScrolling = true;
            
            if (index < 0) index = 0;
            if (index >= totalSections) index = totalSections - 1;
            
            currentSection = index;
            updateIndicators(currentSection);
            
            const targetSection = sections[index];
            const targetPosition = targetSection.offsetTop;
            
            // Add active class to target section and remove from others
            sections.forEach((section, i) => {
                if (i === index) {
                    section.classList.add('active-section');
                    // Execute enter animations for the section
                    animateSectionEnter(section);
                } else {
                    section.classList.remove('active-section');
                    // Only animate exit for adjacent sections
                    if (Math.abs(i - index) === 1) {
                        animateSectionExit(section, i < index ? 'up' : 'down');
                    }
                }
            });
            
            // Smooth scroll to section
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Reset scroll lock after animation completes
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }
        
        // Animate section entrance
        function animateSectionEnter(section) {
            // Select all animatable elements in the section
            const elements = section.querySelectorAll('.animate-on-scroll');
            elements.forEach((el, i) => {
                setTimeout(() => {
                    el.classList.add('in-view');
                }, i * 150); // Stagger the animations
            });
            
            // Special animation for the background image
            const bg = section.querySelector('.section-bg');
            if (bg) {
                bg.style.transform = 'scale(1)';
                bg.style.opacity = '1';
            }
        }
        
        // Animate section exit
        function animateSectionExit(section, direction) {
            // Select all animatable elements in the section
            const elements = section.querySelectorAll('.animate-on-scroll');
            elements.forEach((el) => {
                el.classList.remove('in-view');
                
                // Add direction-based exit class if needed
                if (direction === 'up') {
                    el.classList.add('exit-up');
                } else {
                    el.classList.add('exit-down');
                }
                
                // Remove exit classes after animation
                setTimeout(() => {
                    el.classList.remove('exit-up', 'exit-down');
                }, 1000);
            });
            
            // Special animation for the background image
            const bg = section.querySelector('.section-bg');
            if (bg) {
                bg.style.transform = direction === 'up' ? 'scale(1.1) translateY(-5%)' : 'scale(1.1) translateY(5%)';
                bg.style.opacity = '0.8';
            }
        }
        
        // Set up intersection observer to detect which section is in view
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px',
            threshold: 0
        };
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isScrolling) {
                    const index = parseInt(entry.target.getAttribute('data-index'));
                    currentSection = index;
                    updateIndicators(currentSection);
                }
            });
        }, observerOptions);
        
        sections.forEach(section => {
            sectionObserver.observe(section);
        });
        
        // Set up click handlers for section indicators
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('section-indicator') || e.target.parentElement.classList.contains('section-indicator')) {
                const target = e.target.classList.contains('section-indicator') ? e.target : e.target.parentElement;
                const index = parseInt(target.getAttribute('data-section'));
                goToSection(index);
            }
        });
        
        // Handle mousewheel events for smooth section transitions
        let wheelTimeout;
        window.addEventListener('wheel', (e) => {
            clearTimeout(wheelTimeout);
            
            wheelTimeout = setTimeout(() => {
                if (isScrolling) return;
                
                if (e.deltaY > 0) {
                    // Scroll down
                    goToSection(currentSection + 1);
                } else {
                    // Scroll up
                    goToSection(currentSection - 1);
                }
            }, 50);
        }, { passive: true });
        
        // Handle key events
        window.addEventListener('keydown', (e) => {
            if (isScrolling) return;
            
            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                goToSection(currentSection + 1);
                e.preventDefault();
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                goToSection(currentSection - 1);
                e.preventDefault();
            }
        });
        
        // Handle touch events for mobile
        window.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        window.addEventListener('touchend', (e) => {
            if (isScrolling) return;
            
            touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;
            
            // Only trigger if significant swipe
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    // Swipe up - go to next section
                    goToSection(currentSection + 1);
                } else {
                    // Swipe down - go to previous section
                    goToSection(currentSection - 1);
                }
            }
        }, { passive: true });
        
        // Set initial active section
        updateIndicators(0);
        sections[0].classList.add('active-section');
        setTimeout(() => animateSectionEnter(sections[0]), 100);
        
        // Add animation classes to elements
        document.querySelectorAll('.section-heading, .section-content, .detail-card, .gallery-container, .payment-card').forEach(el => {
            el.classList.add('animate-on-scroll');
        });
    }

    // Enhanced parallax effect for background images
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        const viewportHeight = window.innerHeight;
        
        // Apply enhanced parallax to all sections with background images
        document.querySelectorAll('.parallax-section, .hero-section, .gallery-section, .rsvp-section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const distanceFromTop = scrollPosition - sectionTop;
            
            // Only apply effect when section is in viewport
            if (distanceFromTop > -viewportHeight && distanceFromTop < sectionHeight) {
                // Calculate parallax amount based on scroll position
                const speed = section.classList.contains('hero-section') ? 0.7 : 0.5;
                const yPos = -(distanceFromTop * speed);
                
                // Apply to section background
                if (section.style.backgroundImage) {
                    section.style.backgroundPosition = `center ${yPos}px`;
                }
                
                // Also apply to any section-bg elements
                const bg = section.querySelector('.section-bg');
                if (bg) {
                    // Create more dramatic parallax for section backgrounds
                    const scale = 1 + Math.abs(distanceFromTop / viewportHeight * 0.1);
                    const translateY = distanceFromTop * 0.15;
                    bg.style.transform = `scale(${scale}) translateY(${translateY}px)`;
                }
            }
        });
    });

    // Gallery functionality (keeping existing code)
    const galleryInit = () => {
        const galleryImages = document.querySelectorAll('.gallery-image');
        const dotsContainer = document.querySelector('.dots-container');
        const prevButton = document.getElementById('prev-photo');
        const nextButton = document.getElementById('next-photo');
        
        if (!galleryImages.length) return;
        
        // Create dots for navigation
        if (galleryImages.length && dotsContainer) {
            galleryImages.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => changePhoto(index));
                dotsContainer.appendChild(dot);
            });
        }
        
        // Navigation buttons
        if (prevButton && nextButton) {
            prevButton.addEventListener('click', () => {
                const activeIndex = getCurrentPhotoIndex();
                const prevIndex = (activeIndex - 1 + galleryImages.length) % galleryImages.length;
                changePhoto(prevIndex);
            });
            
            nextButton.addEventListener('click', () => {
                const activeIndex = getCurrentPhotoIndex();
                const nextIndex = (activeIndex + 1) % galleryImages.length;
                changePhoto(nextIndex);
            });
        }
        
        // Helper function to get current active photo index
        function getCurrentPhotoIndex() {
            let activeIndex = 0;
            galleryImages.forEach((image, index) => {
                if (image.classList.contains('active')) {
                    activeIndex = index;
                }
            });
            return activeIndex;
        }
        
        // Change photo function with enhanced animation
        function changePhoto(index) {
            const activeImage = document.querySelector('.gallery-image.active');
            const targetImage = galleryImages[index];
            
            if (activeImage) {
                activeImage.classList.add('fade-out');
                
                setTimeout(() => {
                    galleryImages.forEach((image) => {
                        image.classList.remove('active', 'fade-out');
                    });
                    targetImage.classList.add('active');
                    
                    const dots = document.querySelectorAll('.dot');
                    dots.forEach((dot) => dot.classList.remove('active'));
                    dots[index].classList.add('active');
                }, 300);
            } else {
                targetImage.classList.add('active');
            }
        }
        
        // Auto change photos every 6 seconds
        let galleryInterval = setInterval(() => {
            const activeIndex = getCurrentPhotoIndex();
            const nextIndex = (activeIndex + 1) % galleryImages.length;
            changePhoto(nextIndex);
        }, 6000);
        
        // Pause auto-rotation when user interacts with the gallery
        const galleryContainer = document.querySelector('.photo-gallery');
        if (galleryContainer) {
            galleryContainer.addEventListener('mouseenter', () => {
                clearInterval(galleryInterval);
            });
            
            galleryContainer.addEventListener('mouseleave', () => {
                galleryInterval = setInterval(() => {
                    const activeIndex = getCurrentPhotoIndex();
                    const nextIndex = (activeIndex + 1) % galleryImages.length;
                    changePhoto(nextIndex);
                }, 6000);
            });
        }
    };

    // RSVP form (keeping existing code)
    const rsvpSection = document.getElementById('rsvp-form');
    
    if (rsvpSection) {
        const rsvpForm = document.createElement('form');
        rsvpForm.innerHTML = `
            <div class="form-group">
                <label for="name">Your Name</label>
                <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label>Will you be attending?</label>
                <div class="radio-group">
                    <input type="radio" id="attending-yes" name="attending" value="yes" required>
                    <label for="attending-yes">Yes</label>
                    <input type="radio" id="attending-no" name="attending" value="no">
                    <label for="attending-no">No</label>
                </div>
            </div>
            <div class="form-group">
                <label for="guests">Number of Guests</label>
                <input type="number" id="guests" name="guests" min="0" value="0">
            </div>
            <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" name="message" rows="4"></textarea>
            </div>
            <button type="submit">Send RSVP</button>
        `;
        
        rsvpSection.appendChild(rsvpForm);
        
        // Form submission handler
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Display message on form submission
            const formData = new FormData(rsvpForm);
            let responseMessage = document.createElement('div');
            responseMessage.className = 'response-message';
            responseMessage.innerHTML = `
                <h3>Thank you, ${formData.get('name')}!</h3>
                <p>We have received your RSVP.</p>
            `;
            
            rsvpForm.style.display = 'none';
            rsvpSection.appendChild(responseMessage);
        });
    }

    // Countdown timer (keeping existing code)
    const weddingDate = new Date('2025-06-01T14:00:00');
    const timer = document.getElementById('timer');
    
    function updateCountdown() {
        if (!timer) return;
        
        const now = new Date();
        const diff = weddingDate - now;
        
        if (diff <= 0) {
            timer.innerHTML = "<span>It's our wedding day!</span>";
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        timer.innerHTML = `
            <span>${days}<br>Days</span> 
            <span>${hours}<br>Hours</span> 
            <span>${minutes}<br>Minutes</span> 
            <span>${seconds}<br>Seconds</span>
        `;
    }
    
    if (timer) {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    // Initialize gallery after a short delay to ensure DOM is ready
    setTimeout(galleryInit, 100);
    
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.navbar a, .btn');
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Get section index
                    const index = parseInt(targetElement.getAttribute('data-index'));
                    if (!isNaN(index)) {
                        // If we're using full screen sections, use our custom navigation
                        const event = new CustomEvent('navigateToSection', {
                            detail: { sectionIndex: index }
                        });
                        document.dispatchEvent(event);
                    } else {
                        // Fall back to default smooth scroll
                        const navHeight = navbar.offsetHeight;
                        const targetPosition = targetElement.offsetTop - navHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });
    
    // Custom event listener for section navigation
    document.addEventListener('navigateToSection', (e) => {
        const sectionIndex = e.detail.sectionIndex;
        const sections = document.querySelectorAll('.scroll-section');
        
        if (sections.length > sectionIndex) {
            window.scrollTo({
                top: sections[sectionIndex].offsetTop,
                behavior: 'smooth'
            });
        }
    });
});