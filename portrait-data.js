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

  const page = location.pathname.split('/').pop() || 'index.html';

  if (page === 'index.html' || page === '') {
    const style = document.createElement('style');
    style.textContent = `
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
      }
    `;
    document.head.appendChild(style);

    const jobs = [...document.querySelectorAll('.timeline .job')];
    const tangerine = jobs.find(job => /Tangerine/i.test(job.textContent));
    if (tangerine) {
      const p = tangerine.querySelector('p');
      if (p) p.textContent = 'Backend Payments · Modernizing payment methods on current payment rails using microservices.';
    }
  }

  if (page === 'achievements.html') {
    const cards = [...document.querySelectorAll('.impact-cards .impact')];
    if (cards[0]) {
      const h = cards[0].querySelector('h3');
      const p = cards[0].querySelector('p');
      if (h) h.textContent = 'iCRM adopted by Scotiabank Chile for';
      if (p) p.textContent = "Built the business case and secured Scotiabank Chile's $3M investment; the platform is now expanding to additional countries.";
    }
    if (cards[1]) {
      const h = cards[1].querySelector('h3');
      const p = cards[1].querySelector('p');
      if (h) h.textContent = 'Reduced discovery from 5 months to';
      if (p) p.textContent = 'Standardized and scaled the discovery approach across all implementation projects, reducing discovery from 5 months to 2–3 weeks.';
    }
  }
})();
