document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle with Overlay
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    // Create overlay if not exists
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
    }

    if (menuToggle && nav) {
        const toggleMenu = (show) => {
            const isActive = show !== undefined ? show : !nav.classList.contains('active');
            nav.classList.toggle('active', isActive);
            menuToggle.classList.toggle('active', isActive);
            overlay.classList.toggle('active', isActive);

            const icon = menuToggle.querySelector('i');
            if (isActive) {
                icon.classList.replace('fa-bars', 'fa-times');
                document.body.style.overflow = 'hidden';
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
                document.body.style.overflow = '';
            }
        };

        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        overlay.addEventListener('click', () => toggleMenu(false));

        // Close menu on link click
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });
    }

// 📌 Wycena auta
const valuationForm = document.getElementById('valuation-form');
const fileInput = document.getElementById('car-photos');
const previewContainer = document.getElementById('file-preview-container');

if (valuationForm) {
    // 📸 Podgląd zdjęć
    fileInput.addEventListener('change', () => {
        previewContainer.innerHTML = '';
        Array.from(fileInput.files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.width = "100px";
                    img.style.borderRadius = "5px";
                    previewContainer.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    });

    // 🖼️ Kompresja zdjęć
    async function compressImage(file) {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const maxWidth = 1200;
                    let width = img.width;
                    let height = img.height;
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.7);
                };
            };
            reader.readAsDataURL(file);
        });
    }

    // 🚀 Submit wyceny
    valuationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = valuationForm.querySelector('.btn-submit');
        const msgDiv = valuationForm.querySelector('#form-message');

        btn.disabled = true;
        btn.textContent = 'Wysyłanie...';
        msgDiv.textContent = '';
        msgDiv.className = 'form-message';

        const formData = new FormData();
        formData.append('form-type', 'valuation');
        formData.append('brand-model', valuationForm['brand-model'].value);
        formData.append('year', valuationForm['year'].value);
        formData.append('mileage', valuationForm['mileage'].value);
        formData.append('engine', valuationForm['engine'].value);
        formData.append('fuel', valuationForm['fuel'].value);
        formData.append('gearbox', valuationForm['gearbox'].value);
        formData.append('damaged', valuationForm['damaged'].checked ? 'Tak' : 'Nie');
        formData.append('description', valuationForm['description'].value);
        formData.append('phone', valuationForm['phone'].value);
        formData.append('website', valuationForm['website'].value);

        const files = fileInput.files;
        for (let file of files) {
            const compressed = await compressImage(file);
            formData.append('photos[]', compressed, file.name);
        }

        try {
            const res = await fetch('send.php', { method: 'POST', body: formData });
            const text = await res.text();
            if (text === "OK") {
                msgDiv.textContent = '✅ Wysłano pomyślnie!';
                msgDiv.classList.add('success');
                valuationForm.reset();
                previewContainer.innerHTML = '';
            } else {
                msgDiv.textContent = '❌ ' + text;
                msgDiv.classList.add('error');
            }
        } catch {
            msgDiv.textContent = '❌ Błąd połączenia';
            msgDiv.classList.add('error');
        }

        btn.disabled = false;
        btn.textContent = 'WYŚLIJ WYCENĘ';
    });
}

