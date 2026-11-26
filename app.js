(function () {
  'use strict';
  var P = window.PROJECTS || [], C = window.CATEGORIES || [];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); };

  $('#year').textContent = new Date().getFullYear();
  $('#count').textContent = P.length;

  /* ---------- Heure de Cotonou ---------- */
  function tick() {
    var t;
    try { t = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Porto-Novo' }).format(new Date()); }
    catch (e) { t = ''; }
    $$('.clock').forEach(function (el) { el.textContent = t + ' GMT+1'; });
  }
  tick(); setInterval(tick, 30000);

  /* ---------- Écran d'ouverture ---------- */
  var loader = $('#loader'), lv = $('#loaderVideo'), pct = $('#loaderPct'), opened = false;
  function open() {
    if (opened) return; opened = true;
    try { sessionStorage.setItem('lrn', '1'); } catch (e) {}
    pct.textContent = '100';
    loader.classList.add('out');
    document.body.classList.remove('is-loading');
    setTimeout(function () { document.body.classList.add('ready'); }, 250);
    setTimeout(function () { loader.classList.add('gone'); try { lv.pause(); } catch (e) {} }, 1100);
  }
  var seen = false; try { seen = sessionStorage.getItem('lrn') === '1'; } catch (e) {}
  if (seen || reduced) { loader.classList.add('gone'); document.body.classList.remove('is-loading'); document.body.classList.add('ready'); opened = true; }
  else {
    lv.addEventListener('timeupdate', function () {
      if (lv.duration) pct.textContent = ('00' + Math.min(100, Math.round(lv.currentTime / lv.duration * 100))).slice(-3);
    });
    lv.addEventListener('ended', function () { setTimeout(open, 350); });
    var pr = lv.play(); if (pr && pr.catch) pr.catch(function () { setTimeout(open, 900); });
    setTimeout(open, 8000);
    loader.addEventListener('click', open);
  }

  /* ---------- Curseur ---------- */
  var cur = $('#cursor'), curLabel = $('#cursorLabel');
  if (finePointer && !reduced) {
    document.body.classList.add('has-cursor');
    var mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
    (function loop() { cx += (mx - cx) * .2; cy += (my - cy) * .2; cur.style.transform = 'translate(' + cx + 'px,' + cy + 'px)'; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', function (e) {
      var play = e.target.closest('[data-cursor="play"]');
      var link = e.target.closest('a,button');
      cur.classList.toggle('is-play', !!play);
      cur.classList.toggle('is-link', !play && !!link);
    });
  } else { cur.style.display = 'none'; }

  /* ---------- En-tête ---------- */
  var top = $('#top'), lastY = 0;
  addEventListener('scroll', function () {
    var y = scrollY;
    top.classList.toggle('solid', y > innerHeight * .8);
    top.classList.toggle('hide', y > lastY && y > innerHeight);
    lastY = y;
  }, { passive: true });

  /* ---------- Manifeste : les mots s'allument au défilement ---------- */
  var st = $('#statement'), words = [];
  (function split(node) {
    Array.prototype.slice.call(node.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s); words.push(s);
        });
        n.parentNode.replaceChild(frag, n);
      }
    });
  })(st);
  function lightWords() {
    var r = st.getBoundingClientRect();
    var p = (innerHeight * .85 - r.top) / (r.height + innerHeight * .35);
    var k = Math.round(Math.max(0, Math.min(1, p)) * words.length);
    words.forEach(function (w, i) { w.classList.toggle('on', i < k); });
  }
  if (reduced) words.forEach(function (w) { w.classList.add('on'); });
  else { addEventListener('scroll', lightWords, { passive: true }); lightWords(); }

  /* ---------- Apparitions ---------- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach(function (el) { io.observe(el); });

  /* ---------- Compteurs ---------- */
  var cio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return; cio.unobserve(e.target);
      var el = e.target, to = +el.dataset.to, t0 = performance.now();
      (function step(t) { var k = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); })(t0);
    });
  }, { threshold: .6 });
  $$('.num').forEach(function (el) { cio.observe(el); });

  /* ---------- Projets ---------- */
  var grid = $('#grid'), list = $('#list'), filters = $('#filters');
  var current = 'all', view = 'grid', shown = P.slice();

  C.forEach(function (c) {
    var n = c.id === 'all' ? P.length : P.filter(function (p) { return p.cat === c.id; }).length;
    if (!n) return;
    var b = document.createElement('button');
    b.type = 'button'; b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', c.id === current);
    b.innerHTML = esc(c.label) + '<sup>' + n + '</sup>';
    b.onclick = function () {
      current = c.id;
      $$('button', filters).forEach(function (x) { x.setAttribute('aria-selected', x === b); });
      render();
    };
    filters.appendChild(b);
  });
  $$('.views button').forEach(function (b) {
    b.onclick = function () {
      view = b.dataset.view;
      $$('.views button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      render();
    };
  });

  // Lecture des aperçus : au survol (souris) ou quand la carte est visible (tactile)
  function startPreview(card) {
    var v = $('video', card);
    if (!v.src) { v.src = v.dataset.src; }
    var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
    card.classList.add('playing');
  }
  function stopPreview(card) { var v = $('video', card); v.pause(); card.classList.remove('playing'); }
  var vio = new IntersectionObserver(function (es) {
    es.forEach(function (e) { e.intersectionRatio > .6 ? startPreview(e.target) : stopPreview(e.target); });
  }, { threshold: [0, .6] });

  function cardHTML(p, i) {
    return '<div class="thumb">' +
      '<img loading="lazy" src="' + p.id + '.jpg" alt="' + esc(p.title) + '">' +
      '<video muted loop playsinline preload="none" data-src="' + p.id + '-preview.mp4"></video></div>' +
      '<div class="card-meta"><span class="n">' + pad(i + 1) + '</span><h3>' + esc(p.title) + '</h3>' +
      '<p class="mono"><span>' + esc(p.client) + '</span><span>' + p.format + '</span><span>' + p.duration + '</span></p></div>';
  }

  function layoutGrid() {
    grid.innerHTML = '';
    var g = getComputedStyle(grid).columnGap; grid.style.setProperty('--g', g);
    shown.forEach(function (p, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'card' + (p.format === '16:9' ? ' is-wide' : '');
      b.setAttribute('data-cursor', 'play');
      b.setAttribute('aria-label', 'Lire : ' + p.title);
      b.innerHTML = cardHTML(p, i);
      b.onclick = function () { openPlayer(i); };
      if (finePointer) {
        b.onmouseenter = function () { startPreview(b); };
        b.onmouseleave = function () { stopPreview(b); };
      } else { vio.observe(b); }
      b.style.transitionDelay = (i % 4) * 70 + 'ms';
      grid.appendChild(b);
      io.observe(b);
    });
    var cta = document.createElement('a');
    cta.href = '#contact'; cta.className = 'card card-cta';
    cta.innerHTML = '<div class="thumb"><div class="cta-in"><span class="mono">' + pad(shown.length + 1) + '</span>' +
      '<strong>Votre projet ici</strong><span class="mono">Parlons-en →</span></div></div>';
    grid.appendChild(cta); io.observe(cta);
  }

  var fp = $('#floatPreview'), fpv = $('video', fp);
  function layoutList() {
    list.innerHTML = '';
    shown.forEach(function (p, i) {
      var li = document.createElement('li');
      li.innerHTML = '<button type="button" class="row" data-cursor="play"><span class="mono">' + pad(i + 1) + '</span><h3>' + esc(p.title) + '</h3>' +
        '<span class="mono c-client">' + esc(p.client) + '</span><span class="mono c-cat">' + esc(catLabel(p.cat)) + '</span><span class="mono">' + p.duration + '</span></button>';
      var row = $('button', li);
      row.onclick = function () { fp.classList.remove('on'); openPlayer(i); };
      if (finePointer) {
        row.onmouseenter = function () {
          fp.classList.toggle('wide', p.format === '16:9');
          fpv.src = p.id + '-preview.mp4'; var pr = fpv.play(); if (pr && pr.catch) pr.catch(function () {});
          fp.classList.add('on');
        };
        row.onmouseleave = function () { fp.classList.remove('on'); fpv.pause(); };
      }
      list.appendChild(li);
    });
  }
  if (finePointer) {
    var fx = 0, fy = 0, tx = 0, ty = 0;
    addEventListener('mousemove', function (e) { tx = e.clientX + 24; ty = e.clientY - fp.offsetHeight / 2; });
    (function loop() { fx += (tx - fx) * .12; fy += (ty - fy) * .12; fp.style.transform = 'translate(' + fx + 'px,' + fy + 'px)' + (fp.classList.contains('on') ? '' : ' scale(.7)'); requestAnimationFrame(loop); })();
  }
  function catLabel(id) { for (var i = 0; i < C.length; i++) if (C[i].id === id) return C[i].label; return ''; }

  function render() {
    shown = P.filter(function (p) { return current === 'all' || p.cat === current; });
    grid.hidden = view !== 'grid'; list.hidden = view !== 'list';
    if (view === 'grid') layoutGrid(); else layoutList();
  }
  render();
  addEventListener('resize', function () { grid.style.setProperty('--g', getComputedStyle(grid).columnGap); });

  /* ---------- Lecteur ---------- */
  var player = $('#player'), pv = $('#pVideo'), idx = 0, lastFocus = null;
  function fill() {
    var p = shown[idx];
    pv.poster = p.id + '.jpg'; pv.src = p.id + '.mp4';
    $('#pIndex').textContent = pad(idx + 1) + ' / ' + pad(shown.length);
    $('#pClient').textContent = p.client;
    $('#pTitle').textContent = p.title;
    $('#pDesc').textContent = p.desc;
    $('#pFormat').textContent = p.format === '16:9' ? '16:9 large' : '9:16 vertical';
    $('#pDur').textContent = p.duration;
    $('#pYear').textContent = p.year;
    var pr = pv.play(); if (pr && pr.catch) pr.catch(function () {});
  }
  function openPlayer(i) {
    idx = i; lastFocus = document.activeElement;
    player.hidden = false; document.body.style.overflow = 'hidden';
    $$('.card.playing').forEach(stopPreview);
    fill(); $('#pClose').focus();
  }
  function closePlayer() {
    pv.pause(); pv.removeAttribute('src'); pv.load();
    player.hidden = true; document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  function go(d) { idx = (idx + d + shown.length) % shown.length; fill(); }
  $('#pClose').onclick = closePlayer;
  $('#pPrev').onclick = function () { go(-1); };
  $('#pNext').onclick = function () { go(1); };
  $('#pCta').onclick = closePlayer;
  document.addEventListener('keydown', function (e) {
    if (player.hidden) return;
    if (e.key === 'Escape') closePlayer();
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  });

  $('#toTop').onclick = function (e) { e.preventDefault(); scrollTo({ top: 0, behavior: 'smooth' }); };
})();
