// Server-only HTML: complete paragraphs/sections, never conditional sentence fragments.
// Historical employment and achievements remain in the shared pages.
export const colombiaBlocks = {
  relocation: '<div data-nosnippet><p class="market-note">Preparing to relocate to Colombia in 2027.</p></div>',
  // Experience page stats: the Colombian version names the countries; Canada's
  // fallback (in experience.html) states the same years without them.
  experienceStats: '<div class="card stats"><div class="stat"><div class="num">20</div><p>years of professional<br>experience</p></div><div class="stat"><div class="num">10</div><p>years in Agile delivery<br>in Canada</p></div><div class="stat"><div class="num">10</div><p>years of SAP consulting<br>in Argentina and Colombia</p></div></div>',
  contactContext: `<section class="prototype-card" aria-label="Professional context" data-nosnippet>
    <div class="label">Contact</div>
    <div class="body"><h2>Available for regional leadership</h2><p>Open to director-level product, transformation and delivery roles across Colombia and remote teams in Canada and Latin America.</p></div>
    <div class="when">2027 · Colombia</div>
    <div class="flags"><span>🇦🇷 <b>Argentine citizenship</b></span><span>🇨🇦 <b>Canadian citizenship</b></span><span>🇨🇴 <b>Colombian residence</b></span></div>
  </section>`,
};

export function marketForCountry(country) {
  return typeof country === 'string' && country.trim().toUpperCase() === 'CA' ? 'canada' : 'colombia';
}
