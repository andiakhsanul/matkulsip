# Design System — BGI Cirebon Blue-Green Atlas

Dokumen ini mencatat arah visual, token, dan keputusan antarmuka atlas. Tujuannya bukan membuat tampilan generik, melainkan menjadikan data spasial BGI sebagai fokus utama dengan rasa seperti instrumen hidrologi: tenang, presisi, dan biru.

## 1. Arah desain

**Konsep: atlas sebagai instrumen peta.**

- Peta mengisi seluruh kanvas; UI mengambang di atasnya seperti panel instrumen.
- Antarmuka didominasi biru laut dalam, aqua, dan kabut terang, dengan aksen amber yang sangat terbatas untuk peringatan/duplikasi.
- Warna **di dalam peta** dipisahkan dari tema UI: unsur rupa bumi (tutupan lahan, perairan, jalan, batas administrasi) memakai nilai SNI 6502.2:2010, sedangkan kelas tematik memakai ramp yang diturunkan dari tinta SNI (hijau, oranye kontur, cyan), bukan biru UI.
- Permukaan dibuat berlapis: kaca, bayangan lembut, garis tipis, dan ruang kosong yang cukup.
- Data menjadi dekorasi: angka besar, label mono, legenda warna, dan kontur tipis menjadi bahasa visual utama.
- Tidak ada gradient dekoratif yang berlebihan, ilustrasi stok, atau kartu bertumpuk tanpa alasan.

Prinsip:

1. **Peta dulu, panel kemudian.** Panel tidak boleh menutupi area peta lebih dari yang diperlukan.
2. **Progressive disclosure.** Kontrol yang jarang dipakai berada di tab, popover, atau halaman terpisah.
3. **Satu lapisan tematik.** Menghindari layer saling menutupi dan memudahkan pembacaan legenda.
4. **Angka yang dapat dipercaya.** Semua statistik berasal dari `summary.json`, bukan angka hardcode di komponen.
5. **Responsif secara struktural.** Bukan sekadar mengecilkan desktop; mobile mendapat pola interaksi sendiri.

## 2. Tipografi

| Peran | Font | Penggunaan |
| --- | --- | --- |
| Utama | Plus Jakarta Sans Variable | Judul, label, isi, tombol |
| Data | Geist Mono Variable | Angka, satuan, kode, metadata, legenda kecil |

Aturan:

- Judul besar memakai tracking negatif (`-0.04em` hingga `-0.065em`) dan line-height sempit.
- Label kecil memakai uppercase, tracking lebar (`0.1em`–`0.17em`), serta warna redup.
- Angka statistik memakai `tabular-nums` agar tidak bergeser saat filter berubah.
- Ukuran teks UI utama berada di 10–14 px; judul halaman `clamp(2.5rem, 5.4vw, 5rem)`.
- Body copy di panel memakai 9.5–11 px dengan line-height longgar agar tetap terbaca di panel sempit.

## 3. Warna

### Token inti

| Token | Nilai | Fungsi |
| --- | --- | --- |
| `--color-ocean-950` | `#041e33` | Latar tergelap, header aktif, blok formula |
| `--color-ocean-900` | `#05263c` | Teks pada permukaan terang |
| `--color-ocean-700` | `#0a4c72` | Aksen UI dan label antarmuka |
| `--color-blue-700` | `#0a4f94` | Tautan, aksen kuat |
| `--color-blue-600` | `#0b63b8` | Tombol utama, status aktif |
| `--color-blue-500` | `#1683e8` | Fokus, highlight |
| `--color-aqua-500` | `#12a6b8` | Aksen data, grafik |
| `--color-aqua-300` | `#5ed6e2` | Teks di atas latar gelap |
| `--color-mist-50` | `#f5fafe` | Latar halaman |
| `--color-mist-200` | `#d7eaf7` | Garis, pemisah |
| `--color-ink` | `#06283d` | Teks utama |
| `--color-ink-soft` | `#52728a` | Teks sekunder |
| `--color-ink-faint` | `#7d97aa` | Metadata |
| `--color-amber-500` | `#f2a93b` | Peringatan, duplikasi, aksen hangat |

### Warna data prioritas

| Kelas | Warna peta | Peran |
| --- | --- | --- |
| Rendah | `#e5ffd8` | Hijau SNI tint 30% (kebun) |
| Sedang | `#bfff99` | Hijau SNI tint 40% (hutan/semak) |
| Tinggi | `#66cc66` | Hijau sedang |
| Sangat Tinggi | `#1b7a3c` | Hijau gelap |

