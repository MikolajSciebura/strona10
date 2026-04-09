document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const overlay = document.querySelector('.nav-overlay');

    const toggleMenu = () => {
        if (!nav || !menuToggle) return;
        nav.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';

        const icon = menuToggle.querySelector('i');
        if (icon) {
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    };

    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);

    // Close menu when clicking link
    if (nav) {
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('active')) toggleMenu();
            });
        });
    }

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

    // 🚀 Generic Form AJAX
    const forms = [
        { id: 'valuation-form', statusId: 'form-status' },
        { id: 'contact-form', statusId: 'form-message' }
    ];

    forms.forEach(({ id, statusId }) => {
        const form = document.getElementById(id);
        const status = document.getElementById(statusId);

        if (form) {
            // Handle image preview for valuation form
            if (id === 'valuation-form') {
                const fileInput = form.querySelector('input[type="file"]');
                const previewContainer = document.getElementById('file-preview-container');
                if (fileInput && previewContainer) {
                    fileInput.addEventListener('change', () => {
                        previewContainer.innerHTML = '';
                        Array.from(fileInput.files).forEach(file => {
                            if (file.type.startsWith('image/')) {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                    const img = document.createElement('img');
                                    img.src = e.target.result;
                                    img.style.width = "60px";
                                    img.style.height = "60px";
                                    img.style.objectFit = "cover";
                                    img.style.borderRadius = "5px";
                                    img.style.border = "1px solid #ff9800";
                                    previewContainer.appendChild(img);
                                };
                                reader.readAsDataURL(file);
                            }
                        });
                    });
                }
            }

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = form.querySelector('.btn-submit');
                btn.disabled = true;
                const originalText = btn.textContent;
                btn.textContent = 'Wysyłanie...';

                if (status) {
                    status.style.display = 'none';
                    status.className = '';
                }

                const formData = new FormData(form);

                // Handle multiple photos with compression (valuation only)
                const fileInput = form.querySelector('input[type="file"]');
                if (fileInput && fileInput.files.length > 0) {
                    formData.delete('photos[]');
                    for (let file of fileInput.files) {
                        if (file.type.startsWith('image/')) {
                            const compressed = await compressImage(file);
                            formData.append('photos[]', compressed, file.name);
                        }
                    }
                }

                try {
                    const res = await fetch('send.php', { method: 'POST', body: formData });
                    const text = await res.text();
                    if (text.trim() === "OK") {
                        if (status) {
                            status.textContent = '✅ Wysłano pomyślnie!';
                            status.className = 'success';
                            status.style.display = 'block';
                        } else {
                            alert('✅ Wysłano pomyślnie!');
                        }
                        form.reset();
                        const preview = document.getElementById('file-preview-container');
                        if (preview) preview.innerHTML = '';
                    } else {
                        if (status) {
                            status.textContent = '❌ ' + text;
                            status.className = 'error';
                            status.style.display = 'block';
                        } else {
                            alert('❌ ' + text);
                        }
                    }
                } catch {
                    if (status) {
                        status.textContent = '❌ Błąd połączenia';
                        status.className = 'error';
                        status.style.display = 'block';
                    } else {
                        alert('❌ Błąd połączenia');
                    }
                }

                btn.disabled = false;
                btn.textContent = originalText;
            });
        }
    });

    // --- Animations on Scroll ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // --- Slider Dots Logic ---
    const sliders = document.querySelectorAll('.slider-container');

    sliders.forEach(slider => {
        const wrapper = slider.parentElement;
        const dotsContainer = wrapper.querySelector('.slider-dots');
        const items = slider.children;

        if (!dotsContainer) return;

        // Create dots
        for (let i = 0; i < items.length; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');

            dot.addEventListener('click', () => {
                slider.scrollTo({
                    left: items[i].offsetLeft - slider.offsetLeft,
                    behavior: 'smooth'
                });
            });

            dotsContainer.appendChild(dot);
        }

        // Update dots on scroll
        slider.addEventListener('scroll', () => {
            const scrollIndex = Math.round(slider.scrollLeft / items[0].offsetWidth);
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === scrollIndex);
            });
        });
    });

    // Smooth Scrolling
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
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    });

    // Header scroll effect
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
