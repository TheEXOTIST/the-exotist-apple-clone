(() => {
  const controls = document.querySelectorAll('[role="tab"]');
  controls.forEach(control => control.addEventListener('click', () => {
    const group = control.closest('[role="tablist"]');
    group?.querySelectorAll('[role="tab"]').forEach(item => { item.classList.remove('is-active'); item.setAttribute('aria-selected', 'false'); });
    control.classList.add('is-active'); control.setAttribute('aria-selected', 'true');
  }));

  const gallery = document.querySelector('#sc-02 .highlights-gallery');
  const track = document.querySelector('#sc-02 .highlights-track');
  const cards = [...document.querySelectorAll('#sc-02 .highlight-card')];
  const dots = [...document.querySelectorAll('#sc-02 .highlight-dot')];
  const playToggle = document.querySelector('#sc-02 .highlight-play-toggle');
  const galleryControls = document.querySelector('#sc-02 .highlight-gallery-controls');
  let galleryIndex = 0;
  let galleryTimer;
  let galleryScrollSync = false;
  const syncGalleryControls = () => {
    if (galleryControls && gallery) galleryControls.style.transform = `translateX(calc(-50% + ${gallery.scrollLeft}px))`;
  };
  const renderGallery = state => {
    const nextIndex = cards.findIndex(card => card.dataset.galleryCard === state);
    if (!track || nextIndex < 0) return;
    galleryIndex = nextIndex;
    galleryScrollSync = true;
    gallery?.scrollTo({ left: cards[galleryIndex]?.offsetLeft || 0, behavior: 'smooth' });
    cards.forEach((card, index) => card.classList.toggle('is-active', index === galleryIndex));
    dots.forEach((dot, index) => { dot.classList.toggle('is-active', index === galleryIndex); dot.setAttribute('aria-selected', String(index === galleryIndex)); });
    requestAnimationFrame(syncGalleryControls);
    setTimeout(() => { galleryScrollSync = false; }, 700);
  };
  gallery?.addEventListener('scroll', () => {
    syncGalleryControls();
    if (galleryScrollSync || !cards.length) return;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const width = cards[0].getBoundingClientRect().width + gap;
    const nearest = Math.max(0, Math.min(cards.length - 1, Math.round(gallery.scrollLeft / width)));
    if (nearest !== galleryIndex) {
      galleryIndex = nearest;
      cards.forEach((card, index) => card.classList.toggle('is-active', index === galleryIndex));
      dots.forEach((dot, index) => { dot.classList.toggle('is-active', index === galleryIndex); dot.setAttribute('aria-selected', String(index === galleryIndex)); });
    }
  }, { passive: true });
  dots.forEach(control => control.addEventListener('click', () => renderGallery(control.dataset.highlight)));
  const stopGallery = () => { clearInterval(galleryTimer); galleryTimer = undefined; if (playToggle) { playToggle.textContent = '▶'; playToggle.setAttribute('aria-pressed', 'false'); playToggle.setAttribute('aria-label', 'Play highlights'); } };
  playToggle?.addEventListener('click', () => {
    if (galleryTimer) { stopGallery(); return; }
    playToggle.textContent = '⏸'; playToggle.setAttribute('aria-pressed', 'true'); playToggle.setAttribute('aria-label', 'Pause highlights');
    galleryTimer = setInterval(() => renderGallery(cards[(galleryIndex + 1) % cards.length]?.dataset.galleryCard), 2800);
  });
  addEventListener('resize', () => renderGallery(cards[galleryIndex]?.dataset.galleryCard || 'design'));
  renderGallery('design');

  const film = document.querySelector('#highlights-film');
  const filmTrigger = document.querySelector('.highlights-film-trigger');
  const filmClose = document.querySelector('.highlights-film-close');
  const closeFilm = () => { if (film) { film.hidden = true; film.querySelector('video')?.pause(); document.body.style.overflow = ''; } filmTrigger?.focus(); };
  filmTrigger?.addEventListener('click', () => { if (film) { film.hidden = false; document.body.style.overflow = 'hidden'; filmClose?.focus(); film.querySelector('video')?.play().catch(() => {}); } });
  filmClose?.addEventListener('click', closeFilm);
  film?.addEventListener('click', event => { if (event.target === film) closeFilm(); });
  addEventListener('keydown', event => { if (event.key === 'Escape' && film && !film.hidden) closeFilm(); });

  const designVideo = document.querySelector('#design-media');
  const designVideoSource = 'assets/sc-03/design_large_2x.mp4';
  let designVideoLoaded = false;
  const updateDesignVideo = () => {
    if (!designVideo) return;
    const rect = designVideo.getBoundingClientRect();
    const inLoadRange = rect.top < innerHeight && rect.bottom > -innerHeight;
    const inPlayRange = rect.top <= innerHeight * .65 && rect.bottom >= 0;
    if (inLoadRange && !designVideoLoaded) {
      designVideo.src = designVideoSource;
      designVideo.load();
      designVideoLoaded = true;
    }
    if (designVideoLoaded && inPlayRange) designVideo.play().catch(() => {});
    else if (designVideoLoaded) designVideo.pause();
    if (!inLoadRange && designVideoLoaded && rect.bottom < 0) {
      designVideo.pause();
      designVideo.removeAttribute('src');
      designVideo.load();
      designVideoLoaded = false;
    }
  };

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
  addEventListener('scroll', updateDesignVideo, { passive: true });
  addEventListener('resize', updateDesignVideo);
  updateDesignVideo();

  const compareModal = document.querySelector('#design-compare-modal');
  const compareTrigger = document.querySelector('#sc-03 .design-compare');
  const compareClose = document.querySelector('#sc-03 .design-compare-close');
  const compareCards = document.querySelector('#sc-03 .design-compare-cards');
  const compareTabs = [...document.querySelectorAll('#sc-03 [data-compare-tab]')];
  let compareIndex = 0;
  const compareTabData = {
    design: [['design-pro.jpg','iPhone 17 Pro','Innovative design with breakthrough pro performance.','FORGED ALUMINUM UNIBODY'],['design-air.jpg','iPhone Air','Super thin. Strikingly light. Shockingly strong.','POLISHED TITANIUM FRAME'],['design-17.jpg','iPhone 17','Even more delightful. Even more durable.','DURABLE ALUMINUM FRAME']],
    camera: [['camera-pro.jpg','iPhone 17 Pro','Ultimate pro camera system.','48MP FUSION MAIN · 48MP FUSION ULTRA WIDE · 48MP FUSION TELEPHOTO'],['camera-air.jpg','iPhone Air','Two advanced cameras in one.','48MP FUSION MAIN'],['camera-17.jpg','iPhone 17','Superstunning shots up close or far away.','48MP FUSION MAIN · 48MP FUSION ULTRA WIDE']],
    chip: [['chip-pro.jpg','iPhone 17 Pro','Exceptional pro performance.','6-CORE CPU · 6-CORE GPU WITH NEURAL ACCELERATORS'],['chip-pro.jpg','iPhone Air','Hyperspeed. Hyperefficient.','6-CORE CPU · 5-CORE GPU WITH NEURAL ACCELERATORS'],['chip-air.jpg','iPhone 17','Power player. Energy expert.','6-CORE CPU · 5-CORE GPU WITH NEURAL ACCELERATORS']],
    battery: [[null,'iPhone 17 Pro','Up to 39 hours of video playback.','UP TO 50% CHARGE IN 20 MINUTES'],[null,'iPhone Air','Up to 27 hours of video playback.','UP TO 50% CHARGE IN 30 MINUTES'],[null,'iPhone 17','Up to 30 hours of video playback.','UP TO 50% CHARGE IN 20 MINUTES']],
    price: [[null,'iPhone 17 Pro','256GB model from $1099.','OR $45.79/MO. FOR 24 MO.'],[null,'iPhone Air','256GB model from $999.','OR $41.62/MO. FOR 24 MO.'],[null,'iPhone 17','256GB model from $799.','OR $33.29/MO. FOR 24 MO.']]
  };
  const renderCompareCards = tab => {
    if (!compareCards) return;
    compareIndex = 0;
    compareCards.innerHTML = compareTabData[tab].map((item,index) => `<article class="design-compare-card" data-compare-card="${index}">${item[0] ? `<img src="assets/sc-03/compare/${item[0]}" alt="${item[1]} ${tab}">` : '<div class="compare-no-media" aria-hidden="true"></div>'}<h4>${item[1]}</h4>${index===0?'<span class="compare-current">Currently Viewing</span>':''}<p>${item[2]}</p><strong>${item[3]}</strong></article>`).join('');
    compareCards.scrollLeft = 0;
  };
  const openCompare = () => { if (!compareModal) return; compareModal.hidden = false; document.body.style.overflow = 'hidden'; compareClose?.focus(); };
  const closeCompare = () => { if (!compareModal) return; compareModal.hidden = true; document.body.style.overflow = ''; compareTrigger?.focus(); };
  compareTrigger?.addEventListener('click', openCompare);
  compareClose?.addEventListener('click', closeCompare);
  compareModal?.addEventListener('click', event => { if (event.target === compareModal) closeCompare(); });
  compareModal?.addEventListener('keydown', event => { if (event.key === 'Escape') closeCompare(); });
  compareTabs.forEach(tab => tab.addEventListener('click', () => { compareTabs.forEach(item => item.setAttribute('aria-selected','false')); tab.setAttribute('aria-selected','true'); renderCompareCards(tab.dataset.compareTab); }));
  document.querySelector('#sc-03 .design-compare-prev')?.addEventListener('click', () => { compareIndex = Math.max(0, compareIndex - 1); compareCards?.children[compareIndex]?.scrollIntoView({behavior:'smooth',inline:'start'}); });
  document.querySelector('#sc-03 .design-compare-next')?.addEventListener('click', () => { compareIndex = Math.min((compareCards?.children.length || 1) - 1, compareIndex + 1); compareCards?.children[compareIndex]?.scrollIntoView({behavior:'smooth',inline:'start'}); });
})();
