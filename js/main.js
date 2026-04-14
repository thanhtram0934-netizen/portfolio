/* ============================================================
   MAIN.JS — Portfolio Nguyễn Thị Thanh Trâm
   Editorial Vintage — Navy + Cream + Gold
   Features: AOS, Language Toggle, Scroll Effects,
             Counter Animation, Meter Animation,
             Project Filter, Nav Toggle, Form Handling
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

    // ==================== LANGUAGE STATE ====================
    let currentLang = localStorage.getItem('portfolio-lang') || 'vi';

    // ==================== NAVBAR SCROLL EFFECT ====================
    const navbar = document.getElementById('mainNav');
    const backToTop = document.getElementById('backToTop');

    function handleScroll() {
        var scrollY = window.scrollY;

        // Navbar background
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        if (backToTop) {
            if (scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        // Active nav link
        updateActiveNavLink();
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ==================== ACTIVE NAV LINK ====================
    function updateActiveNavLink() {
        var sections = document.querySelectorAll('section[id]');
        var navLinks = document.querySelectorAll('.ed-nav-links a[href^="#"]');
        var scrollY = window.scrollY + 120;

        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');

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

    // ==================== MOBILE NAV TOGGLE ====================
    var navToggle = document.getElementById('navToggle');
    var navLinksEl = document.getElementById('navLinks');

    if (navToggle && navLinksEl) {
        navToggle.addEventListener('click', function () {
            navLinksEl.classList.toggle('open');
        });

        navLinksEl.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinksEl.classList.remove('open');
            });
        });
    }

    // ==================== BACK TO TOP ====================
    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==================== LANGUAGE TOGGLE ====================
    var langToggle = document.getElementById('langToggle');
    var langLabel = document.getElementById('langLabel');

    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('portfolio-lang', lang);

        langLabel.textContent = lang === 'vi' ? 'EN' : 'VI';

        document.querySelectorAll('[data-vi][data-en]').forEach(function (el) {
            var text = el.getAttribute('data-' + lang);
            if (text) {
                if (text.includes('<')) {
                    el.innerHTML = text;
                } else {
                    el.textContent = text;
                }
            }
        });
    }

    langToggle.addEventListener('click', function () {
        var newLang = currentLang === 'vi' ? 'en' : 'vi';
        applyLanguage(newLang);
    });

    if (currentLang !== 'vi') {
        applyLanguage(currentLang);
    }

    // ==================== COUNTER ANIMATION ====================
    function animateCounters() {
        document.querySelectorAll('.stat-number[data-count]').forEach(function (counter) {
            if (counter.dataset.animated) return;

            var rect = counter.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
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
    animateCounters();

    // ==================== METER ANIMATION ====================
    function animateMeters() {
        document.querySelectorAll('.ed-meter-fill[data-width]').forEach(function (fill) {
            if (fill.dataset.animated) return;

            var rect = fill.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                fill.dataset.animated = 'true';
                var width = fill.getAttribute('data-width');
                setTimeout(function () {
                    fill.style.width = width + '%';
                }, 200);
            }
        });
    }

    window.addEventListener('scroll', animateMeters, { passive: true });
    animateMeters();

    // ==================== PROJECT FILTER ====================
    var filterBtns = document.querySelectorAll('.ed-filter-btn');
    var projectItems = document.querySelectorAll('.project-item');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var filter = btn.getAttribute('data-filter');

            projectItems.forEach(function (item) {
                var category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
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

            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                formStatus.className = 'form-status mt-3 error';
                formStatus.textContent = currentLang === 'vi'
                    ? 'Email không hợp lệ.'
                    : 'Invalid email address.';
                return;
            }

            var submitBtn = contactForm.querySelector('.ed-btn-submit');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' +
                (currentLang === 'vi' ? 'Đang gửi...' : 'Sending...');

            setTimeout(function () {
                formStatus.className = 'form-status mt-3 success';
                formStatus.textContent = currentLang === 'vi'
                    ? 'Cảm ơn bạn! Tin nhắn đã được gửi thành công.'
                    : 'Thank you! Your message has been sent successfully.';

                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> ' +
                    (currentLang === 'vi' ? 'Gửi tin nhắn' : 'Send Message');

                setTimeout(function () {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status mt-3';
                }, 5000);
            }, 1500);
        });
    }

});
