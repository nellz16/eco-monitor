export const coastalCenter = [-5.9368808, 106.0001942]; // rerata koordinat 9 foto observasi GPS

export const detections = [
  { id: 'DET-2611-0248', time: '11:32:18', date: '06 Nov 2026', type: 'Botol plastik', classKey: 'bottle', confidence: 96.8, zone: 'Zona A', density: 'Tinggi', status: 'Perlu ditangani', lat: -5.93285, lng: 105.98775 },
  { id: 'DET-2611-0247', time: '11:27:43', date: '06 Nov 2026', type: 'Kantong plastik', classKey: 'bag', confidence: 93.4, zone: 'Zona A', density: 'Tinggi', status: 'Perlu ditangani', lat: -5.93342, lng: 105.98835 },
  { id: 'DET-2611-0246', time: '11:18:06', date: '06 Nov 2026', type: 'Styrofoam', classKey: 'foam', confidence: 89.2, zone: 'Zona B', density: 'Sedang', status: 'Dipantau', lat: -5.93510, lng: 105.99110 },
  { id: 'DET-2611-0245', time: '11:04:51', date: '06 Nov 2026', type: 'Botol plastik', classKey: 'bottle', confidence: 97.1, zone: 'Zona C', density: 'Rendah', status: 'Dipantau', lat: -5.93175, lng: 105.99205 },
  { id: 'DET-2611-0244', time: '10:58:24', date: '06 Nov 2026', type: 'Kantong plastik', classKey: 'bag', confidence: 91.6, zone: 'Zona B', density: 'Sedang', status: 'Ditangani', lat: -5.93445, lng: 105.99020 },
  { id: 'DET-2611-0243', time: '10:42:11', date: '06 Nov 2026', type: 'Botol plastik', classKey: 'bottle', confidence: 95.3, zone: 'Zona A', density: 'Tinggi', status: 'Ditangani', lat: -5.93305, lng: 105.98805 },
  { id: 'DET-2611-0242', time: '10:26:32', date: '06 Nov 2026', type: 'Styrofoam', classKey: 'foam', confidence: 87.9, zone: 'Zona C', density: 'Rendah', status: 'Dipantau', lat: -5.93205, lng: 105.99170 },
  { id: 'DET-2611-0241', time: '10:11:09', date: '06 Nov 2026', type: 'Botol plastik', classKey: 'bottle', confidence: 94.7, zone: 'Zona A', density: 'Tinggi', status: 'Ditangani', lat: -5.93400, lng: 105.98880 },
];

export const alertsSeed = [
  { id: 'ALT-0081', title: 'Kepadatan sampah meningkat', description: 'Zona A melewati ambang batas simulasi selama 10 menit.', time: '11:30 WIB', zone: 'Zona A', level: 'critical', status: 'Belum ditangani' },
  { id: 'ALT-0080', title: 'Deteksi sampah berulang', description: 'Objek botol plastik terdeteksi berulang di area pengamatan.', time: '10:08 WIB', zone: 'Zona B', level: 'warning', status: 'Dipantau' },
  { id: 'ALT-0079', title: 'Kepadatan kembali normal', description: 'Jumlah deteksi di Zona C berada di bawah ambang batas.', time: '09:45 WIB', zone: 'Zona C', level: 'info', status: 'Selesai' },
];

export const trendToday = [
  { time: '06.00', bottle: 8, bag: 4, foam: 2 },
  { time: '07.00', bottle: 12, bag: 5, foam: 3 },
  { time: '08.00', bottle: 18, bag: 8, foam: 4 },
  { time: '09.00', bottle: 15, bag: 7, foam: 5 },
  { time: '10.00', bottle: 23, bag: 11, foam: 6 },
  { time: '11.00', bottle: 29, bag: 13, foam: 7 },
  { time: '12.00', bottle: 34, bag: 16, foam: 9 },
];

