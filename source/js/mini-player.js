(function () {
  var playlist = [
    {
      title: 'Demo Song 1',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    {
      title: 'Demo Song 2',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
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

  function loadSong() {
    title.textContent = playlist[current].title;
    audio.src = playlist[current].url;
  }

  function playSong() {
    audio.play().catch(function () {});
    playBtn.textContent = '⏸';
  }

  function togglePlay() {
    if (audio.paused) {
      playSong();
    } else {
      audio.pause();
      playBtn.textContent = '▶';
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
