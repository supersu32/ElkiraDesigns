

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.btn-top-index');
  if (!btn) return;

  const toggleBtn = () => {
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const scrollable = docHeight - winHeight;
    const threshold = scrollable < 600 ? 100 : scrollable * 0.15;

    if (window.scrollY > threshold) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  };

  window.addEventListener('scroll', toggleBtn);
  window.addEventListener('load', toggleBtn);
  toggleBtn();
});


document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.querySelector('.burger-btn');
  const subnav = document.querySelector('.subnav');

  if (burgerBtn && subnav) {
    burgerBtn.addEventListener('click', () => {
      const isHidden = subnav.hasAttribute('hidden');
      if (isHidden) {
        subnav.removeAttribute('hidden');
        subnav.classList.add('active');
      } else {
        subnav.setAttribute('hidden', '');
        subnav.classList.remove('active');
      }
    });
  }
});


(() => {
  // Zjistí všechny ID lightboxů v aktuální SKUPINĚ (podle prefixu před prvním "-")
  function getGroupIds() {
    const hash = location.hash.replace('#','');
    const cur = document.getElementById(hash);
    if (!cur || !cur.classList.contains('lightbox')) return [];
    const m = hash.match(/^([a-z]+)-/i);
    if (!m) return [];
    const prefix = m[1] + '-';
    return [...document.querySelectorAll(`.lightbox[id^="${prefix}"]`)].map(el => el.id);
  }

  function nav(dir) {
    const ids = getGroupIds();
    const cur = location.hash.replace('#','');
    const i = ids.indexOf(cur);
    if (i === -1 || ids.length === 0) return;
    const next = (i + dir + ids.length) % ids.length;
    location.hash = '#' + ids[next];
  }

  // Klávesnice: ← → Esc
  document.addEventListener('keydown', (e) => {
    const hash = location.hash;
    if (!hash || !document.querySelector(hash + '.lightbox')) return;
    if (e.key === 'Escape') { location.hash = '#!'; return; }
    if (e.key === 'ArrowRight') { nav(+1); }
    if (e.key === 'ArrowLeft')  { nav(-1); }
  });

  // Klik na OBRÁZEK = další snímek (v rámci skupiny)
  document.addEventListener('click', (e) => {
    const img = e.target.closest('.lightbox__img');
    if (img) { e.preventDefault(); nav(+1); }
  });

  // (Volitelné) větší „hit area“ vedle obrázku:
  // přidáme dvě neviditelná tlačítka do aktuálního lightboxu, když se otevře
  function ensureHitAreas(lb) {
    if (lb.querySelector('.lb-hit')) return;
    const content = lb.querySelector('.lightbox__content');
    if (!content) return;
    const mk = (cls, dir, label) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = `lb-hit ${cls}`;
      b.setAttribute('aria-label', label);
      b.addEventListener('click', () => nav(dir));
      return b;
    };
    content.appendChild(mk('lb-hit--left', -1, 'Předchozí'));
    content.appendChild(mk('lb-hit--right', +1, 'Další'));
  }

  window.addEventListener('hashchange', () => {
    const lb = document.querySelector(location.hash + '.lightbox');
    if (lb) ensureHitAreas(lb);
  });
})();

/* Subnav – zvýraznění odkazu podle aktuální sekce */
(() => {
  const links = Array.from(document.querySelectorAll('.subnav a'));
  if (!links.length) return;

  // sekce v pořadí, jak se objevují na stránce
  const sectionIds = ['design','foto', 'kresby', 'pixel', 'preparace'];
  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  // mapování href -> <a>
  const linkMap = Object.fromEntries(
    links.map(a => [a.getAttribute('href').slice(1), a])
  );

  // výška sticky (hlavní menu + subnav) – můžeš doladit
  const STICKY = 120;

  function setActive(id) {
    links.forEach(a => {
      const on = a.getAttribute('href') === ('#' + id);
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  function updateActive() {
    // „sonda“ ve viewportu – bod 35 % pod sticky topem
    const probeY = window.scrollY + STICKY + window.innerHeight * 0.35;

    // defaultně první sekce (když jsme úplně nahoře)
    let current = sectionIds[0];

    for (const s of sections) {
      const top = s.offsetTop;
      const bottom = top + s.offsetHeight;
      if (probeY >= top && probeY < bottom) {
        current = s.id;
        break;
      }
    }
    setActive(current);
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  window.addEventListener('resize', updateActive);
  updateActive(); // hned po načtení

  // okamžité zvýraznění po kliknutí (než doběhne scroll)
  links.forEach(a => {
    a.addEventListener('click', () => {
      setActive(a.getAttribute('href').slice(1));
    });
  });
})();