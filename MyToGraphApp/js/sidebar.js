// js/sidebar.js
// 3 NASA API widgets: APOD, Mars Rover Photos, NASA Image Library

document.addEventListener('DOMContentLoaded', () => {
  const NASA_API_KEY = 'dnygzd7IGEcnhChtgPyBVKAjBfdpgKcuipB3den3';

  // —— 1) Astronomy Picture of the Day (APOD)
  const apodBtn    = document.getElementById('apod-btn');
  const apodResult = document.getElementById('apod-result');
  if (apodBtn && apodResult) {
    async function fetchAPOD() {
      apodResult.innerHTML = '<div class="text-muted">Loading…</div>';
      try {
        const res  = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&count=1`);
        const arr  = await res.json();
        const data = Array.isArray(arr) ? arr[0] : arr;

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
        apodResult.innerHTML = `<div class="text-danger">APOD could not be retrieved: ${err.message}</div>`;
      }
    }

    apodBtn.addEventListener('click', fetchAPOD);
    fetchAPOD();
  }

  // —— 2) Mars Rover Photos 
  const marsInput = document.getElementById('mars-sol-input');
  const marsBtn   = document.getElementById('mars-btn');
  const marsRes   = document.getElementById('mars-result');
  if (marsInput && marsBtn && marsRes) {
    function shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    async function fetchMarsPhotos() {
      const sol = parseInt(marsInput.value, 10) || 1000;
      marsRes.innerHTML = '<div class="text-muted">Loading…</div>';
      try {
        const url  = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos` +
                     `?sol=${sol}&api_key=${NASA_API_KEY}`;
        const res  = await fetch(url);
        const data = await res.json();
        let photos = data.photos;
        if (!photos || photos.length === 0) {
          marsRes.innerHTML = `<div class="text-warning">There is no photo for the left side.</div>`;
          return;
        }

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
          `<div class="text-danger">Mars photos could not be retrieved: ${err.message}</div>`;
      }
    }

    marsBtn.addEventListener('click', fetchMarsPhotos);
    fetchMarsPhotos();
  }

  // —— 3) NASA Image and Video Library )
  const newsRes = document.getElementById('news-result');

  if (newsRes) {
    async function fetchImageLibrary() {
      newsRes.innerHTML = '<div class="text-muted">Loading…</div>';
      try {
        const searchTerm = "galaxy"; 
        const resp = await fetch(`https://images-api.nasa.gov/search?q=${searchTerm}&media_type=image`);
        const data = await resp.json();
        let items = data.collection.items;

        if (!items || items.length === 0) {
          newsRes.innerHTML = '<div class="text-warning">No images found.</div>';
          return;
        }

        // Shuffle and show only 3
        items = items.sort(() => 0.5 - Math.random()).slice(0, 3);

        newsRes.innerHTML = items.map(item => {
          const img = item.links?.[0]?.href;
          const title = item.data?.[0]?.title || 'Untitled';
          const desc = item.data?.[0]?.description || '';
          return `
            <div style="margin-bottom:1rem;">
              <img src="${img}" alt="${title}"
                   style="width:100%;border-radius:.5rem;max-height:100px;object-fit:cover;">
              <small style="color:#000;font-weight:500;">${title}</small><br>
              <small style="color:#666;">${desc.slice(0, 80)}…</small>
            </div>`;
        }).join('');
      } catch (err) {
        console.error(err);
        newsRes.innerHTML = `<div class="text-danger">Images could not be retrieved: ${err.message}</div>`;
      }
    }

    fetchImageLibrary();
  }
});
