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

    var update = rafThrottle(function () {
      var y = window.scrollY;
      var h = docEl.scrollHeight - window.innerHeight;

      if (navbar) navbar.classList.toggle('is-scrolled', y > 12);
      if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(y / h, 1) : 0) + ')';
      if (toTop) toTop.classList.toggle('is-visible', y > 700);
      if (dock) dock.classList.add('is-visible');
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

    /* The closed drawer is only pushed off-screen with translateX, so its
       links stayed in the tab order — keyboard users tabbed into an invisible
       menu. `inert` removes it from focus and the a11y tree in one step, and
       is also what makes aria-hidden legal here. */
    function setInert(isInert) {
      if ('inert' in drawer) drawer.inert = isInert;
      drawer.setAttribute('aria-hidden', String(isInert));
    }

    function open() {
      lastFocus = document.activeElement;
      setInert(false);
      drawer.classList.add('is-open');
      if (scrim) scrim.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('is-locked');
      var first = drawer.querySelector('a, button');
      if (first) setTimeout(function () { first.focus(); }, 120);
    }

    function close() {
      drawer.classList.remove('is-open');
      if (scrim) scrim.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-locked');
      /* Move focus out before making it inert, or the browser drops focus to
         <body> and the user loses their place. */
      if (lastFocus && lastFocus.focus) lastFocus.focus();
      setInert(true);
    }

    setInert(!drawer.classList.contains('is-open'));

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
     6. PORTFOLIO FILTER
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
     7. BEFORE / AFTER SLIDER
     ======================================================================= */
  function initBeforeAfter() {
    $$('.ba').forEach(function (ba) {
      var dragging = false;

      /* role="slider" promises aria-valuenow tracks the handle. It never did,
         so screen readers always announced "50". Every move goes through here
         now, keeping the visual position and the announced value in step. */
      function apply(pct) {
        var v = Math.max(0, Math.min(100, pct));
        ba.style.setProperty('--pos', v + '%');
        ba.setAttribute('aria-valuenow', String(Math.round(v)));
        ba.setAttribute('aria-valuetext', Math.round(v) + '% of the "after" image shown');
      }
      function setPos(clientX) {
        var r = ba.getBoundingClientRect();
        if (!r.width) return;
        apply(((clientX - r.left) / r.width) * 100);
      }
      function current() { return parseFloat(ba.style.getPropertyValue('--pos')) || 50; }

      on(ba, 'pointerdown', function (e) {
        dragging = true;
        if (ba.setPointerCapture) { try { ba.setPointerCapture(e.pointerId); } catch (err) {} }
        setPos(e.clientX);
      });
      on(ba, 'pointermove', function (e) { if (dragging) setPos(e.clientX); });
      on(ba, 'pointerup', function () { dragging = false; });
      on(ba, 'pointercancel', function () { dragging = false; });

      on(ba, 'keydown', function (e) {
        var k = e.key, step = e.shiftKey ? 10 : 4;
        if (k === 'ArrowLeft' || k === 'ArrowDown') { apply(current() - step); e.preventDefault(); }
        else if (k === 'ArrowRight' || k === 'ArrowUp') { apply(current() + step); e.preventDefault(); }
        else if (k === 'Home') { apply(0); e.preventDefault(); }
        else if (k === 'End') { apply(100); e.preventDefault(); }
      });
    });
  }

  /* =======================================================================
     8. CAROUSEL RAILS — arrow buttons
     ======================================================================= */
  function initRails() {
    $$('[data-rail]').forEach(function (wrap) {
      /* data-rail is usually valueless, and querySelector('') throws a
         SyntaxError — which used to abort this whole loop and leave every
         carousel arrow on the site dead. Only treat it as a selector when
         it actually holds one. */
      var rail = $('.rail', wrap);
      if (!rail && wrap.dataset.rail) {
        try { rail = $(wrap.dataset.rail); } catch (e) { rail = null; }
      }
      if (!rail) return;

      var prev = $('[data-rail-prev]', wrap);
      var next = $('[data-rail-next]', wrap);
      if (!prev && !next) return;

      /* Advance by one card, reading the real CSS gap instead of guessing. */
      function step() {
        var first = rail.firstElementChild;
        if (!first) return rail.clientWidth * 0.9;
        var gap = parseFloat(getComputedStyle(rail).columnGap || getComputedStyle(rail).gap) || 20;
        return first.getBoundingClientRect().width + gap;
      }
      function sync() {
        var max = rail.scrollWidth - rail.clientWidth;
        /* Nothing to scroll: hide the arrows rather than show two dead buttons. */
        var scrollable = max > 8;
        if (prev) { prev.disabled = !scrollable || rail.scrollLeft < 8; }
        if (next) { next.disabled = !scrollable || rail.scrollLeft > max - 8; }
      }
      on(prev, 'click', function () { rail.scrollBy({ left: -step(), behavior: 'smooth' }); });
      on(next, 'click', function () { rail.scrollBy({ left: step(), behavior: 'smooth' }); });
      on(rail, 'scroll', rafThrottle(sync), { passive: true });
      on(window, 'resize', rafThrottle(sync), { passive: true });
      sync();
    });
  }

  /* =======================================================================
     9. FORMS — validation, submit states, WhatsApp fallback
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
     10. TOAST
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
     11. TABLE OF CONTENTS — scroll spy
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
     12. LAZY-LOAD YOUTUBE / MAP FACADES
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
     13. ACTIVE NAV STATE (based on current path)
     ======================================================================= */
  function initActiveNav() {
    var norm = function (p) { return p.replace(/index\.html$/, '').replace(/\/+$/, ''); };
    var path = norm(window.location.pathname);
    var origin = window.location.origin + window.location.pathname;

    /* Exact match = this page (aria-current). Ancestor match = the section
       this page lives in, highlighted visually but NOT announced as current,
       so a 2 BHK page still shows "Home Interiors" as the active section. */
    $$('.nav-link[href], .drawer-link[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;
      var target;
      try { target = norm(new URL(href, origin).pathname); } catch (e) { return; }
      if (!target) return;

      if (target === path) {
        a.classList.add('is-active');
        a.setAttribute('aria-current', 'page');
      } else if (path.indexOf(target + '/') === 0) {
        a.classList.add('is-active');
      }
    });

    /* On the home page nothing in the menu matches, so mark the logo instead —
       otherwise the page has no aria-current anywhere for screen readers. */
    var brand = $('.brand[href]');
    if (brand) {
      var bTarget;
      try { bTarget = norm(new URL(brand.getAttribute('href'), origin).pathname); } catch (e) { bTarget = null; }
      if (bTarget !== null && bTarget === path) brand.setAttribute('aria-current', 'page');
    }
  }

  /* =======================================================================
     14. HERO — video loader + walkthrough
     The <video> (when real footage is configured) is only fetched after the
     poster has painted and only on viewports wide enough to justify it, so
     the hero never blocks first paint and never burns mobile data.
     ======================================================================= */
  function initHero() {
    var vid = $('[data-hero-video]');
    if (vid) {
      var min = parseInt(vid.dataset.minWidth || '768', 10);
      var conn = navigator.connection || {};
      var saveData = conn.saveData === true;
      var slow = /(^|-)2g$/.test(conn.effectiveType || '');

      if (!reduceMotion && !saveData && !slow && window.innerWidth >= min) {
        var load = function () {
          $$('source[data-src]', vid).forEach(function (s) {
            if (!s.src) s.src = s.dataset.src;
          });
          vid.load();
          var p = vid.play();
          /* Autoplay can still be refused; the poster simply stays put. */
          if (p && p.catch) p.catch(function () {});
          vid.classList.add('is-playing');
        };
        if ('requestIdleCallback' in window) requestIdleCallback(load, { timeout: 2200 });
        else setTimeout(load, 900);
      }
    }

    /* Placeholder walkthrough — advance the cross-fade on a timer. */
    var walk = $('[data-hero-walk]');
    if (walk) {
      var frames = $$('.hero-frame', walk);
      if (frames.length > 1 && !reduceMotion) {
        var idx = 0;
        var timer = setInterval(function () {
          /* Pause while the tab is hidden — no wasted paints. */
          if (document.hidden) return;
          frames[idx].classList.remove('is-active');
          idx = (idx + 1) % frames.length;
          frames[idx].classList.add('is-active');
        }, 4200);
        on(window, 'pagehide', function () { clearInterval(timer); });
      }
    }
  }

  /* =======================================================================
     15. CONSULTATION MODAL
     Every "Get free consultation" control on the site opens this.
     ======================================================================= */
  function initConsult() {
    var modal = $('#consultModal');
    var scrim = $('#consultScrim');
    if (!modal) return;
    var closeBtn = $('#consultClose');
    var lastFocus = null;

    function open(e) {
      if (e) e.preventDefault();
      lastFocus = document.activeElement;
      modal.hidden = false;
      if (scrim) scrim.hidden = false;
      /* Next frame so the transition actually runs from the hidden state. */
      requestAnimationFrame(function () {
        modal.classList.add('is-open');
        if (scrim) scrim.classList.add('is-open');
      });
      document.body.classList.add('is-locked');
      var first = modal.querySelector('input, select, textarea, button');
      if (first) setTimeout(function () { first.focus(); }, 140);
    }

    function close() {
      modal.classList.remove('is-open');
      if (scrim) scrim.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      setTimeout(function () {
        modal.hidden = true;
        if (scrim) scrim.hidden = true;
      }, 260);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    $$('[data-consult-open]').forEach(function (btn) { on(btn, 'click', open); });
    on(closeBtn, 'click', close);
    on(scrim, 'click', close);
    on(document, 'keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) close();
      if (e.key === 'Tab' && !modal.hidden) {
        var f = $$('a[href], button:not([disabled]), input, select, textarea', modal)
          .filter(function (el) { return el.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    window.nexoraOpenConsult = open;
  }

  /* =======================================================================
     16. GALLERY LIGHTBOX
     Walks through every room of one home package. Keyboard, swipe and
     thumbnail navigation, with the package id reflected in the URL hash.
     ======================================================================= */
  function initGallery() {
    var dataEl = $('#galleryData');
    var lb = $('#lightbox');
    if (!dataEl || !lb) return;

    var packages;
    try { packages = JSON.parse(dataEl.textContent); } catch (e) { return; }
    if (!packages || !packages.length) return;

    var byId = {};
    packages.forEach(function (p) { byId[p.id] = p; });

    var imgEl = $('#lbImg'), nameEl = $('#lbName'), roomEl = $('#lbRoom');
    var avifEl = $('#lbAvif'), webpEl = $('#lbWebp');
    var capEl = $('#lbCaption'), countEl = $('#lbCount'), thumbsEl = $('#lbThumbs');
    var current = null, index = 0, lastFocus = null;

    function render() {
      if (!current) return;
      var room = current.rooms[index];
      /* Update the <source> elements before the <img>, otherwise the browser
         may commit to the JPEG before the AVIF/WebP candidates are in place. */
      if (avifEl) avifEl.srcset = room.avif || '';
      if (webpEl) webpEl.srcset = room.srcset || '';
      imgEl.sizes = '92vw';
      imgEl.srcset = '';
      imgEl.src = room.src;
      imgEl.alt = room.alt;
      nameEl.textContent = current.name;
      roomEl.textContent = room.label;
      capEl.textContent = room.caption;
      countEl.textContent = (index + 1) + ' / ' + current.rooms.length;

      $$('.lb-thumb', thumbsEl).forEach(function (t, i) {
        var active = i === index;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });

      /* Preload the neighbours so arrowing through feels instant. Uses the
         same srcset the <picture> will pick from, so the warmed entry is the
         file actually rendered rather than a JPEG that gets discarded. */
      [index + 1, index - 1].forEach(function (i) {
        var r = current.rooms[(i + current.rooms.length) % current.rooms.length];
        if (!r) return;
        var pre = new Image();
        pre.sizes = '92vw';
        if (r.avif) pre.srcset = r.avif;
        else if (r.srcset) pre.srcset = r.srcset;
        pre.src = r.src;
      });
    }

    function buildThumbs() {
      thumbsEl.innerHTML = '';
      current.rooms.forEach(function (room, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'lb-thumb';
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-label', room.label);
        b.innerHTML = '<img src="' + room.thumb + '" alt="" width="120" height="80" loading="lazy" decoding="async">' +
          '<span>' + room.label + '</span>';
        b.addEventListener('click', function () { index = i; render(); });
        thumbsEl.appendChild(b);
      });
    }

    function open(id, startAt) {
      var pkg = byId[id];
      if (!pkg) return;
      current = pkg;
      index = startAt || 0;
      lastFocus = document.activeElement;
      buildThumbs();
      render();
      lb.hidden = false;
      requestAnimationFrame(function () { lb.classList.add('is-open'); });
      document.body.classList.add('is-locked');
      var c = $('#lbClose');
      if (c) setTimeout(function () { c.focus(); }, 120);
    }

    function close() {
      lb.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      setTimeout(function () { lb.hidden = true; }, 240);
      /* Drop the #package hash without adding a history entry. */
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      if (lastFocus && lastFocus.focus) lastFocus.focus();
      current = null;
    }

    function step(dir) {
      if (!current) return;
      index = (index + dir + current.rooms.length) % current.rooms.length;
      imgEl.classList.remove('is-swap');
      /* Restart the fade — reading offsetWidth forces the reflow. */
      void imgEl.offsetWidth;
      imgEl.classList.add('is-swap');
      render();
    }

    $$('[data-gallery-open]').forEach(function (el) {
      on(el, 'click', function (e) {
        e.preventDefault();
        open(el.getAttribute('data-gallery-open'));
      });
    });

    on($('#lbClose'), 'click', close);
    on($('#lbPrev'), 'click', function () { step(-1); });
    on($('#lbNext'), 'click', function () { step(1); });
    on(lb, 'click', function (e) { if (e.target === lb) close(); });

    on(document, 'keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    });

    /* Swipe on touch devices */
    var x0 = null, y0 = null;
    on(lb, 'touchstart', function (e) {
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });
    on(lb, 'touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      var dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 46 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
      x0 = y0 = null;
    }, { passive: true });

    /* Deep link: /gallery/#aurelia opens that package straight away. */
    var hash = (window.location.hash || '').replace('#', '');
    if (hash && byId[hash]) open(hash);
  }

  /* =======================================================================
     17. PARALLAX — subtle depth on decorated sections
     ======================================================================= */
  function initParallax() {
    var els = $$('[data-parallax]');
    if (!els.length || reduceMotion) return;

    var update = rafThrottle(function () {
      var vh = window.innerHeight;
      els.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -120 || r.top > vh + 120) return;
        var speed = parseFloat(el.dataset.parallax) || 0.12;
        var offset = (r.top + r.height / 2 - vh / 2) * -speed;
        el.style.setProperty('--py', offset.toFixed(1) + 'px');
      });
    });

    on(window, 'scroll', update, { passive: true });
    on(window, 'resize', update);
    update();
  }

  /* =======================================================================
     BOOT
     ======================================================================= */
  function boot() {
    docEl.classList.remove('no-js');
    docEl.classList.add('js');
    try { initScroll(); } catch (e) {}
    try { initDrawer(); } catch (e) {}
    try { initReveal(); } catch (e) {}
    try { initCounters(); } catch (e) {}
    try { initAccordion(); } catch (e) {}
    try { initFilters(); } catch (e) {}
    try { initBeforeAfter(); } catch (e) {}
    try { initRails(); } catch (e) {}
    try { initForms(); } catch (e) {}
    try { initToc(); } catch (e) {}
    try { initFacades(); } catch (e) {}
    try { initActiveNav(); } catch (e) {}
    try { initHero(); } catch (e) {}
    try { initConsult(); } catch (e) {}
    try { initGallery(); } catch (e) {}
    try { initParallax(); } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
