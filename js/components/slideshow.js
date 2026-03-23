/* ===================================
   JEMENA TRADING LIMITED
   Slideshow Component
   - Auto-rotate every 5s
   - Prev/Next arrow buttons
   - Dot indicators
   - Pause on hover
   - Touch/swipe support
   =================================== */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var container = document.querySelector('.slideshow-container');
        if (!container) return;

        var images = container.querySelectorAll('img');
        if (images.length === 0) return;

        var currentIndex = 0;
        var intervalId = null;
        var touchStartX = 0;

        // Show only first image
        images.forEach(function (img, i) {
            img.style.display = i === 0 ? 'block' : 'none';
        });

        // Create Prev button
        var prevBtn = document.createElement('button');
        prevBtn.className = 'slide-prev';
        prevBtn.setAttribute('aria-label', 'Previous slide');
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        container.appendChild(prevBtn);

        // Create Next button
        var nextBtn = document.createElement('button');
        nextBtn.className = 'slide-next';
        nextBtn.setAttribute('aria-label', 'Next slide');
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        container.appendChild(nextBtn);

        // Create dot indicators
        var dotsContainer = document.createElement('div');
        dotsContainer.className = 'slideshow-dots';
        images.forEach(function (_, i) {
            var dot = document.createElement('button');
            dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Slide ' + (i + 1));
            dot.addEventListener('click', function () {
                goToSlide(i);
                resetAutoplay();
            });
            dotsContainer.appendChild(dot);
        });
        container.appendChild(dotsContainer);

        function goToSlide(index) {
            images[currentIndex].style.display = 'none';
            currentIndex = (index + images.length) % images.length;
            images[currentIndex].style.display = 'block';
            images[currentIndex].style.animation = 'fadeEffect 0.6s ease';
            updateDots();
        }

        function updateDots() {
            var dots = dotsContainer.querySelectorAll('.slide-dot');
            dots.forEach(function (d, i) {
                d.classList.toggle('active', i === currentIndex);
            });
        }

        function startAutoplay() {
            intervalId = setInterval(function () {
                goToSlide(currentIndex + 1);
            }, 5000);
        }

        function resetAutoplay() {
            clearInterval(intervalId);
            startAutoplay();
        }

        prevBtn.addEventListener('click', function () {
            goToSlide(currentIndex - 1);
            resetAutoplay();
        });

        nextBtn.addEventListener('click', function () {
            goToSlide(currentIndex + 1);
            resetAutoplay();
        });

        // Pause on hover
        container.addEventListener('mouseenter', function () { clearInterval(intervalId); });
        container.addEventListener('mouseleave', startAutoplay);

        // Touch/swipe support
        container.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        container.addEventListener('touchend', function (e) {
            var diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? goToSlide(currentIndex + 1) : goToSlide(currentIndex - 1);
                resetAutoplay();
            }
        }, { passive: true });

        startAutoplay();
    });
})();
