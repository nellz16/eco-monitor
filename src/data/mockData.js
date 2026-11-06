export const islandCenter = [-5.93361, 105.98972];

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