export const trendWeek = [
  { time: 'Sen', bottle: 82, bag: 31, foam: 16 },
  { time: 'Sel', bottle: 94, bag: 38, foam: 19 },
  { time: 'Rab', bottle: 76, bag: 28, foam: 14 },
  { time: 'Kam', bottle: 112, bag: 46, foam: 21 },
  { time: 'Jum', bottle: 126, bag: 53, foam: 25 },
  { time: 'Sab', bottle: 105, bag: 42, foam: 18 },
  { time: 'Min', bottle: 138, bag: 61, foam: 29 },
];

export const trendMonth = [
  { time: '01–05', bottle: 360, bag: 145, foam: 62 },
  { time: '06–10', bottle: 410, bag: 171, foam: 75 },
  { time: '11–15', bottle: 382, bag: 164, foam: 68 },
  { time: '16–20', bottle: 445, bag: 190, foam: 82 },
  { time: '21–25', bottle: 428, bag: 182, foam: 79 },
  { time: '26–30', bottle: 502, bag: 216, foam: 94 },
];


// Dokumentasi lapangan yang dikirim pengguna (GPS Map Camera, 11 November 2026).
// Indikator kepadatan merupakan interpretasi visual awal, bukan hasil inferensi AI/penimbangan.
export const coastalObservations = [
  {
    id: 'OBS-001', lat: -5.937408, lng: 106.000272, image: '/survey/obs-01.jpg',
    title: 'Akumulasi sampah di garis pantai berbatu', type: 'Sampah campuran pesisir',
    composition: 'Kemasan plastik, kantong, dan material campuran yang tampak pada dokumentasi.',
    density: 'Tinggi', densityNote: 'Penumpukan padat pada batas darat–air',
    area: 'Pesisir selatan', date: '11 Nov 2026', time: '12:16 WIB',
    source: 'Foto GPS Map Camera', sourceNote: 'Dokumentasi observasi lapangan',
    amount: 'Belum dihitung', confidence: 'Belum diuji AI',
    description: 'Sampah tampak terkumpul di antara bebatuan dan sepanjang garis air.'
  },
  {
    id: 'OBS-002', lat: -5.937412, lng: 106.000219, image: '/survey/obs-02.jpg',
    title: 'Tumpukan sampah dekat akses pesisir', type: 'Sampah campuran pesisir',
    composition: 'Sampah kemasan/plastik dan material campuran di sekitar tepi perairan.',
    density: 'Tinggi', densityNote: 'Akumulasi padat di tepi air',
    area: 'Pesisir selatan', date: '11 Nov 2026', time: '12:16 WIB',
    source: 'Foto GPS Map Camera', sourceNote: 'Dokumentasi observasi lapangan',
    amount: 'Belum dihitung', confidence: 'Belum diuji AI',
    description: 'Terlihat akumulasi sampah di sekitar kawasan aktivitas warga dan akses perahu.'
  },
  {
    id: 'OBS-003', lat: -5.937343, lng: 106.000083, image: '/survey/obs-03.jpg',
    title: 'Sampah terapung dekat dermaga', type: 'Sampah terapung campuran',
    composition: 'Objek ringan/kemasan kecil yang tampak mengapung.',
    density: 'Sedang', densityNote: 'Sebaran objek terlihat pada permukaan air',
    area: 'Tambatan perahu tengah', date: '11 Nov 2026', time: '10:15 WIB',
    source: 'Foto GPS Map Camera', sourceNote: 'Dokumentasi observasi lapangan',
    amount: 'Belum dihitung', confidence: 'Belum diuji AI',
    description: 'Beberapa objek terlihat di permukaan air di sekitar struktur dermaga.'
  },
  {
    id: 'OBS-004', lat: -5.937296, lng: 106.000049, image: '/survey/obs-04.jpg',
    title: 'Sampah terapung di area tambatan perahu', type: 'Sampah terapung campuran',
    composition: 'Kemasan dan potongan material ringan yang terlihat di permukaan air.',
    density: 'Sedang', densityNote: 'Objek tersebar di area tambatan',
    area: 'Tambatan perahu tengah', date: '11 Nov 2026', time: '10:15 WIB',
    source: 'Foto GPS Map Camera', sourceNote: 'Dokumentasi observasi lapangan',
    amount: 'Belum dihitung', confidence: 'Belum diuji AI',
    description: 'Sampah terapung terlihat di sela perahu yang sedang bersandar.'
  },
  {
    id: 'OBS-005', lat: -5.937387, lng: 105.999837, image: '/survey/obs-05.jpg',
    title: 'Sebaran sampah ringan di permukaan air', type: 'Sampah terapung campuran',
    composition: 'Beberapa objek kecil yang tampak mengapung.',
    density: 'Rendah', densityNote: 'Sebaran relatif jarang pada foto',
    area: 'Tambatan perahu tengah', date: '11 Nov 2026', time: '10:14 WIB',
    source: 'Foto GPS Map Camera', sourceNote: 'Dokumentasi observasi lapangan',
    amount: 'Belum dihitung', confidence: 'Belum diuji AI',
    description: 'Objek sampah tampak tersebar dan tidak membentuk tumpukan besar pada bidang foto.'
  },
  {
    id: 'OBS-006', lat: -5.936012, lng: 106.000186, image: '/survey/obs-06.jpg',
    title: 'Akumulasi sampah di antara perahu', type: 'Sampah campuran pesisir',
    composition: 'Sampah campuran di area tepi air dan sekitar perahu.',
    density: 'Tinggi', densityNote: 'Tumpukan terkonsentrasi di dekat perahu',
    area: 'Pesisir permukiman utara', date: '11 Nov 2026', time: '09:44 WIB',
    source: 'Foto GPS Map Camera', sourceNote: 'Dokumentasi observasi lapangan',
    amount: 'Belum dihitung', confidence: 'Belum diuji AI',
    description: 'Akumulasi sampah terlihat pada sisi pesisir yang berdekatan dengan perahu dan vegetasi.'
  },
  {
    id: 'OBS-007', lat: -5.936114, lng: 106.000379, image: '/survey/obs-07.jpg',
    title: 'Tumpukan sampah di area tambatan perahu', type: 'Sampah campuran pesisir',
    composition: 'Kemasan plastik dan material campuran yang tertahan di sela perahu.',
    density: 'Tinggi', densityNote: 'Penumpukan padat di tepi perairan',
    area: 'Pesisir permukiman utara', date: '11 Nov 2026', time: '09:34 WIB',
    source: 'Foto GPS Map Camera', sourceNote: 'Dokumentasi observasi lapangan',
    amount: 'Belum dihitung', confidence: 'Belum diuji AI',
    description: 'Sampah terkumpul di ruang antara perahu yang ditambatkan dan tepian pesisir.'
  },
  {
    id: 'OBS-008', lat: -5.936367, lng: 106.000398, image: '/survey/obs-08.jpg',
    title: 'Sampah terapung di kolam tambatan', type: 'Sampah terapung campuran',
    composition: 'Objek kemasan kecil dan potongan material yang terlihat di permukaan air.',
    density: 'Sedang', densityNote: 'Sebaran objek di beberapa bagian permukaan',
    area: 'Pesisir permukiman utara', date: '11 Nov 2026', time: '09:33 WIB',
    source: 'Foto GPS Map Camera', sourceNote: 'Dokumentasi observasi lapangan',
    amount: 'Belum dihitung', confidence: 'Belum diuji AI',
    description: 'Sampah terlihat mengapung di kolam kecil di antara perahu dan tepian dermaga.'
  },
  {
    id: 'OBS-009', lat: -5.936588, lng: 106.000325, image: '/survey/obs-09.jpg',
    title: 'Sebaran sampah di area perahu', type: 'Sampah terapung campuran',
    composition: 'Beberapa potongan kemasan dan objek ringan di permukaan air.',
    density: 'Sedang', densityNote: 'Objek tersebar di sekitar perahu',
    area: 'Pesisir permukiman utara', date: '11 Nov 2026', time: '09:32 WIB',
    source: 'Foto GPS Map Camera', sourceNote: 'Dokumentasi observasi lapangan',
    amount: 'Belum dihitung', confidence: 'Belum diuji AI',
    description: 'Sejumlah objek tampak mengapung di antara perahu yang sedang bersandar.'
  }
];



