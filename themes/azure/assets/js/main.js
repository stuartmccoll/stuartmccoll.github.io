(function () {
    var root = document.documentElement;

    /* ---------- Colour scheme picker ---------- */
    var toggle = document.getElementById('scheme-toggle');
    var menu = document.getElementById('scheme-menu');
    var current = document.getElementById('scheme-current');
    var options = menu ? Array.prototype.slice.call(menu.querySelectorAll('[data-scheme]')) : [];

    function activeScheme() {
        return root.getAttribute('data-theme') || 'system';
    }

    function reflect() {
        var scheme = activeScheme();
        options.forEach(function (o) {
            o.setAttribute('aria-checked', String(o.getAttribute('data-scheme') === scheme));
        });
        if (current) current.className = 'swatch swatch-' + scheme;
    }

    function setScheme(scheme) {
        if (scheme === 'system') root.removeAttribute('data-theme');
        else root.setAttribute('data-theme', scheme);
        try { localStorage.setItem('theme', scheme); } catch (e) {}
        reflect();
    }

    function openMenu() {
        menu.hidden = false;
        toggle.setAttribute('aria-expanded', 'true');
        var checked = menu.querySelector('[aria-checked="true"]') || options[0];
        if (checked) checked.focus();
    }

    function closeMenu(returnFocus) {
        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        if (returnFocus) toggle.focus();
    }

    if (toggle && menu) {
        reflect();
        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            if (menu.hidden) openMenu(); else closeMenu(false);
        });
        menu.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-scheme]');
            if (!btn) return;
            setScheme(btn.getAttribute('data-scheme'));
            closeMenu(true);
        });
        menu.addEventListener('keydown', function (e) {
            var i = options.indexOf(document.activeElement);
            if (e.key === 'ArrowDown') { e.preventDefault(); options[(i + 1) % options.length].focus(); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); options[(i - 1 + options.length) % options.length].focus(); }
            else if (e.key === 'Home') { e.preventDefault(); options[0].focus(); }
            else if (e.key === 'End') { e.preventDefault(); options[options.length - 1].focus(); }
            else if (e.key === 'Escape') { closeMenu(true); }
            else if (e.key === 'Tab') { closeMenu(false); }
        });
        document.addEventListener('click', function (e) {
            if (!menu.hidden && !e.target.closest('.scheme')) closeMenu(false);
        });
    }

    /* ---------- Post filters (home page) ---------- */
    var pills = document.querySelectorAll('[data-filter]');
    var items = document.querySelectorAll('#posts .post-item');
    var empty = document.getElementById('posts-empty');
    Array.prototype.forEach.call(pills, function (pill) {
        pill.addEventListener('click', function () {
            var f = pill.getAttribute('data-filter');
            var shown = 0;
            Array.prototype.forEach.call(pills, function (p) { p.setAttribute('aria-pressed', String(p === pill)); });
            Array.prototype.forEach.call(items, function (li) {
                var match = f === 'all' || (' ' + li.getAttribute('data-tags') + ' ').indexOf(' ' + f + ' ') !== -1;
                li.hidden = !match;
                if (match) shown++;
            });
            if (empty) empty.hidden = shown !== 0;
        });
    });

    /* ---------- Code blocks: language label and copy button ---------- */
    Array.prototype.forEach.call(document.querySelectorAll('.prose .highlight'), function (block) {
        var code = block.querySelector('code');
        if (!code) return;
        var lang = code.getAttribute('data-lang') || '';
        var head = document.createElement('div');
        head.className = 'code-head';
        var label = document.createElement('b');
        label.textContent = lang || 'Code';
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'code-copy';
        btn.textContent = 'Copy';
        btn.addEventListener('click', function () {
            var text = code.innerText;
            var done = function () { btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = 'Copy'; }, 1500); };
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(done, function () { selectText(code); });
            } else {
                selectText(code);
            }
        });
        head.appendChild(label);
        head.appendChild(btn);
        block.insertBefore(head, block.firstChild);
    });

    function selectText(el) {
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    /* ---------- Table of contents: highlight the current section ---------- */
    var tocLinks = document.querySelectorAll('.toc a[href^="#"]');
    if (tocLinks.length && 'IntersectionObserver' in window) {
        var byId = {};
        var headings = [];
        Array.prototype.forEach.call(tocLinks, function (a) {
            var id = decodeURIComponent(a.getAttribute('href').slice(1));
            var h = document.getElementById(id);
            if (h) { byId[id] = a; headings.push(h); }
        });
        var setActive = function (id) {
            Array.prototype.forEach.call(tocLinks, function (a) { a.classList.toggle('is-active', a === byId[id]); });
        };
        var observer = new IntersectionObserver(function () {
            var top = null;
            headings.forEach(function (h) { if (h.getBoundingClientRect().top < 120) top = h; });
            setActive((top || headings[0]).id);
        }, { rootMargin: '-80px 0px -60% 0px', threshold: [0, 1] });
        headings.forEach(function (h) { observer.observe(h); });
        if (headings[0]) setActive(headings[0].id);
    }

    /* ---------- Back to top ---------- */
    var toTop = document.getElementById('to-top');
    if (toTop) toTop.addEventListener('click', function () { window.scrollTo(0, 0); });
})();
