(() => {
  const controls = document.querySelectorAll('[role="tab"]');
  controls.forEach(control => control.addEventListener('click', () => {
    const group = control.closest('[role="tablist"]');
    group?.querySelectorAll('[role="tab"]').forEach(item => { item.classList.remove('is-active'); item.setAttribute('aria-selected', 'false'); });
    control.classList.add('is-active'); control.setAttribute('aria-selected', 'true');
  }));

  const highlightStates = {
    design: { image: 'assets/sc-02/highlights-design.jpg', caption: 'Heat-forged aluminum unibody design for exceptional pro capability.' },
    chip: { image: 'assets/sc-02/highlights-chip.jpg', caption: 'A19 Pro, vapor cooled for lightning-fast performance. Breakthrough battery life.' },
    camera: { image: 'assets/sc-02/highlights-camera.jpg', caption: 'The ultimate pro camera system. All 48MP Fusion rear cameras. And the longest zoom ever on an iPhone.' },
    'center-stage': { image: 'assets/sc-02/highlights-center-stage.jpg', caption: 'New Center Stage front camera. Flexible ways to frame your shot. Smarter group selfies. And so much more.' },
    ios: { image: 'assets/sc-02/highlights-ios.jpg', caption: 'iOS 26. New look. Even more magic.' },
    intelligence: { image: 'assets/sc-02/highlights-intelligence.jpg', caption: 'Apple Intelligence. Effortlessly helpful features — from image creation to Live Translation.' }
  };
  document.querySelectorAll('#sc-02 .selector[data-highlight]').forEach(control => control.addEventListener('click', () => {
    const state = control.dataset.highlight;
    const media = document.querySelector('#sc-02 .feature-media');
    const image = media?.querySelector('.feature-image');
    const caption = document.querySelector('#sc-02 .feature-caption');
    const next = highlightStates[state];
    if (!media || !image || !next) return;
    media.className = `feature-media feature-state-${state}`;
    image.src = next.image;
    image.alt = `${control.textContent.trim()} highlight from the Apple iPhone 17 Pro reference`;
    if (caption) caption.textContent = next.caption;
  }));

  const film = document.querySelector('#highlights-film');
  const filmTrigger = document.querySelector('.highlights-film-trigger');
  const filmClose = document.querySelector('.highlights-film-close');
  const closeFilm = () => { if (film) { film.hidden = true; film.querySelector('video')?.pause(); } filmTrigger?.focus(); };
  filmTrigger?.addEventListener('click', () => { if (film) { film.hidden = false; filmClose?.focus(); } });
  filmClose?.addEventListener('click', closeFilm);
  film?.addEventListener('click', event => { if (event.target === film) closeFilm(); });
  addEventListener('keydown', event => { if (event.key === 'Escape' && film && !film.hidden) closeFilm(); });

  const scrubItems = [...document.querySelectorAll('[data-scrub]')];
  const updateScrub = () => {
    if (matchMedia('(max-width: 700px)').matches) {
      scrubItems.forEach(item => { item.style.transform = 'none'; item.style.opacity = '1'; });
      return;
    }
    scrubItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)));
      item.style.transform = `translate3d(0, ${Math.round((progress - .5) * -28)}px, 0) scale(${(1 + progress * .025).toFixed(3)})`;
      item.style.opacity = String(.72 + progress * .28);
    });
  };
  addEventListener('scroll', updateScrub, { passive: true });
  addEventListener('resize', updateScrub);
  updateScrub();
})();
