document.addEventListener('DOMContentLoaded', function()  {
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
                // ヒーローコンテンツを確実に表示
                const heroContent = document.querySelector('.hero-content');
                if(heroContent) {
                    heroContent.style.opacity = '1';
                    heroContent.style.transform = 'translateY(0)';
                    heroContent.classList.add('animate-in');
                }
                
                // フルスクリーンセクションの初期化
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
        
        // セクション用のインジケーターは維持
        sections.forEach((section, index) => {
            section.setAttribute('data-index', index);
            
            // Create navigation indicators
            const indicator = document.createElement('div');
            indicator.classList.add('section-indicator');
            indicator.setAttribute('data-section', index);
            document.querySelector('.section-indicators') || createIndicators();
            document.querySelector('.section-indicators').appendChild(indicator);
        });
        
        // インジケーター作成関数は維持
        function createIndicators() {
            const indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'section-indicators';
            document.body.appendChild(indicatorsContainer);
        }
        
        // インジケーター更新関数は維持するが、スクロールに合わせて動作するよう変更
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
        
        // スクロール位置に応じてインジケーターを更新する
        window.addEventListener('scroll', function() {
            // 現在のスクロール位置を取得
            const scrollPosition = window.pageYOffset + window.innerHeight / 2;
            
            // 最も近いセクションを見つける
            let closest = null;
            let closestDistance = Infinity;
            
            sections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const distance = Math.abs(scrollPosition - (sectionTop + sectionHeight / 2));
                
                if (distance < closestDistance) {
                    closest = index;
                    closestDistance = distance;
                }
            });
            
            if (closest !== null) {
                updateIndicators(closest);
            }
        });
        
        // インジケーターのクリックイベントは通常のスクロールに変更
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('section-indicator') || e.target.parentElement.classList.contains('section-indicator')) {
                const target = e.target.classList.contains('section-indicator') ? e.target : e.target.parentElement;
                const index = parseInt(target.getAttribute('data-section'));
                const targetSection = sections[index];
                
                // スムーススクロールで対象セクションへ移動
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
        
        // ★★★ 以下のイベントリスナーを削除 ★★★
        // wheel, keydown, touchstartなどのスクロールスナップ関連のイベントは削除
        
        // 初期インジケーターの設定
        updateIndicators(0);
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
    const weddingDate = new Date('2025-05-26T14:00:00');
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
                    // 単純にスムーススクロールで移動
                    const navHeight = navbar.offsetHeight;
                    window.scrollTo({
                        top: targetElement.offsetTop - navHeight,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Custom event listener for section navigation
    document.addEventListener('navigateToSection', (e) => {
        const sectionIndex = e.detail.sectionIndex;
        const sections = document.querySelectorAll('section');
        
        if (sections.length > sectionIndex) {
            window.scrollTo({
                top: sections[sectionIndex].offsetTop,
                behavior: 'smooth'
            });
        }
    });
});