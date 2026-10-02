(() => {
  const portraits = document.querySelectorAll('[data-portrait]');
  const portraitSrc = 'data:image/webp;base64,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';
  portraits.forEach(img => { img.src = portraitSrc; });

  const style = document.createElement('style');
  style.textContent = `
    .portrait{overflow:hidden;}
    .portrait img[data-portrait]{
      width:100%!important;
      height:100%!important;
      object-fit:cover!important;
      object-position:center 16%!important;
      transform:scale(1.18);
      transform-origin:center 18%;
    }
    .mobile-menu-toggle,.mobile-menu-panel{display:none;}
    @media (max-width:900px){
      .timeline{display:block!important;position:relative;padding-left:54px;}
      .timeline:before{content:"";position:absolute;left:18px;top:7px;bottom:8px;width:1px;background:#9fc7ff;}
      .timeline .job{text-align:left!important;border-top:0!important;border-radius:0!important;padding:0 0 34px 0!important;min-height:0;background:transparent!important;transform:none!important;}
      .timeline .job:last-child{padding-bottom:4px!important;}
      .timeline .job:before{top:5px!important;left:-42px!important;width:13px!important;height:13px!important;transform:none!important;box-shadow:0 0 0 4px #fff;}
      .timeline .years{display:block;margin-bottom:8px;font-size:13px;}
      .timeline .job-logo{justify-content:flex-start!important;margin:0 0 7px!important;min-height:0!important;}
      .timeline .job h3{margin:0 0 6px!important;text-align:left;}
      .timeline .job p{font-size:13px;line-height:1.45;max-width:520px;}
      .nav .wrap{gap:10px;}
      .nav .brand{flex:1;min-width:0;}
      .nav>.wrap>.btn.primary{display:none!important;}
      .mobile-menu-toggle{display:grid;place-items:center;width:46px;height:46px;border:0;background:transparent;color:#071b3f;border-radius:10px;padding:0;flex:0 0 auto;}
      .mobile-menu-toggle::before{content:"☰";display:block;font-size:28px;font-weight:500;line-height:1;color:currentColor;}
      .mobile-menu-toggle[aria-expanded="true"]::before{content:"×";font-size:34px;font-weight:300;}
      .mobile-menu-toggle svg{display:none;}
      .mobile-menu-panel{display:block;position:fixed;z-index:29;top:72px;left:0;right:0;background:rgba(255,255,255,.98);backdrop-filter:blur(18px);border-bottom:1px solid #dfe7f2;box-shadow:0 18px 35px rgba(7,27,63,.12);padding:12px 18px 20px;transform:translateY(-120%);opacity:0;pointer-events:none;transition:transform .22s ease,opacity .18s ease;}
      .mobile-menu-panel.open{transform:translateY(0);opacity:1;pointer-events:auto;}
      .mobile-menu-panel a{display:flex;align-items:center;justify-content:space-between;min-height:52px;padding:0 10px;border-bottom:1px solid #edf2f8;font-size:16px;font-weight:600;color:#071b3f;}
      .mobile-menu-panel a:last-child{border-bottom:0;}
      .mobile-menu-panel a.active{color:#0a67ff;}
      .mobile-menu-panel .mobile-connect{margin-top:12px;justify-content:center;background:#0a67ff;color:#fff;border:0;border-radius:8px;box-shadow:0 9px 22px rgba(10,103,255,.18);}
    }
    @media (max-width:560px){
      body{overflow-x:hidden;}
      .nav .wrap{width:calc(100% - 24px)!important;}
      .brand{gap:9px!important;}
      .brand>span{font-size:14px;}
      .brand small{font-size:8px;}
      .nr-logo{width:35px!important;height:28px!important;}
      .hero h1,.contact-card h1,.resume-head h1{font-size:41px!important;line-height:1.04!important;letter-spacing:-.025em;}
      .hero p,.contact-card p{font-size:16px!important;line-height:1.62!important;}
      .hero-grid{gap:0!important;}
      .hero-copy{position:relative;z-index:2;padding-bottom:0!important;}
      .hero-actions,.actions,.cta-actions{position:relative;z-index:3;gap:10px!important;}
      .hero-actions .btn,.actions .btn,.cta-actions .btn{min-height:47px;padding:12px 16px;}
      .portrait{height:320px!important;margin-top:0!important;overflow:hidden!important;position:relative;z-index:1;}
      .hero-copy:has(.hero-actions)+.portrait{margin-top:24px!important;}
      .portrait img[data-portrait]{
        width:100%!important;
        height:100%!important;
        object-fit:contain!important;
        object-position:center bottom!important;
        transform:scale(1.03)!important;
        transform-origin:center bottom!important;
        -webkit-mask-image:none!important;
        mask-image:none!important;
      }
      .section{padding-top:32px!important;padding-bottom:32px!important;}
      .card,.ai-card,.suite-card,.contact-card,.pdf-shell{border-radius:12px!important;}
      .metrics{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:8px!important;padding:14px!important;}
      .metric b{font-size:25px!important;line-height:1.05;overflow-wrap:anywhere;}
      .metric small{display:block;font-size:10px;line-height:1.35;}
      .filters{justify-content:flex-start!important;flex-wrap:nowrap!important;overflow-x:auto;padding:22px 0 24px!important;scrollbar-width:none;}
      .filters::-webkit-scrollbar{display:none;}
      .filter-btn{flex:0 0 auto;}
      .hero-visual{padding:24px 0 30px!important;}
      .hero-visual img{transform:none!important;border-radius:12px!important;}
      .resume-head{padding-top:32px!important;gap:18px!important;}
      .resume-head .actions{width:100%;}
      .resume-head .btn{flex:1 1 150px;}
      .pdf-shell{padding:6px!important;}
      object{height:68vh!important;}
      .contact-card{padding:32px 24px!important;}
      .cta{margin-top:28px!important;margin-bottom:28px!important;gap:14px!important;}
      .cta h2{font-size:28px!important;line-height:1.12;}
    }
  `;
  document.head.appendChild(style);

  const navWrap = document.querySelector('.nav .wrap');
  if (navWrap && !document.querySelector('.mobile-menu-toggle')) {
    const toggle = document.createElement('button');
    toggle.className = 'mobile-menu-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Open navigation');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    navWrap.appendChild(toggle);

    const panel = document.createElement('div');
    panel.className = 'mobile-menu-panel';
    const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const links = [
      ['index.html','Home'],
      ['experience.html','Experience'],
      ['achievements.html','Achievements'],
      ['AI Projects.dc.html','AI Projects'],
      ['resume-pdf.html','Resume'],
      ['contact.html','Contact']
    ];
    panel.innerHTML = links.map(([href,label]) => {
      const active = decodeURIComponent(current) === href.toLowerCase() ? ' class="active"' : '';
      return `<a href="${href}"${active}><span>${label}</span><span aria-hidden="true">→</span></a>`;
    }).join('') + '<a class="mobile-connect" href="mailto:nicolasruiz@gmail.com">Let\'s connect →</a>';
    document.body.appendChild(panel);

    const closeMenu = () => {
      panel.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
      toggle.setAttribute('aria-label','Open navigation');
    };
    toggle.addEventListener('click', () => {
      const open = !panel.classList.contains('open');
      panel.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  const worldCupCard = document.getElementById('world-cup');
  if (worldCupCard) {
    worldCupCard.classList.add('application-card');

    if (!worldCupCard.querySelector('.status-pill.live')) {
      const pill = document.createElement('span');
      pill.className = 'status-pill live';
      pill.textContent = 'Live application';
      worldCupCard.prepend(pill);
    }

    const directImage = [...worldCupCard.children].find(el => el.tagName === 'IMG');
    if (directImage && !worldCupCard.querySelector(':scope > .project-media')) {
      const media = document.createElement('div');
      media.className = 'project-media';
      directImage.before(media);
      media.appendChild(directImage);
    }

    const body = worldCupCard.querySelector('.project-body');
    if (body && !body.querySelector('.open-app')) {
      const open = document.createElement('span');
      open.className = 'open-app';
      open.textContent = 'Open application →';
      const tags = body.querySelector('.tags');
      if (tags) body.insertBefore(open, tags);
      else body.appendChild(open);
    }

    worldCupCard.querySelectorAll('.tag').forEach(tag => {
      if (/open live site/i.test(tag.textContent || '')) tag.remove();
    });
  }

  const projectRail = document.querySelector('.projects-grid');
  const projectCards = projectRail ? [...projectRail.querySelectorAll('.project')] : [];
  if (projectCards.length) {
    const focusProject = card => projectCards.forEach(item => item.classList.toggle('marquee-active', item === card));
    focusProject(projectCards[0]);
    let projectTimer;
    projectRail.addEventListener('scroll', () => {
      if (!matchMedia('(max-width:560px)').matches) return;
      clearTimeout(projectTimer);
      projectTimer = setTimeout(() => {
        const center = projectRail.getBoundingClientRect().left + projectRail.clientWidth / 2;
        const focused = projectCards.reduce((best, card) =>
          Math.abs(card.getBoundingClientRect().left + card.offsetWidth / 2 - center) <
          Math.abs(best.getBoundingClientRect().left + best.offsetWidth / 2 - center) ? card : best
        );
        focusProject(focused);
      }, 90);
    }, { passive: true });
  }
})();