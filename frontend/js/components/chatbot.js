/* ===================================
   JEMENA TRADING LIMITED
   AI Chatbot (JT) — Phase 4
   =================================== */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    var API_URL = 'https://jemenaai.jemenatrading.co.ke/api/chat';

    // =====================
    // Quick-reply chip sets
    // =====================
    var CHIPS_WELCOME = [
        'What products do you stock?',
        'Soaps & Detergent chemicals',
        'Water treatment chemicals',
        'Request a quote',
        'Where are you located?'
    ];

    var CHIPS_FOLLOWUP = [
        'Tell me more',
        'What are the packaging sizes?',
        'Add this to my inquiry',
        'Ask another question'
    ];

    // Product names for inline "Add to Inquiry" detection
    // (shared with cart.js via window._jemenaCart)
    var KNOWN_PRODUCTS = [
        'SLES 70%','Sulphonic Acid LABSA','Sodium Hydroxide','Sodium Tripolyphosphate',
        'Benzalkonium Chloride','CMC','Cocodiethanol Amide','Deionized Water',
        'EDTA','Fabric Softener Stepantex','Formalin','Hydrofluoric Acid',
        'Kaolin','Magnesium Sulphate','Nansa H85','Nonylphenol Ethoxylate',
        'Oleic Acid','Optical Brightener','Para-dichlorobenzene','Pearlizer',
        'Pine Oil','Polyquaternium7','Potassium Hydroxide','Soda Ash',
        'Sodium Bicarbonate','Sodium Carbonate','Sodium Cumene Sulfonate',
        'Sodium Gluconate','Sodium Hydrosulphite','Sodium Hypochlorite',
        'Sodium Meta Bisulphite','Sodium Metasilicate','Sodium Perborate',
        'Sodium Silicate','Sodium Sulphate','Sodium Xylene Sulfonate',
        'Talcum Powder','Tego Betain','Titanium Dioxide','Triethanolamine',
        'Urea','Acetone','Butyl Glycol Ether','Carbomer','Isopropyl Alcohol',
        'Methanol','White Spirit','Aluminium Sulphate','Ammonia Liquor',
        'Calcium Hypo Chlorite','Chlorine 90% TCCA','Copper Sulphate',
        'Poly Aluminium Chloride','Borax','Caustic Soda','Hydrochloric Acid',
        'Hydrogen Peroxide','Nitric Acid','Oxalic Acid','Sulphuric Acid',
        'Citric Acid','Corn Starch','Glacial Acetic Acid','Phosphoric Acid',
        'Sodium Benzoate','Castor Oil','Ceto Stearyl Alcohol','Glycerin',
        'Stearic Acid','White Oil','Paraffin Wax','Mono Propylene Glycol',
        'Essential Oil','Fragrance','Perfume'
    ];

    // =====================
    // Build UI
    // =====================
    var chatButton = document.createElement('div');
    chatButton.id = 'chatbot-button';
    chatButton.setAttribute('aria-label', 'Open JT Chat Assistant');
    chatButton.innerHTML =
        '<span class="jt-btn-avatar">JT</span>' +
        '<span class="jt-btn-label">Ask JT</span>' +
        '<span class="jt-status-dot" id="jt-status-dot"></span>';
    document.body.appendChild(chatButton);

    var chatWindow = document.createElement('div');
    chatWindow.id = 'chatbot-window';
    chatWindow.setAttribute('role', 'dialog');
    chatWindow.setAttribute('aria-label', 'JT Chat Assistant');
    chatWindow.innerHTML =
        '<div id="chatbot-header">' +
            '<div class="jt-header-left">' +
                '<div class="jt-header-avatar">JT</div>' +
                '<div class="jt-header-info">' +
                    '<span class="jt-header-name">JT — Jemena AI</span>' +
                    '<span class="jt-header-status"><span class="jt-status-dot"></span> Online</span>' +
                '</div>' +
            '</div>' +
            '<button id="chat-close" aria-label="Close chat"><i class="fas fa-times"></i></button>' +
        '</div>' +
        '<div id="chatbot-messages" role="log" aria-live="polite"></div>' +
        '<div id="jt-chips-bar" class="jt-chips-bar" aria-label="Quick replies"></div>' +
        '<div id="chatbot-input-container">' +
            '<input type="text" id="chatbot-input" placeholder="Ask about any chemical..." aria-label="Type your message" autocomplete="off">' +
            '<button id="chatbot-send" aria-label="Send message"><i class="fas fa-paper-plane"></i></button>' +
        '</div>';
    document.body.appendChild(chatWindow);

    // =====================
    // State
    // =====================
    var isOpen        = false;
    var isTyping      = false;
    var messageQueue  = [];
    var lastBotText   = '';
    var TYPING_SPEED  = 18;
    var THINKING_MS   = 900;

    var chatMessages = document.getElementById('chatbot-messages');
    var chatInput    = document.getElementById('chatbot-input');
    var chatSend     = document.getElementById('chatbot-send');
    var chipsBar     = document.getElementById('jt-chips-bar');

    // =====================
    // Toggle open / close
    // =====================
    chatButton.addEventListener('click', toggleChat);

    document.getElementById('chat-close').addEventListener('click', function () {
        setOpen(false);
    });

    document.addEventListener('click', function (e) {
        if (isOpen && !chatWindow.contains(e.target) && !chatButton.contains(e.target)) {
            setOpen(false);
        }
    });

    function toggleChat() { setOpen(!isOpen); }

    function setOpen(open) {
        isOpen = open;
        chatWindow.classList.toggle('jt-open', open);
        chatButton.classList.toggle('jt-active', open);
        if (open) {
            chatInput.focus();
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // =====================
    // Page context
    // =====================
    function getPageContext() {
        var h1  = document.querySelector('.hero h1, .hero-content h1');
        var title = document.title || '';
        var page  = h1 ? h1.textContent.trim() : title.replace('Jemena Trading Limited - ', '');
        return page || 'Home';
    }

    // =====================
    // Message rendering
    // =====================
    function addMessage(role, text, isHTML) {
        var wrap = document.createElement('div');
        wrap.className = 'jt-msg-wrap jt-msg-' + role;

        var bubble = document.createElement('div');
        bubble.className = 'jt-bubble';

        var content = document.createElement('span');
        content.className = 'jt-bubble-content';
        bubble.appendChild(content);

        var time = document.createElement('span');
        time.className = 'jt-timestamp';
        time.textContent = formatTime(new Date());
        bubble.appendChild(time);

        wrap.appendChild(bubble);
        chatMessages.appendChild(wrap);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        if (role === 'bot') {
            messageQueue.push({ text: text, isHTML: !!isHTML, el: content, wrap: wrap });
            processQueue();
        } else {
            content.textContent = text;
        }
    }

    function processQueue() {
        if (isTyping || messageQueue.length === 0) return;
        var item = messageQueue.shift();
        isTyping = true;
        showTypingDots();

        setTimeout(function () {
            hideTypingDots();
            if (item.isHTML) {
                typeHTML(item.text, item.el, function () {
                    isTyping = false;
                    lastBotText = item.el.textContent;
                    detectProductsAndAppend(item.text, item.wrap);
                    processQueue();
                });
            } else {
                typeText(item.text, item.el, function () {
                    isTyping = false;
                    lastBotText = item.text;
                    processQueue();
                });
            }
        }, THINKING_MS);
    }

    function typeText(text, el, cb) {
        var i = 0;
        function tick() {
            if (i < text.length) {
                el.textContent += text.charAt(i++);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                setTimeout(tick, TYPING_SPEED);
            } else if (cb) cb();
        }
        tick();
    }

    function typeHTML(html, el, cb) {
        // Render markdown-like formatting then type word by word for speed
        var rendered = renderMarkdown(html);
        el.innerHTML = rendered;
        chatMessages.scrollTop = chatMessages.scrollHeight;
        if (cb) cb();
    }

    // =====================
    // Markdown renderer
    // =====================
    function renderMarkdown(text) {
        return text
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Headers
            .replace(/^#{1,3}\s+(.+)$/gm, '<strong>$1</strong>')
            // Unordered list items
            .replace(/^[-•]\s+(.+)$/gm, '<span class="jt-list-item">$1</span>')
            // Numbered list items
            .replace(/^\d+\.\s+(.+)$/gm, '<span class="jt-list-item">$1</span>')
            // Double newline → paragraph break
            .replace(/\n{2,}/g, '<br><br>')
            // Single newline
            .replace(/\n/g, '<br>');
    }

    // =====================
    // Inline product "Add" buttons
    // =====================
    function detectProductsAndAppend(text, wrapEl) {
        if (!window._jemenaCart) return;
        var textLower = text.toLowerCase();
        var found = [];

        KNOWN_PRODUCTS.forEach(function (p) {
            if (textLower.includes(p.toLowerCase()) && found.indexOf(p) === -1) {
                found.push(p);
            }
        });

        if (found.length === 0) return;

        var chipRow = document.createElement('div');
        chipRow.className = 'jt-product-chips';

        found.slice(0, 4).forEach(function (name) {
            var btn = document.createElement('button');
            btn.className = 'jt-product-chip';
            btn.innerHTML = '<i class="fas fa-plus-circle"></i> ' + name;
            btn.title = 'Add to inquiry list';
            btn.addEventListener('click', function () {
                var cart = window._jemenaCart;
                // Find in PRODUCT_INDEX via cart's internal search
                var pkg = '';
                if (window._jemenaProductIndex) {
                    var match = window._jemenaProductIndex.find(function (p) {
                        return p.name.toLowerCase().includes(name.toLowerCase());
                    });
                    if (match) { pkg = (match.packaging || [])[0] || ''; name = match.name; }
                }
                cart.addItem(name, pkg, '', 1, 'kg');
                btn.innerHTML = '<i class="fas fa-check-circle"></i> ' + name;
                btn.classList.add('added');
                btn.disabled = true;
            });
            chipRow.appendChild(btn);
        });

        wrapEl.appendChild(chipRow);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // =====================
    // Quick-reply chips
    // =====================
    function showChips(chips) {
        chipsBar.innerHTML = '';
        chips.forEach(function (label) {
            var btn = document.createElement('button');
            btn.className = 'jt-chip';
            btn.textContent = label;
            btn.addEventListener('click', function () {
                sendMessage(label);
                chipsBar.innerHTML = '';
            });
            chipsBar.appendChild(btn);
        });
    }

    // =====================
    // Typing dots indicator
    // =====================
    var typingDotsEl = null;

    function showTypingDots() {
        if (typingDotsEl) return;
        typingDotsEl = document.createElement('div');
        typingDotsEl.className = 'jt-msg-wrap jt-msg-bot jt-typing-wrap';
        typingDotsEl.innerHTML =
            '<div class="jt-bubble jt-typing-bubble">' +
                '<span class="jt-dot"></span>' +
                '<span class="jt-dot"></span>' +
                '<span class="jt-dot"></span>' +
            '</div>';
        chatMessages.appendChild(typingDotsEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function hideTypingDots() {
        if (typingDotsEl) {
            typingDotsEl.remove();
            typingDotsEl = null;
        }
    }

    // =====================
    // Send message
    // =====================
    chatSend.addEventListener('click', function () { sendMessage(); });
    chatInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    async function sendMessage(text) {
        var msg = (text || chatInput.value).trim();
        if (!msg) return;
        chatInput.value = '';
        chipsBar.innerHTML = '';
        addMessage('user', msg);
        chatSend.disabled = true;
        chatInput.disabled = true;

        try {
            var res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    message: msg,
                    pageContext: getPageContext()
                }),
                credentials: 'include'
            });

            var data = await res.json();

            if (data.response) {
                addMessage('bot', data.response, true);
                setTimeout(function () { showChips(CHIPS_FOLLOWUP); }, 1200);
            } else {
                addMessage('bot', 'Sorry, I could not process that. Please try again.');
            }
        } catch (err) {
            addMessage('bot', 'I\'m having trouble connecting right now. Please call us on <strong>+254 795 792 234</strong> or email <strong>info@jemenatrading.co.ke</strong>.');
        } finally {
            chatSend.disabled = false;
            chatInput.disabled = false;
            chatInput.focus();
        }
    }

    // =====================
    // Helpers
    // =====================
    function formatTime(d) {
        var h = d.getHours(), m = d.getMinutes();
        var ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return h + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
    }

    // Expose addItem to allow chatbot product chips to interact with cart
    if (window._jemenaCart) {
        window._jemenaCart.addItem = function (name, pkg, cat, qty, unit) {
            // delegate to cart's internal addToCart if exposed
        };
    }

    // =====================
    // Welcome message
    // =====================
    addMessage('bot',
        'Hello! Welcome to **Jemena Trading Limited**.\n\n' +
        'I\'m **JT**, your chemicals expert. I can help you find products, check packaging options, and answer technical questions.\n\n' +
        '**Contact us:**\n' +
        '- Rangwe Road, Off Lunga Lunga Rd, Nairobi\n' +
        '- Tel: +254 795 792 234\n' +
        '- Email: info@jemenatrading.co.ke\n\n' +
        'How can I help you today?',
        true
    );

    setTimeout(function () { showChips(CHIPS_WELCOME); }, 1500);
});
