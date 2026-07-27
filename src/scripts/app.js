/**
 * ============================================================================
 *  NEXORA SPACES — site runtime
 *  Vanilla JS, no dependencies. Everything is progressive enhancement:
 *  if this file fails to load, the site still renders and every link works.
 * ============================================================================
 */
(function () {
  'use strict';

  var docEl = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  function on(el, evt, fn, opts) { if (el) el.addEventListener(evt, fn, opts || false); }

  /* Throttle via rAF — keeps scroll handlers off the critical path */
  function rafThrottle(fn) {
    var ticking = false;
    return function () {
      var args = arguments, self = this;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function () { fn.apply(self, args); ticking = false; });
      }
    };
  }

  /* =======================================================================
     1. NAVBAR — shadow on scroll, scroll progress, back-to-top, dock reveal
     ======================================================================= */
  function initScroll() {
    var navbar = $('#navbar');
    var bar = $('#scrollBar');
    var toTop = $('#toTop');
    var dock = $('#mobileDock');
    var leadBar = $('#leadBar');
    var lastY = window.scrollY;

    var update = rafThrottle(function () {
      var y = window.scrollY;
      var h = docEl.scrollHeight - window.innerHeight;

      if (navbar) navbar.classList.toggle('is-scrolled', y > 12);
      if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(y / h, 1) : 0) + ')';
      if (toTop) toTop.classList.toggle('is-visible', y > 700);
      if (dock) dock.classList.add('is-visible');

      /* Sticky lead bar appears after the hero, hides near the footer */
      if (leadBar) {
        var nearEnd = y + window.innerHeight > docEl.scrollHeight - 560;
        leadBar.classList.toggle('is-visible', y > 900 && !nearEnd);
      }
      lastY = y;
    });

    on(window, 'scroll', update, { passive: true });
    update();
  }

  /* =======================================================================
     2. MOBILE DRAWER — focus trap, body lock, ESC to close
     ======================================================================= */
  function initDrawer() {
    var toggle = $('#navToggle');
    var drawer = $('#drawer');
    var scrim = $('#drawerScrim');
    var closeBtn = $('#drawerClose');
    if (!toggle || !drawer) return;

    var lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      drawer.classList.add('is-open');
      if (scrim) scrim.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      var first = drawer.querySelector('a, button');
      if (first) setTimeout(function () { first.focus(); }, 120);
    }

    function close() {
      drawer.classList.remove('is-open');
      if (scrim) scrim.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      if (lastFocus) lastFocus.focus();
    }

    on(toggle, 'click', function () {
      drawer.classList.contains('is-open') ? close() : open();
    });
    on(scrim, 'click', close);
    on(closeBtn, 'click', close);

    on(document, 'keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
      /* Focus trap */
      if (e.key === 'Tab' && drawer.classList.contains('is-open')) {
        var f = $$('a[href], button:not([disabled]), input, select, textarea', drawer)
          .filter(function (el) { return el.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    /* Close when a real navigation link is tapped */
    $$('.drawer-sub a, .drawer-link[href]', drawer).forEach(function (a) {
      on(a, 'click', function () { if (a.getAttribute('href')) close(); });
    });

    /* Collapsible groups inside the drawer */
    $$('.drawer-toggle', drawer).forEach(function (btn) {
      on(btn, 'click', function () {
        var group = btn.closest('.drawer-group');
        var isOpen = group.classList.contains('is-open');
        $$('.drawer-group.is-open', drawer).forEach(function (g) {
          if (g !== group) { g.classList.remove('is-open'); var b = $('.drawer-toggle', g); if (b) b.setAttribute('aria-expanded', 'false'); }
        });
        group.classList.toggle('is-open', !isOpen);
        btn.setAttribute('aria-expanded', String(!isOpen));
      });
    });
  }

  /* =======================================================================
     3. SCROLL REVEAL — IntersectionObserver, unobserve after firing
     ======================================================================= */
  function initReveal() {
    var els = $$('.reveal, .reveal-stagger');
    if (!els.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    els.forEach(function (el) { io.observe(el); });
  }

  /* =======================================================================
     4. COUNTERS — animate numbers into view
     ======================================================================= */
  function initCounters() {
    var els = $$('[data-count]');
    if (!els.length) return;

    function run(el) {
      var target = parseFloat(el.dataset.count);
      var decimals = parseInt(el.dataset.decimals || '0', 10);
      var dur = 1500;
      var start = performance.now();

      if (reduceMotion) { el.textContent = target.toFixed(decimals); return; }

      function tick(now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toFixed(decimals);
      }
      requestAnimationFrame(tick);
    }

    if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* =======================================================================
     5. ACCORDIONS (FAQ)
     ======================================================================= */
  function initAccordion() {
    $$('.acc-btn').forEach(function (btn) {
      on(btn, 'click', function () {
        var item = btn.closest('.acc-item');
        var group = btn.closest('.accordion');
        var isOpen = item.classList.contains('is-open');

        if (group && group.dataset.single !== 'false') {
          $$('.acc-item.is-open', group).forEach(function (o) {
            if (o !== item) {
              o.classList.remove('is-open');
              var b = $('.acc-btn', o);
              if (b) b.setAttribute('aria-expanded', 'false');
            }
          });
        }
        item.classList.toggle('is-open', !isOpen);
        btn.setAttribute('aria-expanded', String(!isOpen));
      });
    });
  }

  /* =======================================================================
     6. TABS
     ======================================================================= */
  function initTabs() {
    $$('[data-tabs]').forEach(function (wrap) {
      var tabs = $$('.tab', wrap);
      var panels = $$('.tab-panel', wrap.parentElement) ;

      tabs.forEach(function (tab) {
        on(tab, 'click', function () {
          var id = tab.dataset.tab;
          tabs.forEach(function (t) {
            var active = t === tab;
            t.classList.toggle('is-active', active);
            t.setAttribute('aria-selected', String(active));
          });
          panels.forEach(function (p) {
            p.classList.toggle('is-active', p.dataset.panel === id);
          });
        });
      });
    });
  }

  /* =======================================================================
     7. PORTFOLIO FILTER
     ======================================================================= */
  function initFilters() {
    $$('[data-filter-group]').forEach(function (group) {
      var pills = $$('.filter-pill', group);
      var targetSel = group.dataset.filterTarget;
      var items = $$(targetSel + ' [data-tags]');
      var empty = $(group.dataset.filterEmpty || '#filterEmpty');

      pills.forEach(function (pill) {
        on(pill, 'click', function () {
          var f = pill.dataset.filter;
          pills.forEach(function (p) {
            p.classList.toggle('is-active', p === pill);
            p.setAttribute('aria-pressed', String(p === pill));
          });
          var shown = 0;
          items.forEach(function (item) {
            var match = f === 'all' || (item.dataset.tags || '').split(' ').indexOf(f) > -1;
            item.style.display = match ? '' : 'none';
            if (match) shown++;
          });
          if (empty) empty.style.display = shown ? 'none' : '';
        });
      });
    });
  }

  /* =======================================================================
     8. BEFORE / AFTER SLIDER
     ======================================================================= */
  function initBeforeAfter() {
    $$('.ba').forEach(function (ba) {
      var dragging = false;

      function setPos(clientX) {
        var r = ba.getBoundingClientRect();
        var pct = ((clientX - r.left) / r.width) * 100;
        ba.style.setProperty('--pos', Math.max(0, Math.min(100, pct)) + '%');
      }

      on(ba, 'pointerdown', function (e) { dragging = true; ba.setPointerCapture(e.pointerId); setPos(e.clientX); });
      on(ba, 'pointermove', function (e) { if (dragging) setPos(e.clientX); });
      on(ba, 'pointerup', function () { dragging = false; });
      on(ba, 'pointercancel', function () { dragging = false; });
      on(ba, 'keydown', function (e) {
        var cur = parseFloat(ba.style.getPropertyValue('--pos')) || 50;
        if (e.key === 'ArrowLeft') { ba.style.setProperty('--pos', Math.max(0, cur - 4) + '%'); e.preventDefault(); }
        if (e.key === 'ArrowRight') { ba.style.setProperty('--pos', Math.min(100, cur + 4) + '%'); e.preventDefault(); }
      });
    });
  }

  /* =======================================================================
     9. CAROUSEL RAILS — arrow buttons
     ======================================================================= */
  function initRails() {
    $$('[data-rail]').forEach(function (wrap) {
      var rail = $('.rail', wrap) || $(wrap.dataset.rail);
      var prev = $('[data-rail-prev]', wrap);
      var next = $('[data-rail-next]', wrap);
      if (!rail) return;

      function step() {
        var first = rail.firstElementChild;
        return first ? first.getBoundingClientRect().width + 20 : 320;
      }
      function sync() {
        if (prev) prev.disabled = rail.scrollLeft < 8;
        if (next) next.disabled = rail.scrollLeft > rail.scrollWidth - rail.clientWidth - 8;
      }
      on(prev, 'click', function () { rail.scrollBy({ left: -step(), behavior: 'smooth' }); });
      on(next, 'click', function () { rail.scrollBy({ left: step(), behavior: 'smooth' }); });
      on(rail, 'scroll', rafThrottle(sync), { passive: true });
      sync();
    });
  }

  /* =======================================================================
     10. COST CALCULATOR
     Transparent NCR pricing model. Rates are ₹ per sq.ft of carpet area.
     ======================================================================= */
  var CALC = {
    /* City cost index — labour + logistics differential across NCR */
    city: {
      gurugram: 1.06, 'south-delhi': 1.08, delhi: 1.0,
      noida: 0.97, 'greater-noida': 0.93, ghaziabad: 0.93,
      faridabad: 0.95, other: 1.0
    },
    /* Base ₹/sqft by package tier */
    pkg: {
      essential: { min: 1150, max: 1450, label: 'Essential' },
      signature: { min: 1650, max: 2100, label: 'Signature' },
      luxe: { min: 2400, max: 3400, label: 'Luxe' }
    },
    /* Scope multipliers */
    scope: { modular: 0.62, full: 1.0, turnkey: 1.24 },
    /* Typical carpet area by config (used to auto-fill the slider) */
    area: { '1bhk': 480, '2bhk': 780, '3bhk': 1150, '4bhk': 1650, villa: 2600 },
    /* Cost split for the breakdown bars */
    split: [
      { key: 'Modular kitchen & wardrobes', pct: 0.38 },
      { key: 'Furniture, beds & seating', pct: 0.21 },
      { key: 'False ceiling, lighting & electrical', pct: 0.16 },
      { key: 'Civil, painting & flooring', pct: 0.15 },
      { key: 'Decor, soft furnishing & styling', pct: 0.10 }
    ]
  };

  function inr(n) {
    return '\u20B9' + Math.round(n).toLocaleString('en-IN');
  }
  function inrLakh(n) {
    var l = n / 100000;
    return '\u20B9' + (l >= 10 ? l.toFixed(1) : l.toFixed(2)) + ' L';
  }

  function initCalculator() {
    var form = $('#calcForm');
    if (!form) return;

    var elCity = $('#calcCity');
    var elConfig = $('#calcConfig');
    var elArea = $('#calcArea');
    var elAreaOut = $('#calcAreaOut');
    var elScope = $$('input[name="calcScope"]');
    var elPkg = $$('input[name="calcPkg"]');
    var outMin = $('#calcMin');
    var outMax = $('#calcMax');
    var outRate = $('#calcRate');
    var outRows = $('#calcRows');
    var outEmi = $('#calcEmi');
    var waBtn = $('#calcWa');

    var manualArea = false;
    on(elArea, 'input', function () { manualArea = true; });

    function currentPkg() {
      var c = elPkg.filter(function (r) { return r.checked; })[0];
      return c ? c.value : 'signature';
    }
    function currentScope() {
      var c = elScope.filter(function (r) { return r.checked; })[0];
      return c ? c.value : 'full';
    }

    function compute() {
      var city = CALC.city[elCity.value] || 1;
      var pkg = CALC.pkg[currentPkg()];
      var scope = CALC.scope[currentScope()] || 1;
      var area = parseInt(elArea.value, 10) || 800;

      var min = pkg.min * area * city * scope;
      var max = pkg.max * area * city * scope;

      if (elAreaOut) elAreaOut.textContent = area.toLocaleString('en-IN') + ' sq.ft';
      if (outMin) outMin.textContent = inrLakh(min);
      if (outMax) outMax.textContent = inrLakh(max);
      if (outRate) outRate.textContent = inr(pkg.min * city * scope) + ' – ' + inr(pkg.max * city * scope) + ' / sq.ft';

      /* 18-month no-cost-EMI style indication on the midpoint */
      if (outEmi) outEmi.textContent = inr(((min + max) / 2) / 18);

      if (outRows) {
        outRows.innerHTML = CALC.split.map(function (s) {
          var lo = min * s.pct, hi = max * s.pct;
          return '<div class="calc-row">' +
            '<div class="calc-row-head"><span>' + s.key + '</span><b>' + inrLakh(lo) + ' – ' + inrLakh(hi) + '</b></div>' +
            '<div class="calc-bar"><span style="width:' + (s.pct * 100 * 2.2) + '%"></span></div>' +
            '</div>';
        }).join('');
      }

      if (waBtn) {
        var msg = 'Hi Nexora Spaces, I used your cost calculator.\n\n' +
          'City: ' + (elCity.options[elCity.selectedIndex] || {}).text + '\n' +
          'Home: ' + (elConfig.options[elConfig.selectedIndex] || {}).text + '\n' +
          'Carpet area: ' + area + ' sq.ft\n' +
          'Package: ' + pkg.label + '\n' +
          'Scope: ' + currentScope() + '\n' +
          'Estimate shown: ' + inrLakh(min) + ' – ' + inrLakh(max) + '\n\n' +
          'Please share a detailed quote.';
        waBtn.href = waBtn.dataset.wa + encodeURIComponent(msg);
      }
    }

    /* Config change auto-sets a sensible area (until the user drags) */
    on(elConfig, 'change', function () {
      if (!manualArea && CALC.area[elConfig.value]) {
        elArea.value = CALC.area[elConfig.value];
      }
      compute();
    });

    [elCity, elArea].forEach(function (el) { on(el, 'input', compute); on(el, 'change', compute); });
    elScope.concat(elPkg).forEach(function (el) { on(el, 'change', compute); });
    on(form, 'submit', function (e) { e.preventDefault(); compute(); });

    compute();
  }

  /* =======================================================================
     11. FORMS — validation, submit states, WhatsApp fallback
     ======================================================================= */
  function initForms() {
    $$('form[data-lead-form]').forEach(function (form) {
      var submitBtn = form.querySelector('[type="submit"]');

      function fieldError(input, msg) {
        var field = input.closest('.field') || input.parentElement;
        field.classList.add('has-error');
        var err = field.querySelector('.field-error');
        if (err) err.textContent = msg;
      }
      function clearError(input) {
        var field = input.closest('.field') || input.parentElement;
        field.classList.remove('has-error');
      }

      $$('input, select, textarea', form).forEach(function (input) {
        on(input, 'input', function () { clearError(input); });
        on(input, 'blur', function () { if (input.value.trim()) validate(input); });
      });

      function validate(input) {
        var v = (input.value || '').trim();
        if (input.hasAttribute('required') && !v) { fieldError(input, 'This field is required'); return false; }
        if (input.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v)) {
          fieldError(input, 'Enter a valid email address'); return false;
        }
        if (input.type === 'tel' && v) {
          var digits = v.replace(/\D/g, '');
          if (digits.length < 10 || digits.length > 13) { fieldError(input, 'Enter a valid 10-digit mobile number'); return false; }
        }
        if (input.type === 'checkbox' && input.hasAttribute('required') && !input.checked) {
          fieldError(input, 'Please accept to continue'); return false;
        }
        clearError(input);
        return true;
      }

      on(form, 'submit', function (e) {
        e.preventDefault();
        var ok = true;
        $$('[required]', form).forEach(function (input) { if (!validate(input)) ok = false; });
        if (!ok) {
          var firstErr = form.querySelector('.has-error input, .has-error select, .has-error textarea');
          if (firstErr) firstErr.focus();
          return;
        }

        /* Honeypot — silently drop bots */
        var hp = form.querySelector('[name="_gotcha"]');
        if (hp && hp.value) return;

        var endpoint = form.getAttribute('action');
        var data = new FormData(form);

        if (submitBtn) {
          submitBtn.classList.add('is-loading');
          submitBtn.disabled = true;
          var label = submitBtn.querySelector('.btn-text');
          if (label) { submitBtn.dataset.label = label.textContent; label.textContent = 'Sending…'; }
        }

        function done(success) {
          if (submitBtn) {
            submitBtn.classList.remove('is-loading');
            submitBtn.disabled = false;
            var l = submitBtn.querySelector('.btn-text');
            if (l && submitBtn.dataset.label) l.textContent = submitBtn.dataset.label;
          }
          if (success) {
            form.reset();
            var to = form.dataset.success;
            if (to) { window.location.href = to; return; }
            toast('Thank you! Our design team will call you within 2 working hours.');
          } else {
            /* Never lose a lead: fall back to WhatsApp with the enquiry pre-filled */
            var lines = [];
            data.forEach(function (val, key) {
              if (key.charAt(0) !== '_' && String(val).trim()) lines.push(key + ': ' + val);
            });
            var wa = form.dataset.waFallback;
            if (wa) {
              toast('Opening WhatsApp to send your enquiry…');
              setTimeout(function () {
                window.open(wa + encodeURIComponent('New enquiry from website\n\n' + lines.join('\n')), '_blank');
              }, 700);
            } else {
              toast('Could not send right now. Please call us — we pick up fast.');
            }
          }
        }

        if (!endpoint || endpoint === '#') { done(false); return; }

        fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(function (r) { done(r.ok); })
          .catch(function () { done(false); });
      });
    });
  }

  /* =======================================================================
     12. TOAST
     ======================================================================= */
  var toastTimer;
  function toast(msg) {
    var el = $('#toast');
    if (!el) { console.log(msg); return; }
    var txt = $('.toast-text', el);
    if (txt) txt.textContent = msg;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-visible'); }, 5200);
  }
  window.nexoraToast = toast;

  /* =======================================================================
     13. TABLE OF CONTENTS — scroll spy
     ======================================================================= */
  function initToc() {
    var toc = $('#toc');
    if (!toc || !('IntersectionObserver' in window)) return;
    var links = $$('a[href^="#"]', toc);
    var targets = links.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
    if (!targets.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (a) {
            a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-90px 0px -70% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* =======================================================================
     14. LAZY-LOAD YOUTUBE / MAP FACADES
     Loads the heavy iframe only when the user clicks — big LCP/TBT win.
     ======================================================================= */
  function initFacades() {
    $$('[data-embed]').forEach(function (box) {
      on(box, 'click', function () {
        var src = box.dataset.embed;
        var title = box.dataset.embedTitle || 'Embedded content';
        var iframe = document.createElement('iframe');
        iframe.src = src;
        iframe.title = title;
        iframe.loading = 'lazy';
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
        iframe.allowFullscreen = true;
        iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0';
        box.innerHTML = '';
        box.appendChild(iframe);
        box.classList.add('is-loaded');
      });
    });
  }

  /* =======================================================================
     15. ACTIVE NAV STATE (based on current path)
     ======================================================================= */
  function initActiveNav() {
    var path = window.location.pathname.replace(/index\.html$/, '').replace(/\/$/, '');
    $$('.nav-link[href], .drawer-link[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;
      var url = new URL(href, window.location.origin + window.location.pathname);
      var target = url.pathname.replace(/index\.html$/, '').replace(/\/$/, '');
      if (target && target === path) {
        a.classList.add('is-active');
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  /* =======================================================================
     16. COPY-TO-CLIPBOARD
     ======================================================================= */
  function initCopy() {
    $$('[data-copy]').forEach(function (btn) {
      on(btn, 'click', function () {
        var text = btn.dataset.copy;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(function () { toast('Copied: ' + text); });
        }
      });
    });
  }

  /* =======================================================================
     BOOT
     ======================================================================= */
  function boot() {
    docEl.classList.remove('no-js');
    try { initScroll(); } catch (e) {}
    try { initDrawer(); } catch (e) {}
    try { initReveal(); } catch (e) {}
    try { initCounters(); } catch (e) {}
    try { initAccordion(); } catch (e) {}
    try { initTabs(); } catch (e) {}
    try { initFilters(); } catch (e) {}
    try { initBeforeAfter(); } catch (e) {}
    try { initRails(); } catch (e) {}
    try { initCalculator(); } catch (e) {}
    try { initForms(); } catch (e) {}
    try { initToc(); } catch (e) {}
    try { initFacades(); } catch (e) {}
    try { initActiveNav(); } catch (e) {}
    try { initCopy(); } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