// Foto produk yang dirujuk untuk model kamera yang dipilih. Sumber gambar menampilkan
// dua varian; varian atas berlabel "With -R Model" adalah varian dengan wiper (IZHRS).
export const hikvisionCamera = {
  model: 'Hikvision DS-2XC6686G0/P-IZHRS (2.8–12 mm)',
  productImage: 'https://www.dssl.ru/upload/iblock/530/DS_2XC6686G0_P_IZHRS_2.8_12_4.jpg',
  productPage: 'https://securitylab.hikvision.com/en/products/IP-Products/Explosion-Proof---Anti-corrosion-Series/Anti-corrosion-Series/ds-2xc6686g0-p-izh-r-s/',
  datasheet: 'https://assets.hikvision.com/prd/normal/all/doc/m000061886/DS-2XC6686G0_P-IZHRS_Datasheet_20260304.pdf',
};

// Tiga klaster foto menghindari marker saling menutupi pada koordinat yang sangat berdekatan.
// Koordinat klaster adalah titik tengah foto anggota; setiap foto tetap menyimpan GPS aslinya.
export const coastalObservationClusters = [
  {
    id: 'CL-01', lat: -5.937410, lng: 106.000246, label: 'Pesisir selatan', density: 'Tinggi',
    description: 'Dua dokumentasi menunjukkan akumulasi sampah pada garis pantai dan akses pesisir.',
    observations: coastalObservations.filter((item) => ['OBS-001', 'OBS-002'].includes(item.id)),
  },
  {
    id: 'CL-02', lat: -5.937342, lng: 105.999990, label: 'Tambatan perahu tengah', density: 'Sedang',
    description: 'Tiga dokumentasi memperlihatkan sampah terapung di sekitar area tambatan perahu.',
    observations: coastalObservations.filter((item) => ['OBS-003', 'OBS-004', 'OBS-005'].includes(item.id)),
  },
  {
    id: 'CL-03', lat: -5.936270, lng: 106.000322, label: 'Pesisir permukiman utara', density: 'Tinggi',
    description: 'Empat dokumentasi menunjukkan akumulasi dan sebaran sampah di sela perahu dan tepi permukiman.',
    observations: coastalObservations.filter((item) => ['OBS-006', 'OBS-007', 'OBS-008', 'OBS-009'].includes(item.id)),
  },
];

