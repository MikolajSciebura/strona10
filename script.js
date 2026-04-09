document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const navOverlay = document.querySelector('.nav-overlay');

    if (menuToggle && nav) {
        const toggleMenu = () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            if (navOverlay) navOverlay.classList.toggle('active');

            if (nav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        };

        menuToggle.addEventListener('click', toggleMenu);
        if (navOverlay) navOverlay.addEventListener('click', toggleMenu);
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
        btn.disabled = true;
        btn.textContent = 'Wysyłanie...';

        const formData = new FormData();
        formData.append('form-type', 'valuation');
        formData.append('brand-model', valuationForm['brand-model'].value);
        formData.append('year', valuationForm['year'].value);
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
                alert('✅ Wysłano!');
                valuationForm.reset();
                previewContainer.innerHTML = '';
            } else alert('❌ ' + text);
        } catch {
            alert('Błąd połączenia');
        }

        btn.disabled = false;
        btn.textContent = 'WYŚLIJ ZGŁOSZENIE';
    });
}

// 📌 Formularz kontaktowy
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.btn-submit');
        btn.disabled = true;
        btn.textContent = 'Wysyłanie...';

        const formData = new FormData(contactForm);

        try {
            const res = await fetch('send.php', { method: 'POST', body: formData });
            const text = await res.text();
            if (text === "OK") {
                alert('✅ Wiadomość wysłana!');
                contactForm.reset();
            } else alert('❌ ' + text);
        } catch {
            alert('Błąd połączenia');
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
                    nav.classList.remove('active');
                    menuToggle.classList.remove('active');
                    if (navOverlay) navOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });

    // Add scroll effect to header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.padding = '5px 0';
            header.style.background = 'rgba(11, 19, 43, 0.95)';
        } else {
            header.style.padding = '15px 0';
            header.style.background = '#0b132b';
        }
    });
});

// 📌 Scroll Reveal Animation
const revealOnScroll = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
};

document.addEventListener('DOMContentLoaded', revealOnScroll);

// 📌 Slider Logic
const initSliders = () => {
    const sliders = document.querySelectorAll('.slider-container');

    sliders.forEach(slider => {
        const track = slider.querySelector('.slider-track');
        const dotsContainer = slider.querySelector('.slider-dots');
        const items = track.children;

        let currentIndex = 0;
        const totalItems = items.length;

        const goToSlide = (index) => {
            if (index < 0) index = 0;
            if (index >= totalItems) index = totalItems - 1;

            currentIndex = index;
            const scrollAmount = items[currentIndex].offsetLeft - track.offsetLeft;

            if (window.innerWidth <= 600) {
                slider.scrollTo({ left: scrollAmount, behavior: 'smooth' });
            } else {
                track.style.transform = `translateX(-${scrollAmount}px)`;
            }
            updateDots(currentIndex);
        };

        // Navigation Arrows
        const prevBtn = slider.querySelector('.slider-prev');
        const nextBtn = slider.querySelector('.slider-next');

        if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

        // Create dots
        if (dotsContainer) {
            Array.from(items).forEach((_, idx) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (idx === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(idx));
                dotsContainer.appendChild(dot);
            });
        }

        const updateDots = (activeIndex) => {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === activeIndex);
            });
        };

        // For mobile scroll snapping
        if (window.innerWidth <= 600) {
            slider.addEventListener('scroll', () => {
                const scrollLeft = slider.scrollLeft;
                const itemWidth = items[0].offsetWidth + 15;
                const activeIndex = Math.round(scrollLeft / itemWidth);
                updateDots(activeIndex);
            });
        }
    });
};

document.addEventListener('DOMContentLoaded', initSliders);
