(() => {
  const files = [
    'profile-inline.txt',
    'profile-inline-2.txt',
    'profile-inline-3.txt',
    'profile-inline-4.txt'
  ];

  Promise.all(
    files.map(file =>
      fetch(file, { cache: 'no-store' }).then(response => {
        if (!response.ok) throw new Error(`Failed to load ${file}`);
        return response.text();
      })
    )
  )
    .then(parts => {
      const src = 'data:image/webp;base64,' + parts.join('');
      document.querySelectorAll('[data-portrait]').forEach(img => {
        img.src = src;
      });
    })
    .catch(error => {
      console.error('Portrait failed to load:', error);
    });

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
      .mobile-menu-toggle svg{width:27px;height:27px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round;transition:transform .2s ease;}
      .mobile-menu-toggle[aria-expanded="true"] svg{transform:rotate(90deg);}
      .mobile-menu-panel{display:block;position:fixed;z-index:29;top:72px;left:0;right:0;background:rgba(255,255,255,.98);backdrop-filter:blur(18px);border-bottom:1px solid #dfe7f2;box-shadow:0 18px 35px rgba(7,27,63,.12);padding:12px 18px 20px;transform:translateY(-120%);opacity:0;pointer-events:none;transition:transform .22s ease,opacity .18s ease;}
      .mobile-menu-panel.open{transform:translateY(0);opacity:1;pointer-events:auto;}
      .mobile-menu-panel a{display:flex;align-items:center;justify-content:space-between;min-height:52px;padding:0 10px;border-bottom:1px solid #edf2f8;font-size:16px;font-weight:600;color:#071b3f;}
      .mobile-menu-panel a:last-child{border-bottom:0;}
      .mobile-menu-panel a.active{color:#0a67ff;}
      .mobile-menu-panel .mobile-connect{margin-top:12px;justify-content:center;background:#0a67ff;color:#fff;border:0;border-radius:8px;box-shadow:0 9px 22px rgba(10,103,255,.18);}
    }
    @media (max-width:560px){
      .hero-grid{gap:0!important;}
      .hero-copy{position:relative;z-index:2;padding-bottom:0!important;}
      .hero-actions{position:relative;z-index:3;}
      .portrait{height:330px!important;margin-top:-18px!important;overflow:visible!important;position:relative;z-index:1;}
      .portrait img[data-portrait]{
        transform:scale(1.18)!important;
        object-position:center 14%!important;
        -webkit-mask-image:linear-gradient(to bottom,transparent 0%,rgba(0,0,0,.35) 5%,#000 16%,#000 100%);
        mask-image:linear-gradient(to bottom,transparent 0%,rgba(0,0,0,.35) 5%,#000 16%,#000 100%);
      }
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
})();
