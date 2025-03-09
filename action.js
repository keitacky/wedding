document.addEventListener('DOMContentLoaded', function() {
    // Generate RSVP form
    const rsvpSection = document.getElementById('rsvp-form');
    
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
        <button type="submit">Submit</button>
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
        
        // Here you would typically send data to an external service
        // Example: Using Formspree
        // fetch("https://formspree.io/f/yourFormspreeID", { method: "POST", body: formData });
    });
    
    // Add countdown timer
    const welcomeSection = document.getElementById('welcome');
    
    const countdownDiv = document.createElement('div');
    countdownDiv.className = 'countdown';
    countdownDiv.innerHTML = '<h3>Countdown to our wedding:</h3><div id="timer"></div>';
    welcomeSection.appendChild(countdownDiv);
    
    // Countdown functionality
    const weddingDate = new Date('2025-06-01T14:00:00');
    
    function updateCountdown() {
        const now = new Date();
        const diff = weddingDate - now;
        
        if (diff <= 0) {
            document.getElementById('timer').innerHTML = "It's our wedding day!";
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('timer').innerHTML = `
            <span>${days} days</span> 
            <span>${hours} hours</span> 
            <span>${minutes} minutes</span> 
            <span>${seconds} seconds</span>
        `;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Photo Gallery Functionality
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
    
    // Change photo function
    function changePhoto(index) {
        galleryImages.forEach((image) => image.classList.remove('active'));
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot) => dot.classList.remove('active'));
        
        galleryImages[index].classList.add('active');
        dots[index].classList.add('active');
    }
    
    // Auto change photos every 5 seconds
    let galleryInterval = setInterval(() => {
        const activeIndex = getCurrentPhotoIndex();
        const nextIndex = (activeIndex + 1) % galleryImages.length;
        changePhoto(nextIndex);
    }, 5000);
    
    // Pause auto-rotation when user interacts
    document.querySelector('.photo-gallery').addEventListener('mouseenter', () => {
        clearInterval(galleryInterval);
    });
    
    document.querySelector('.photo-gallery').addEventListener('mouseleave', () => {
        galleryInterval = setInterval(() => {
            const activeIndex = getCurrentPhotoIndex();
            const nextIndex = (activeIndex + 1) % galleryImages.length;
            changePhoto(nextIndex);
        }, 5000);
    });
    
    // Scroll animations
    function setupScrollAnimations() {
        // All sections for fade-in effect
        const sections = document.querySelectorAll('section');
        sections.forEach(section => section.classList.add('fade-in'));
        
        // Create intersection observer for fade-in elements
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: if you want the animation only once
                    // observer.unobserve(entry.target);
                } else {
                    // Comment out the next line if you want elements to stay visible once shown
                    // entry.target.classList.remove('visible');
                }
            });
        }, {
            threshold: 0.2 // 20% of the element is visible
        });
        
        // Observe all fade-in elements
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(element => {
            observer.observe(element);
        });
        
        // Parallax effect for header
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            const header = document.querySelector('header');
            if (header) {
                const headerHeight = header.offsetHeight;
                if (scrollPosition <= headerHeight) {
                    header.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
                }
            }
        });
    }
    
    setupScrollAnimations();
});