// 📌 Formularz kontaktowy
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.btn-submit');
        const msgDiv = contactForm.querySelector('#form-message');

        btn.disabled = true;
        btn.textContent = 'Wysyłanie...';
        msgDiv.textContent = '';
        msgDiv.className = 'form-message';

        const formData = new FormData(contactForm);

        try {
            const res = await fetch('send.php', { method: 'POST', body: formData });
            const text = await res.text();
            if (text === "OK") {
                msgDiv.textContent = '✅ Wiadomość wysłana!';
                msgDiv.classList.add('success');
                contactForm.reset();
            } else {
                msgDiv.textContent = '❌ ' + text;
                msgDiv.classList.add('error');
            }
        } catch {
            msgDiv.textContent = '❌ Błąd połączenia';
            msgDiv.classList.add('error');
        }

        btn.disabled = false;
        btn.textContent = 'WYŚLIJ WIADOMOŚĆ';
    });
}


    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (nav && nav.classList.contains('active')) {
                    menuToggle.click();
                }
            }
        });
    });

    // Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(reveal => revealObserver.observe(reveal));

    // Robust Slider Functionality (High-Performance Mobile Snapping)
    function initSlider(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const track = container.querySelector('.slider-track');
        const items = Array.from(container.querySelectorAll('.slider-item'));

        let index = 0;
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let isScrolling = false;
        let autoSlideTimer;
        let lastTouchTime = 0;

        function getCurrentTranslate() {
            const style = window.getComputedStyle(track);
            const matrix = new WebKitCSSMatrix(style.transform);
            return matrix.m41;
        }

        // Create Dots - Fixed to match scrollable positions
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'slider-dots';
        container.appendChild(dotsContainer);

        function updateDots() {
            const itemsPerView = getItemsPerView();
            const numDots = Math.max(1, items.length - itemsPerView + 1);

            if (dotsContainer.children.length !== numDots) {
                dotsContainer.innerHTML = '';
                for (let i = 0; i < numDots; i++) {
                    const dot = document.createElement('span');
                    dot.className = 'dot';
                    dot.addEventListener('click', () => {
                        index = i;
                        scrollToIndex();
                        resetAutoSlide();
                    });
                    dotsContainer.appendChild(dot);
                }
            }

            Array.from(dotsContainer.children).forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }

        function getItemsPerView() {
            if (window.innerWidth > 992) return 3;
            if (window.innerWidth > 768) return 2;
            return 1;
        }

        function scrollToIndex() {
            const itemsPerView = getItemsPerView();
            const maxIndex = Math.max(0, items.length - itemsPerView);
            if (index < 0) index = 0;
            if (index > maxIndex) index = maxIndex;

            const gap = 20;
            const itemWidth = items[0].offsetWidth;
            currentTranslate = index * -(itemWidth + gap);
            prevTranslate = currentTranslate;

            track.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
            track.style.transform = `translateX(${currentTranslate}px)`;
            updateDots();
        }

        function handleDragStart(e) {
            if (e.type === 'mousedown' && (e.button !== 0 || Date.now() - lastTouchTime < 500)) return;
            if (e.type.startsWith('touch')) lastTouchTime = Date.now();

            currentTranslate = getCurrentTranslate();
            prevTranslate = currentTranslate;

            isDragging = true;
            isScrolling = false;
            startX = getX(e);
            startY = getY(e);

            track.style.transition = 'none';
            void track.offsetWidth; // force reflow
            stopAutoSlide();
        }

        function handleDragMove(e) {
            if (!isDragging || isScrolling) return;

            const x = getX(e);
            const y = getY(e);
            const dx = x - startX;
            const dy = y - startY;

            if (!isScrolling && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
                if (Math.abs(dy) > Math.abs(dx)) {
                    isScrolling = true;
                    isDragging = false;
                    return;
                }
            }

            if (isDragging) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    if (e.cancelable) e.preventDefault();
                }
                currentTranslate = prevTranslate + dx;
                track.style.transform = `translateX(${currentTranslate}px)`;
            }
        }

        function handleDragEnd() {
            if (!isDragging && !isScrolling) return;

            const wasDragging = isDragging;
            isDragging = false;
            isScrolling = false;

            if (wasDragging) {
                const gap = 20;
                const itemWidth = items[0].offsetWidth + gap;
                const movedBy = currentTranslate - prevTranslate;

                // Threshold for direct index change or snapping
                if (Math.abs(movedBy) > 50) {
                    const direction = movedBy < 0 ? 1 : -1;
                    index += direction;
                } else {
                    index = Math.round(Math.abs(currentTranslate) / itemWidth);
                }
            }

            scrollToIndex();
            startAutoSlide();
        }

        function getX(e) {
            if (e.type.includes('mouse')) return e.pageX;
            if (e.touches && e.touches.length > 0) return e.touches[0].clientX;
            if (e.changedTouches && e.changedTouches.length > 0) return e.changedTouches[0].clientX;
            return 0;
        }
        function getY(e) {
            if (e.type.includes('mouse')) return e.pageY;
            if (e.touches && e.touches.length > 0) return e.touches[0].clientY;
            if (e.changedTouches && e.changedTouches.length > 0) return e.changedTouches[0].clientY;
            return 0;
        }

        function startAutoSlide() {
            stopAutoSlide();
            autoSlideTimer = setInterval(() => {
                const itemsPerView = getItemsPerView();
                if (index < items.length - itemsPerView) {
                    index++;
                } else {
                    index = 0;
                }
                scrollToIndex();
            }, 5000);
        }

        function stopAutoSlide() { clearInterval(autoSlideTimer); }
        function resetAutoSlide() { stopAutoSlide(); startAutoSlide(); }

        track.addEventListener('touchstart', handleDragStart, { passive: true });
        track.addEventListener('touchmove', handleDragMove, { passive: false });
        track.addEventListener('touchend', handleDragEnd);
        track.addEventListener('touchcancel', handleDragEnd);

        track.addEventListener('mousedown', handleDragStart);
        window.addEventListener('mousemove', (e) => isDragging && handleDragMove(e));
        window.addEventListener('mouseup', (e) => (isDragging || isScrolling) && handleDragEnd(e));

        window.addEventListener('resize', () => {
            const itemsPerView = getItemsPerView();
            const gap = 20;
            const itemWidth = (container.offsetWidth - (gap * (itemsPerView - 1))) / itemsPerView;
            items.forEach(item => item.style.flex = `0 0 ${itemWidth}px`);
            scrollToIndex();
        });

        // Init Layout
        const itemsPerView = getItemsPerView();
        const gap = 20;
        const itemWidth = (container.offsetWidth - (gap * (itemsPerView - 1))) / itemsPerView;
        items.forEach(item => item.style.flex = `0 0 ${itemWidth}px`);
        updateDots();
        startAutoSlide();
    }

    initSlider('recent-buys-slider');
    initSlider('testimonials-slider');

    // Add scroll effect to header and Back to Top button
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.padding = '5px 0';
            header.style.background = 'rgba(11, 19, 43, 0.95)';
        } else {
            header.style.padding = '15px 0';
            header.style.background = '#0b132b';
        }

        if (backToTop) {
            if (window.scrollY > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
