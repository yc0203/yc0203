(function () {
  var playlist = [
    {
      title: '雨爱 - 杨丞琳',
      url: '/yc0203/music/' + encodeURIComponent('杨丞琳 - 雨爱.mp3')
    },
    {
      title: '我不难过 - 孙燕姿',
      url: '/yc0203/music/' + encodeURIComponent('孙燕姿+-+我不难过.mp3')
    }
  ];

  var current = 0;
  var player = document.getElementById('mini-player');
  var audio = document.getElementById('mini-audio');
  var title = document.getElementById('mini-player-title');
  var playBtn = document.getElementById('mini-play');
  var prevBtn = document.getElementById('mini-prev');
  var nextBtn = document.getElementById('mini-next');

  if (!player || !audio || !title || !playBtn || !prevBtn || !nextBtn) return;

  var expand = document.createElement('button');
  expand.className = 'mini-expand';
  expand.type = 'button';
  expand.textContent = '音乐';
  expand.setAttribute('aria-label', '展开音乐播放器');
  expand.setAttribute('aria-expanded', 'false');
  expand.addEventListener('click', function () {
    var expanded = player.classList.toggle('is-expanded');
    expand.setAttribute('aria-expanded', String(expanded));
    expand.setAttribute('aria-label', expanded ? '收起音乐播放器' : '展开音乐播放器');
    expand.textContent = expanded ? '收起' : '音乐';
  });
  player.prepend(expand);

  function loadSong() {
    title.textContent = playlist[current].title;
    audio.src = playlist[current].url;
  }

  function updatePlayState(playing) {
    playBtn.textContent = playing ? 'Ⅱ' : '▶';
    playBtn.setAttribute('aria-label', playing ? '暂停' : '播放');
    playBtn.setAttribute('aria-pressed', String(playing));
  }

  function playSong() {
    var promise = audio.play();
    if (promise) {
      promise.then(function () {
        updatePlayState(true);
      }).catch(function () {
        updatePlayState(false);
      });
    } else {
      updatePlayState(true);
    }
  }

  function togglePlay() {
    if (audio.paused) {
      playSong();
    } else {
      audio.pause();
      updatePlayState(false);
    }
  }

  function nextSong() {
    current = (current + 1) % playlist.length;
    loadSong();
    playSong();
  }

  function prevSong() {
    current = (current - 1 + playlist.length) % playlist.length;
    loadSong();
    playSong();
  }

  audio.addEventListener('ended', nextSong);
  audio.addEventListener('error', function () {
    updatePlayState(false);
    title.textContent = '播放失败，请检查音乐链接';
  });
  playBtn.addEventListener('click', togglePlay);
  nextBtn.addEventListener('click', nextSong);
  prevBtn.addEventListener('click', prevSong);

  // 拖动播放器
  var isDragging = false;
  var startX = 0;
  var startY = 0;
  var initLeft = 0;
  var initTop = 0;

  player.addEventListener('pointerdown', function (e) {
    if (e.target.closest('button')) return;
    isDragging = true;
    player.setPointerCapture(e.pointerId);
    var rect = player.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    initLeft = rect.left;
    initTop = rect.top;
    player.style.cursor = 'grabbing';
    e.preventDefault();
  });

  player.addEventListener('pointermove', function (e) {
    if (!isDragging) return;
    var dx = e.clientX - startX;
    var dy = e.clientY - startY;
    var left = initLeft + dx;
    var top = initTop + dy;
    left = Math.max(0, Math.min(window.innerWidth - player.offsetWidth, left));
    top = Math.max(0, Math.min(window.innerHeight - player.offsetHeight, top));
    player.style.left = left + 'px';
    player.style.right = 'auto';
    player.style.top = top + 'px';
    player.style.bottom = 'auto';
  });

  function stopDrag() {
    isDragging = false;
    player.style.cursor = 'grab';
  }

  player.addEventListener('pointerup', stopDrag);
  player.addEventListener('pointercancel', stopDrag);

  loadSong();
})();
