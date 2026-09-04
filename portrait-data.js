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
})();
