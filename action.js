document.addEventListener('DOMContentLoaded', function() {
    // Page preloader - ensures images load completely
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="spinner"></div>
        <div class="preloader-text">J & S</div>
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

    // Parallax effect for background images
    const parallaxSections = document.querySelectorAll('.parallax-section, .hero-section');
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        
        parallaxSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Check if section is in viewport
            if (scrollPosition >= sectionTop - window.innerHeight && 
                scrollPosition <= sectionTop + sectionHeight) {
                const speed = section.classList.contains('hero-section') ? 0.5 : 0.3;
                const yPos = -(scrollPosition - sectionTop) * speed;
                section.style.backgroundPosition = `center ${yPos}px`;
            }
        });
    });

    // Animated reveal on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.detail-card, .payment-card, .section-heading, .section-intro, .gallery-container');
        
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(element => {
            element.classList.add('will-animate');
            observer.observe(element);
        });
    };
    
    animateOnScroll();

    // Enhanced gallery functionality
    const galleryInit = () => {
        const galleryImages = document.querySelectorAll('.gallery-image');
        const dotsContainer = document.querySelector('.dots-container');
        const prevButton = document.getElementById('prev-photo');
        const nextButton = document.getElementById('next-photo');
        
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
        document.querySelector('.photo-gallery').addEventListener('mouseenter', () => {
            clearInterval(galleryInterval);
        });
        
        document.querySelector('.photo-gallery').addEventListener('mouseleave', () => {
            galleryInterval = setInterval(() => {
                const activeIndex = getCurrentPhotoIndex();
                const nextIndex = (activeIndex + 1) % galleryImages.length;
                changePhoto(nextIndex);
            }, 6000);
        });
    };

    // RSVP form 
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
            
            // Example: Using Formspree
            // fetch("https://formspree.io/f/yourFormspreeID", { method: "POST", body: formData });
        });
    }

    // Countdown timer
    const weddingDate = new Date('2025-06-01T14:00:00');
    const timer = document.getElementById('timer');
    
    function updateCountdown() {
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
                    const navHeight = navbar.offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});