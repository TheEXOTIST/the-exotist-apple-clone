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
  const compareViewport = document.querySelector('#sc-03 .design-compare-feature-viewport');
  const compareTrack = document.querySelector('#sc-03 .design-compare-feature-track');
  const compareSlides = [...document.querySelectorAll('#sc-03 .design-compare-feature-slide')];
  const compareTabs = [...document.querySelectorAll('#sc-03 [data-compare-tab]')];
  const featureData = {
    'design-1': [['design-detail-pro.jpg','iPhone 17 Pro','Innovative design with breakthrough pro performance.','FORGED ALUMINUM UNIBODY'],['design-detail-air.jpg','iPhone Air','Super thin. Strikingly light. Shockingly strong.','POLISHED TITANIUM FRAME'],['design-detail-17.jpg','iPhone 17','Even more delightful. Even more durable.','DURABLE ALUMINUM FRAME']],
    'design-2': [['design-unibody-pro.jpg','iPhone 17 Pro','6.9” / 6.3”','SUPER RETINA XDR DISPLAY · FORGED ALUMINUM UNIBODY'],['design-titanium-air.jpg','iPhone Air','6.5”','SUPER RETINA XDR DISPLAY · POLISHED TITANIUM FRAME'],['design-aluminum-17.jpg','iPhone 17','6.3”','SUPER RETINA XDR DISPLAY · DURABLE ALUMINUM FRAME']],
    'camera-1': [['camera-initial-pro.jpg','iPhone 17 Pro','Ultimate pro camera system.','48MP FUSION MAIN · 48MP FUSION ULTRA WIDE · 48MP FUSION TELEPHOTO'],['camera-initial-air.jpg','iPhone Air','Two advanced cameras in one.','48MP FUSION MAIN'],['camera-initial-17.jpg','iPhone 17','Superstunning shots up close or far away.','48MP FUSION MAIN · 48MP FUSION ULTRA WIDE']],
    'camera-2': [[null,'iPhone 17 Pro','48MP Pro Fusion camera system','.5x · 1x · 2x · 4x · 8x'],[null,'iPhone Air','48MP Fusion camera system','1x · 2x'],[null,'iPhone 17','48MP Dual Fusion camera system','.5x · 1x · 2x']],
    'camera-3': [['camera-center-pro.jpg','iPhone 17 Pro','18MP Center Stage front camera','CENTER STAGE FOR PHOTOS · ULTRA-STABILIZED VIDEO · DUAL CAPTURE VIDEO'],['camera-center-air.jpg','iPhone Air','18MP Center Stage front camera','CENTER STAGE FOR PHOTOS · ULTRA-STABILIZED VIDEO · DUAL CAPTURE VIDEO'],['camera-center-17.jpg','iPhone 17','18MP Center Stage front camera','CENTER STAGE FOR PHOTOS · ULTRA-STABILIZED VIDEO · DUAL CAPTURE VIDEO']],
    'chip-1': [['chip-pro.jpg','iPhone 17 Pro','Exceptional pro performance.','6-CORE CPU · 6-CORE GPU WITH NEURAL ACCELERATORS'],['chip-pro.jpg','iPhone Air','Hyperspeed. Hyperefficient.','6-CORE CPU · 5-CORE GPU WITH NEURAL ACCELERATORS'],['chip-air.jpg','iPhone 17','Power player. Energy expert.','6-CORE CPU · 5-CORE GPU WITH NEURAL ACCELERATORS']],
    'battery-1': [[null,'iPhone 17 Pro','Up to 39 hours of video playback.','UP TO 50% CHARGE IN 20 MINUTES'],[null,'iPhone Air','Up to 27 hours of video playback.','UP TO 50% CHARGE IN 30 MINUTES'],[null,'iPhone 17','Up to 30 hours of video playback.','UP TO 50% CHARGE IN 20 MINUTES']],
    'price-1': [[null,'iPhone 17 Pro','256GB model from $1099.','OR $45.79/MO. FOR 24 MO.'],[null,'iPhone Air','256GB model from $999.','OR $41.62/MO. FOR 24 MO.'],[null,'iPhone 17','256GB model from $799.','OR $33.29/MO. FOR 24 MO.']]
  };
  const sequence = compareSlides.map(slide => slide.dataset.compareSlide);
  const groups = {design:['design-1','design-2'],camera:['camera-1','camera-2','camera-3'],chip:['chip-1'],battery:['battery-1'],price:['price-1']};
  const renderCompareSlide = (slide, key) => {
    const group=Object.keys(groups).find(name=>groups[name].includes(key)); const items=featureData[key];
    slide.innerHTML=`<div class="design-compare-cards">${items.map((item,index)=>{
      if (key === 'camera-2') {
        const levels = item[3].split(' · ');
        return `<div class="compare-product"><article class="design-compare-card compare-zoom-card" data-compare-card="${index}"><div class="compare-card-copy"><p>${item[2]}</p><span class="zoom-label">Optical zoom options:</span><ul class="zoom-levels">${levels.map(level=>`<li>${level}</li>`).join('')}</ul></div></article></div>`;
      }
      return `<div class="compare-product"><article class="design-compare-card${index===0?' is-current':''}" data-compare-card="${index}">${item[0]?`<img src="assets/sc-03/compare/${item[0]}" alt="${item[1]} ${group}">`:'<div class="compare-no-media" aria-hidden="true"></div>'}<div class="compare-card-copy"><p>${item[2]}</p><strong>${item[3]}</strong></div></article></div>`;
    }).join('')}</div>`;
  };
  const setActiveTab = key => { const group=Object.keys(groups).find(name=>groups[name].includes(key)); compareTabs.forEach(tab=>tab.setAttribute('aria-selected',String(tab.dataset.compareTab===group))); };
  const goToSlide = (index, behavior='smooth') => { const safe=Math.max(0,Math.min(sequence.length-1,index)); compareViewport?.scrollTo({left:compareSlides[safe].offsetLeft,behavior}); setActiveTab(sequence[safe]); };
  compareViewport?.addEventListener('scroll', () => { const left=compareViewport.scrollLeft; let nearest=0; compareSlides.forEach((slide,index)=>{ if(Math.abs(slide.offsetLeft-left)<Math.abs(compareSlides[nearest].offsetLeft-left)) nearest=index; }); setActiveTab(sequence[nearest]); });
  const openCompare = () => { if (!compareModal) return; compareModal.hidden = false; document.body.style.overflow = 'hidden'; compareClose?.focus(); };
  const closeCompare = () => { if (!compareModal) return; compareModal.hidden = true; document.body.style.overflow = ''; compareTrigger?.focus(); };
  compareTrigger?.addEventListener('click', openCompare);
  compareClose?.addEventListener('click', closeCompare);
  compareModal?.addEventListener('click', event => { if (event.target === compareModal) closeCompare(); });
  compareModal?.addEventListener('keydown', event => { if (event.key === 'Escape') closeCompare(); });
  compareSlides.forEach(slide => renderCompareSlide(slide, slide.dataset.compareSlide));
  compareTabs.forEach(tab => tab.addEventListener('click', () => goToSlide(sequence.indexOf(groups[tab.dataset.compareTab][0]))));
  document.querySelector('#sc-03 .design-compare-gallery-prev')?.addEventListener('click', () => goToSlide(Math.round(compareViewport.scrollLeft / (compareSlides[0].offsetWidth + 18))-1));
  document.querySelector('#sc-03 .design-compare-gallery-next')?.addEventListener('click', () => goToSlide(Math.round(compareViewport.scrollLeft / (compareSlides[0].offsetWidth + 18))+1));
  document.querySelector('#sc-03 .compare-tab-paddle[aria-label="Previous feature"]')?.addEventListener('click', () => goToSlide(Math.max(0,sequence.indexOf(compareSlides.find(s=>s.getBoundingClientRect().left>=compareViewport.getBoundingClientRect().left)?.dataset.compareSlide)-1)));
  document.querySelector('#sc-03 .compare-tab-paddle[aria-label="Next feature"]')?.addEventListener('click', () => goToSlide(Math.min(sequence.length-1,sequence.indexOf(compareSlides.find(s=>s.getBoundingClientRect().left>=compareViewport.getBoundingClientRect().left)?.dataset.compareSlide)+1)));

  // SC-04: one active Apple product-viewer feature, with independent local/global navigation.
  const viewer = document.querySelector('#sc-04 [data-product-viewer]');
  if (viewer) {
    const featureNames = ['colors','aluminum','vapor','ceramic','display','camera-control','action-button'];
    const media = {
      colors: { orange:'assets/sc-04/colors_orange__cr2oq3n1dwk2_large.jpg', blue:'assets/sc-04/colors_blue__li170wg4gkae_large.jpg', silver:'assets/sc-04/colors_silver__eb8fu7zfvwmu_large.jpg' },
      aluminum:'assets/sc-04/unibody__beiiszaqty3m_large.jpg',
      vapor:'assets/sc-04/vapor_chamber__ghepoq1a90a6_large.jpg',
      ceramic:'assets/sc-04/ceramic_shield__cv0z40rccqy6_large.jpg',
      display:'assets/sc-04/pro_display__bvu4xbhsdpf6_large.jpg',
      'camera-control':'assets/sc-04/camera_control__gl7rgu1l9066_large.jpg',
      'action-button':'assets/sc-04/action_button__efiof6bf182u_large.jpg'
    };
    const controls = [...viewer.querySelectorAll('.product-viewer-control')];
    const panels = [...viewer.querySelectorAll('[data-feature-content]')];
    const image = viewer.querySelector('[data-color-media]');
    const mediaLayers = [...viewer.querySelectorAll('[data-feature-media]')];
    const colorName = viewer.querySelector('[data-current-color]');
    const colorCopy = viewer.querySelector('[data-current-color-copy]');
    const prev = viewer.querySelector('[data-viewer-global-prev]');
    const next = viewer.querySelector('[data-viewer-global-next]');
    let activeIndex = 0;
    const colorLabels = {orange:'Cosmic Orange',blue:'Deep Blue',silver:'Silver'};
    const render = index => {
      activeIndex = Math.max(0, Math.min(featureNames.length - 1, index));
      const key = featureNames[activeIndex];
      controls.forEach(button => { const on=button.dataset.feature===key; button.classList.toggle('is-active',on); button.setAttribute('aria-expanded',String(on)); button.setAttribute('aria-selected',String(on)); });
      panels.forEach(panel => { const on=panel.dataset.featureContent===key; panel.hidden=!on; panel.classList.toggle('is-active',on); });
      const selected = key === 'colors' ? (image?.dataset.color || 'orange') : null;
      mediaLayers.forEach(layer => { const on=layer.dataset.featureMedia===key; layer.hidden=!on; layer.classList.toggle('is-active',on); layer.querySelectorAll('video').forEach(video=>{ if(on) video.play().catch(()=>{}); else { video.pause(); video.currentTime=0; } }); });
      if (image && key === 'colors') image.src = media.colors[selected];
      if (colorName && key === 'colors') colorName.textContent = colorLabels[selected];
      if (prev) prev.disabled = activeIndex === 0;
      if (next) next.disabled = activeIndex === featureNames.length - 1;
      viewer.querySelectorAll('.viewer-local-prev').forEach(button=>button.disabled=activeIndex===0);
      viewer.querySelectorAll('.viewer-local-next').forEach(button=>button.disabled=activeIndex===featureNames.length-1);
    };
    controls.forEach(button=>button.addEventListener('click',()=>render(featureNames.indexOf(button.dataset.feature))));
    viewer.querySelectorAll('.viewer-local-prev').forEach(button=>button.addEventListener('click',()=>render(activeIndex-1)));
    viewer.querySelectorAll('.viewer-local-next').forEach(button=>button.addEventListener('click',()=>render(activeIndex+1)));
    prev?.addEventListener('click',()=>render(activeIndex-1)); next?.addEventListener('click',()=>render(activeIndex+1));
    viewer.querySelectorAll('.color-swatch').forEach(button=>button.addEventListener('click',()=>{ const color=button.dataset.color; if(image){image.dataset.color=color; image.src=media.colors[color];} if(colorName) colorName.textContent=colorLabels[color]; if(colorCopy) colorCopy.textContent=colorLabels[color]; viewer.querySelectorAll('.color-swatch').forEach(item=>item.classList.toggle('is-active',item===button)); }));
    viewer.querySelector('.product-viewer-close')?.addEventListener('click',()=>render(0));
    addEventListener('keydown',event=>{if(event.key==='Escape') render(0);});
    render(0);
  }
})();
