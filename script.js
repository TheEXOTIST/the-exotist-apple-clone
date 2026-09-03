(() => {
  const controls = document.querySelectorAll('[role="tab"]');
  controls.forEach(control => control.addEventListener('click', () => {
    const group = control.closest('[role="tablist"]');
    group?.querySelectorAll('[role="tab"]').forEach(item => { item.classList.remove('is-active'); item.setAttribute('aria-selected', 'false'); });
    control.classList.add('is-active'); control.setAttribute('aria-selected', 'true');
  }));

  const highlightCopy = {
    design: 'Heat-forged enclosure, shaped around performance.',
    chip: 'A19 Pro chip, built for sustained power.',
    camera: 'Pro Fusion camera system, ready for every focal length.',
    'center-stage': 'Center Stage front camera, keeping the frame in motion.',
    ios: 'iOS 26, a new surface for everyday work.',
    intelligence: 'Apple Intelligence, designed around useful moments.'
  };
  document.querySelectorAll('#sc-02 .selector[data-highlight]').forEach(control => control.addEventListener('click', () => {
    const state = control.dataset.highlight;
    const media = document.querySelector('#sc-02 .feature-media');
    const caption = document.querySelector('#sc-02 .feature-caption');
    if (!media || !state) return;
    [...media.classList].filter(name => name.startsWith('feature-state-')).forEach(name => media.classList.remove(name));
    media.classList.add(`feature-state-${state}`);
    media.querySelector('.feature-label').textContent = control.textContent.trim().toUpperCase();
    if (caption) caption.textContent = highlightCopy[state] || '';
  }));

  const film = document.querySelector('#highlights-film');
  const filmTrigger = document.querySelector('.highlights-film-trigger');
  const filmClose = document.querySelector('.highlights-film-close');
  const closeFilm = () => { if (film) film.hidden = true; filmTrigger?.focus(); };
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
