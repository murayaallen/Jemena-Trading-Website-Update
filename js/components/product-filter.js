/* ===================================
   JEMENA TRADING LIMITED
   Product Filter + Slim Card Builder
   - Converts table → slim expandable card grid
   - Click/tap to expand details
   - Live search filters by name/uses/packaging
   =================================== */

(function () {
    'use strict';

    var cardGrid = null;

    /* ── HTML helpers ─────────────────── */
    function esc(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function escAttr(str) {
        return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    /* ── Build a single slim card ─────── */
    function buildCard(num, name, uses, packaging) {
        var card = document.createElement('div');
        card.className = 'product-card-item stagger-item';
        card.setAttribute('data-search', (name + ' ' + uses + ' ' + packaging).toLowerCase());

        card.innerHTML =
            '<div class="pci-slim">' +
                '<span class="pci-number">' + esc(num) + '</span>' +
                '<h3 class="pci-name">' + esc(name) + '</h3>' +
                '<i class="fas fa-chevron-down pci-chevron" aria-hidden="true"></i>' +
            '</div>' +
            '<div class="pci-detail" aria-hidden="true">' +
                '<div class="pci-detail-inner">' +
                    '<p class="pci-uses">' + esc(uses) + '</p>' +
                    '<div class="pci-action-row">' +
                        '<span class="pci-pack">' +
                            '<i class="fas fa-box"></i>' +
                            esc(packaging) +
                        '</span>' +
                        '<button class="pci-quote-btn cart-add-btn" ' +
                            'data-name="' + escAttr(name) + '" ' +
                            'data-packaging="' + escAttr(packaging) + '">' +
                            '<i class="fas fa-plus"></i> Add to Quote' +
                        '</button>' +
                    '</div>' +
                '</div>' +
            '</div>';

        /* Toggle expand on click (slim row or anywhere on card) */
        card.addEventListener('click', function (e) {
            /* Don't collapse when clicking the quote button */
            if (e.target.closest('.pci-quote-btn')) return;

            var isOpen = card.classList.contains('pci-open');

            /* Close all other open cards */
            if (!isOpen) {
                var siblings = cardGrid ? cardGrid.querySelectorAll('.product-card-item.pci-open') : [];
                siblings.forEach(function (c) {
                    c.classList.remove('pci-open');
                    var detail = c.querySelector('.pci-detail');
                    if (detail) detail.setAttribute('aria-hidden', 'true');
                });
            }

            card.classList.toggle('pci-open', !isOpen);
            var detail = card.querySelector('.pci-detail');
            if (detail) detail.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
        });

        return card;
    }

    /* ── Transform table into card grid ─ */
    function buildProductCards() {
        var table = document.querySelector('table');
        var tbody = document.getElementById('product-table');
        if (!table || !tbody) return;

        var rows = tbody.querySelectorAll('.product-row');
        if (rows.length === 0) return;

        cardGrid = document.createElement('div');
        cardGrid.className = 'product-cards-grid';
        cardGrid.id = 'product-cards-grid';

        rows.forEach(function (row, i) {
            var cells    = row.querySelectorAll('td');
            var num      = cells[0] ? cells[0].textContent.trim() : String(i + 1);
            var name     = cells[1] ? cells[1].textContent.trim() : '';
            var uses     = cells[2] ? cells[2].textContent.trim() : '';
            var packaging = cells[3] ? cells[3].textContent.trim() : '';
            if (!name) return;
            cardGrid.appendChild(buildCard(num, name, uses, packaging));
        });

        /* Insert grid before table; hide table */
        table.parentNode.insertBefore(cardGrid, table);
        table.style.display = 'none';

        /* Stagger entrance animation */
        wireStagger(cardGrid.querySelectorAll('.stagger-item'));
    }

    /* ── Stagger entrance via IntersectionObserver ─ */
    function wireStagger(items) {
        if (!items.length) return;
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var allCards = cardGrid ? Array.from(cardGrid.children) : [];
                    var idx = allCards.indexOf(entry.target);
                    var delay = (idx % 4) * 55;
                    setTimeout(function () {
                        entry.target.classList.add('visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.06 });

        items.forEach(function (item) { observer.observe(item); });
    }

    /* ── Live search ──────────────────── */
    window.filterProducts = function () {
        var input = document.getElementById('product-search');
        if (!input) return;

        var term = input.value.toLowerCase().trim();
        var noResults = document.getElementById('no-results');
        var visible = 0;

        if (cardGrid) {
            cardGrid.querySelectorAll('.product-card-item').forEach(function (card) {
                var text = card.getAttribute('data-search') || '';
                var show = !term || text.includes(term);
                card.style.display = show ? '' : 'none';
                if (show) visible++;
            });
        } else {
            /* Fallback — table rows */
            document.querySelectorAll('.product-row').forEach(function (row) {
                var text = row.textContent.toLowerCase();
                var show = !term || text.includes(term);
                row.style.display = show ? '' : 'none';
                if (show) visible++;
            });
        }

        if (noResults) {
            noResults.style.display = visible === 0 ? 'block' : 'none';
        }
    };

    document.addEventListener('DOMContentLoaded', buildProductCards);
})();
