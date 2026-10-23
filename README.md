# BGI Cirebon — Blue-Green Atlas

Atlas digital interaktif untuk membaca **prioritas pengembangan Blue-Green Infrastructure (BGI) di Kota Cirebon**. Proyek ini menggantikan ekspor qgis2web/Leaflet lama dengan antarmuka React yang map-first, responsif, dan mudah dipakai di desktop maupun ponsel.

**[Buka atlas →](https://andiakhsanul.github.io/matkulsip/)**

---

## Sorotan

- **Peta tematik 7 layer** — prioritas BGI, bahaya banjir, tutupan lahan, kemiringan lereng, elevasi, jarak dari sungai, dan batas kecamatan.
- **Layer pendukung jaringan jalan RBI 25K** — 883 segmen jalan Kota Cirebon dengan simbol arteri/kolektor magenta, lokal hitam-putih, serta jalan lain/setapak magenta muda mengikuti SNI 6502.2:2010. Layer jalan dapat dinyalakan tanpa mematikan layer tematik.
- **Satu layer tematik aktif** pada satu waktu agar visual tidak saling menutupi, dengan legenda dan kontrol opasitas per layer.
- **Warna peta mengikuti konvensi SNI/RBI** — hijau–kuning–oranye–merah untuk kelas prioritas, warna tanah untuk lereng/elevasi, dan biru hanya untuk unsur air. Tema antarmuka web tetap biru.
- **Filter langsung** berdasarkan kecamatan dan kelas prioritas. Ringkasan area, jumlah fitur, dan grafik ikut menyesuaikan.
- **Tiga basemap keyless** — Terang, Satelit, dan Gelap — tanpa watermark atau API key.
- **Detail fitur** saat diklik: kelas prioritas, luas, konteks kecamatan, dan catatan kualitas data.
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
| Data | GeoJSON hasil optimasi dari ekspor qgis2web + shapefile RBI 25K |
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
npm run data        # regenerasi GeoJSON tematik dari folder legacy/
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
│   ├── convert-data.mjs          # Ekstraksi, deduplikasi, simplifikasi, ringkasan
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

Data runtime berada di `public/data/` dan dihasilkan dari ekspor qgis2web di `legacy/`:

| Berkas | Ukuran | Keterangan |
| --- | ---: | --- |
| `priority.geojson` | ~130 KB | 12 fitur prioritas BGI |
| `flood.geojson` | ~250 KB | Bahaya banjir |
| `admin.geojson` | ~47 KB | Batas 5 kecamatan |
| `factors/landcover.geojson` | ~304 KB | Tutupan lahan |
| `factors/slope.geojson` | ~126 KB | Kemiringan lereng |
| `factors/elevation.geojson` | ~417 KB | Elevasi |
| `factors/river-distance.geojson` | ~293 KB | Jarak dari sungai |
| `roads.geojson` | ~265 KB | 883 segmen jalan RBI 25K |
| `summary.json` | — | Angka kanonik untuk UI dan grafik |

`scripts/convert-data.mjs` melakukan:

1. ekstraksi geometri dari file JavaScript qgis2web,
2. normalisasi properti dan nama kelas,
3. penanganan 24 pasang geometri tutupan lahan yang duplikat,
4. simplifikasi geometri untuk ukuran file yang lebih kecil,
5. pembuatan `summary.json` untuk kartu, filter, dan statistik.

`scripts/convert-roads.mjs` membaca `JALAN_LN_25K/JALAN_LN_25K.shp` + `.dbf`, mempertahankan kelas dari atribut `REMARK`, menghitung panjang segmen (haversine), membulatkan koordinat ke enam desimal, lalu menulis `public/data/roads.geojson`. Data sumber tidak memiliki nama jalan; atribut yang bermakna hanya kelas jalan.

### Angka utama

- Area prioritas BGI yang dianalisis: **3.888,72 ha**.
- Prioritas tinggi + sangat tinggi: **2.742,12 ha (70,51%)**.
- Sebaran kelas: Rendah 115,84 ha · Sedang 1.030,76 ha · Tinggi 2.544,90 ha · Sangat Tinggi 197,22 ha.
- Total area administrasi setelah simplifikasi: **3.963,51 ha**; selisih terhadap area analisis **74,79 ha**.
- Tutupan lahan: 72 fitur sumber → 48 geometri unik (24 pasang duplikat).
- Jaringan jalan: **883 segmen · ±251,3 km** — 58 arteri (25,7 km), 14 kolektor (16,9 km), 572 lokal (151,9 km), 58 jalan lain (20,1 km), dan 181 setapak (36,8 km).

### Warna peta

Warna antarmuka tetap memakai tema biru atlas. Di dalam kanvas peta, warna tematik tidak lagi memakai biru sebagai warna kelas:

- Prioritas dan bahaya banjir memakai urutan hijau → kuning → oranye → merah.
- Kemiringan dan elevasi memakai gradasi tanah/okre; jarak sungai memakai hijau muda–tua.
- Tutupan lahan mengikuti warna RBI/SNI; biru hanya dipakai untuk badan air (sungai, empang).
- Simbol jalan mengikuti SNI 6502.2:2010: arteri/kolektor magenta dengan casing hitam, lokal hitam dengan casing putih, jalan lain/setapak magenta muda.

### Batasan

- Kelas prioritas tinggi dan sangat tinggi mencakup sekitar 70% area analisis. Angka ini perlu dibaca bersama kelas breaks dan metode asli, bukan sebagai rekomendasi lokasi tunggal.
- Geometri telah disederhanakan untuk performa web. Atlas ini cocok untuk eksplorasi dan komunikasi, bukan pengukuran presisi.
- Proyek QGIS dan data mentah tidak tersedia di repositori ini, sehingga model weighted overlay tidak dapat diverifikasi ulang secara independen. Sumber data jalan yang tersedia adalah shapefile RBI 25K, bukan data jaringan jalan terbaru.
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