Ramp hijau bertingkat dipilih karena BGI adalah infrastruktur hijau. SNI 6502.2:2010 tidak mengatur kelas tematik prioritas, sehingga ramp ini adalah palet tematik yang diturunkan dari tint tinta hijau SNI. Grafik statistik memakai palet yang sama agar legenda konsisten.

### Warna peta lainnya

| Unsur | Palet |
| --- | --- |
| Kemiringan lereng | Tint oranye kontur SNI `#ffe5b3` → `#ffb266` → `#ff7f00` |
| Elevasi | Tint oranye kontur SNI `#fff3e6` → `#ffc299` → `#e67300` |
| Jarak dari sungai | Tint cyan perairan SNI `#00ffff` → `#99ffff` → `#ccffff` |
| Tutupan lahan | SNI 6502.2:2010 eksak: permukiman `#ffd8b2`, sawah `#b2ffff`, kebun `#e5ffd8`, hutan/semak `#bfff99`, tegal `#ffff99`, tanah kosong `#ffffff`, perairan `#00ffff` |
| Jalan arteri/kolektor | Magenta SNI `#ff66ff` (0/60/0/0) dengan casing hitam |
| Jalan lokal | Hitam `#000000` dengan casing putih |
| Jalan lain/setapak | Magenta SNI 40% `#ff99ff` tanpa casing; setapak putus-putus |
| Batas kecamatan | Garis hitam `#000000` berpola (garis–titik) dengan label hitam |
| Latar terang | Putih kertas `#ffffff` mengikuti gaya peta rupa bumi |

Rasio penggunaan UI yang dijaga: **90% biru/netral, 10% aksen hangat**. Amber tidak dipakai untuk elemen dekoratif; hanya untuk peringatan, catatan kualitas data, dan hover line. Rasio ini berlaku untuk antarmuka, bukan isi peta.

## 4. Permukaan, radius, dan bayangan

- Radius panel: `30px`; kartu dalam panel: `22px`; kontrol kecil: `12–16px`; pil: `999px`.
- Panel memakai kombinasi `bg-white/72`–`bg-white/90`, `backdrop-blur`, border putih transparan, dan shadow besar yang lembut.
- Shadow utama: `0 24px 80px -24px rgba(6,40,61,.35)`.
- Bayangan tidak dipakai untuk membuat hierarki palsu; hierarki utama dibentuk oleh ukuran, warna, dan ruang.
- Kontrol peta (zoom, compass, locate) berbentuk kapsul vertikal dengan pembatas tipis.

## 5. Layout responsif

### Desktop (`≥ 1024px`)

- Header kapsul mengambang di atas peta.
- Panel kontrol kiri mengambang, lebar tetap, dengan area scroll internal.
- Detail fitur muncul sebagai panel kanan.
- Footer sumber dan atribusi berada di bawah peta.
- Peta tetap interaktif di area yang tidak tertutup panel.

### Tablet (`768–1023px`)

- Panel berubah menjadi drawer dari kiri; detail menjadi drawer dari kanan.
- Header tetap ringkas; pencarian dan menu tetap dapat dijangkau.
- Target sentuh minimal 40 px.

### Mobile (`< 768px`)

- Header kapsul penuh dengan menu full-screen.
- Peta memenuhi layar; kontrol peta dipindah agar tidak bertabrakan dengan dock.
- Dock bawah berisi Layer, Filter, Statistik, dan Detail.
- Panel dibuka sebagai **bottom sheet** dengan snap peek/full, radius atas besar, dan safe-area inset.
- Label kecamatan diperkecil dan diberi offset agar tidak bertumpuk pada lebar sempit.
- Footer situs tidak ditampilkan di peta mobile agar kanvas tetap lapang.

Breakpoint mengikuti Tailwind (`sm`, `md`, `lg`), dengan pengecekan `matchMedia` untuk perilaku panel peta.

## 6. Komponen

### Header

- Kapsul kaca dengan logo, nama atlas, navigasi utama, pencarian, dan tombol menu.
- Navigasi aktif memakai pil gelap `ocean-950` dengan teks putih.
- Command palette dapat dibuka dengan `⌘K`/`Ctrl+K`.

### Panel kontrol

- Tiga tab: Layer, Filter, Statistik.
- Hero prioritas memperlihatkan luas dan persentase prioritas tinggi; kartu ini juga menjadi toggle layer utama.
- Baris layer memakai ikon, bobot, rentang skor QGIS, deskripsi singkat, dan switch.
- Legenda selalu tampil untuk layer aktif. Layer ber-skor menampilkan chip `skor 1–5` per kelas dalam satu kolom agar label tetap terbaca; legenda jalan memakai swatch garis (termasuk pola putus-putus untuk setapak), bukan kotak area.
- Skor berasal dari atribut `skor` shapefile QGIS, bukan nilai yang diturunkan ulang di antarmuka. Untuk empat parameter, skor tinggi berarti lebih mendukung BGI; untuk bahaya banjir, skor tinggi berarti bahaya lebih besar.
- Slider opasitas hanya muncul saat relevan.
- Data quality note ditempatkan dekat layer yang bermasalah, bukan disembunyikan di halaman lain.

