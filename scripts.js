// =====================================================
// Pluggen Elektro — Shared scripts
// =====================================================

(function () {
    // Mobile menu
    window.toggleMenu = function () {
        const menu = document.getElementById('nav-menu');
        if (menu) menu.classList.toggle('is-open');
    };

    document.addEventListener('DOMContentLoaded', function () {
        // Disable native HTML5 drag on nav, logo and buttons (covers Firefox)
        document.querySelectorAll(
            'nav a, nav img, .logo img, .phone-header, .btn, button, .submit-button'
        ).forEach(el => {
            el.setAttribute('draggable', 'false');
            el.addEventListener('dragstart', e => e.preventDefault());
        });

        // Close mobile menu on link click
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.addEventListener('click', () => {
                const menu = document.getElementById('nav-menu');
                if (menu) menu.classList.remove('is-open');
            });
        });

        // Header opacity-on-scroll (only when transparent variant is in use)
        const header = document.querySelector('header');
        const body = document.body;
        if (header && body.classList.contains('has-video-hero')) {
            const onScroll = () => {
                if (window.scrollY > 60) header.classList.add('is-scrolled');
                else header.classList.remove('is-scrolled');
            };
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        }

        // FAQ accordion
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const isActive = question.classList.contains('is-active');
                document.querySelectorAll('.faq-question').forEach(q => {
                    q.classList.remove('is-active');
                    q.nextElementSibling.classList.remove('is-active');
                });
                if (!isActive) {
                    question.classList.add('is-active');
                    answer.classList.add('is-active');
                }
            });
        });

        // Video autoplay (defensive — some browsers block until interaction)
        document.querySelectorAll('video[autoplay]').forEach(video => {
            const p = video.play();
            if (p) p.catch(() => {});
        });
        document.addEventListener('click', () => {
            document.querySelectorAll('video[autoplay]').forEach(v => {
                if (v.paused) v.play().catch(() => {});
            });
        }, { once: true });

        // Lazy video — plays when scrolled into view, pauses when out of view
        const lazyVideos = document.querySelectorAll('video[data-play-on-view]');
        if (lazyVideos.length) {
            if ('IntersectionObserver' in window) {
                const vio = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        const v = entry.target;
                        if (entry.isIntersecting) {
                            const p = v.play();
                            if (p) p.catch(() => {});
                        } else {
                            if (!v.paused) v.pause();
                        }
                    });
                }, { threshold: 0.25 });
                lazyVideos.forEach(v => vio.observe(v));
            } else {
                lazyVideos.forEach(v => { const p = v.play(); if (p) p.catch(() => {}); });
            }
        }

        // Subtle reveal-on-scroll for cards / team / about images
        if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const targets = document.querySelectorAll('.card, .team-member, .stat-item, .about-image, .clean-energy-moment, .clean-energy-photo, .process-proof-item, .process-step');
            targets.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(16px)';
                el.style.transition = 'opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)';
            });
            const io = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'none';
                        io.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
            targets.forEach(el => io.observe(el));
        }
    });
})();
