/* ===================================
   JEMENA TRADING LIMITED
   Navigation Component
   - Mobile menu toggle (drawer)
   - Sticky nav on scroll (glassmorphism)
   - Active page indicator
   - Close on overlay / link click
   - Back-to-top button
   =================================== */

(function () {
    'use strict';

    // === Mobile Menu Toggle ===
    window.toggleMenu = function () {
        var nav = document.querySelector('.nav-links');
        var overlay = document.querySelector('.nav-overlay');
        var hamburger = document.querySelector('.hamburger');
        if (nav) nav.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
        if (hamburger) hamburger.classList.toggle('active');
    };

    document.addEventListener('DOMContentLoaded', function () {

        // === Sticky Nav Scroll Behavior ===
        var topNav = document.querySelector('.top-nav');
        if (topNav) {
            window.addEventListener('scroll', function () {
                if (window.scrollY > 50) {
                    topNav.classList.add('scrolled');
                } else {
                    topNav.classList.remove('scrolled');
                }
            }, { passive: true });
        }

        // === Active Page Indicator ===
        var currentPage = window.location.pathname.split('/').pop() || 'index.html';
        var productPages = [
            'soap_detergents.html', 'solvents.html', 'water_treatment.html',
            'mining.html', 'food_industry.html', 'essential_oils.html', 'cosmetics.html'
        ];

        var navLinks = document.querySelectorAll('.nav-links > li > a');
        navLinks.forEach(function (link) {
            var href = link.getAttribute('href') || '';
            // Direct match
            if (href === currentPage || href === './' + currentPage) {
                link.classList.add('nav-active');
            }
            // Home page anchor links
            if ((currentPage === 'index.html' || currentPage === '') && (href === '#home' || href === 'index.html')) {
                link.classList.add('nav-active');
            }
            // Highlight "Our Products" when on a product sub-page
            if (productPages.includes(currentPage) && (href === 'index.html#products' || href === '#products')) {
                link.classList.add('nav-active');
            }
            // About page
            if (currentPage === 'about-us.html' && href === 'about-us.html') {
                link.classList.add('nav-active');
            }
        });

        // === Close Mobile Menu When a Nav Link is Clicked ===
        var allNavLinks = document.querySelectorAll('.nav-links a');
        allNavLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                var nav = document.querySelector('.nav-links');
                var overlay = document.querySelector('.nav-overlay');
                var hamburger = document.querySelector('.hamburger');
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    if (overlay) overlay.classList.remove('active');
                    if (hamburger) hamburger.classList.remove('active');
                }
            });
        });

        // === Back-to-Top Button ===
        var backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.setAttribute('aria-label', 'Back to top');
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(backToTop);

        window.addEventListener('scroll', function () {
            if (window.scrollY > 400) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }, { passive: true });

        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

    });
})();
