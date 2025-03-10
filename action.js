document.addEventListener('DOMContentLoaded', function()  {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="spinner"></div>
        <div class="preloader-text">K & M</div>
    `;
    document.body.appendChild(preloader);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('preloader-hidden');
            setTimeout(() => {
                preloader.remove();
                const heroContent = document.querySelector('.hero-content');
                if(heroContent) {
                    heroContent.style.opacity = '1';
                    heroContent.style.transform = 'translateY(0)';
                    heroContent.classList.add('animate-in');
                }
                
                initFullScreenSections();
            }, 500);
        }, 800);
    });

    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    function initFullScreenSections() {
        const sections = document.querySelectorAll('section');
        const totalSections = sections.length;
        
        sections.forEach((section, index) => {
            section.setAttribute('data-index', index);
            
            const indicator = document.createElement('div');
            indicator.classList.add('section-indicator');
            indicator.setAttribute('data-section', index);
            document.querySelector('.section-indicators') || createIndicators();
            document.querySelector('.section-indicators').appendChild(indicator);
        });
        
        function createIndicators() {
            const indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'section-indicators';
            document.body.appendChild(indicatorsContainer);
        }
        
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
        
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset + window.innerHeight / 2;
            
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
        
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('section-indicator') || e.target.parentElement.classList.contains('section-indicator')) {
                const target = e.target.classList.contains('section-indicator') ? e.target : e.target.parentElement;
                const index = parseInt(target.getAttribute('data-section'));
                const targetSection = sections[index];
                
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
        
        updateIndicators(0);
    }

    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        const viewportHeight = window.innerHeight;
        
        document.querySelectorAll('.parallax-section, .hero-section, .gallery-section, .rsvp-section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const distanceFromTop = scrollPosition - sectionTop;
            
            if (distanceFromTop > -viewportHeight && distanceFromTop < sectionHeight) {
                const speed = section.classList.contains('hero-section') ? 0.7 : 0.5;
                const yPos = -(distanceFromTop * speed);
                
                if (section.style.backgroundImage) {
                    section.style.backgroundPosition = `center ${yPos}px`;
                }
                
                const bg = section.querySelector('.section-bg');
                if (bg) {
                    const scale = 1 + Math.abs(distanceFromTop / viewportHeight * 0.1);
                    const translateY = distanceFromTop * 0.15;
                    bg.style.transform = `scale(${scale}) translateY(${translateY}px)`;
                }
            }
        });
    });

    const galleryInit = () => {
        const galleryImages = document.querySelectorAll('.gallery-image');
        const dotsContainer = document.querySelector('.dots-container');
        const prevButton = document.getElementById('prev-photo');
        const nextButton = document.getElementById('next-photo');
        
        if (!galleryImages.length) return;
        
        if (galleryImages.length && dotsContainer) {
            galleryImages.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => changePhoto(index));
                dotsContainer.appendChild(dot);
            });
        }
        
        if (prevButton && nextButton) {
            const events = ['click', 'touchstart', 'touchend'];
            
            events.forEach(eventType => {
                prevButton.addEventListener(eventType, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const activeIndex = getCurrentPhotoIndex();
                    const prevIndex = (activeIndex - 1 + galleryImages.length) % galleryImages.length;
                    changePhoto(prevIndex);
                }, { passive: false });
                
                nextButton.addEventListener(eventType, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const activeIndex = getCurrentPhotoIndex();
                    const nextIndex = (activeIndex + 1) % galleryImages.length;
                    changePhoto(nextIndex);
                }, { passive: false });
            });
        }
        
        function getCurrentPhotoIndex() {
            let activeIndex = 0;
            galleryImages.forEach((image, index) => {
                if (image.classList.contains('active')) {
                    activeIndex = index;
                }
            });
            return activeIndex;
        }
        
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
        
        let galleryInterval = setInterval(() => {
            const activeIndex = getCurrentPhotoIndex();
            const nextIndex = (activeIndex + 1) % galleryImages.length;
            changePhoto(nextIndex);
        }, 6000);
        
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
            
            // iOS/タッチデバイス向け拡張機能
            // iOSでのボタン表示保証
            if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
                if (prevButton && nextButton) {
                    // ボタンの可視性を強制的に保証
                    setTimeout(() => {
                        prevButton.style.display = 'flex';
                        nextButton.style.display = 'flex';
                        prevButton.style.visibility = 'visible';
                        nextButton.style.visibility = 'visible';
                        prevButton.style.opacity = '1';
                        nextButton.style.opacity = '1';
                    }, 500);
                }
            }
        }
    };

    const weddingDate = new Date('2025-05-26T14:00:00');
    const timer = document.getElementById('timer');
    
    const miniCountdown = document.getElementById('when-countdown');

    function updateCountdown() {
        if (!timer && !miniCountdown) return;
        
        const now = new Date();
        const diff = weddingDate - now;
        
        if (diff <= 0) {
            if (timer) timer.innerHTML = "<span>It's our wedding day!</span>";
            if (miniCountdown) miniCountdown.innerHTML = "Today's the day!";
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        if (timer) {
            timer.innerHTML = `
                <span>${days}<br>Days</span> 
                <span>${hours}<br>Hours</span> 
                <span>${minutes}<br>Minutes</span> 
                <span>${seconds}<br>Seconds</span>
            `;
        }
        
        if (miniCountdown) {
            miniCountdown.innerHTML = `
                <span>Countdown:</span>
                <span><span class="count-value">${days}</span> days 
                <span class="count-value">${hours}</span> hrs 
                <span class="count-value">${minutes}</span> min</span>
            `;
        }
    }
    
    if (timer || miniCountdown) {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    setTimeout(galleryInit, 100);
    
    const navLinks = document.querySelectorAll('.navbar a, .btn');
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const navHeight = navbar.offsetHeight;
                    window.scrollTo({
                        top: targetElement.offsetTop - navHeight,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
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

    const form = document.getElementById('rsvp-form');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');
    const tryAgainBtn = document.getElementById('try-again-btn');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const action = form.getAttribute('action');
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;
            
            fetch(action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                form.style.display = 'none';
                formSuccess.style.display = 'block';
                formError.style.display = 'none';
            })
            .catch(error => {
                console.error('Error:', error);
                form.style.display = 'none';
                formError.style.display = 'block';
                formSuccess.style.display = 'none';
            })
            .finally(() => {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            });
        });
        
        if (tryAgainBtn) {
            tryAgainBtn.addEventListener('click', function() {
                form.style.display = 'flex';
                formError.style.display = 'none';
            });
        }
    }
});