# BGI Cirebon — Blue-Green Atlas

Atlas digital interaktif untuk membaca **prioritas pengembangan Blue-Green Infrastructure (BGI) di Kota Cirebon**. Proyek ini menggantikan ekspor qgis2web/Leaflet lama dengan antarmuka React yang map-first, responsif, dan mudah dipakai di desktop maupun ponsel.

**[Buka atlas →](https://andiakhsanul.github.io/matkulsip/)**

---

## Sorotan

- **Peta tematik 7 layer** — prioritas BGI, bahaya banjir, tutupan lahan, kemiringan lereng, elevasi, jarak dari sungai, dan batas kecamatan.
- **Skor parameter 1–5 dari QGIS** — skor asli pada shapefile parameter dan bahaya banjir tampil di bagian **Parameter analisis**, legenda, tooltip peta, dan detail fitur. Skor tidak diubah atau diinventarisasi ulang.
- **Layer pendukung jaringan jalan RBI 25K** — 883 segmen jalan Kota Cirebon dengan simbol SNI 6502.2:2010: arteri/kolektor magenta dengan casing hitam, lokal hitam dengan casing putih, serta jalan lain/setapak magenta 40% (setapak putus-putus). Layer jalan dapat dinyalakan tanpa mematikan layer tematik.
- **Satu layer tematik aktif** pada satu waktu agar visual tidak saling menutupi, dengan legenda dan kontrol opasitas per layer.
- **Warna peta mengikuti SNI 6502.2:2010** — tutupan lahan memakai tint tinta SNI (permukiman oranye 30%, sawah cyan 30%, kebun hijau 30%, hutan/semak hijau 40%, tegal kuning 40%, tanah kosong tanpa tinta, perairan cyan 100%), batas administrasi garis hitam berpola, dan latar terang putih kertas. Kelas tematik (prioritas, banjir, lereng, elevasi, jarak sungai) tidak diatur SNI sehingga memakai ramp yang diturunkan dari tinta SNI. Tema antarmuka web tetap biru.
- **Filter langsung** berdasarkan kecamatan dan kelas prioritas. Ringkasan area, jumlah fitur, dan grafik ikut menyesuaikan.
- **Tiga basemap keyless** — Terang, Satelit, dan Gelap — tanpa watermark atau API key.
- **Detail fitur** saat diklik: kelas, skor parameter, luas, konteks kecamatan, dan catatan kualitas data.
- **Command palette** (`⌘K` / `Ctrl+K`) untuk berpindah halaman, layer, dan filter.
- **Responsif penuh** — panel mengambang di desktop, bottom sheet di tablet/ponsel, dan dock navigasi seluler.
- **Halaman ringkasan, metodologi, dan tentang** untuk membaca angka penting serta batasan analisis.
- **Deep link aman di GitHub Pages** melalui `404.html` dan `.nojekyll` yang dibuat saat build.

## Stack

| Lapisan | Teknologi |
| --- | --- |
| UI | React 19, TypeScript, Vite 8 |
| Peta | MapLibre GL, react-map-gl |
| Styling | Tailwind CSS v4, Radix UI, Motion |
| State | Zustand |
| Data | GeoJSON hasil optimasi ekspor qgis2web + skor shapefile QGIS + shapefile RBI 25K |
| Grafik | Recharts |
| Ikon | Phosphor Icons |
| Deployment | GitHub Actions → GitHub Pages |

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Vite memakai base path `/matkulsip/`, jadi buka:

```text
http://localhost:5173/matkulsip/
```

Perintah lain:

```bash
npm run typecheck   # pemeriksaan TypeScript
npm run build       # build produksi + 404.html + .nojekyll
npm run preview     # pratinjau build produksi
npm run data        # regenerasi GeoJSON tematik (termasuk skor parameter)
npm run data:scores # ekstrak ulang peta skor dari shapefile QGIS sumber
npm run data:roads  # konversi JALAN_LN_25K/ menjadi public/data/roads.geojson
```

Build lokal dapat dipreview di `http://localhost:4173/matkulsip/`.

## Struktur proyek

```text
.
├── legacy/                       # Ekspor qgis2web asli (referensi, tidak dipakai runtime)
├── JALAN_LN_25K/                 # Shapefile RBI 25K sumber layer jalan
├── public/
│   ├── data/                     # GeoJSON yang sudah dioptimasi
│   └── favicon.svg
├── scripts/
│   ├── convert-data.mjs          # Ekstraksi, deduplikasi, simplifikasi, skor, ringkasan
│   ├── extract-parameter-scores.mjs # Ekstraksi field skor QGIS ke parameter-scores.json
│   ├── parameter-scores.json     # Peta kelas → skor hasil ekstraksi shapefile QGIS
│   ├── convert-roads.mjs         # Konversi shapefile jalan ke GeoJSON + hitung panjang
│   └── postbuild.mjs             # 404.html + .nojekyll
├── src/
│   ├── components/               # Header, footer, brand, search, UI primitives
│   ├── features/
│   │   ├── map/                  # MapView, style, kontrol peta
│   │   ├── panel/                # Layer, filter, statistik, legenda
│   │   ├── detail/               # Panel detail fitur
│   │   └── mobile/               # Dock dan bottom sheet
│   ├── pages/                    # Peta, ringkasan, metodologi, tentang
│   ├── providers/                # Pemuatan data GeoJSON
│   ├── stores/                   # State aplikasi (Zustand)
│   └── lib/                      # Basemap, konstanta, format, util peta
├── .github/workflows/deploy.yml  # Deploy otomatis ke GitHub Pages
└── DESIGN.md                     # Sistem desain dan keputusan antarmuka
```

## Data dan pipeline

Data runtime berada di `public/data/` dan dihasilkan dari ekspor qgis2web di `legacy/`, lalu diperkaya dengan skor dari shapefile QGIS parameter:

| Berkas | Ukuran | Keterangan |
| --- | ---: | --- |
| `priority.geojson` | ~130 KB | 12 fitur prioritas BGI |
| `flood.geojson` | ~251 KB | Bahaya banjir + skor 1/3/5 |
| `admin.geojson` | ~47 KB | Batas 5 kecamatan |
| `factors/landcover.geojson` | ~306 KB | Tutupan lahan + skor 1–5 |
| `factors/slope.geojson` | ~127 KB | Kemiringan lereng + skor 1/3/5 |
| `factors/elevation.geojson` | ~417 KB | Elevasi + skor 1/3/5 |
| `factors/river-distance.geojson` | ~293 KB | Jarak dari sungai + skor 1/3/5 |
| `roads.geojson` | ~265 KB | 883 segmen jalan RBI 25K |
| `summary.json` | — | Angka kanonik untuk UI, legenda, dan grafik |

`scripts/convert-data.mjs` melakukan:

1. ekstraksi geometri dari file JavaScript qgis2web,
2. normalisasi properti dan nama kelas,
3. penambahan properti `score` dari `scripts/parameter-scores.json`,
4. penanganan 24 pasang geometri tutupan lahan yang duplikat, termasuk skor tiap kelas asal,
5. simplifikasi geometri untuk ukuran file yang lebih kecil,
6. pembuatan `summary.json` untuk kartu, filter, legenda, dan statistik.

`scripts/extract-parameter-scores.mjs` membaca field `skor` pada shapefile di `MATKUL SIP SEMUA PARAMETER DISINI/` dan menulis `scripts/parameter-scores.json`. Folder shapefile sumber tidak disertakan dalam repositori; peta skor hasil ekstraksi disimpan agar data runtime tetap dapat dibangun ulang tanpa folder tersebut.

### Skor parameter

Nilai berikut diambil langsung dari field `skor` pada shapefile QGIS dan tidak diubah:

- **Tutupan lahan** — Permukiman 1; Tegalan 3; Perkebunan/kebun, Semak Belukar, Lahan Kosong 4; Sawah Irigasi, Sawah Tadah Hujan, Sungai, Empang 5.
- **Kemiringan lereng** — 0–8% 5; 8–15% 3; >15% 1.
- **Elevasi** — 0–25 m 5; 25–100 m 3; >100 m 1.
- **Jarak dari sungai** — 0–50 m 5; 50–100 m 3; >100 m 1.
- **Bahaya banjir** — Rendah 1; Sedang 3; Tinggi 5 (layer konteks, bukan parameter weighted overlay).

Skor 5 pada empat parameter berarti paling mendukung BGI. Skor tersebut bukan skor akhir prioritas; kelas prioritas adalah hasil weighted overlay dan shapefile prioritas tidak memiliki field `skor` akhir.

`scripts/convert-roads.mjs` membaca `JALAN_LN_25K/JALAN_LN_25K.shp` + `.dbf`, mempertahankan kelas dari atribut `REMARK`, menghitung panjang segmen (haversine), membulatkan koordinat ke enam desimal, lalu menulis `public/data/roads.geojson`. Data sumber tidak memiliki nama jalan; atribut yang bermakna hanya kelas jalan.

### Angka utama

- Area prioritas BGI yang dianalisis: **3.888,72 ha**.
- Prioritas tinggi + sangat tinggi: **2.742,12 ha (70,51%)**.
- Sebaran kelas: Rendah 115,84 ha · Sedang 1.030,76 ha · Tinggi 2.544,90 ha · Sangat Tinggi 197,22 ha.
- Total area administrasi setelah simplifikasi: **3.963,51 ha**; selisih terhadap area analisis **74,79 ha**.
- Tutupan lahan: 72 fitur sumber → 48 geometri unik (24 pasang duplikat).
- Jaringan jalan: **883 segmen · ±251,3 km** — 58 arteri (25,7 km), 14 kolektor (16,9 km), 572 lokal (151,9 km), 58 jalan lain (20,1 km), dan 181 setapak (36,8 km).

### Warna peta

Warna antarmuka tetap memakai tema biru atlas. Di dalam kanvas peta, unsur rupa bumi mengikuti SNI 6502.2:2010 (Spesifikasi penyajian peta rupa bumi skala 1:25.000):

- Tutupan lahan memakai tint tinta SNI: permukiman `#ffd8b2`, sawah (irigasi & tadah hujan) `#b2ffff`, kebun/perkebunan `#e5ffd8`, hutan/semak belukar `#bfff99`, tegalan `#ffff99`, tanah kosong `#ffffff`, dan perairan (sungai/empang) cyan `#00ffff`.
- Jalan arteri/kolektor magenta SNI `#ff66ff` dengan casing hitam; jalan lokal hitam `#000000` dengan casing putih; jalan lain/setapak magenta 40% `#ff99ff` tanpa casing, dengan setapak putus-putus.
- Batas kecamatan digambar garis hitam berpola dengan label hitam, sesuai spesifikasi batas administratif SNI.
- SNI 6502.2:2010 tidak mengatur kelas tematik BGI, sehingga kelas analisis memakai ramp yang diturunkan dari tinta SNI: prioritas hijau bertingkat (`#e5ffd8` → `#1b7a3c`), bahaya banjir kuning → oranye → merah tua, lereng/elevasi oranye kontur `#ff7f00`, dan jarak sungai tint cyan perairan.
- Latar basemap terang memakai putih kertas mengikuti gaya peta rupa bumi.

### Batasan

- Kelas prioritas tinggi dan sangat tinggi mencakup sekitar 70% area analisis. Angka ini perlu dibaca bersama kelas breaks dan metode asli, bukan sebagai rekomendasi lokasi tunggal.
- Geometri telah disederhanakan untuk performa web. Atlas ini cocok untuk eksplorasi dan komunikasi, bukan pengukuran presisi.
- Skor dan kelas parameter mengikuti shapefile QGIS yang disediakan. Proyek QGIS lengkap dan proses weighted overlay tidak disertakan, sehingga perhitungan skor prioritas akhir belum dapat diverifikasi ulang secara independen. Sumber data jalan yang tersedia adalah shapefile RBI 25K, bukan data jaringan jalan terbaru.
- Nama jalan dan atribut teknis jalan tidak tersedia pada sumber (`NAMRJL` kosong); layer jalan hanya membedakan kelas dari atribut `REMARK`.
- Basemap Esri digunakan tanpa API key untuk tampilan publik. Untuk kebutuhan produksi berskala besar, pertimbangkan penyedia basemap berlangganan.

## Deployment

Push ke `main` memicu `.github/workflows/deploy.yml`:

1. `npm ci`
2. `npm run build`
3. unggah `dist/` sebagai artifact Pages
4. deploy ke environment `github-pages`

Aktifkan sekali di **Settings → Pages → Build and deployment → Source: GitHub Actions**. Situs akan tersedia di:

```text
https://andiakhsanul.github.io/matkulsip/
```

Base path `/matkulsip/` ditetapkan di `vite.config.ts`. Jika repositori diganti nama, ubah nilai tersebut dan semua URL kanonis di UI.

## Kredit

- Analisis asli: weighted overlay BGI Kota Cirebon (tutupan lahan 40%, kemiringan 25%, elevasi 25%, jarak sungai 10%).
- Basemap: Esri Light Gray Canvas, Esri Dark Gray Canvas, dan Esri World Imagery; atribusi OpenStreetMap dipertahankan.
- Antarmuka: React, MapLibre GL, Vite, Tailwind CSS, Radix UI, dan Phosphor Icons.

Dibuat sebagai atlas akademik untuk eksplorasi dan diskusi perencanaan kota.
