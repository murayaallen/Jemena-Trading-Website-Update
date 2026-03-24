/* ===================================
   JEMENA TRADING LIMITED
   Animations Component
   - Loading screen dismiss
   - Hero canvas particle network
   - Hero rotating/cycling text
   - Scroll fade-in animations
   - Number counter animation
   - Staggered card entrance
   - Features strip entrance
   - Collapsible sections
   =================================== */

(function () {
    'use strict';

    /* =========================================================
       LOADING SCREEN — FLIP FLY-IN DISMISS
       The loading logo pulses, then flies to its resting
       position inside the hero section and the loading screen
       fades away, revealing the page underneath.
       ========================================================= */
    window.addEventListener('load', function () {
        var HOLD_DURATION  = 900;   /* ms logo pulses before flying */
        var FLY_DURATION   = 720;   /* ms for the fly animation */
        var FADE_DURATION  = 420;   /* ms for loading screen fade */

        setTimeout(function () {
            var loadingScreen = document.getElementById('loading-screen');
            var loadingLogo   = document.getElementById('loading-logo');
            var heroLogo      = document.getElementById('hero-logo-img');

            if (!loadingScreen) return;

            /* Non-home pages: no hero logo present — simple fade out */
            if (!heroLogo || !loadingLogo) {
                loadingScreen.style.opacity = '0';
                setTimeout(function () { loadingScreen.style.display = 'none'; }, FADE_DURATION);
                return;
            }

            /* ── FLIP: measure source and destination ── */
            var srcRect  = loadingLogo.getBoundingClientRect();
            var destRect = heroLogo.getBoundingClientRect();

            var srcCX  = srcRect.left  + srcRect.width  / 2;
            var srcCY  = srcRect.top   + srcRect.height / 2;
            var destCX = destRect.left + destRect.width  / 2;
            var destCY = destRect.top  + destRect.height / 2;

            var tx    = destCX - srcCX;
            var ty    = destCY - srcCY;
            var scale = destRect.width / srcRect.width;

            /* ── Phase 1: stop pulsing, apply fly transform ── */
            loadingLogo.classList.add('logo-flying');

            /* Force reflow so transition picks up the new class */
            loadingLogo.offsetHeight; // eslint-disable-line no-unused-expressions

            loadingLogo.style.transform =
                'translate(' + tx + 'px, ' + ty + 'px) scale(' + scale + ')';

            /* ── Phase 2: after fly completes, reveal hero logo + fade screen ── */
            setTimeout(function () {
                /* Reveal the real hero logo in place */
                heroLogo.classList.add('logo-revealed');

                /* Brief pause (one frame) then fade loading screen */
                requestAnimationFrame(function () {
                    loadingScreen.style.opacity = '0';

                    setTimeout(function () {
                        loadingScreen.style.display = 'none';
                        /* Reset loading logo transform so it doesn't affect reflow */
                        loadingLogo.style.transform = '';
                    }, FADE_DURATION);
                });
            }, FLY_DURATION);

        }, HOLD_DURATION);
    });

    /* =========================================================
       DYNAMIC COPYRIGHT YEAR
       ========================================================= */
    document.addEventListener('DOMContentLoaded', function () {
        var copyrightEl = document.querySelector('.footer-bottom p');
        if (copyrightEl) {
            copyrightEl.innerHTML = copyrightEl.innerHTML.replace(/\d{4}/, new Date().getFullYear());
        }
    });

    /* =========================================================
       HERO CANVAS — MOLECULE PARTICLE NETWORK
       ========================================================= */
    function initHeroParticles() {
        var canvas = document.getElementById('hero-canvas');
        if (!canvas) return;

        var ctx = canvas.getContext('2d');
        var particles = [];
        var raf;
        var PARTICLE_COUNT = 55;
        var CONNECTION_DIST = 110;

        function resize() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        function randomBetween(a, b) {
            return a + Math.random() * (b - a);
        }

        // Particle colours: white, brand red, brand blue
        var COLORS = [
            { r: 255, g: 255, b: 255 },  // white
            { r: 200, g: 22,  b: 26  },  // brand red
            { r: 15,  g: 73,  b: 150 }   // brand blue
        ];

        function createParticle() {
            var col = COLORS[Math.floor(Math.random() * COLORS.length)];
            return {
                x:     randomBetween(0, canvas.width),
                y:     randomBetween(0, canvas.height),
                r:     randomBetween(1.2, 2.8),
                vx:    randomBetween(-0.3, 0.3),
                vy:    randomBetween(-0.3, 0.3),
                alpha: randomBetween(0.28, 0.70),
                col:   col,
                // slow colour drift — cycles through hue over time
                drift: randomBetween(0, Math.PI * 2),
                driftSpeed: randomBetween(0.003, 0.008)
            };
        }

        resize();
        window.addEventListener('resize', function () {
            resize();
            particles = [];
            for (var i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(createParticle());
            }
        }, { passive: true });

        for (var i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(createParticle());
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connecting lines — gradient between the two particle colours
            for (var a = 0; a < particles.length; a++) {
                for (var b = a + 1; b < particles.length; b++) {
                    var dx = particles[a].x - particles[b].x;
                    var dy = particles[a].y - particles[b].y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECTION_DIST) {
                        var lineAlpha = 0.22 * (1 - dist / CONNECTION_DIST);
                        var ca = particles[a].col;
                        var cb = particles[b].col;
                        var grad = ctx.createLinearGradient(
                            particles[a].x, particles[a].y,
                            particles[b].x, particles[b].y
                        );
                        grad.addColorStop(0, 'rgba(' + ca.r + ',' + ca.g + ',' + ca.b + ',' + lineAlpha + ')');
                        grad.addColorStop(1, 'rgba(' + cb.r + ',' + cb.g + ',' + cb.b + ',' + lineAlpha + ')');
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.strokeStyle = grad;
                        ctx.lineWidth = 0.7;
                        ctx.stroke();
                    }
                }
            }

            // Draw particles — each its own colour, slow alpha pulse
            particles.forEach(function (p) {
                p.drift += p.driftSpeed;
                var pulse = p.alpha * (0.75 + 0.25 * Math.sin(p.drift));
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + p.col.r + ',' + p.col.g + ',' + p.col.b + ',' + pulse + ')';
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < -5) p.x = canvas.width + 5;
                else if (p.x > canvas.width + 5) p.x = -5;
                if (p.y < -5) p.y = canvas.height + 5;
                else if (p.y > canvas.height + 5) p.y = -5;
            });

            raf = requestAnimationFrame(draw);
        }

        // Pause when tab is hidden to save resources
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                cancelAnimationFrame(raf);
            } else {
                draw();
            }
        });

        draw();
    }

    /* =========================================================
       HERO ROTATING TEXT
       ========================================================= */
    function initRotatingText() {
        var el = document.getElementById('hero-rotating-word');
        if (!el) return;

        var words = [
            'Water Treatment',
            'Mining',
            'Soap & Detergent',
            'Food Industry',
            'Essential Oil',
            'Cosmetic',
            'Solvent'
        ];
        var index = 0;
        var INTERVAL = 2800;

        function cycle() {
            // Fade out
            el.classList.add('fade-out');
            el.classList.remove('fade-in');

            setTimeout(function () {
                index = (index + 1) % words.length;
                el.textContent = words[index];

                // Fade in
                el.classList.remove('fade-out');
                el.classList.add('fade-in');
            }, 300);
        }

        setInterval(cycle, INTERVAL);
    }

    /* =========================================================
       DOMContentLoaded ANIMATIONS
       ========================================================= */
    document.addEventListener('DOMContentLoaded', function () {

        // Init hero canvas & rotating text (only on home page)
        initHeroParticles();
        initRotatingText();

        /* --- Generic Fade-In (.fade-in class) --- */
        var fadeElements = document.querySelectorAll('.fade-in');
        if (fadeElements.length) {
            var fadeObserver = new IntersectionObserver(function (entries, obs) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });
            fadeElements.forEach(function (el) { fadeObserver.observe(el); });
        }

        /* ─────────────────────────────────────────
           SCROLL-REVEAL SYSTEM
           Supports:
             .scroll-reveal          → fade up (default)
             .scroll-reveal.sr-left  → fade from left
             .scroll-reveal.sr-right → fade from right
             .scroll-reveal.sr-scale → scale up
           ───────────────────────────────────────── */
        var srElements = document.querySelectorAll('.scroll-reveal');
        if (srElements.length) {
            var srObserver = new IntersectionObserver(function (entries, obs) {
                entries.forEach(function (entry, i) {
                    if (entry.isIntersecting) {
                        /* Stagger siblings within the same parent */
                        var parent = entry.target.parentElement;
                        var allSr = parent ? Array.from(parent.querySelectorAll(':scope > .scroll-reveal')) : [entry.target];
                        var idx = allSr.indexOf(entry.target);
                        var delay = idx >= 0 ? idx * 90 : 0;

                        setTimeout(function () {
                            entry.target.classList.add('sr-visible');
                        }, delay);

                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

            srElements.forEach(function (el) { srObserver.observe(el); });
        }

        /* --- Features Strip Entrance --- */
        var featureItems = document.querySelectorAll('.feature-item');
        if (featureItems.length) {
            var featureObserver = new IntersectionObserver(function (entries, obs) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            featureItems.forEach(function (item) {
                featureObserver.observe(item);
            });
        }

        /* --- Number Counter Animation (stat-item + metric-card) --- */
        var counterItems = document.querySelectorAll('.stat-item, .metric-card');
        if (counterItems.length) {
            var statObserver = new IntersectionObserver(function (entries, obs) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        /* stat-item uses h3, metric-card uses .metric-number */
                        var numEl = entry.target.querySelector('h3') ||
                                    entry.target.querySelector('.metric-number');
                        var target = parseInt(entry.target.getAttribute('data-target'), 10);
                        if (numEl && target) {
                            animateCount(numEl, target);
                        }
                        /* metric-card also triggers bottom bar grow */
                        entry.target.classList.add('visible');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.4 });

            counterItems.forEach(function (item) { statObserver.observe(item); });
        }

        function animateCount(el, target) {
            var start = 0;
            var duration = 2000;
            var startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                // Ease out cubic
                var eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target);
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = target;
                }
            }
            requestAnimationFrame(step);
        }

        /* --- Staggered Card Entrance (.stagger-item) --- */
        var staggerItems = document.querySelectorAll('.stagger-item');
        if (staggerItems.length) {
            var staggerObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        // Find index among siblings for delay
                        var parent = entry.target.parentElement;
                        var siblings = parent ? Array.from(parent.children) : [];
                        var idx = siblings.indexOf(entry.target);
                        var delay = (idx % 4) * 80;

                        setTimeout(function () {
                            entry.target.classList.add('visible');
                        }, delay);

                        staggerObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            staggerItems.forEach(function (item) { staggerObserver.observe(item); });
        }

        /* --- Product card scroll-in --- */
        var cardObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var card = entry.target;
                    var idx = Array.from(card.parentNode.children).indexOf(card);
                    setTimeout(function () {
                        card.classList.add('in-view');
                    }, (idx % 4) * 100);
                    cardObserver.unobserve(card);
                }
            });
        }, { threshold: 0.12 });

        document.querySelectorAll('.card-scroll-in').forEach(function (c) {
            cardObserver.observe(c);
        });

        /* --- Product Category Card — mobile tap toggle + click-to-navigate --- */
        document.querySelectorAll('.product-category[data-href]').forEach(function (card) {
            var href = card.getAttribute('data-href');
            var isTouchDevice = false;

            card.addEventListener('touchstart', function () {
                isTouchDevice = true;
            }, { passive: true });

            card.addEventListener('click', function (e) {
                // If the click target is the explore button, let it navigate naturally
                if (e.target.closest('.cop-btn')) return;

                if (isTouchDevice) {
                    // First tap: reveal overlay. Second tap: navigate
                    if (card.classList.contains('active')) {
                        window.location.href = href;
                    } else {
                        // Close all other active cards
                        document.querySelectorAll('.product-category.active').forEach(function (c) {
                            if (c !== card) c.classList.remove('active');
                        });
                        card.classList.add('active');
                    }
                } else {
                    // Desktop: click navigates (hover handles overlay)
                    window.location.href = href;
                }
            });
        });

        // Close active card when clicking outside
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.product-category')) {
                document.querySelectorAll('.product-category.active').forEach(function (c) {
                    c.classList.remove('active');
                });
            }
        });

        /* --- Why Choose Us Card Toggle --- */
        document.querySelectorAll('.why-choose-card').forEach(function (card) {
            card.addEventListener('click', function () {
                this.classList.toggle('expanded');
            });
        });

        /* --- Collapsible Section Functionality --- */
        window.toggleCollapse = function (button) {
            button.classList.toggle('active');
            var content = button.nextElementSibling;
            if (content) content.classList.toggle('active');
        };

        document.querySelectorAll('.collapsible').forEach(function (btn) {
            btn.addEventListener('click', function () { window.toggleCollapse(this); });
        });

    });
})();
