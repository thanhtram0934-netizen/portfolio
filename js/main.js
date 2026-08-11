/* ============================================================
   MAIN.JS — Portfolio Nguyễn Thị Thanh Trâm
   Editorial Vintage — Navy + Cream + Gold
   Features: AOS, Language Toggle, Scroll Effects, Counter Animation,
             Case Study Expand/Collapse, Nav Toggle, Contact Form, Lightbox
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ==================== AOS INIT ====================
    // AOS hides every [data-aos] element until it adds .aos-animate. If the CDN is
    // blocked, that would leave the whole page blank — fall back to plain visible.
    if (window.AOS) {
        AOS.init({
            duration: 900,
            easing: 'ease-out-cubic',
            once: true,
            offset: 80,
            disable: false
        });

        // Landing directly on an anchor (e.g. /#projects) jumps past AOS's initial
        // check, leaving those sections invisible until the first scroll. Recalculate
        // once everything has loaded, and again after the browser settles on the anchor.
        var nudgeAos = function () {
            AOS.refreshHard();
            window.dispatchEvent(new Event('scroll'));
        };
        window.addEventListener('load', function () {
            nudgeAos();
            setTimeout(nudgeAos, 300);
        });
        window.addEventListener('hashchange', nudgeAos);
    } else {
        document.documentElement.classList.add('no-aos');
    }

    // ==================== LANGUAGE STATE ====================
    let currentLang = localStorage.getItem('portfolio-lang') || 'vi';

    // ==================== NAVBAR SCROLL EFFECT ====================
    const navbar = document.getElementById('mainNav');
    const backToTop = document.getElementById('backToTop');
    const scrollProgress = document.getElementById('scrollProgress');

    function handleScroll() {
        var scrollY = window.scrollY;

        // Scroll progress bar
        if (scrollProgress) {
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            var progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
            scrollProgress.style.width = progress + '%';
        }

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

                var target = parseFloat(counter.getAttribute('data-count'));
                var prefix = counter.getAttribute('data-prefix') || '';
                var suffix = counter.getAttribute('data-suffix') || '';
                var decimals = parseInt(counter.getAttribute('data-decimals'), 10) || 0;
                var useSeparator = counter.getAttribute('data-separator') === 'true';

                function format(value) {
                    var num = value.toFixed(decimals);
                    if (useSeparator) {
                        var parts = num.split('.');
                        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        num = parts.join('.');
                    }
                    return prefix + num + suffix;
                }

                var duration = 1600;
                var startTime = null;

                function updateCounter(timestamp) {
                    if (!startTime) startTime = timestamp;
                    var elapsed = timestamp - startTime;
                    var t = Math.min(elapsed / duration, 1);
                    // easeOutCubic
                    var eased = 1 - Math.pow(1 - t, 3);
                    counter.textContent = format(target * eased);
                    if (t < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = format(target);
                    }
                }

                requestAnimationFrame(updateCounter);
            }
        });
    }

    window.addEventListener('scroll', animateCounters, { passive: true });
    animateCounters();

    // ==================== CASE STUDY — EXPAND / COLLAPSE ====================
    document.querySelectorAll('[data-case-toggle]').forEach(function (btn) {
        var panel = document.getElementById(btn.getAttribute('data-case-toggle'));
        if (!panel) return;

        btn.addEventListener('click', function () {
            var isOpen = btn.getAttribute('aria-expanded') === 'true';

            btn.setAttribute('aria-expanded', String(!isOpen));
            panel.hidden = isOpen;

            if (isOpen) {
                // Collapsing — keep the card header in view
                var card = btn.closest('.ed-case-card');
                var top = card.getBoundingClientRect().top + window.scrollY - 90;
                if (window.scrollY > top) window.scrollTo({ top: top, behavior: 'smooth' });
            }

            if (window.AOS) AOS.refresh();
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

            function resetButton() {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> ' +
                    (currentLang === 'vi' ? 'Gửi tin nhắn' : 'Send Message');
            }

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' +
                (currentLang === 'vi' ? 'Đang gửi...' : 'Sending...');

            fetch(contactForm.action, {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: new FormData(contactForm)
            })
                .then(function (res) {
                    if (!res.ok) throw new Error('HTTP ' + res.status);
                    return res.json();
                })
                .then(function () {
                    formStatus.className = 'form-status mt-3 success';
                    formStatus.textContent = currentLang === 'vi'
                        ? 'Cảm ơn bạn! Tin nhắn đã được gửi tới hộp thư của tôi.'
                        : 'Thank you! Your message has landed in my inbox.';
                    contactForm.reset();
                    resetButton();
                })
                .catch(function () {
                    formStatus.className = 'form-status mt-3 error';
                    formStatus.textContent = currentLang === 'vi'
                        ? 'Gửi không thành công. Vui lòng email trực tiếp tới thanhtram0934@gmail.com.'
                        : 'Sending failed. Please email me directly at thanhtram0934@gmail.com.';
                    resetButton();
                });
        });
    }

    // ==================== LIGHTBOX ====================
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxCaption = document.getElementById('lightboxCaption');
    var lightboxClose = document.getElementById('lightboxClose');

    if (lightbox && lightboxImg) {
        // Build a readable caption from the nearest before/after label or alt text
        function captionFor(img) {
            var item = img.closest('.ed-showcase-item');
            var label = item ? item.querySelector('.ed-showcase-label') : null;
            var labelText = label ? label.textContent.trim() : '';
            var alt = img.getAttribute('alt') || '';
            return [labelText, alt].filter(Boolean).join(' — ');
        }

        function openLightbox(img) {
            lightboxImg.setAttribute('src', img.currentSrc || img.src);
            lightboxImg.setAttribute('alt', img.getAttribute('alt') || '');
            lightboxCaption.textContent = captionFor(img);
            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        document.querySelectorAll('.ed-showcase-img-wrap img, .ed-phone-screen img').forEach(function (img) {
            img.addEventListener('click', function () { openLightbox(img); });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
        });
    }

});