// Posisi CCTV berikut adalah titik usulan untuk prototipe, bukan perangkat yang telah dipasang.
// Foto yang ditampilkan merupakan foto referensi area, bukan live stream CCTV.
export const proposedCameras = [
  {
    id: 'CCTV-01', name: 'CCTV-01 · Pesisir permukiman utara',
    productModel: hikvisionCamera.model, productImage: hikvisionCamera.productImage, productPage: hikvisionCamera.productPage, datasheet: hikvisionCamera.datasheet,
    lat: -5.93602, lng: 106.00052, status: 'Titik usulan',
    coverage: 'Area tambatan perahu dan akumulasi sampah sisi utara',
    resolution: 'Target kamera outdoor 4K',
    mounting: 'Usulan pemasangan pada tiang/struktur darat yang aman',
    view: 'Arah pantau ke area tambatan perahu dan garis air',
    image: '/survey/obs-07.jpg',
    note: 'Lokasi dan arah kamera masih perlu validasi lapangan serta izin pengelola.'
  },
  {
    id: 'CCTV-02', name: 'CCTV-02 · Pesisir selatan',
    productModel: hikvisionCamera.model, productImage: hikvisionCamera.productImage, productPage: hikvisionCamera.productPage, datasheet: hikvisionCamera.datasheet,
    lat: -5.93728, lng: 106.00042, status: 'Titik usulan',
    coverage: 'Garis pantai berbatu dan akses perahu sisi selatan',
    resolution: 'Target kamera outdoor 4K',
    mounting: 'Usulan pemasangan pada tiang/struktur darat yang aman',
    view: 'Arah pantau ke garis pantai dan permukaan air dekat permukiman',
    image: '/survey/obs-01.jpg',
    note: 'Foto hanya menjadi referensi lokasi pengamatan, bukan cuplikan CCTV aktual.'
  }
];
