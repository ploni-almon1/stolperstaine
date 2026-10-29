// ==========================================
// 1. DATA
// ==========================================
const stolpersteine = [
  {
    id: 1, name: "Anna Franková", address: "Náměstí Míru 12, Praha",
    lat: 50.0755, lng: 14.4378, photo: "https://picsum.photos/seed/1/200/150",
    bio: "Narodila se 12. 5. 1900. Deportována do Terezína.",
    link: "https://example.com", lastCleaned: "2024-11-15"
  },
  {
    id: 2, name: "Josef Novák", address: "Vinohradská 44, Praha",
    lat: 50.0780, lng: 14.4450, photo: "https://picsum.photos/seed/2/200/150",
    bio: "Obchodník, zahynul v roce 1942.",
    link: "https://example.com", lastCleaned: "2023-02-10"
  }
];

// ==========================================
// 2. POMOCNÉ FUNKCE PRO DATUM
// ==========================================
function formatCz(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

function toIso(d) {
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}

function parseCzechDate(str) {
  if (!str) return null;
  const m = str.trim().match(/^(\d{1,2})\.\s?(\d{1,2})\.\s?(\d{4})$/);
  if (!m) return null;
  const [, d, mo, y] = m;
  const date = new Date(+y, +mo - 1, +d);
  if (date.getFullYear() !== +y || date.getMonth() !== +mo - 1 || date.getDate() !== +d) return null;
  if (date > new Date()) return null;
  return date;
}

// ==========================================
// 3. STAV ČIŠTĚNÍ → BARVA
//    Interval: 3× ročně = každé 4 měsíce
//    0–4 měsíce   → zelená  (čerstvě)
//    4–8 měsíců   → oranžová (středně)
//    8+ měsíců    → červená (potřeba)
// ==========================================
const FRESH_MONTHS   = 4;
const MEDIUM_MONTHS  = 8;

function getCleaningStatus(dateStr) {
  if (!dateStr) return "needs-cleaning";
  const then = new Date(dateStr);
  const now = new Date();
  const months = (now.getFullYear() - then.getFullYear()) * 12
               + (now.getMonth() - then.getMonth());
  if (months < FRESH_MONTHS) return "recently-cleaned";
  if (months < MEDIUM_MONTHS) return "medium";
  return "needs-cleaning";
}

function getStatusText(dateStr) {
  if (!dateStr) return "Bez záznamu o čištění";
  const s = getCleaningStatus(dateStr);
  if (s === 'recently-cleaned') return `Naposledy čištěno ${formatCz(dateStr)} (čerstvé)`;
  if (s === 'medium')           return `Naposledy čištěno ${formatCz(dateStr)} (středně staré)`;
  return `Naposledy čištěno ${formatCz(dateStr)} – potřebuje očistit!`;
}

// ==========================================
// 4. MAPA
// ==========================================
const map = L.map('map').setView([50.08, 14.44], 14);

const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap',
  className: 'map-tiles'
}).addTo(map);

const markersGroup = L.markerClusterGroup().addTo(map);

// ==========================================
// 5. TLAČÍTKO POLOHY jako Leaflet control (pod zoomem)
// ==========================================
const LocateControl = L.Control.extend({
  options: { position: 'topleft' },
  onAdd: function () {
    const btn = L.DomUtil.create('button', 'locate-btn-custom leaflet-bar');
    btn.type = 'button';
    btn.innerHTML = '◎';
    btn.title = 'Moje poloha';

    // Zabránit, aby klik na tlačítko ovlivnil mapu
    L.DomEvent.disableClickPropagation(btn);
    L.DomEvent.on(btn, 'click', (e) => {
      L.DomEvent.stop(e);
      map.locate({ setView: true, maxZoom: 16, enableHighAccuracy: true });
    });

    return btn;
  }
});
map.addControl(new LocateControl());

