/* ===================================
   JEMENA TRADING LIMITED
   WhatsApp Floating Button Component
   =================================== */

(function () {
    'use strict';

    function showFloatingButtons() {
        var whatsapp  = document.querySelector('.whatsapp-float');
        var chatbot   = document.getElementById('chatbot-button');
        var cartBtn   = document.querySelector('.cart-float-btn');

        if (whatsapp) whatsapp.classList.add('show');
        if (chatbot)  chatbot.classList.add('scrolled-in');
        if (cartBtn)  cartBtn.classList.add('scrolled-in');
    }

    function hideFloatingButtons() {
        var whatsapp  = document.querySelector('.whatsapp-float');
        var chatbot   = document.getElementById('chatbot-button');
        var cartBtn   = document.querySelector('.cart-float-btn');

        if (whatsapp) whatsapp.classList.remove('show');
        if (chatbot)  chatbot.classList.remove('scrolled-in');
        if (cartBtn)  cartBtn.classList.remove('scrolled-in');
    }

    window.addEventListener('load', function () {
        var hero = document.querySelector('.hero');

        // No hero on this page — show immediately
        if (!hero) {
            setTimeout(showFloatingButtons, 800);
            return;
        }

        // Watch hero: show buttons when hero scrolls out of view
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    hideFloatingButtons();
                } else {
                    showFloatingButtons();
                }
            });
        }, { threshold: 0.15 });

        observer.observe(hero);
    });
})();
