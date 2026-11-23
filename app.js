(function () {
  var projects = window.PROJECTS || [];
  var cats = window.CATEGORIES || [];
  var grid = document.getElementById('grid');
  var filters = document.getElementById('filters');
  var byId = {};
  projects.forEach(function (p) { byId[p.id] = p; });
  // La vidéo de présentation du hero
  document.getElementById('statCount').textContent = projects.length;
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Intro (animation du logo) ---------- */
  var intro = document.getElementById('intro');
  var iv = document.getElementById('introVideo');
  var seen = false;
  try { seen = sessionStorage.getItem('learneoIntro') === '1'; } catch (e) {}
  function endIntro() {
    if (intro.classList.contains('done')) return;
    intro.classList.add('done');
    document.body.classList.remove('intro-on');
    try { sessionStorage.setItem('learneoIntro', '1'); } catch (e) {}
    setTimeout(function () { try { iv.pause(); } catch (e) {} }, 800);
  }
  if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    intro.classList.add('done');
  } else {
    document.body.classList.add('intro-on');
    iv.addEventListener('ended', function () { setTimeout(endIntro, 700); });
    var p = iv.play();
    if (p && p.catch) p.catch(function () { setTimeout(endIntro, 1200); });
    setTimeout(endIntro, 9000); // sécurité si la vidéo ne se charge pas
  }
  document.getElementById('skipIntro').addEventListener('click', endIntro);

  /* ---------- Filtres ---------- */
  var current = 'all';
  cats.forEach(function (c) {
    var n = c.id === 'all' ? projects.length : projects.filter(function (p) { return p.cat === c.id; }).length;
    if (!n) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', c.id === current ? 'true' : 'false');
    b.innerHTML = c.label + '<span>' + n + '</span>';
    b.addEventListener('click', function () {
      current = c.id;
      Array.prototype.forEach.call(filters.children, function (x) { x.setAttribute('aria-selected', 'false'); });
      b.setAttribute('aria-selected', 'true');
      render();
    });
    filters.appendChild(b);
  });

  /* ---------- Grille ---------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); }
  function render() {
    grid.innerHTML = '';
    projects.filter(function (p) { return current === 'all' || p.cat === current; }).forEach(function (p, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'card' + (p.format === '16:9' ? ' wide' : '');
      b.style.animationDelay = (i * 40) + 'ms';
      b.innerHTML =
        '<div class="thumb"><img loading="lazy" src="assets/posters/' + p.id + '.jpg" alt="">' +
        '<div class="badges"><span>' + esc(p.format) + '</span><span>' + esc(p.duration) + '</span></div>' +
        '<span class="play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span></div>' +
        '<div class="card-body"><p class="client">' + esc(p.client) + '</p><h3>' + esc(p.title) + '</h3></div>';
      b.addEventListener('click', function () { openPlayer(p.id); });
      grid.appendChild(b);
    });
  }
  render();

  /* ---------- Lecteur ---------- */
  var player = document.getElementById('player');
  var box = player.querySelector('.player-box');
  var pv = document.getElementById('playerVideo');
  var lastFocus = null;
  function openPlayer(id) {
    var p = byId[id]; if (!p) return;
    lastFocus = document.activeElement;
    box.classList.toggle('wide', p.format === '16:9');
    pv.poster = 'assets/posters/' + p.id + '.jpg';
    pv.src = 'assets/videos/' + p.id + '.mp4';
    document.getElementById('pClient').textContent = p.client;
    document.getElementById('pTitle').textContent = p.title;
    document.getElementById('pDesc').textContent = p.desc;
    document.getElementById('pMeta').textContent = 'Format ' + p.format + ' · Durée ' + p.duration;
    player.hidden = false;
    document.body.style.overflow = 'hidden';
    var pr = pv.play(); if (pr && pr.catch) pr.catch(function () {});
    document.getElementById('closePlayer').focus();
  }
  function closePlayer() {
    pv.pause(); pv.removeAttribute('src'); pv.load();
    player.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  document.getElementById('closePlayer').addEventListener('click', closePlayer);
  player.addEventListener('click', function (e) { if (e.target === player) closePlayer(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !player.hidden) closePlayer(); });
  Array.prototype.forEach.call(document.querySelectorAll('[data-play]'), function (el) {
    el.addEventListener('click', function () { openPlayer(el.getAttribute('data-play')); });
  });
})();
