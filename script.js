document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
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
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(reveal => revealObserver.observe(reveal));

    // Slider Functionality
    function initSlider(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const track = container.querySelector('.slider-track');
        const nextBtn = container.querySelector('.slider-next');
        const prevBtn = container.querySelector('.slider-prev');
        const items = container.querySelectorAll('.slider-item');

        let index = 0;

        function updateSlider() {
            const itemWidth = items[0].offsetWidth + 20; // width + gap
            track.style.transform = `translateX(-${index * itemWidth}px)`;

            // Handle buttons visibility or state if needed
        }

        nextBtn.addEventListener('click', () => {
            const visibleItems = Math.floor(container.offsetWidth / items[0].offsetWidth);
            if (index < items.length - visibleItems) {
                index++;
            } else {
                index = 0; // Loop back
            }
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            if (index > 0) {
                index--;
            } else {
                const visibleItems = Math.floor(container.offsetWidth / items[0].offsetWidth);
                index = items.length - visibleItems; // Go to last possible index
            }
            updateSlider();
        });

        // Resize handling
        window.addEventListener('resize', updateSlider);
    }

    initSlider('recent-buys-slider');
    initSlider('testimonials-slider');

    // Auto-slide functionality (optional but nice)
    function autoSlide(containerId, interval = 5000) {
        const nextBtn = document.querySelector(`#${containerId} .slider-next`);
        if (nextBtn) {
            setInterval(() => {
                nextBtn.click();
            }, interval);
        }
    }

    autoSlide('recent-buys-slider');
    autoSlide('testimonials-slider');

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
