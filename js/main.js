/* ============================================================
   MAIN.JS — Portfolio Nguyễn Thị Thanh Trâm
   Features: AOS, Typed.js, Language Toggle, Scroll Effects,
             Counter Animation, Project Filter, Form Handling
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ==================== AOS INIT ====================
    AOS.init({
        duration: 900,
        easing: 'ease-out-cubic',
        once: true,
        offset: 80,
        disable: false
    });

    // ==================== TYPED.JS INIT ====================
    const typedStringsVI = [
        'Chuyên viên TMĐT',
        'Chiến lược nội dung',
        'Phân tích dữ liệu',
        'Tối ưu tăng trưởng'
    ];

    const typedStringsEN = [
        'E-Commerce Specialist',
        'Content Strategist',
        'Data Analyst',
        'Growth Operator'
    ];

    let currentLang = localStorage.getItem('portfolio-lang') || 'vi';
    let typedInstance = null;

    function initTyped() {
        if (typedInstance) {
            typedInstance.destroy();
        }
        const strings = currentLang === 'vi' ? typedStringsVI : typedStringsEN;
        typedInstance = new Typed('#typed-output', {
            strings: strings,
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }

    initTyped();

    // ==================== NAVBAR SCROLL EFFECT ====================
    const navbar = document.getElementById('mainNav');
    const backToTop = document.getElementById('backToTop');

    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar shrink
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link based on scroll position
        updateActiveNavLink();
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ==================== ACTIVE NAV LINK ====================
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        const scrollY = window.scrollY + 100;

        sections.forEach(function (section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ==================== CLOSE MOBILE NAV ON LINK CLICK ====================
    const navbarCollapse = document.getElementById('navbarNav');
    document.querySelectorAll('.nav-link[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function () {
            if (navbarCollapse.classList.contains('show')) {
                var bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) bsCollapse.hide();
            }
        });
    });

    // ==================== LANGUAGE TOGGLE ====================
    const langToggle = document.getElementById('langToggle');
    const langLabel = document.getElementById('langLabel');

    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('portfolio-lang', lang);

        // Update toggle button label
        langLabel.textContent = lang === 'vi' ? 'EN' : 'VI';

        // Update all elements with data-vi and data-en attributes
        document.querySelectorAll('[data-vi][data-en]').forEach(function (el) {
            var text = el.getAttribute('data-' + lang);
            if (text) {
                // Check if the text contains HTML
                if (text.includes('<')) {
                    el.innerHTML = text;
                } else {
                    el.textContent = text;
                }
            }
        });

        // Reinitialize Typed.js with new language
        initTyped();
    }

    langToggle.addEventListener('click', function () {
        var newLang = currentLang === 'vi' ? 'en' : 'vi';
        applyLanguage(newLang);
    });

    // Apply saved language on load
    if (currentLang !== 'vi') {
        applyLanguage(currentLang);
    }

    // ==================== COUNTER ANIMATION ====================
    function animateCounters() {
        document.querySelectorAll('.stat-number[data-count]').forEach(function (counter) {
            if (counter.dataset.animated) return;

            var rect = counter.getBoundingClientRect();
            var windowHeight = window.innerHeight;

            if (rect.top < windowHeight - 50) {
                counter.dataset.animated = 'true';
                var target = parseInt(counter.getAttribute('data-count'), 10);
                var current = 0;
                var duration = 1500;
                var step = Math.ceil(target / (duration / 16));

                function updateCounter() {
                    current += step;
                    if (current >= target) {
                        counter.textContent = target;
                    } else {
                        counter.textContent = current;
                        requestAnimationFrame(updateCounter);
                    }
                }

                requestAnimationFrame(updateCounter);
            }
        });
    }

    window.addEventListener('scroll', animateCounters, { passive: true });
    animateCounters(); // Check on load

    // ==================== SKILL PROGRESS BAR ANIMATION ====================
    function animateProgressBars() {
        document.querySelectorAll('.progress-bar[data-width]').forEach(function (bar) {
            if (bar.dataset.animated) return;

            var rect = bar.getBoundingClientRect();
            var windowHeight = window.innerHeight;

            if (rect.top < windowHeight - 50) {
                bar.dataset.animated = 'true';
                var width = bar.getAttribute('data-width');
                setTimeout(function () {
                    bar.style.width = width + '%';
                }, 200);
            }
        });
    }

    window.addEventListener('scroll', animateProgressBars, { passive: true });
    animateProgressBars(); // Check on load

    // ==================== PROJECT FILTER ====================
    var filterBtns = document.querySelectorAll('.filter-btn');
    var projectItems = document.querySelectorAll('.project-item');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Update active button
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var filter = btn.getAttribute('data-filter');

            projectItems.forEach(function (item) {
                var category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    item.style.position = '';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                    item.style.display = '';
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-10px)';
                    setTimeout(function () {
                        item.style.display = 'none';
                    }, 400);
                }
            });
        });
    });

    // ==================== CONTACT FORM ====================
    var contactForm = document.getElementById('contactForm');
    var formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Simple frontend validation
            var name = document.getElementById('contactName').value.trim();
            var email = document.getElementById('contactEmail').value.trim();
            var message = document.getElementById('contactMessage').value.trim();

            if (!name || !email || !message) {
                formStatus.className = 'form-status mt-3 error';
                formStatus.textContent = currentLang === 'vi'
                    ? 'Vui lòng điền đầy đủ thông tin bắt buộc.'
                    : 'Please fill in all required fields.';
                return;
            }

            // Email validation
            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                formStatus.className = 'form-status mt-3 error';
                formStatus.textContent = currentLang === 'vi'
                    ? 'Email không hợp lệ.'
                    : 'Invalid email address.';
                return;
            }

            // Simulate send
            var submitBtn = contactForm.querySelector('.btn-submit');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>' +
                (currentLang === 'vi' ? 'Đang gửi...' : 'Sending...');

            setTimeout(function () {
                formStatus.className = 'form-status mt-3 success';
                formStatus.textContent = currentLang === 'vi'
                    ? 'Cảm ơn bạn! Tin nhắn đã được gửi thành công.'
                    : 'Thank you! Your message has been sent successfully.';

                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>' +
                    (currentLang === 'vi' ? 'Gửi tin nhắn' : 'Send Message');

                setTimeout(function () {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status mt-3';
                }, 5000);
            }, 1500);
        });
    }

    // ==================== SMOOTH REVEAL ON SCROLL ====================
    // Additional parallax-like subtle effect for hero section
    var heroSection = document.getElementById('hero');
    if (heroSection) {
        window.addEventListener('scroll', function () {
            var scrollY = window.scrollY;
            var shapes = heroSection.querySelectorAll('.shape');
            shapes.forEach(function (shape, i) {
                var speed = 0.3 + (i * 0.1);
                shape.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
            });

            var heroCard = heroSection.querySelector('.hero-card-main');
            var heroMiniCards = heroSection.querySelectorAll('.hero-mini-card');
            var heroSticker = heroSection.querySelector('.hero-sticker-star');

            if (heroCard) {
                heroCard.style.transform = 'translateY(' + (scrollY * 0.05) + 'px) rotate(-5deg)';
            }

            heroMiniCards.forEach(function (card, index) {
                var direction = index === 0 ? 1 : -1;
                card.style.transform = 'translateY(' + (scrollY * (0.03 + (index * 0.01)) * direction) + 'px) ' + (index === 0 ? 'rotate(7deg)' : 'rotate(-8deg)');
            });

            if (heroSticker) {
                heroSticker.style.transform = 'translateY(' + (scrollY * 0.06) + 'px) rotate(14deg)';
            }
        }, { passive: true });
    }

});
