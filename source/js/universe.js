/* Site interactions; the actual game engine lives in vendor/super-mona. */
(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const home = $('.universe-home');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const cleanPath = path => decodeURI(path).replace(/index\.html$/, '').replace(/\/$/, '');
  $$('#nav .menus_items a').forEach(link => {
    if (cleanPath(new URL(link.href).pathname) === cleanPath(location.pathname)) link.setAttribute('aria-current', 'page');
  });
  const navigation = $('#nav');
  if (navigation) {
    const reserveNavigationSpace = () => document.documentElement.style.setProperty('--site-nav-height', `${navigation.getBoundingClientRect().height}px`);
    new ResizeObserver(reserveNavigationSpace).observe(navigation); reserveNavigationSpace();
  }
  const tagSearch = $('#tag-search');
  if (tagSearch) {
    const tags = $$('.tag-chip'), count = $('#tag-result-count'), sort = $('#tag-sort');
    const updateTags = () => {
      const query = tagSearch.value.trim().toLocaleLowerCase();
      tags.forEach(tag => { tag.hidden = !tag.dataset.name.toLocaleLowerCase().includes(query); });
      count.textContent = `${tags.filter(tag => !tag.hidden).length} 个标签`;
      $('#tag-empty').hidden = tags.some(tag => !tag.hidden);
    };
    tagSearch.addEventListener('input', updateTags);
    sort.addEventListener('change', () => {
      tags.sort((a,b) => sort.value === 'name' ? a.dataset.name.localeCompare(b.dataset.name,'zh-CN') : Number(b.dataset.count) - Number(a.dataset.count));
      tags.forEach(tag => $('.tag-library').append(tag));
    });
  }
  const post = $('#post');
  if (post) {
    const progress = $('.reading-progress'), article = $('#article-container');
    let scheduled = false;
    const update = () => {
      scheduled = false;
      const bounds = article.getBoundingClientRect(), distance = Math.max(1, article.offsetHeight - innerHeight * .5);
      const value = Math.max(0,Math.min(1,-bounds.top / distance));
      if (progress) progress.style.transform = `scaleX(${value})`;
      const number = $('#reading-percent'); if (number) number.textContent = `${Math.round(value*100)}%`;
    };
    window.addEventListener('scroll', () => { if (!scheduled) { scheduled=true; requestAnimationFrame(update); } }, {passive:true});
    update();
    const mobileToc = $('.mobile-toc');
    const navigateSection = event => {
      const link = event.target.closest('.toc-link');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      let target;
      try { target = document.getElementById(decodeURIComponent(href.slice(1))); } catch (_) { return; }
      if (!target) return;
      event.preventDefault(); event.stopPropagation();
      if (mobileToc) mobileToc.open = false;
      history.pushState(null, '', href);
      requestAnimationFrame(() => target.scrollIntoView({block:'start', behavior:motion.matches ? 'auto' : 'smooth'}));
    };
    post.addEventListener('click', navigateSection, true);
    const rail = $('.reading-rail'); if (rail) rail.addEventListener('click', navigateSection, true);
  }
  if (!home) return;
  const introCopy = $('#intro-description'), introLink = $('#intro-link');
  const introTabs = $$('[data-intro]');
  introTabs.forEach((button, index) => {
    button.id = `intro-tab-${index}`; button.setAttribute('aria-controls','intro-description');
    button.tabIndex = index === 0 ? 0 : -1;
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? introTabs.length-1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + introTabs.length) % introTabs.length;
      introTabs[next].focus(); introTabs[next].click();
    });
    button.addEventListener('click', () => {
    $$('[data-intro]').forEach(item => { item.setAttribute('aria-selected', String(item === button)); item.classList.toggle('is-active',item === button); item.tabIndex = item === button ? 0 : -1; });
    introCopy.textContent = button.dataset.description; introLink.href = button.dataset.href; introLink.textContent = button.dataset.linkText + ' ↗';
    introCopy.setAttribute('aria-labelledby',button.id);
    });
  });
  introCopy.setAttribute('aria-labelledby','intro-tab-0');

  const filters = $('.topic-filters'), entries = $$('.notebook-entry');
  filters.hidden = false;
  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-topic]');
    if (!button) return;
    let count = 0;
    entries.forEach(entry => {
      entry.hidden = button.dataset.topic !== 'all' && !JSON.parse(entry.dataset.topics).includes(button.dataset.topic);
      count += Number(!entry.hidden);
    });
    filters.querySelectorAll('button').forEach(item => {
      item.classList.toggle('is-active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    $('.notebook-count').textContent = `${count} 篇记录`;
    $('.filter-empty').hidden = count > 0;
  });

  const panel = $('.playground'), canvas = $('#orbit-canvas'), toggle = $('#game-toggle');
  const pauseButton = $('.game-pause'), soundButton = $('.game-sound');
  const status = $('.game-status'), hud = $('.game-hud'), result = $('.game-result'), touch = $('.game-touch');
  const pauseOverlay = document.createElement('div');
  pauseOverlay.className = 'game-paused-label'; pauseOverlay.hidden = true;
  pauseOverlay.innerHTML = '暂停一下。<small>点击「继续」回到游戏</small>';
  panel.append(pauseOverlay);
  let engine = null, loading = null, running = false, paused = false, busy = false, ended = false;
  let visible = false, frame = 0, state = null, best = 0, activeTouches = new Set();
  const bestKey = 'cheng-blog:super-mona:best';
  const codes = new Set(['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD', 'Space']);
  try { const saved = Number(localStorage.getItem(bestKey)); if (Number.isSafeInteger(saved) && saved >= 0) best = saved; } catch (_) { /* Optional storage. */ }
  function engineResize() {
    if (!engine) return;
    const columns = running ? 94 : (innerWidth <= 767 ? 67 : 94);
    // Match the camera aspect ratio instead of stretching the sprites.
    const desiredHeight = panel.clientWidth * 26 / columns;
    if (running) panel.style.aspectRatio = '94 / 26'; else panel.style.aspectRatio = '';
    engine.resize(running ? 1280 : innerWidth <= 767 ? 767 : 1280);
    engine.renderer.setClearColor(0xeef0f6, 1);
    engine.renderer.setSize(panel.clientWidth, panel.clientHeight, false);
    engine.firstScene.resize(panel.clientWidth, panel.clientHeight, innerWidth <= 767 ? 767 : 1280);
    engine.firstScene.monaGroup.position.y = -.015;
    engine.firstScene.monaGroup.scale.setScalar(innerWidth <= 767 ? .105 : .085);
    if (!running && motion.matches) engine.firstScene.openingTimeline.progress(1);
    if (running && engine.game) {
      const actualHeight = panel.clientHeight;
      engine.renderer.setSize(panel.clientWidth, actualHeight, false);
      engine.camera.top = actualHeight / 2; engine.camera.bottom = -actualHeight / 2;
      engine.camera.updateProjectionMatrix();
      engine.game.group.position.y = -(actualHeight - desiredHeight) / 2;
    }
    engine.render();
  }
  function requestFrame() { if (!frame && visible && !document.hidden && engine) frame = requestAnimationFrame(tick); }
  function tick() {
    frame = 0;
    if (!engine || !visible || document.hidden) return;
    if (paused) { engine.clock.getDelta(); return; }
    else if (!motion.matches || running || busy) engine.update(true, true);
    requestFrame();
  }
  function onState(next) {
    state = next;
    $('.game-score').textContent = `得分 ${next.score}`;
    $('.game-lives').textContent = `生命 ${next.lives} / 3`;
    $('.game-power').textContent = next.superSeconds ? `强化 ${next.superSeconds}s · 双倍得分` : '';
    if (!next.gameOverScreenVisible || ended) return;
    ended = true; busy = false; paused = false; pauseOverlay.hidden = true;
    best = Math.max(best, next.score);
    try { localStorage.setItem(bestKey, String(best)); } catch (_) { /* Memory fallback. */ }
    const label = document.createElement('span'), score = document.createElement('strong'), record = document.createElement('small');
    label.textContent = 'YOUR SCORE'; score.textContent = String(next.score); record.textContent = `BEST ${best}`;
    $('.game-final-score').replaceChildren(label, score, record);
    result.style.setProperty('--board-offset', String(next.gameOverScoreBoardOffsetX));
    // Put the score inside the engine's own scoreboard, preserving its game-over art.
    result.hidden = false; hud.hidden = true; pauseButton.hidden = true; touch.hidden = true;
    $('.game-restart').hidden = false;
    $('.game-restart').focus({preventScroll: true}); toggle.disabled = false;
  }
  function updateSound() {
    const muted = window.ChengSuperMona.audio.isMuted();
    soundButton.textContent = muted ? '音效：关' : '音效：开';
    soundButton.setAttribute('aria-pressed', String(!muted));
    soundButton.setAttribute('aria-label', muted ? '开启游戏音效' : '关闭游戏音效');
  }
  function loadEngine() {
    if (loading) return loading;
    loading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/yc0203/vendor/super-mona/beagle-model.js?v=20261026c';
      script.onload = () => {
        const engineScript = document.createElement('script'); engineScript.src = '/yc0203/vendor/super-mona/engine.js?v=20261026c';
        engineScript.onload = resolve; engineScript.onerror = () => reject(new Error('游戏资源加载失败')); document.head.append(engineScript);
      };
      script.onerror = () => reject(new Error('比格犬模型加载失败'));
      document.head.append(script);
    }).then(() => {
      engine = new window.ChengSuperMona.Engine({wrapper: panel, canvas, onStateChange: onState});
      window.ChengSuperMona.audio.setMuted(true); updateSound();
      engineResize();
      new ResizeObserver(engineResize).observe(panel);
      toggle.hidden = false; soundButton.hidden = false;
      status.textContent = best ? `最佳 ${best} · ← → 移动 · 空格二段跳` : '← → 移动 · 空格二段跳';
      requestFrame(); return engine;
    }).catch(error => {
      status.textContent = `${error.message}，刷新后重试`;
      toggle.hidden = false; toggle.disabled = true;
      return null;
    });
    return loading;
  }
  function clearKeys() { if (engine?.game) engine.game.keys.clear(); activeTouches.clear(); }
  function setPaused(value) {
    if (!engine || !running || ended || busy) return;
    paused = value; clearKeys(); pauseOverlay.hidden = !value;
    pauseButton.textContent = value ? '继续' : '暂停';
    status.textContent = value ? '已暂停 · 随时继续' : '← → 移动 · 空格二段跳 · Esc 退出';
    engine.clock.getDelta();
    if (value) { window.ChengSuperMona.animations.globalTimeline.pause(); engine.render(); }
    else { window.ChengSuperMona.animations.globalTimeline.resume(); requestFrame(); }
  }
  function ready() {
    busy = false; toggle.disabled = false; pauseButton.hidden = false; touch.hidden = false;
    pauseButton.textContent = '暂停'; toggle.textContent = '退出游戏';
    status.textContent = '← → 移动 · 空格二段跳 · Esc 退出';
    engineResize();
    if (visible && !document.hidden) canvas.focus({preventScroll: true});
    else setPaused(true);
  }
  function start(restart = false) {
    if (!engine || busy) return;
    if (paused) { paused = false; window.ChengSuperMona.animations.globalTimeline.resume(); }
    ended = false; busy = true; result.hidden = true; pauseOverlay.hidden = true; $('.game-restart').hidden = true;
    panel.classList.add('is-playing');
    toggle.disabled = true; toggle.textContent = '正在进入…';
    const accepted = restart ? engine.restartGame(ready) : engine.startGame(ready);
    if (!accepted) { busy = false; toggle.disabled = false; return; }
    running = true; toggle.setAttribute('aria-pressed', 'true'); hud.hidden = false;
    canvas.setAttribute('aria-label', '比格犬探索游戏。左右方向键或 A D 移动，空格二段跳，踩怪兽、撞方块、收集符号；彩色强化可获得双倍分数。Escape 退出。');
    engineResize(); requestFrame();
  }
  function exit() {
    if (!engine || busy) return;
    if (paused) { paused = false; window.ChengSuperMona.animations.globalTimeline.resume(); }
    busy = true; clearKeys(); toggle.disabled = true; toggle.textContent = '正在返回…';
    pauseOverlay.hidden = true; result.hidden = true; $('.game-restart').hidden = true;
    engine.stopGame(() => {
      running = false; ended = false; busy = false; panel.classList.remove('is-playing');
      toggle.disabled = false; toggle.textContent = '玩一下 ↗'; toggle.setAttribute('aria-pressed', 'false');
      hud.hidden = true; pauseButton.hidden = true; touch.hidden = true;
      status.textContent = best ? `最佳 ${best} · 再来一局？` : '← → 移动 · 空格二段跳';
      canvas.setAttribute('aria-label', '会跟随鼠标摇尾巴的三维比格犬，点击下方开始游戏');
      engineResize(); toggle.focus({preventScroll: true});
    });
    requestFrame();
  }
  toggle.addEventListener('click', () => running ? exit() : start());
  $('.game-restart').addEventListener('click', () => start(true));
  pauseButton.addEventListener('click', () => { setPaused(!paused); if (!paused) canvas.focus({preventScroll: true}); });
  soundButton.addEventListener('click', () => {
    if (!engine) return; window.ChengSuperMona.audio.ensureContext(); window.ChengSuperMona.audio.toggleMuted(); updateSound();
    if (running && !paused && !busy && !ended) canvas.focus({preventScroll: true});
  });
  canvas.addEventListener('keydown', event => {
    if (!running || busy || ended) return;
    if (event.code === 'Escape') { event.preventDefault(); exit(); return; }
    if (!codes.has(event.code)) return;
    event.preventDefault(); if (!paused) engine.game?.handleKeyDown(event);
  });
  canvas.addEventListener('keyup', event => { if (codes.has(event.code)) engine?.game?.handleKeyUp(event); });
  canvas.addEventListener('blur', event => {
    const next = event.relatedTarget;
    if (!next || !(panel.contains(next) || $('.game-controls').contains(next))) setPaused(true);
    if (engine?.game) engine.game.keys.clear();
  });
  document.querySelectorAll('[data-key]').forEach(button => {
    button.addEventListener('pointerdown', event => {
      if (!running || busy || ended || !engine?.game) return;
      event.preventDefault(); if (paused) setPaused(false);
      button.setPointerCapture(event.pointerId); activeTouches.add(button.dataset.key);
      engine.game.handleKeyDown({code: button.dataset.key, preventDefault() {}});
    });
    const release = () => { activeTouches.delete(button.dataset.key); engine?.game?.handleKeyUp({code:button.dataset.key}); };
    button.addEventListener('pointerup', release); button.addEventListener('pointercancel', release); button.addEventListener('lostpointercapture', release);
    button.addEventListener('click', event => {
      if (event.detail !== 0 || !running || busy || ended || !engine?.game) return;
      if (paused) setPaused(false);
      engine.game.handleKeyDown({code:button.dataset.key,preventDefault(){}}); engine.game.handleKeyUp({code:button.dataset.key});
    });
  });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) { loadEngine(); requestFrame(); }
    else { if (running && !busy) setPaused(true); if (frame) cancelAnimationFrame(frame); frame = 0; }
  }).observe(panel);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { setPaused(true); if (frame) cancelAnimationFrame(frame); frame = 0; } else requestFrame(); });
  window.addEventListener('blur', () => setPaused(true));
  window.addEventListener('pageshow', requestFrame);

  // Original six-color palette, snapped to the same grid as the scene.
  const trail = document.createElement('canvas'); trail.className = 'pixel-trail'; trail.setAttribute('aria-hidden', 'true'); home.append(trail);
  const ctx = trail.getContext('2d'); if (!ctx) return;
  const palette = ['#5fed83','#bba00a','#ae85ff','#f73678','#c05200','#583af7'];
  const symbols = ['-','/',')','.','+','=','>','<','*','&','('];
  let particles = [], trailFrame = 0, cellKey = '', colorIndex = 0;
  function resizeTrail() {
    const ratio = Math.min(devicePixelRatio || 1, 2); trail.width = Math.round(innerWidth * ratio); trail.height = Math.round(innerHeight * ratio);
    trail.style.width = `${innerWidth}px`; trail.style.height = `${innerHeight}px`; ctx.setTransform(ratio,0,0,ratio,0,0);
  }
  function paintTrail(now) {
    trailFrame = 0; ctx.clearRect(0,0,innerWidth,innerHeight); particles = particles.filter(p => now - p.time < p.life);
    particles.forEach(p => {
      ctx.globalAlpha = Math.min(1,(1-(now-p.time)/p.life)*3); ctx.fillStyle=p.color; ctx.fillRect(p.x,p.y,p.size,p.size);
      ctx.fillStyle='#fff'; ctx.font=`${p.size*.5}px Consolas,monospace`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(p.char,p.x+p.size/2,p.y+p.size/2);
    }); ctx.globalAlpha=1; if(particles.length)trailFrame=requestAnimationFrame(paintTrail);
  }
  home.addEventListener('pointermove', event => {
    if(motion.matches||running||event.pointerType==='touch'||event.target.closest('a,button')||!event.target.closest('.home-hero'))return;
    const rect=panel.getBoundingClientRect(), size=rect.width/(innerWidth<=767?67:94);
    const x=rect.left+Math.floor((event.clientX-rect.left)/size)*size, y=rect.top+Math.floor((event.clientY-rect.top)/size)*size;
    const next=`${x}/${y}`;if(next===cellKey)return;cellKey=next;
    particles.push({x,y,size,time:performance.now(),life:100+Math.random()*300,color:palette[colorIndex++%palette.length],char:symbols[Math.floor(Math.random()*symbols.length)]});
    if(particles.length>40)particles.shift();if(!trailFrame)trailFrame=requestAnimationFrame(paintTrail);
  });
  function clearTrail(){particles=[];if(trailFrame)cancelAnimationFrame(trailFrame);trailFrame=0;ctx.clearRect(0,0,innerWidth,innerHeight);}
  motion.addEventListener('change',clearTrail);document.addEventListener('visibilitychange',()=>{if(document.hidden)clearTrail();});
  window.addEventListener('resize',resizeTrail,{passive:true});resizeTrail();
})();
