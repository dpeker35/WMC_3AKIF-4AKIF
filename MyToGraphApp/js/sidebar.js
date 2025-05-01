// js/sidebar.js
// 3 NASA API widget’ları: APOD, Mars Rover Photos, NeoWs

document.addEventListener('DOMContentLoaded', () => {
  const NASA_API_KEY = 'dnygzd7IGEcnhChtgPyBVKAjBfdpgKcuipB3den3';

  // —— 1) Astronomy Picture of the Day (APOD) —————————————————
const apodBtn    = document.getElementById('apod-btn');
const apodResult = document.getElementById('apod-result');
if (apodBtn && apodResult) {
  async function fetchAPOD() {
    apodResult.innerHTML = '<div class="text-muted">Loading…</div>';
    try {
      const res  = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&count=1`);
      const arr  = await res.json();
      const data = Array.isArray(arr) ? arr[0] : arr;

      // Yalnızca medya içeriği: video ise iframe, resim ise img
      if (data.media_type === 'video') {
        apodResult.innerHTML = `
          <iframe
            src="${data.url}"
            frameborder="0"
            style="width:100%;height:180px;border-radius:.5rem;"
          ></iframe>
        `;
      } else {
        apodResult.innerHTML = `
          <img
            src="${data.url}"
            alt="Astronomy Picture of the Day"
            style="width:100%;border-radius:.5rem;"
          />
        `;
      }
    } catch (err) {
      console.error(err);
      apodResult.innerHTML = `<div class="text-danger">APOD alınamadı: ${err.message}</div>`;
    }
  }

  apodBtn.addEventListener('click', fetchAPOD);
  fetchAPOD();
}
  // —— 2) Mars Rover Photos (Curiosity) —————————————————
  // —— 2) Mars Rover Photos (Curiosity) —————————————————
const marsInput = document.getElementById('mars-sol-input');
const marsBtn   = document.getElementById('mars-btn');
const marsRes   = document.getElementById('mars-result');
if (marsInput && marsBtn && marsRes) {
  // Küçük yardımcı: bir diziyi Fisher–Yates ile karıştırır
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  async function fetchMarsPhotos() {
    const sol = parseInt(marsInput.value, 10) || 1000;
    marsRes.innerHTML = '<div class="text-muted">Yükleniyor…</div>';
    try {
      const url  = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos` +
                   `?sol=${sol}&api_key=${NASA_API_KEY}`;
      const res  = await fetch(url);
      const data = await res.json();
      let photos = data.photos;
      if (!photos || photos.length === 0) {
        marsRes.innerHTML = `<div class="text-warning">Bu sol için fotoğraf yok.</div>`;
        return;
      }

      // Burada fotoğrafları karıştırıp ilk 3’ü alıyoruz:
      photos = shuffleArray(photos).slice(0, 3);

      marsRes.innerHTML = photos.map(p =>
        `<div style="margin-bottom:.5rem;">
           <img
             src="${p.img_src}"
             alt="Mars photo"
             style="width:100%;border-radius:.5rem;max-height:100px;object-fit:cover;"
           >
           <small style="color:#000000;">
             ${p.rover.name} • ${p.camera.full_name}
           </small>
         </div>`
      ).join('');
    } catch (err) {
      console.error(err);
      marsRes.innerHTML =
        `<div class="text-danger">Mars fotoğrafları alınamadı: ${err.message}</div>`;
    }
  }

  marsBtn.addEventListener('click', fetchMarsPhotos);
  fetchMarsPhotos();
}


// —— 3) NASA Breaking News —————————————————
const newsRes = document.getElementById('news-result');

if (newsRes) {
  async function fetchNews() {
    newsRes.innerHTML = '<div class="text-muted">Yükleniyor…</div>';
    try {
      // RSS’i CORS sorunu olmadan almak için AllOrigins proxy’si kullanıyoruz
      const resp = await fetch(
        'https://api.allorigins.win/raw?url=https://www.nasa.gov/rss/dyn/breaking_news.rss'
      );
      const xmlText = await resp.text();
      const parser  = new DOMParser();
      const xmlDoc  = parser.parseFromString(xmlText, 'application/xml');

      const items = Array.from(xmlDoc.querySelectorAll('item')).slice(0, 5);
      if (items.length === 0) {
        newsRes.innerHTML = '<div class="text-warning">Haber bulunamadı.</div>';
        return;
      }

      newsRes.innerHTML = items.map(item => {
        const title = item.querySelector('title')?.textContent || '—';
        const link  = item.querySelector('link')?.textContent  || '#';
        return `
          <div style="margin-bottom:.75rem;">
            <a href="${link}"
               target="_blank"
               style="color:#1e90ff; text-decoration:none; font-weight:500;">
              ${title}
            </a>
          </div>`;
      }).join('');
    } catch (err) {
      console.error(err);
      newsRes.innerHTML =
        `<div class="text-danger">Haber alınamadı: ${err.message}</div>`;
    }
  }

  // Sayfa yüklendiğinde hemen çalıştır
  fetchNews();

  // İstersen 1 saatte bir yenilemek için (opsiyonel):
   setInterval(fetchNews, 1000 * 60 * 60);
}

});
