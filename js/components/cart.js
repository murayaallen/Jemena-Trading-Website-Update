/* ===================================
   JEMENA TRADING LIMITED
   Inquiry Cart — Phase 3
   =================================== */

(function () {
    'use strict';

    const STORAGE_KEY   = 'jemena-inquiry-cart';
    const WHATSAPP_NUM  = '254795792234';
    const API_BASE      = 'https://jemenaai.jemenatrading.co.ke';
    const UNITS         = ['kg', 'L', 'mt', 'units'];
    const DEFAULT_UNIT  = 'kg';

    // =====================
    // Embedded Product Index (client-side search fallback)
    // =====================
    var PRODUCT_INDEX = [
        // Soaps & Detergents
        { name: "Benzalkonium Chloride 50%", category: "Soaps & Detergents", packaging: ["200kg Drum", "Custom Packaging"] },
        { name: "Benzalkonium Chloride 80%", category: "Soaps & Detergents", packaging: ["200kg Drum", "Custom Packaging"] },
        { name: "CMC (Sodium Carboxymethyl Cellulose)", category: "Soaps & Detergents", packaging: ["25kg", "Custom Packaging"] },
        { name: "Cocodiethanol Amide 85% (CDE)", category: "Soaps & Detergents", packaging: ["210kg Drum", "Custom Packaging"] },
        { name: "Deionized Water", category: "Soaps & Detergents", packaging: ["1,000L", "Custom Packaging"] },
        { name: "EDTA 99% Disodium (2NA)", category: "Soaps & Detergents", packaging: ["25kg", "Custom Packaging"] },
        { name: "EDTA 99% Tetra Sodium (4NA)", category: "Soaps & Detergents", packaging: ["25kg", "Custom Packaging"] },
        { name: "Fabric Softener Stepantex VL 90A", category: "Soaps & Detergents", packaging: ["5kg", "10kg", "20kg", "200kg Drum"] },
        { name: "Fine Salt", category: "Soaps & Detergents", packaging: ["50kg", "Custom Packaging"] },
        { name: "Formalin (Formaldehyde 37%)", category: "Soaps & Detergents", packaging: ["35kg", "Custom Packaging"] },
        { name: "Hydrofluoric Acid 50-55%", category: "Soaps & Detergents", packaging: ["25kg", "Custom Packaging"] },
        { name: "Industrial Salt", category: "Soaps & Detergents", packaging: ["50kg", "Custom Packaging"] },
        { name: "Kaolin", category: "Soaps & Detergents", packaging: ["50kg"] },
        { name: "Magnesium Sulphate Crystal (Epsom Salt)", category: "Soaps & Detergents", packaging: ["25kg", "50kg"] },
        { name: "Nansa H85", category: "Soaps & Detergents", packaging: ["20kg", "Custom Packaging"] },
        { name: "Nonylphenol Ethoxylate (NPE9)", category: "Soaps & Detergents", packaging: ["5kg", "20kg", "200kg Drum"] },
        { name: "Oleic Acid 75%", category: "Soaps & Detergents", packaging: ["5kg", "20kg", "190kg Drum"] },
        { name: "Optical Brightener", category: "Soaps & Detergents", packaging: ["1kg", "5kg", "10kg", "24kg"] },
        { name: "Para-dichlorobenzene (PDCB)", category: "Soaps & Detergents", packaging: ["25kg"] },
        { name: "Pearlizer/Ufablend", category: "Soaps & Detergents", packaging: ["5kg", "20kg", "Custom Packaging"] },
        { name: "Pine Oil 85% & 96%", category: "Soaps & Detergents", packaging: ["1kg", "5kg", "20kg", "185kg Drum"] },
        { name: "Polyquaternium7 (PQ7)", category: "Soaps & Detergents", packaging: ["1kg", "5kg", "20kg", "200kg Drum"] },
        { name: "Potassium Hydroxide Flakes", category: "Soaps & Detergents", packaging: ["25kg", "Custom Packaging"] },
        { name: "SLES 70%", category: "Soaps & Detergents", packaging: ["170kg Drum", "Custom Packaging"] },
        { name: "Soda Ash Light", category: "Soaps & Detergents", packaging: ["50kg", "Custom Packaging"] },
        { name: "Sodium Bicarbonate", category: "Soaps & Detergents", packaging: ["25kg", "Custom Packaging"] },
        { name: "Sodium Carbonate Dense (Magadi)", category: "Soaps & Detergents", packaging: ["50kg", "Custom Packaging"] },
        { name: "Sodium Cumene Sulfonate 40% (SC40)", category: "Soaps & Detergents", packaging: ["25kg", "Custom Packaging"] },
        { name: "Sodium Gluconate", category: "Soaps & Detergents", packaging: ["25kg", "Custom Packaging"] },
        { name: "Sodium Hydrosulphite 88%", category: "Soaps & Detergents", packaging: ["50kg", "Custom Packaging"] },
        { name: "Sodium Hydroxide", category: "Soaps & Detergents", packaging: ["25kg", "Custom Packaging"] },
        { name: "Sodium Hypochlorite 10%", category: "Soaps & Detergents", packaging: ["24kg", "Custom Packaging"] },
        { name: "Sodium Meta Bisulphite", category: "Soaps & Detergents", packaging: ["25kg", "Custom Packaging"] },
        { name: "Sodium Metasilicate Penta", category: "Soaps & Detergents", packaging: ["25kg", "Custom Packaging"] },
        { name: "Sodium Perborate Tetrahydrate", category: "Soaps & Detergents", packaging: ["25kg", "Custom Packaging"] },
        { name: "Sodium Silicate", category: "Soaps & Detergents", packaging: ["30kg", "Custom Packaging"] },
        { name: "Sodium Sulphate Anhydrous", category: "Soaps & Detergents", packaging: ["50kg", "Custom Packaging"] },
        { name: "Sodium Tripolyphosphate (STPP)", category: "Soaps & Detergents", packaging: ["25kg", "Custom Packaging"] },
        { name: "Sodium Xylene Sulfonate 60%", category: "Soaps & Detergents", packaging: ["25kg", "Custom Packaging"] },
        { name: "Sulphonic Acid LABSA 90% & 96%", category: "Soaps & Detergents", packaging: ["250kg Drum", "Custom Packaging"] },
        { name: "Talcum Powder", category: "Soaps & Detergents", packaging: ["50kg"] },
        { name: "Tego Betain CAPB 30%", category: "Soaps & Detergents", packaging: ["5kg", "20kg", "235kg Drum"] },
        { name: "Titanium Dioxide", category: "Soaps & Detergents", packaging: ["25kg"] },
        { name: "Triethanolamine 99% (TEA)", category: "Soaps & Detergents", packaging: ["1kg", "5kg", "20kg", "230kg Drum"] },
        { name: "Urea", category: "Soaps & Detergents", packaging: ["50kg"] },
        { name: "Whiting 40 (Calcium Carbonate 52%)", category: "Soaps & Detergents", packaging: ["50kg", "Custom Packaging"] },
        // Solvents
        { name: "Acetone", category: "Solvents", packaging: ["5kg", "20kg", "Drum"] },
        { name: "Butyl Glycol Ether", category: "Solvents", packaging: ["5kg", "20kg", "Drum"] },
        { name: "Carbomer 940", category: "Solvents", packaging: ["20kg", "Custom Packaging"] },
        { name: "Denatured IMS 96%", category: "Solvents", packaging: ["5kg", "20kg", "Drum"] },
        { name: "Isopropyl Alcohol Pure", category: "Solvents", packaging: ["5kg", "20kg", "Drum"] },
        { name: "Methanol Denatured", category: "Solvents", packaging: ["5kg", "20kg", "Drum"] },
        { name: "Solvent C9 (Naphtha 100)", category: "Solvents", packaging: ["5kg", "20kg", "Drum"] },
        { name: "White Spirit", category: "Solvents", packaging: ["5kg", "20kg", "Drum"] },
        // Water Treatment
        { name: "Aluminium Sulphate Powder", category: "Water Treatment", packaging: ["50kg"] },
        { name: "Aluminium Sulphate Rock", category: "Water Treatment", packaging: ["50kg"] },
        { name: "Ammonia Liquor 25%", category: "Water Treatment", packaging: ["33kg", "Custom Packaging"] },
        { name: "Calcium Hypo Chlorite 65-70%", category: "Water Treatment", packaging: ["45kg", "Custom Packaging"] },
        { name: "Chlorine 90% TCCA", category: "Water Treatment", packaging: ["50kg", "Custom Packaging"] },
        { name: "Copper Sulphate Pentahydrate", category: "Water Treatment", packaging: ["25kg"] },
        { name: "Poly Aluminium Chloride (PAC)", category: "Water Treatment", packaging: ["25kg", "50kg"] },
        // Mining
        { name: "Borax Decahydrate", category: "Mining", packaging: ["25kg"] },
        { name: "Caustic Soda Flakes", category: "Mining", packaging: ["25kg", "Custom Packaging"] },
        { name: "Caustic Soda Pearls", category: "Mining", packaging: ["25kg", "Custom Packaging"] },
        { name: "Hydrochloric Acid 30-35%", category: "Mining", packaging: ["40kg", "Custom Packaging"] },
        { name: "Hydrogen Peroxide 50%", category: "Mining", packaging: ["30kg", "40kg", "Custom Packaging"] },
        { name: "Nitric Acid", category: "Mining", packaging: ["35kg"] },
        { name: "Oxalic Acid Dihydrate", category: "Mining", packaging: ["25kg", "Custom Packaging"] },
        { name: "Sodium Sulphide (Yellow Flakes)", category: "Mining", packaging: ["25kg", "Custom Packaging"] },
        { name: "Sulphuric Acid", category: "Mining", packaging: ["47kg"] },
        // Food Industry
        { name: "Citric Acid", category: "Food Industry", packaging: ["25kg", "Custom Packaging"] },
        { name: "Corn Starch", category: "Food Industry", packaging: ["25kg"] },
        { name: "Glacial Acetic Acid", category: "Food Industry", packaging: ["30kg", "Custom Packaging"] },
        { name: "Hydrogen Peroxide 35%", category: "Food Industry", packaging: ["30kg", "Custom Packaging"] },
        { name: "Phosphoric Acid Food Grade 85%", category: "Food Industry", packaging: ["35kg", "Custom Packaging"] },
        { name: "Sodium Benzoate Powder", category: "Food Industry", packaging: ["25kg", "Custom Packaging"] },
        // Essential Oils & Fragrances
        { name: "Color Acid Blue 80", category: "Essential Oils", packaging: ["1kg"] },
        { name: "Color Apple Green", category: "Essential Oils", packaging: ["1kg"] },
        { name: "Color Brilliant Blue", category: "Essential Oils", packaging: ["1kg"] },
        { name: "Color Egg Yellow", category: "Essential Oils", packaging: ["1kg"] },
        { name: "Color Iragon Blue ABL 9", category: "Essential Oils", packaging: ["1kg"] },
        { name: "Color Pink Rose", category: "Essential Oils", packaging: ["1kg"] },
        { name: "Color Puricolor Green PGR7", category: "Essential Oils", packaging: ["1kg"] },
        { name: "Color Puricolor Yellow AYE 23", category: "Essential Oils", packaging: ["1kg"] },
        { name: "Color Raspberry", category: "Essential Oils", packaging: ["1kg"] },
        { name: "Color Sunset Yellow", category: "Essential Oils", packaging: ["1kg"] },
        { name: "Color Tomato Red", category: "Essential Oils", packaging: ["1kg"] },
        { name: "Diethlphthalate 99%", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Essential Oil Almond Sweet", category: "Essential Oils", packaging: ["1L"] },
        { name: "Essential Oil Aloe Vera", category: "Essential Oils", packaging: ["1L"] },
        { name: "Essential Oil Eucalyptus", category: "Essential Oils", packaging: ["1L"] },
        { name: "Essential Oil Frutine", category: "Essential Oils", packaging: ["1L"] },
        { name: "Essential Oil Kired", category: "Essential Oils", packaging: ["500ml", "1L"] },
        { name: "Essential Oil Lemon Grass", category: "Essential Oils", packaging: ["500ml", "1L"] },
        { name: "Essential Oil Lemon Perfume", category: "Essential Oils", packaging: ["500ml", "1L"] },
        { name: "Essential Oil Peppermint BP", category: "Essential Oils", packaging: ["500ml", "1L"] },
        { name: "Essential Oil Pine Fresh", category: "Essential Oils", packaging: ["500ml", "1L"] },
        { name: "Essential Oil Silky", category: "Essential Oils", packaging: ["500ml", "1L"] },
        { name: "Essential Oil Suaril", category: "Essential Oils", packaging: ["500ml", "1L"] },
        { name: "Essential Oil Tea Tree Oil", category: "Essential Oils", packaging: ["500ml", "1L"] },
        { name: "Fragrance Apricot", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Fragrance Eternall Eagle", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Fragrance Grape Fruit", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Fragrance Pineapple", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Fragrance Strawberry", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Apple", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Apple Fizz", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Apricot", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Blue Fresh", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Bubble Gum", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Caramel", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Caring Moments", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Carnation", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Citrus", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Coco Butter", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Earternal Eagle", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Florazol", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Fresh Toilet Cleaner", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Intense Clean", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Jojoba", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Lavender", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Lemon 3", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Mangue Vanille", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Marine Fresh", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume New Car", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Orange", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Passion", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Peach", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Pine", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Pineaple NK", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume PineappleStrawberry", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Pink Breeze", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Purete", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Rose", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Sheer Summer", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Soft Peach", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Strawberry Ice Cream", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Stwaberry EP", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Sundance", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Sweet Lemon", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Tropical Burst", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Vanilla", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        { name: "Perfume Vanilla Blossom", category: "Essential Oils", packaging: ["500ml", "1L", "5L"] },
        // Cosmetics
        { name: "Castor Oil", category: "Cosmetics", packaging: ["1kg", "5kg", "20kg", "Drum"] },
        { name: "Ceto Stearyl Alcohol", category: "Cosmetics", packaging: ["25kg", "Custom Packaging"] },
        { name: "Dehyquart 4046", category: "Cosmetics", packaging: ["20kg", "Custom Packaging"] },
        { name: "Glyccor Mono Stearic (GMS)", category: "Cosmetics", packaging: ["20kg", "Custom Packaging"] },
        { name: "Glycerin USP Grade", category: "Cosmetics", packaging: ["5kg", "25kg", "Drum"] },
        { name: "Lanette Wax Ao", category: "Cosmetics", packaging: ["20kg", "Custom Packaging"] },
        { name: "Micro Slack Wax 160S", category: "Cosmetics", packaging: ["25kg"] },
        { name: "Mono Propylene Glycol (MPG)", category: "Cosmetics", packaging: ["5kg", "20kg"] },
        { name: "Paraffin Wax 58/60", category: "Cosmetics", packaging: ["25kg"] },
        { name: "Stearic Acid", category: "Cosmetics", packaging: ["25kg"] },
        { name: "White Oil", category: "Cosmetics", packaging: ["1kg", "5kg", "20kg", "Drum"] },
    ];

    // =====================
    // Cart State (localStorage)
    // item: { name, packaging, category, quantity, unit }
    // =====================
    function getCart() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
        catch (e) { return []; }
    }

    function saveCart(cart) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }

    function addToCart(name, packaging, category, quantity, unit, note) {
        const cart = getCart();
        const idx  = cart.findIndex(function (i) { return i.name === name; });
        if (idx === -1) {
            cart.push({
                name:      name,
                packaging: packaging || '',
                category:  category  || '',
                quantity:  parseFloat(quantity) || 1,
                unit:      unit || DEFAULT_UNIT,
                note:      note || ''
            });
            saveCart(cart);
            return 'added';
        }
        cart[idx].quantity = parseFloat(quantity) || cart[idx].quantity;
        cart[idx].unit     = unit || cart[idx].unit;
        if (note !== undefined) cart[idx].note = note;
        saveCart(cart);
        return 'updated';
    }

    function removeFromCart(name) {
        saveCart(getCart().filter(function (i) { return i.name !== name; }));
    }

    function updateQty(name, quantity, unit) {
        const cart = getCart();
        const item = cart.find(function (i) { return i.name === name; });
        if (item) {
            if (quantity !== undefined) item.quantity = parseFloat(quantity) || item.quantity;
            if (unit     !== undefined) item.unit     = unit;
            saveCart(cart);
        }
    }

    function clearCart() { localStorage.removeItem(STORAGE_KEY); }

    function isInCart(name) {
        return getCart().some(function (i) { return i.name === name; });
    }

    // =====================
    // Qty Modal (centered overlay)
    // =====================
    function showQtyModal(triggerBtn, productName, packagingText, category) {
        // Remove any existing modal
        var existing = document.getElementById('cart-qty-modal-wrap');
        if (existing) existing.remove();

        var unitOptions = UNITS.map(function (u) {
            return '<option value="' + u + '"' + (u === DEFAULT_UNIT ? ' selected' : '') + '>' + u + '</option>';
        }).join('');

        var wrap = document.createElement('div');
        wrap.id        = 'cart-qty-modal-wrap';
        wrap.className = 'cqm-wrap';
        wrap.innerHTML =
            '<div class="cqm-backdrop"></div>' +
            '<div class="cqm-box" role="dialog" aria-modal="true" aria-label="Add to inquiry">' +
                '<div class="cqm-header">' +
                    '<div class="cqm-icon"><i class="fas fa-flask"></i></div>' +
                    '<div class="cqm-header-text">' +
                        '<span class="cqm-label">Add to Inquiry</span>' +
                        '<strong class="cqm-product-name">' + escapeHTML(productName) + '</strong>' +
                    '</div>' +
                    '<button class="cqm-close" aria-label="Close"><i class="fas fa-times"></i></button>' +
                '</div>' +
                '<div class="cqm-body">' +
                    '<label class="cqm-field-label">Quantity &amp; Unit</label>' +
                    '<div class="cqm-qty-row">' +
                        '<input type="number" class="cqm-qty-input" id="cqm-qty" value="1" min="0.1" step="0.1" placeholder="Amount" aria-label="Quantity">' +
                        '<select class="cqm-unit-select" id="cqm-unit" aria-label="Unit">' + unitOptions + '</select>' +
                    '</div>' +
                    '<label class="cqm-field-label" style="margin-top:12px">Packaging</label>' +
                    '<div class="cqm-pkg-display">' + escapeHTML(packagingText || 'Custom / As Available') + '</div>' +
                    '<label class="cqm-field-label" style="margin-top:12px">Notes <span class="cqm-optional">(optional)</span></label>' +
                    '<input type="text" class="cqm-notes-input" id="cqm-notes" placeholder="e.g. specific grade, delivery notes...">' +
                '</div>' +
                '<div class="cqm-footer">' +
                    '<button class="cqm-cancel-btn" id="cqm-cancel">Cancel</button>' +
                    '<button class="cqm-confirm-btn" id="cqm-confirm"><i class="fas fa-plus-circle"></i> Add to Inquiry</button>' +
                '</div>' +
            '</div>';

        document.body.appendChild(wrap);
        // Animate in
        requestAnimationFrame(function () { wrap.classList.add('cqm-visible'); });

        var qtyInput = wrap.querySelector('#cqm-qty');
        qtyInput.focus();
        qtyInput.select();

        function closeModal() {
            wrap.classList.remove('cqm-visible');
            setTimeout(function () { if (wrap.parentNode) wrap.remove(); }, 280);
        }

        wrap.querySelector('#cqm-confirm').addEventListener('click', function () {
            var qty  = parseFloat(qtyInput.value) || 1;
            var unit = wrap.querySelector('#cqm-unit').value;
            var note = wrap.querySelector('#cqm-notes').value.trim();
            closeModal();
            var result = addToCart(productName, packagingText, category, qty, unit, note);
            if (triggerBtn) updateAddBtn(triggerBtn, productName, result);
            updateCartBadge();
            showAddedToast(productName, qty, unit);
        });

        wrap.querySelector('#cqm-cancel').addEventListener('click', closeModal);
        wrap.querySelector('.cqm-close').addEventListener('click', closeModal);
        wrap.querySelector('.cqm-backdrop').addEventListener('click', closeModal);

        // Enter key confirms
        wrap.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') wrap.querySelector('#cqm-confirm').click();
            if (e.key === 'Escape') closeModal();
        });
    }

    function updateAddBtn(btn, productName, result) {
        if (!btn) return;
        if (result === 'added' || result === 'updated') {
            // Table row button
            if (btn.classList.contains('cart-add-btn')) {
                btn.innerHTML = '<i class="fas fa-check"></i>';
                btn.classList.add('added');
                btn.title = 'In inquiry list';
            }
            // Card button
            if (btn.classList.contains('pci-quote-btn')) {
                btn.innerHTML = '<i class="fas fa-check"></i> In Inquiry';
                btn.classList.add('pci-added');
            }
        }
    }

    // =====================
    // Inject Table Column
    // =====================
    function injectCartColumn() {
        var table  = document.querySelector('table');
        var tbody  = document.getElementById('product-table');
        if (!table || !tbody) return;

        // Header
        var headerRow = table.querySelector('thead tr');
        if (headerRow) {
            var th = document.createElement('th');
            th.textContent = 'Inquire';
            headerRow.appendChild(th);
        }

        // Rows
        tbody.querySelectorAll('.product-row').forEach(function (row) {
            var cells = row.querySelectorAll('td');
            if (cells.length < 2) return;

            var productName  = cells[1].textContent.trim();
            var packagingTxt = cells[3] ? cells[3].textContent.trim() : '';

            var td  = document.createElement('td');
            var btn = document.createElement('button');
            btn.className = 'cart-add-btn';
            btn.setAttribute('data-name', productName);
            btn.setAttribute('aria-label', 'Add ' + productName + ' to inquiry');

            if (isInCart(productName)) {
                btn.innerHTML = '<i class="fas fa-check"></i>';
                btn.classList.add('added');
                btn.title = 'In inquiry list';
            } else {
                btn.innerHTML = '<i class="fas fa-plus"></i>';
                btn.title     = 'Add to inquiry';
            }

            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                if (isInCart(productName)) {
                    // Toggle off
                    removeFromCart(productName);
                    btn.innerHTML = '<i class="fas fa-plus"></i>';
                    btn.classList.remove('added');
                    btn.title = 'Add to inquiry';
                    updateCartBadge();
                    renderCartPanel();
                } else {
                    showQtyModal(btn, productName, packagingTxt, detectCategory());
                }
            });

            td.appendChild(btn);
            row.appendChild(td);
        });
    }

    function detectCategory() {
        var h1 = document.querySelector('.ph-title, .hero h1, .hero-content h1');
        return h1 ? h1.textContent.trim() : '';
    }

    // =====================
    // Toast
    // =====================
    function showAddedToast(name, qty, unit) {
        var existing = document.getElementById('cart-toast');
        if (existing) existing.remove();

        var toast = document.createElement('div');
        toast.id        = 'cart-toast';
        toast.className = 'cart-toast';
        toast.innerHTML =
            '<i class="fas fa-check-circle"></i> ' +
            '<span>' + escapeHTML(name) + '</span> &nbsp;' +
            '<em>' + qty + ' ' + unit + '</em>';
        document.body.appendChild(toast);

        setTimeout(function () { toast.classList.add('show'); }, 10);
        setTimeout(function () {
            toast.classList.remove('show');
            setTimeout(function () { if (toast.parentNode) toast.remove(); }, 300);
        }, 2500);
    }

    // =====================
    // Floating Cart Button
    // =====================
    function createCartButton() {
        var btn = document.createElement('button');
        btn.id        = 'cart-float-btn';
        btn.className = 'cart-float-btn';
        btn.setAttribute('aria-label', 'Open inquiry cart');
        btn.innerHTML = '<i class="fas fa-clipboard-list"></i><span class="cart-badge" id="cart-badge">0</span>';
        btn.addEventListener('click', openCartPanel);
        document.body.appendChild(btn);
        updateCartBadge();
    }

    function updateCartBadge() {
        var badge = document.getElementById('cart-badge');
        if (!badge) return;
        var count = getCart().length;
        badge.textContent  = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
        var fb = document.getElementById('cart-float-btn');
        if (fb) fb.classList.toggle('has-items', count > 0);
    }

    // =====================
    // Cart Panel
    // =====================
    function createCartPanel() {
        var overlay = document.createElement('div');
        overlay.id        = 'cart-overlay';
        overlay.className = 'cart-overlay';
        overlay.addEventListener('click', closeCartPanel);

        var panel = document.createElement('div');
        panel.id        = 'cart-panel';
        panel.className = 'cart-panel';
        panel.innerHTML =
            '<div class="cart-panel-header">' +
                '<h3><i class="fas fa-clipboard-list"></i> Inquiry List</h3>' +
                '<button class="cart-close-btn" onclick="window._jemenaCart.close()" aria-label="Close">' +
                    '<i class="fas fa-times"></i>' +
                '</button>' +
            '</div>' +
            // Search section
            '<div class="cart-search-section">' +
                '<div class="cart-search-wrapper">' +
                    '<i class="fas fa-search cart-search-icon"></i>' +
                    '<input type="text" id="cart-search-input" class="cart-search-input" placeholder="Search all products...">' +
                    '<button class="cart-search-clear" id="cart-search-clear" style="display:none" aria-label="Clear search">' +
                        '<i class="fas fa-times"></i>' +
                    '</button>' +
                '</div>' +
                '<div class="cart-search-results" id="cart-search-results" style="display:none"></div>' +
            '</div>' +
            '<div class="cart-panel-body" id="cart-panel-body"></div>' +
            '<div class="cart-panel-footer" id="cart-panel-footer"></div>';

        document.body.appendChild(overlay);
        document.body.appendChild(panel);

        // Wire up search
        var searchInput = panel.querySelector('#cart-search-input');
        var clearBtn    = panel.querySelector('#cart-search-clear');
        var resultsDiv  = panel.querySelector('#cart-search-results');

        var debounceTimer;
        searchInput.addEventListener('input', function () {
            clearTimeout(debounceTimer);
            var q = searchInput.value.trim();
            clearBtn.style.display = q ? 'flex' : 'none';
            if (!q) {
                resultsDiv.style.display = 'none';
                resultsDiv.innerHTML = '';
                return;
            }
            debounceTimer = setTimeout(function () { runSearch(q, resultsDiv); }, 350);
        });

        clearBtn.addEventListener('click', function () {
            searchInput.value          = '';
            clearBtn.style.display     = 'none';
            resultsDiv.style.display   = 'none';
            resultsDiv.innerHTML       = '';
            searchInput.focus();
        });
    }

    // =====================
    // Product Search (local index, instant — no API needed)
    // =====================
    function runSearch(query, resultsDiv) {
        resultsDiv.style.display = 'block';
        var q = query.toLowerCase().trim();

        if (!q) {
            resultsDiv.style.display = 'none';
            return;
        }

        // Score each product: exact match > starts with > contains (name, then category)
        var scored = PRODUCT_INDEX.map(function (p) {
            var name = p.name.toLowerCase();
            var cat  = p.category.toLowerCase();
            var score = 0;
            if (name === q)                  score = 100;
            else if (name.startsWith(q))     score = 80;
            else if (name.includes(q))       score = 60;
            else if (cat.includes(q))        score = 30;
            // fuzzy: all query words present
            else {
                var words = q.split(/\s+/);
                var allMatch = words.every(function (w) { return name.includes(w) || cat.includes(w); });
                if (allMatch) score = 20;
            }
            return { product: p, score: score };
        })
        .filter(function (r) { return r.score > 0; })
        .sort(function (a, b) { return b.score - a.score; })
        .slice(0, 15)
        .map(function (r) { return r.product; });

        renderSearchResults(scored, resultsDiv);
    }

    function renderSearchResults(products, resultsDiv) {
        if (products.length === 0) {
            resultsDiv.innerHTML = '<div class="cart-search-empty">No products found.</div>';
            return;
        }

        var html = products.map(function (p) {
            var pkgOptions = (p.packaging || []).map(function (pkg) {
                return '<option value="' + escapeAttr(pkg) + '">' + escapeHTML(pkg) + '</option>';
            }).join('');
            if (!pkgOptions) pkgOptions = '<option value="">Custom</option>';

            var unitOpts = UNITS.map(function (u) {
                return '<option value="' + u + '"' + (u === DEFAULT_UNIT ? ' selected' : '') + '>' + u + '</option>';
            }).join('');

            var inCart     = isInCart(p.name);
            var btnClass   = inCart ? 'cart-sr-add-btn added' : 'cart-sr-add-btn';
            var btnIcon    = inCart ? 'fa-check' : 'fa-plus';
            var btnTitle   = inCart ? 'In inquiry list' : 'Add to inquiry';

            return '<div class="cart-search-result" data-name="' + escapeAttr(p.name) + '">' +
                '<div class="cart-sr-info">' +
                    '<span class="cart-sr-name">' + escapeHTML(p.name) + '</span>' +
                    '<span class="cart-sr-cat">' + escapeHTML(p.category) + '</span>' +
                '</div>' +
                '<div class="cart-sr-controls">' +
                    '<input type="number" class="cart-sr-qty" value="1" min="0.1" step="0.1" aria-label="Quantity">' +
                    '<select class="cart-sr-unit" aria-label="Unit">' + unitOpts + '</select>' +
                    '<select class="cart-sr-pkg" aria-label="Packaging">' + pkgOptions + '</select>' +
                    '<button class="' + btnClass + '" title="' + btnTitle + '" ' +
                        'data-name="' + escapeAttr(p.name) + '" ' +
                        'data-category="' + escapeAttr(p.category) + '">' +
                        '<i class="fas ' + btnIcon + '"></i>' +
                    '</button>' +
                '</div>' +
            '</div>';
        }).join('');

        resultsDiv.innerHTML = html;

        // Bind add buttons
        resultsDiv.querySelectorAll('.cart-sr-add-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var name     = btn.dataset.name;
                var category = btn.dataset.category;
                var row      = btn.closest('.cart-search-result');
                var qty      = parseFloat(row.querySelector('.cart-sr-qty').value) || 1;
                var unit     = row.querySelector('.cart-sr-unit').value;
                var pkg      = row.querySelector('.cart-sr-pkg').value;

                if (isInCart(name)) {
                    removeFromCart(name);
                    btn.innerHTML = '<i class="fas fa-plus"></i>';
                    btn.classList.remove('added');
                    btn.title = 'Add to inquiry';
                } else {
                    addToCart(name, pkg, category, qty, unit);
                    btn.innerHTML = '<i class="fas fa-check"></i>';
                    btn.classList.add('added');
                    btn.title = 'In inquiry list';
                    showAddedToast(name, qty, unit);
                }

                // Sync table row button if visible
                var tableBtn = document.querySelector('.cart-add-btn[data-name="' + escapeAttr(name) + '"]');
                if (tableBtn) {
                    if (isInCart(name)) {
                        tableBtn.innerHTML = '<i class="fas fa-check"></i>';
                        tableBtn.classList.add('added');
                    } else {
                        tableBtn.innerHTML = '<i class="fas fa-plus"></i>';
                        tableBtn.classList.remove('added');
                    }
                }

                updateCartBadge();
                renderCartPanel();
            });
        });
    }

    // =====================
    // Render Cart Items
    // =====================
    function renderCartPanel() {
        var body   = document.getElementById('cart-panel-body');
        var footer = document.getElementById('cart-panel-footer');
        if (!body || !footer) return;

        var cart = getCart();

        if (cart.length === 0) {
            body.innerHTML =
                '<div class="cart-empty">' +
                    '<i class="fas fa-clipboard"></i>' +
                    '<p>Your inquiry list is empty.</p>' +
                    '<p>Search for products above or click <strong>+</strong> on any product row.</p>' +
                '</div>';
            footer.innerHTML = '';
            return;
        }

        var listHTML = cart.map(function (item) {
            var unitOpts = UNITS.map(function (u) {
                return '<option value="' + u + '"' + (u === item.unit ? ' selected' : '') + '>' + u + '</option>';
            }).join('');

            return '<div class="cart-item" data-name="' + escapeAttr(item.name) + '">' +
                '<div class="cart-item-info">' +
                    '<span class="cart-item-name">' + escapeHTML(item.name) + '</span>' +
                    '<span class="cart-item-pkg">' + escapeHTML(item.packaging) + '</span>' +
                '</div>' +
                '<div class="cart-item-qty-row">' +
                    '<input type="number" class="cart-item-qty-input" value="' + item.quantity + '" min="0.1" step="0.1" ' +
                        'data-name="' + escapeAttr(item.name) + '" aria-label="Quantity">' +
                    '<select class="cart-item-unit-select" data-name="' + escapeAttr(item.name) + '" aria-label="Unit">' +
                        unitOpts +
                    '</select>' +
                '</div>' +
                '<button class="cart-item-remove" data-name="' + escapeAttr(item.name) + '" ' +
                    'aria-label="Remove ' + escapeAttr(item.name) + '">' +
                    '<i class="fas fa-trash-alt"></i>' +
                '</button>' +
            '</div>';
        }).join('');

        body.innerHTML = listHTML;

        // Bind qty inputs
        body.querySelectorAll('.cart-item-qty-input').forEach(function (input) {
            input.addEventListener('change', function () {
                updateQty(input.dataset.name, input.value, undefined);
            });
        });

        // Bind unit selects
        body.querySelectorAll('.cart-item-unit-select').forEach(function (sel) {
            sel.addEventListener('change', function () {
                updateQty(sel.dataset.name, undefined, sel.value);
            });
        });

        // Bind remove buttons
        body.querySelectorAll('.cart-item-remove').forEach(function (btn) {
            btn.addEventListener('click', function () {
                window._jemenaCart.remove(btn.dataset.name);
            });
        });

        // Customer info — preserve previous values
        var prevName    = document.getElementById('cart-customer-name')    ? document.getElementById('cart-customer-name').value    : (localStorage.getItem('jemena-cust-name')    || '');
        var prevCompany = document.getElementById('cart-customer-company') ? document.getElementById('cart-customer-company').value : (localStorage.getItem('jemena-cust-company') || '');

        footer.innerHTML =
            '<div class="cart-customer-section">' +
                '<h4 class="cart-customer-title"><i class="fas fa-user-circle"></i> Your Details <span class="cart-optional">(optional)</span></h4>' +
                '<input type="text" id="cart-customer-name" class="cart-customer-input" ' +
                    'placeholder="Your name" value="' + escapeHTML(prevName) + '">' +
                '<input type="text" id="cart-customer-company" class="cart-customer-input" ' +
                    'placeholder="Company / Organisation name" value="' + escapeHTML(prevCompany) + '">' +
            '</div>' +
            '<div class="cart-footer-actions">' +
                '<button class="cart-btn-wa" onclick="window._jemenaCart.sendWhatsApp()">' +
                    '<i class="fab fa-whatsapp"></i> WhatsApp' +
                '</button>' +
                '<button class="cart-btn-email" onclick="window._jemenaCart.sendEmail()">' +
                    '<i class="fas fa-envelope"></i> Email' +
                '</button>' +
                '<button class="cart-btn-clear" onclick="window._jemenaCart.clearAll()">' +
                    '<i class="fas fa-trash"></i> Clear' +
                '</button>' +
            '</div>';

        // Persist customer info to localStorage on change
        footer.querySelector('#cart-customer-name').addEventListener('input', function () {
            localStorage.setItem('jemena-cust-name', this.value);
        });
        footer.querySelector('#cart-customer-company').addEventListener('input', function () {
            localStorage.setItem('jemena-cust-company', this.value);
        });
    }

    function openCartPanel() {
        renderCartPanel();
        document.getElementById('cart-overlay')?.classList.add('active');
        document.getElementById('cart-panel')?.classList.add('active');
        document.body.classList.add('cart-open');
    }

    function closeCartPanel() {
        document.getElementById('cart-overlay')?.classList.remove('active');
        document.getElementById('cart-panel')?.classList.remove('active');
        document.body.classList.remove('cart-open');
    }

    // =====================
    // Quote Actions
    // =====================
    function getCustomerInfo() {
        var nameEl    = document.getElementById('cart-customer-name');
        var companyEl = document.getElementById('cart-customer-company');
        return {
            name:    nameEl    ? nameEl.value.trim()    : (localStorage.getItem('jemena-cust-name')    || ''),
            company: companyEl ? companyEl.value.trim() : (localStorage.getItem('jemena-cust-company') || '')
        };
    }

    function buildMessage() {
        var c    = getCustomerInfo();
        var cart = getCart();
        var lines = [];

        lines.push('QUOTE INQUIRY — Jemena Trading Limited');
        lines.push('─────────────────────────────────────');

        if (c.name)    lines.push('Name:    ' + c.name);
        if (c.company) lines.push('Company: ' + c.company);
        if (c.name || c.company) lines.push('');

        lines.push('ITEMS REQUESTED:');
        cart.forEach(function (item, i) {
            lines.push((i + 1) + '. ' + item.name);
            lines.push('   Qty:  ' + item.quantity + ' ' + item.unit);
            if (item.packaging) lines.push('   Pkg:  ' + item.packaging);
            if (item.note)      lines.push('   Note: ' + item.note);
        });

        lines.push('─────────────────────────────────────');
        return lines.join('\n');
    }

    function sendWhatsApp() {
        var cart = getCart();
        if (cart.length === 0) { alert('Your inquiry list is empty.'); return; }
        window.open('https://wa.me/' + WHATSAPP_NUM + '?text=' + encodeURIComponent(buildMessage()), '_blank');
    }

    function sendEmail() {
        var cart = getCart();
        if (cart.length === 0) { alert('Your inquiry list is empty.'); return; }
        var c       = getCustomerInfo();
        var subject = 'Quote Inquiry' + (c.company ? ' — ' + c.company : c.name ? ' — ' + c.name : '') + ' | Jemena Trading';
        window.location.href =
            'mailto:info@jemenatrading.co.ke' +
            '?subject=' + encodeURIComponent(subject) +
            '&body='    + encodeURIComponent(buildMessage());
    }

    function clearAll() {
        clearCart();
        updateCartBadge();
        renderCartPanel();
        document.querySelectorAll('.cart-add-btn.added').forEach(function (btn) {
            btn.innerHTML = '<i class="fas fa-plus"></i>';
            btn.classList.remove('added');
            btn.title = 'Add to inquiry';
        });
    }

    function removeItem(name) {
        removeFromCart(name);
        var tableBtn = document.querySelector('.cart-add-btn[data-name="' + escapeAttr(name) + '"]');
        if (tableBtn) {
            tableBtn.innerHTML = '<i class="fas fa-plus"></i>';
            tableBtn.classList.remove('added');
            tableBtn.title = 'Add to inquiry';
        }
        updateCartBadge();
        renderCartPanel();
    }

    // =====================
    // Helpers
    // =====================
    function escapeHTML(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function escapeAttr(str) {
        return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
    }

    // =====================
    // Public API
    // =====================
    window._jemenaCart = {
        close:        closeCartPanel,
        remove:       removeItem,
        clearAll:     clearAll,
        sendWhatsApp: sendWhatsApp,
        sendEmail:    sendEmail
    };

    // =====================
    // Init
    // =====================
    document.addEventListener('DOMContentLoaded', function () {
        createCartButton();
        createCartPanel();
        if (document.getElementById('product-table')) {
            injectCartColumn();
        }
        updateCartBadge();

        // Event delegation — handles dynamically generated card buttons (.pci-quote-btn)
        document.addEventListener('click', function (e) {
            var btn = e.target.closest('.pci-quote-btn');
            if (!btn) return;
            e.stopPropagation();
            var name      = btn.getAttribute('data-name');
            var packaging = btn.getAttribute('data-packaging') || '';
            if (!name) return;

            if (isInCart(name)) {
                removeFromCart(name);
                btn.innerHTML = '<i class="fas fa-plus"></i> Add to Quote';
                btn.classList.remove('pci-added');
                updateCartBadge();
                renderCartPanel();
            } else {
                showQtyModal(btn, name, packaging, detectCategory());
            }
        });
    });

})();