// ==========================================
// 6. VYKRESLENÍ BODŮ
// ==========================================
function renderMarkers() {
  markersGroup.clearLayers();
  stolpersteine.forEach(stone => {
    const statusClass = getCleaningStatus(stone.lastCleaned);
    const icon = L.divIcon({
      className: '',
      html: `<div class="stone-icon ${statusClass}"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });
    const marker = L.marker([stone.lat, stone.lng], { icon }).addTo(markersGroup);
    marker.on('click', () => openDetail(stone));
  });
}

// ==========================================
// 7. DETAILNÍ PANEL
// ==========================================
const panel      = document.getElementById('detail-panel');
const textInput  = document.getElementById('cleaning-text');
const feedback   = document.getElementById('cleaning-feedback');
let currentStone = null;

function openDetail(stone) {
  currentStone = stone;

  document.getElementById('detail-photo').src            = stone.photo;
  document.getElementById('detail-name').textContent     = stone.name;
  document.getElementById('detail-address').textContent  = '📍 ' + stone.address;
  document.getElementById('detail-bio').textContent      = stone.bio;
  document.getElementById('detail-link').href            = stone.link;
  document.getElementById('detail-cleaned').textContent  = '🧹 ' + getStatusText(stone.lastCleaned);

  textInput.value = formatCz(stone.lastCleaned);
  textInput.classList.remove('invalid');
  feedback.classList.add('hidden');

  panel.classList.add('active');
  document.body.classList.add('panel-open');
}

document.getElementById('close-detail').onclick = () => {
  panel.classList.remove('active');
  document.body.classList.remove('panel-open');
};

// ==========================================
// 8. AUTOMATICKÉ FORMÁTOVÁNÍ VSTUPU
//    "15112024" → "15.11.2024"
//    "15 11 2024" → "15.11.2024"
//    "15.11.2024" → "15.11.2024"
// ==========================================
textInput.addEventListener('input', () => {
  // Ponechá jen číslice
  let digits = textInput.value.replace(/\D/g, '');
  if (digits.length > 8) digits = digits.slice(0, 8);

  // Sestaví DD.MM.RRRR
  let formatted = '';
  if (digits.length > 0) formatted = digits.slice(0, 2);
  if (digits.length > 2) formatted += '.' + digits.slice(2, 4);
  if (digits.length > 4) formatted += '.' + digits.slice(4, 8);

  textInput.value = formatted;

  // Validace (jen když je délka kompletní)
  if (digits.length === 8) {
    const parsed = parseCzechDate(formatted);
    textInput.classList.toggle('invalid', !parsed);
  } else {
    textInput.classList.remove('invalid');
  }
});

// ==========================================
// 9. ODESLÁNÍ FORMULÁŘE
// ==========================================
document.getElementById('cleaning-form').onsubmit = (e) => {
  e.preventDefault();
  if (!currentStone) return;

  const parsed = parseCzechDate(textInput.value);
  if (!parsed) {
    feedback.textContent = '⚠ Zadejte platné datum (DD.MM.RRRR)';
    feedback.style.color = '#e74c3c';
    feedback.classList.remove('hidden');
    return;
  }

  const iso = toIso(parsed);
  currentStone.lastCleaned = iso;

  document.getElementById('detail-cleaned').textContent = '🧹 ' + getStatusText(iso);

  feedback.textContent = '✓ Uloženo';
  feedback.style.color = '#27ae60';
  feedback.classList.remove('hidden');
  setTimeout(() => feedback.classList.add('hidden'), 2500);

  renderMarkers();
};

// ==========================================
// 10. OVLÁDACÍ PRVKY
// ==========================================
document.getElementById('toggle-grayscale').onchange = (e) => {
  const tiles = document.querySelectorAll('.map-tiles');
  tiles.forEach(t => {
    t.style.filter = e.target.checked ? 'grayscale(100%) contrast(110%)' : 'none';
  });
};

// ==========================================
// 11. ZJIŠTĚNÍ POLOHY
// ==========================================
map.on('locationfound', (e) => {
  L.circleMarker(e.latlng, {
    color: '#3498db', fillColor: '#3498db', fillOpacity: 1, radius: 8, weight: 3
  }).addTo(map).bindPopup("📍 Jste zde").openPopup();
});

map.on('locationerror', () => {
  alert("Polohu nelze zjistit. Povolte přístup k poloze v nastavení prohlížeče.");
});

// Start
renderMarkers();
