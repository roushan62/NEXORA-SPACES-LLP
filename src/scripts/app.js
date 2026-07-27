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

    /* The button is revealed on scroll, so it must actually go back to top. */
    on(toTop, 'click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      /* Return focus to the start of the document, not just the viewport,
         so keyboard and screen-reader users follow the same jump. */
      var target = $('#main') || document.body;
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.removeAttribute('tabindex');
    });

    on(window, 'scroll', update, { passive: true });
    /* The dock and progress bar must also settle correctly when the viewport
       changes size or the page is restored from the back/forward cache. */
    on(window, 'resize', update);
    on(window, 'pageshow', update);
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
      /* The rail is normally a .rail inside this wrapper. A non-empty
         data-rail value may point at one elsewhere — but an EMPTY value must
         never reach querySelector(), which throws on '' and would kill the
         rest of the boot sequence. */
      var sel = (wrap.getAttribute('data-rail') || '').trim();
      var rail = $('.rail', wrap);
      if (!rail && sel) { try { rail = $(sel); } catch (e) { rail = null; } }

      var prev = $('[data-rail-prev]', wrap);
      var next = $('[data-rail-next]', wrap);
      if (!prev && !next) return;

      /* Arrows with no rail to drive are dead controls — hide them rather
         than leave a button that visibly does nothing. */
      if (!rail) {
        [prev, next].forEach(function (b) { if (b) b.hidden = true; });
        return;
      }

      function step() {
        var first = rail.firstElementChild;
        var gap = parseFloat(getComputedStyle(rail).columnGap || getComputedStyle(rail).gap) || 20;
        return first ? first.getBoundingClientRect().width + gap : Math.round(rail.clientWidth * 0.8);
      }
      function sync() {
        var max = rail.scrollWidth - rail.clientWidth;
        /* Nothing to scroll → no reason to show the controls at all. */
        var scrollable = max > 8;
        [prev, next].forEach(function (b) { if (b) b.hidden = !scrollable; });
        if (prev) prev.disabled = rail.scrollLeft < 8;
        if (next) next.disabled = rail.scrollLeft > max - 8;
      }
      on(prev, 'click', function () { rail.scrollBy({ left: -step(), behavior: 'smooth' }); });
      on(next, 'click', function () { rail.scrollBy({ left: step(), behavior: 'smooth' }); });
      on(rail, 'scroll', rafThrottle(sync), { passive: true });
      on(window, 'resize', rafThrottle(sync));
      sync();
    });
  }

  /* =======================================================================
     11. FORMS — validation, submit states, WhatsApp fallback
     ======================================================================= */
  function initForms() {
    $$('form[data-lead-form]').forEach(function (form) {
      var submitBtn = form.querySelector('[type="submit"]');

      /* The consent control is a <label class="consent">, not a .field, so it
         has no .field-error slot. Create one on demand, otherwise refusing to
         submit an unticked consent box shows the user nothing at all. */
      function errorSlot(field) {
        var err = field.querySelector('.field-error');
        if (!err) {
          err = document.createElement('span');
          err.className = 'field-error';
          field.appendChild(err);
        }
        return err;
      }
      function holderOf(input) {
        return input.closest('.field') || input.closest('.consent') || input.parentElement;
      }
      function fieldError(input, msg) {
        var field = holderOf(input);
        field.classList.add('has-error');
        errorSlot(field).textContent = msg;
        input.setAttribute('aria-invalid', 'true');
      }
      function clearError(input) {
        var field = holderOf(input);
        field.classList.remove('has-error');
        input.removeAttribute('aria-invalid');
      }

      $$('input, select, textarea', form).forEach(function (input) {
        on(input, 'input', function () { clearError(input); });
        on(input, 'change', function () { if (input.type === 'checkbox' || input.tagName === 'SELECT') validate(input); });
        on(input, 'blur', function () { if (input.value.trim()) validate(input); });
      });

      function validate(input) {
        /* Checkboxes carry state in .checked — .value is always "on". */
        if (input.type === 'checkbox') {
          if (input.hasAttribute('required') && !input.checked) {
            fieldError(input, 'Please accept this to continue'); return false;
          }
          clearError(input);
          return true;
        }
        var v = (input.value || '').trim();
        if (input.hasAttribute('required') && !v) {
          fieldError(input, input.tagName === 'SELECT' ? 'Please choose an option' : 'This field is required');
          return false;
        }
        if (input.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v)) {
          fieldError(input, 'Enter a valid email address'); return false;
        }
        if (input.type === 'tel' && v) {
          var digits = v.replace(/\D/g, '');
          if (digits.length < 10 || digits.length > 13) { fieldError(input, 'Enter a valid 10-digit mobile number'); return false; }
        }
        clearError(input);
        return true;
      }

      on(form, 'submit', function (e) {
        e.preventDefault();
        var ok = true;
        $$('[required]', form).forEach(function (input) { if (!validate(input)) ok = false; });
        if (!ok) {
          /* .consent is a <label>, so include it — otherwise an unticked
             consent box blocks submit with no focus moved and no explanation. */
          var firstErr = form.querySelector(
            '.field.has-error input, .field.has-error select, .field.has-error textarea, .consent.has-error input'
          );
          if (firstErr) {
            firstErr.focus();
            if (firstErr.scrollIntoView) firstErr.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
          }
          return;
        }

        /* Honeypot — silently drop bots */
        var hp = form.querySelector('[name="_gotcha"]');
        if (hp && hp.value) return;

        var endpoint = form.getAttribute('action');
        var data = new FormData(form);
        /* Tell the backend which page the lead came from. */
        if (!data.has('page_url')) data.append('page_url', window.location.href);

        if (submitBtn) {
          submitBtn.classList.add('is-loading');
          submitBtn.disabled = true;
          var label = submitBtn.querySelector('.btn-text');
          if (label) { submitBtn.dataset.label = label.textContent; label.textContent = 'Sending…'; }
        }

        /* Paint server-side validation errors onto the matching fields. */
        function applyServerErrors(errors) {
          var focused = false;
          Object.keys(errors || {}).forEach(function (key) {
            var input = form.querySelector('[name="' + key + '"]');
            if (!input) return;
            fieldError(input, errors[key]);
            if (!focused) { input.focus(); focused = true; }
          });
          return focused;
        }

        function done(success, payload) {
          if (submitBtn) {
            submitBtn.classList.remove('is-loading');
            submitBtn.disabled = false;
            var l = submitBtn.querySelector('.btn-text');
            if (l && submitBtn.dataset.label) l.textContent = submitBtn.dataset.label;
          }
          if (success) {
            form.reset();
            /* Clear any lingering error state from a previous attempt. */
            $$('.has-error', form).forEach(function (el) { el.classList.remove('has-error'); });
            var to = form.dataset.success;
            if (to) { window.location.href = to; return; }
            toast((payload && payload.message) || 'Thank you! Our design team will call you within 2 working hours.');
          } else if (payload && payload.errors && applyServerErrors(payload.errors)) {
            /* The server rejected specific fields — show them rather than
               bouncing the user to WhatsApp for a fixable mistake. */
            toast(payload.error || 'Please check the highlighted fields.');
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

        /* Abort a stalled request rather than leaving the button spinning
           forever — after 15s we hand the user to WhatsApp instead. */
        var controller = window.AbortController ? new AbortController() : null;
        var timer = setTimeout(function () { if (controller) controller.abort(); }, 15000);

        fetch(endpoint, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
          signal: controller ? controller.signal : undefined,
        })
          .then(function (r) {
            clearTimeout(timer);
            /* Read the JSON body so field-level errors can be shown; a
               non-JSON response (proxy error page) is simply ignored. */
            return r.json().catch(function () { return null; })
              .then(function (payload) {
                var succeeded = r.ok && (!payload || payload.ok !== false);
                done(succeeded, payload);
              });
          })
          .catch(function () { clearTimeout(timer); done(false); });
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
     17. HERO — video loader + walkthrough
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
     18. CONSULTATION MODAL
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
     19. GALLERY LIGHTBOX
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
    var capEl = $('#lbCaption'), countEl = $('#lbCount'), thumbsEl = $('#lbThumbs');
    var current = null, index = 0, lastFocus = null;

    function render() {
      if (!current) return;
      var room = current.rooms[index];
      imgEl.src = room.src;
      imgEl.srcset = room.srcset || '';
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

      /* Preload the neighbours so arrowing through feels instant. */
      [index + 1, index - 1].forEach(function (i) {
        var r = current.rooms[(i + current.rooms.length) % current.rooms.length];
        if (r) { var pre = new Image(); pre.src = r.src; }
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
     20. PARALLAX — subtle depth on decorated sections
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
    try { initScroll(); } catch (e) {}
    try { initDrawer(); } catch (e) {}
    try { initReveal(); } catch (e) {}
    try { initCounters(); } catch (e) {}
    try { initAccordion(); } catch (e) {}
    try { initTabs(); } catch (e) {}
    try { initFilters(); } catch (e) {}
    try { initBeforeAfter(); } catch (e) {}
    try { initRails(); } catch (e) {}
    try { initForms(); } catch (e) {}
    try { initToc(); } catch (e) {}
    try { initFacades(); } catch (e) {}
    try { initActiveNav(); } catch (e) {}
    try { initCopy(); } catch (e) {}
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
