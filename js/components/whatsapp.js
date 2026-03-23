/* ===================================
   JEMENA TRADING LIMITED
   WhatsApp Floating Button Component
   =================================== */

(function () {
    'use strict';

    // Show WhatsApp button after a short delay
    window.addEventListener('load', function () {
        setTimeout(function () {
            var whatsappButton = document.querySelector('.whatsapp-float');
            if (whatsappButton) {
                whatsappButton.classList.add('show');
            }
        }, 1500);
    });
})();
