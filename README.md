# ECO-MONITOR AI — Dashboard Prototype

Frontend demo dashboard untuk proyek ASIK ECO-MONITOR AI. Dibangun dengan React + Vite, **Leaflet 2.0.0-beta.2 (native ESM)**, Recharts, dan Lucide React.

> **Penting:** seluruh angka, marker, status perangkat, kepadatan heatmap, dan notifikasi di proyek ini adalah data simulasi. Dashboard belum tersambung ke CCTV, YOLO, MQTT, database, atau WhatsApp Gateway.

## Fitur demo

- Ringkasan KPI pemantauan, tren deteksi, komposisi sampah, dan peringatan.
- Peta interaktif Perairan Pulau Merak Besar dengan heat spot radial, zona, marker deteksi, dan marker kamera.
- Toggle lapisan Heatmap, Zona, Deteksi, dan Kamera.
- Kontrol zoom Leaflet di kanan atas, fokus ulang lokasi, dan fullscreen.
- Riwayat deteksi dengan pencarian, filter, serta ekspor CSV.
- Pusat peringatan dengan aksi tandai ditangani dan tombol membuat alert uji.
- Halaman status perangkat dan arsitektur integrasi.
- Skeleton shimmer saat aplikasi pertama dibuka, berpindah halaman, dan refresh.
- Layout responsif untuk desktop dan ponsel.

## Versi peta

Proyek ini menggunakan Leaflet **2.0.0-beta.2**, dirilis sebagai pre-release pada 6 November 2026. Integrasi dilakukan langsung melalui class ESM Leaflet, bukan React Leaflet, agar tidak bergantung pada wrapper React yang belum dipastikan kompatibel dengan Leaflet 2.

Perubahan API mengikuti panduan migrasi Leaflet 1.x ke 2.0:

- `LeafletMap` digunakan sebagai pengganti factory `L.map()`.
- `TileLayer`, `Circle`, `CircleMarker`, `Marker`, `DivIcon`, `LayerGroup`, `ZoomControl`, dan `ScaleControl` diimpor sebagai named exports.
- CSS Leaflet dimuat melalui `leaflet/styles.css`.

Leaflet 2.0 masih beta; untuk implementasi produksi, evaluasi kompatibilitas plugin, browser, dan stabilitas rilis sebelum mengunci versi.

## Menjalankan secara lokal

Gunakan Node.js 20 LTS atau versi stabil yang kompatibel.

```bash
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan Vite, biasanya `http://localhost:5173`.

Untuk menguji hasil production build:

```bash
npm run build
npm run preview
```

## Deploy ke Vercel Hobby

1. Buat repository GitHub dan upload seluruh isi folder ini.
2. Di Vercel pilih **Add New → Project**, lalu import repository.
3. Framework preset: **Vite**.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Klik Deploy.

Tidak memerlukan environment variables untuk versi demo ini.

## Mengganti data simulasi

Data contoh terletak di:

- `src/data/mockData.js`

Koordinat pusat peta dan marker pada file tersebut masih koordinat ilustratif. Pastikan menggantinya dengan hasil survei/kalibrasi lapangan sebelum menyebutnya sebagai koordinat deteksi nyata.

## Integrasi backend di tahap berikutnya

Arsitektur integrasi yang direncanakan:

```text
CCTV / Edge Device
       │
       ▼
 YOLO / Object Tracking
       │ metadata
       ▼
 MQTT Broker → Backend API
                    │
                    ├── Database (opsional sesuai kebutuhan)
                    ├── REST API / WebSocket → Vercel Dashboard
                    └── WhatsApp Gateway (Go + whatsmeow) di Koyeb
```

Untuk saat ini frontend masih membaca data statis dari `mockData.js`. Ketika API siap, ganti sumber data tersebut dengan `fetch()` ke backend dan gunakan WebSocket/SSE bila dibutuhkan pembaruan real-time.

## Catatan heatmap

Heatmap saat ini merupakan visualisasi demo menggunakan radial gradient yang diposisikan pada koordinat ilustratif. Ini bukan hasil interpolasi spasial dari sensor atau data deteksi aktual. Nilai kepadatan perlu dihitung dan divalidasi dari data lapangan sebelum digunakan untuk analisis ilmiah.

## Catatan deployment WhatsApp Gateway

Jika menggunakan `whatsmeow`, sediakan penyimpanan sesi SQL (SQLite atau PostgreSQL). File SQLite pada local SSD Koyeb tidak boleh dianggap persisten: Koyeb mendokumentasikan bahwa local storage bersifat ephemeral. Kehilangan file sesi dapat mengharuskan pairing ulang WhatsApp. Uptime monitoring juga tidak menjamin koneksi WhatsApp selalu online.
