# MarLit Vision — Dashboard Prototype

Frontend demo dashboard untuk proyek MarLit Vision: Sistem Pemantauan Sampah Laut Real-Time Berbasis Edge Computer Vision di Pesisir Dermaga Penyeberangan Wisata Pulau Merak. Dibangun dengan React + Vite, Leaflet 2.0.0-beta.4 (native ESM), Recharts, dan Lucide React.

> **Penting:** seluruh angka, marker klaster, status perangkat, grafik pH/DO, dan notifikasi merupakan data simulasi/dokumentasi survei. Dashboard belum terhubung ke CCTV, YOLO, MQTT, database, probe kualitas air, atau WhatsApp Gateway.

## Fitur demo

- Ringkasan KPI dan dokumentasi survei pesisir Pulomerak.
- Peta interaktif dengan 3 klaster foto GPS agar marker yang sangat berdekatan tidak saling menutupi.
- Klik klaster untuk melihat galeri foto dan metadata tiap foto; koordinat foto asli tetap ditampilkan.
- Titik CCTV usulan dengan foto produk model Hikvision DS-2XC6686G0/P-IZHRS (2.8–12 mm), tautan produk resmi dan datasheet.
- Halaman kualitas air dengan grafik pH dan dissolved oxygen (DO), acuan Wisata Bahari PP 22/2021 Lampiran VIII, serta penjelasan cara membaca grafik.
- Riwayat deteksi sampah dengan pencarian, filter, dan ekspor CSV.
- Pusat peringatan dengan aksi simulasi.
- Inventaris perangkat, skeleton shimmer, dan layout responsif.

## Versi Leaflet

Menggunakan `leaflet@2.0.0-beta.4`, versi pre-release yang memperbaiki jitter tiles/markers/overlays saat `flyTo` dan meningkatkan performa animated panning. Integrasi memakai class ESM (`LeafletMap`, `Marker`, `TileLayer`, dan lainnya), bukan React Leaflet. Leaflet 2 masih beta; evaluasi kembali stabilitas/kompatibilitas sebelum penggunaan produksi.

## Perbaikan marker peta

Sembilan foto survei dikelompokkan menjadi tiga klaster yang koordinat tampilannya merupakan titik tengah anggota klaster. Setiap foto tetap mempertahankan koordinat GPS aslinya pada panel detail. Marker tidak menggunakan `flyTo` otomatis saat dipilih, inertia dimatikan, dan animasi zoom/fade marker dinonaktifkan untuk mengurangi lompatan visual saat peta digeser atau di-zoom. Tombol fokus menggunakan `setView` tanpa animasi.

## Kualitas air

Data pH dan DO pada `src/data/mockData.js` adalah nilai simulasi. Acuan UI dipilih sebagai Wisata Bahari dari Lampiran VIII PP RI No. 22 Tahun 2021: pH 7,0–8,5 dan DO >5 mg/L. Jika peruntukan resmi lokasi masuk kategori Pelabuhan, acuan pH pada lampiran adalah 6,5–8,5 dan kolom DO tidak mencantumkan nilai numerik. Jangan menganggap grafik sebagai hasil ukur atau penetapan status mutu air aktual.

## Foto kamera

Foto produk yang digunakan adalah gambar listing model DS-2XC6686G0/P-IZHRS dari sumber DSSL yang menampilkan varian **With -R Model** (dengan wiper) di bagian atas. Verifikasi model dan spesifikasi melalui halaman produk Hikvision serta datasheet yang ditautkan di dashboard.

## Menjalankan lokal

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Deploy Vercel

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_CARTO_API_KEY` bila menggunakan CARTO. Jika kosong, map menggunakan fallback OpenStreetMap.

## Sumber data

- `src/data/mockData.js`: demo detections, alert, chart, foto observasi GPS, klaster observasi, kamera usulan, dan pH/DO simulasi.
- `public/survey/obs-01.jpg`–`obs-09.jpg`: sembilan foto survei pengguna tanggal 11 November 2026.

Foto-foto lapangan menggambarkan kondisi yang terlihat pada saat dokumentasi; kategorisasi kepadatan di dashboard merupakan interpretasi visual awal, bukan hitung AI atau penimbangan. Titik CCTV masih usulan.
