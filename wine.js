document.querySelectorAll('.wine-scene').forEach(scene => {
  const film = scene.querySelector('video');
  const toggle = scene.querySelector('.film-switch');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let allowPlayback = !motion.matches;
  let inView = false;

  function syncPlayback() {
    if (allowPlayback && inView && !document.hidden) {
      film.play().catch(() => {});
    } else {
      film.pause();
    }
  }

  function syncButton() {
    toggle.textContent = film.paused ? '▶' : 'Ⅱ';
    toggle.setAttribute('aria-label', film.paused ? '映像を再生' : '映像を一時停止');
  }

  if ('IntersectionObserver' in window) {
    film.controls = false;
    toggle.hidden = false;
    new IntersectionObserver(([entry]) => {
      inView = entry.intersectionRatio >= 0.15;
      syncPlayback();
    }, {threshold: [0, 0.15]}).observe(film);
    toggle.addEventListener('click', () => {
      allowPlayback = film.paused;
      syncPlayback();
    });
    film.addEventListener('play', syncButton);
    film.addEventListener('pause', syncButton);
    document.addEventListener('visibilitychange', syncPlayback);
    motion.addEventListener('change', () => {
      allowPlayback = !motion.matches;
      syncPlayback();
    });
  }
});
