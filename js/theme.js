/* ===================================
   JEMENA TRADING LIMITED
   Dark / Light Mode Toggle
   =================================== */

(function () {
    'use strict';

    const STORAGE_KEY = 'jemena-theme';
    const DARK = 'dark';
    const LIGHT = 'light';

    /**
     * Get the user's preferred theme.
     * Priority: localStorage > system preference > light (default)
     */
    function getPreferredTheme() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === DARK || stored === LIGHT) return stored;

        // Respect system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return DARK;
        }

        return LIGHT;
    }

    /**
     * Apply theme to the document
     */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);
        updateToggleIcon(theme);
    }

    /**
     * Update all toggle button icons on the page
     */
    function updateToggleIcon(theme) {
        document.querySelectorAll('.theme-toggle').forEach(function (toggleBtn) {
            var icon = toggleBtn.querySelector('i');
            if (!icon) return;
            if (theme === DARK) {
                icon.className = 'fas fa-sun';
                toggleBtn.setAttribute('aria-label', 'Switch to light mode');
                toggleBtn.title = 'Switch to light mode';
            } else {
                icon.className = 'fas fa-moon';
                toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
                toggleBtn.title = 'Switch to dark mode';
            }
        });
    }

    /**
     * Toggle between dark and light themes
     */
    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || LIGHT;
        const next = current === DARK ? LIGHT : DARK;
        applyTheme(next);
    }

    // Apply theme immediately (before DOM loads to prevent flash)
    applyTheme(getPreferredTheme());

    // Bind toggle buttons once DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.theme-toggle').forEach(function (btn) {
            btn.addEventListener('click', toggleTheme);
        });

        // Update icons to match current theme
        updateToggleIcon(getPreferredTheme());
    });

    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem(STORAGE_KEY)) {
                applyTheme(e.matches ? DARK : LIGHT);
            }
        });
    }
})();