### Filter

- Filter kecamatan dan kelas prioritas memakai tombol multi-pilih yang besar.
- Ringkasan area terfilter dihitung langsung dari fitur yang lolos filter.
- Quick filter menyediakan “Hanya prioritas tinggi” dan “Tampilkan seluruh area”.
- Filter kelas hanya memengaruhi layer prioritas; ini dijelaskan secara eksplisit.

### Detail fitur

- Menampilkan kelas, luas, kecamatan, skor parameter/bahaya, dan catatan duplikasi.
- Skor ditampilkan sebagai angka besar `n/5` dengan label sumber atribut QGIS.
- Memiliki aksi untuk memusatkan peta ke fitur.
- Di mobile muncul sebagai tab Detail di bottom sheet.

### Statistik

- Donut chart prioritas, bar kecamatan, dan insight yang dihitung dari data.
- Warna grafik konsisten dengan legenda peta.
- Angka besar menjadi jangkar visual; chart menjadi pendukung, bukan hiasan.

## 7. Peta

- Renderer: MapLibre GL dengan geometri GeoJSON yang sudah disederhanakan.
- Basemap: Esri Light Gray Canvas, Esri Dark Gray Canvas, dan Esri World Imagery; label referensi ditambahkan sebagai raster terpisah untuk mode terang/gelap.
- Semua basemap dipasang sejak awal dan diubah melalui `visibility`, sehingga pergantian basemap tidak mengubah urutan layer tematik.
- Layer prioritas menggunakan fill + garis putih tipis; hover memakai garis oranye kontur SNI `#ff7f00`; seleksi memakai casing putih dan garis hitam, bukan biru.
- Layer jalan adalah layer pendukung independen: tetap tampil saat layer tematik diganti, karena tidak mengikuti aturan satu-layer-tematik. Simbol mengikuti SNI 6502.2:2010 dengan urutan gambar casing → garis. Arteri/kolektor terlihat sejak zoom luas; lokal dan setapak muncul saat peta diperbesar agar tidak memenuhi kanvas.
- Wilayah kecamatan diberi marker label HTML dengan offset khusus untuk pusat kecamatan yang berdekatan. Label memakai tinta hitam dengan latar putih sesuai tipografi batas administratif SNI.
- Tooltip mengikuti kursor dan dibatasi agar tidak keluar viewport; kelas, skor QGIS, dan luas ditampilkan ringkas.
- Peta dibatasi pada bounding box Kota Cirebon; rotasi dinonaktifkan agar orientasi konsisten.

## 8. Gerak

- Menggunakan Motion untuk transisi panel, sheet, dan elemen masuk.
- Durasi pendek (150–350 ms) dengan easing `cubic-bezier(0.16, 1, 0.3, 1)`.
- Animasi hanya untuk menjelaskan perubahan state, bukan untuk dekorasi terus-menerus.
- `prefers-reduced-motion` menonaktifkan animasi secara global.

## 9. Aksesibilitas

- Fokus keyboard terlihat dengan outline biru.
- Semua switch dan tombol memiliki label aksesibel.
- Navigasi utama menggunakan elemen semantik dan state aktif.
- Kontras teks utama dijaga di atas latar putih; teks sekunder tidak dipakai untuk informasi kritis.
- Target sentuh seluler minimal 40–44 px.
- Peta tetap dapat digunakan tanpa hover; detail tersedia lewat klik/tap dan tab Detail.
- Atribusi basemap selalu terlihat di desktop dan dapat dijangkau di mobile.

## 10. Keputusan teknis yang memengaruhi desain

- **MapLibre worker eksplisit.** Worker diimpor dengan `?url` dan dipasang melalui `setWorkerUrl` agar build produksi tidak gagal memuat peta.
- **Filter kosong dihilangkan.** Prop `filter` hanya dikirim saat ada nilai; MapLibre menolak `filter: undefined`.
- **Basemap tidak di-remount.** Ketiga basemap dirender sekali dan di-toggle dengan `visibility` untuk menjaga urutan layer.
- **SPA fallback.** `404.html` disalin dari `index.html` agar deep link GitHub Pages tetap bekerja.
- **Data ringkas.** Geometri disederhanakan dan diringkas saat build data; UI tidak melakukan perhitungan berat di main thread.
