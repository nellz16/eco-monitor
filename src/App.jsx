import React, { useEffect, useRef, useState } from 'react';
import {
  Activity, AlertOctagon, AlertTriangle, ArrowDownRight, ArrowUpRight,
  Bell, Check, CheckCircle2, ChevronRight, CircleHelp, Clock3, Cpu, Download,
  ExternalLink, Eye, FileText, Filter, Gauge, Info, Leaf, Map as MapIcon, MapPin,
  Menu, MessageCircle, MoreHorizontal, Radio, RefreshCw, Search, Send, ShieldCheck,
  Waves, Wifi, X, Zap, Crosshair, Maximize2, Minimize2, BookOpen
} from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis
} from 'recharts';
import { LeafletMap, TileLayer, Circle, CircleMarker, LayerGroup, ZoomControl, ScaleControl, Marker, DivIcon } from 'leaflet';
import { alertsSeed, detections, coastalCenter, coastalObservations, proposedCameras, trendMonth, trendToday, trendWeek } from './data/mockData';

const navItems = [
  { id: 'overview', label: 'Ringkasan', icon: Activity, section: 'MONITORING' },
  { id: 'map', label: 'Peta Sebaran', icon: MapIcon },
  { id: 'detections', label: 'Deteksi AI', icon: Eye, count: '248' },
  { id: 'alerts', label: 'Peringatan', icon: Bell, count: '2', alert: true },
  { id: 'devices', label: 'Perangkat', icon: Radio, section: 'SISTEM' },
];

const pageMeta = {
  overview: ['Ringkasan pemantauan', 'Pantau kondisi sampah laut dari satu tempat.'],
  map: ['Peta observasi pesisir', 'Jelajahi dokumentasi sampah di pesisir permukiman dan tambatan perahu Pulomerak.'],
  detections: ['Riwayat deteksi AI', 'Contoh log deteksi untuk demonstrasi pemantauan sampah pesisir.'],
  alerts: ['Pusat peringatan', 'Pantau kondisi yang membutuhkan perhatian petugas lapangan.'],
  devices: ['Status perangkat', 'Kondisi perangkat pemantauan dan konektivitas sistem.'],
};

function formatNow(value = new Date()) {
  return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(value);
}

function Badge({ children, tone = 'neutral', dot = false }) {
  return <span className={`badge badge-${tone}`}>{dot && <i />}{children}</span>;
}

function MetricCard({ title, value, unit, change, trend = 'up', icon: Icon, tone, footnote }) {
  return (
    <article className="metric-card">
      <div className="metric-top">
        <span className={`metric-icon metric-${tone}`}><Icon size={18} strokeWidth={2.1} /></span>
        <span className="metric-label">{title}</span>
      </div>
      <div className="metric-value-row"><strong>{value}</strong>{unit && <span>{unit}</span>}</div>
      <div className="metric-foot">
        <span className={`metric-change ${trend}`}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{change}
        </span>
        <span className="muted">{footnote}</span>
      </div>
    </article>
  );
}

function MapFeatureDetail({ feature, onClose }) {
  if (!feature) return null;
  const isCamera = feature.kind === 'camera';
  const item = feature.data;
  const lat = item.lat;
  const lng = item.lng;
  const densityTone = item.density === 'Tinggi' ? 'danger' : item.density === 'Sedang' ? 'warning' : 'success';

  return (
    <section className="map-feature-detail" aria-live="polite">
      <div className="map-feature-image-wrap">
        <img src={item.image} alt={isCamera ? `Foto referensi area ${item.name}` : `Dokumentasi ${item.title}`} />
        <span className={`map-feature-image-tag ${isCamera ? 'camera-tag' : 'observation-tag'}`}>
          {isCamera ? 'FOTO REFERENSI AREA' : 'DOKUMENTASI LAPANGAN'}
        </span>
      </div>
      <div className="map-feature-content">
        <div className="map-feature-title-row">
          <div>
            <span className="map-feature-kicker">{isCamera ? 'TITIK CCTV USULAN' : `TITIK OBSERVASI · ${item.id}`}</span>
            <h4>{isCamera ? item.name : item.title}</h4>
          </div>
          <button className="map-feature-close" onClick={onClose} aria-label="Tutup detail" title="Tutup detail"><X size={17} /></button>
        </div>

        {isCamera ? (
          <>
            <div className="map-feature-chips"><Badge tone="info" dot>Belum terpasang</Badge><Badge tone="neutral">Rencana perangkat</Badge></div>
            <div className="map-feature-data-grid">
              <div><small>Area cakupan</small><strong>{item.coverage}</strong></div>
              <div><small>Resolusi target</small><strong>{item.resolution}</strong></div>
              <div><small>Rencana pemasangan</small><strong>{item.mounting}</strong></div>
              <div><small>Arah pantau</small><strong>{item.view}</strong></div>
              <div><small>Koordinat usulan</small><strong>{lat.toFixed(6)}, {lng.toFixed(6)}</strong></div>
              <div><small>Status streaming</small><strong>Belum tersedia</strong></div>
            </div>
            <p className="map-feature-note"><Info size={14} />{item.note} Foto di atas merupakan dokumentasi lapangan sebagai referensi, bukan rekaman CCTV aktual.</p>
          </>
        ) : (
          <>
            <div className="map-feature-chips">
              <Badge tone={densityTone} dot>Kepadatan visual {item.density}</Badge>
              <Badge tone="neutral">{item.area}</Badge>
            </div>
            <p className="map-feature-description">{item.description}</p>
            <div className="map-feature-data-grid">
              <div><small>Jenis temuan</small><strong>{item.type}</strong></div>
              <div><small>Komposisi yang terlihat</small><strong>{item.composition}</strong></div>
              <div><small>Indikasi kepadatan</small><strong>{item.densityNote}</strong></div>
              <div><small>Jumlah / kadar terukur</small><strong>{item.amount}</strong></div>
              <div><small>Waktu dokumentasi</small><strong>{item.date} · {item.time}</strong></div>
              <div><small>Metode / confidence AI</small><strong>{item.confidence}</strong></div>
              <div><small>Koordinat GPS foto</small><strong>{lat.toFixed(6)}, {lng.toFixed(6)}</strong></div>
              <div><small>Sumber data</small><strong>{item.source}</strong></div>
            </div>
            <p className="map-feature-note"><Info size={14} />{item.sourceNote}. Kepadatan merupakan penilaian visual awal dari foto, bukan hasil hitung model AI atau pengukuran berat/volume sampah.</p>
          </>
        )}
        <a className="map-feature-directions" href={`https://www.google.com/maps?q=${lat},${lng}`} target="_blank" rel="noreferrer">
          <MapPin size={14} /> Buka koordinat di Google Maps <ExternalLink size={13} />
        </a>
      </div>
    </section>
  );
}

function MapPanel({ compact = false }) {
  const frameRef = useRef(null);
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const layerRefs = useRef({});
  const activeMarkerRef = useRef(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [visibleLayers, setVisibleLayers] = useState({ heat: true, zones: true, detections: true, cameras: true });
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) return undefined;

    const map = new LeafletMap(mapElementRef.current, {
      minZoom: 15,
      maxZoom: 20,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      zoomControl: false,
      scrollWheelZoom: true,
      preferCanvas: false,
      attributionControl: true,
    });
    map.setView(coastalCenter, compact ? 18 : 18.5);

    // CARTO key is a public browser key; set VITE_CARTO_API_KEY in Vercel.
    // OSM is a fallback for local preview when the CARTO key is not configured.
    const cartoKey = import.meta.env.VITE_CARTO_API_KEY || '';
    const tileUrl = cartoKey
      ? `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${encodeURIComponent(cartoKey)}`
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tileAttribution = cartoKey
      ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const baseLayer = new TileLayer(tileUrl, {
      maxZoom: 20,
      attribution: tileAttribution,
      subdomains: cartoKey ? 'abcd' : 'abc',
    });
    baseLayer.addTo(map);
    new ZoomControl({ position: 'topright' }).addTo(map);
    new ScaleControl({ position: 'bottomleft', metric: true, imperial: false, maxWidth: 110 }).addTo(map);

    const heat = new LayerGroup();
    const zones = new LayerGroup();
    const points = new LayerGroup();
    const cameras = new LayerGroup();

    const heatPane = map.createPane('heatmapPane');
    heatPane.style.zIndex = '350';
    const addHotspot = (center, variant, size) => {
      const icon = new DivIcon({
        className: 'heat-blob-icon',
        html: `<div class="heat-blob heat-blob-${variant}"></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
      new Marker(center, { pane: 'heatmapPane', icon, interactive: false, keyboard: false }).addTo(heat);
    };

    // Hotspots follow the actual GPS photo clusters along the inhabited shoreline.
    addHotspot([-5.93737, 106.00024], 'high', compact ? 105 : 150);
    addHotspot([-5.93613, 106.00035], 'high', compact ? 100 : 142);
    addHotspot([-5.93731, 105.99998], 'medium', compact ? 86 : 116);

    const zoneSpecs = [
      { name: 'Zona A · Pesisir selatan', label: 'Indikasi kepadatan tinggi', center: [-5.93737, 106.00024], radius: 22, color: '#df735b' },
      { name: 'Zona B · Permukiman utara', label: 'Indikasi kepadatan tinggi', center: [-5.93615, 106.00034], radius: 34, color: '#df735b' },
      { name: 'Zona C · Tambatan perahu', label: 'Sebaran sedang–rendah', center: [-5.93731, 105.99998], radius: 25, color: '#dca54d' },
    ];
    zoneSpecs.forEach((zone) => {
      const ring = new Circle(zone.center, {
        radius: zone.radius,
        color: zone.color,
        weight: 1.5,
        opacity: 0.85,
        fillColor: zone.color,
        fillOpacity: 0.055,
        dashArray: '4 6',
      });
      ring.bindTooltip(`${zone.name} · ${zone.label}`, { direction: 'top' });
      ring.addTo(zones);
    });

    coastalObservations.forEach((point) => {
      const color = point.density === 'Tinggi' ? '#df7058' : point.density === 'Sedang' ? '#dfa84c' : '#2b9f96';
      const marker = new CircleMarker([point.lat, point.lng], {
        radius: 7,
        color: '#ffffff',
        weight: 2.5,
        fillColor: color,
        fillOpacity: 1,
        opacity: 1,
        bubblingPointerEvents: false,
      });
      marker.bindTooltip(`${point.id} · ${point.density}`, { direction: 'top', offset: [0, -7] });
      marker.on('click', () => {
        if (activeMarkerRef.current) activeMarkerRef.current.setStyle({ radius: 7, weight: 2.5 });
        marker.setStyle({ radius: 11, weight: 3.5 });
        activeMarkerRef.current = marker;
        setSelectedFeature({ kind: 'observation', data: point });
        map.flyTo([point.lat, point.lng], Math.max(map.getZoom(), compact ? 18 : 18.5), { duration: 0.55 });
      });
      marker.addTo(points);
    });

    proposedCameras.forEach((camera) => {
      const marker = new Marker([camera.lat, camera.lng], {
        icon: new DivIcon({
          className: 'camera-marker-shell',
          html: `<div class="camera-map-marker"><span>◉</span><b>${camera.id.replace('CCTV-', 'C')}</b></div>`,
          iconSize: [44, 40],
          iconAnchor: [22, 20],
        }),
        keyboard: true,
        title: `${camera.name} · titik usulan`,
      });
      marker.bindTooltip(`${camera.id} · titik usulan`, { direction: 'top', offset: [0, -12] });
      marker.on('click', () => {
        if (activeMarkerRef.current) {
          try { activeMarkerRef.current.setStyle({ radius: 7, weight: 2.5 }); } catch { /* camera marker has no circle style */ }
        }
        activeMarkerRef.current = null;
        setSelectedFeature({ kind: 'camera', data: camera });
        map.flyTo([camera.lat, camera.lng], Math.max(map.getZoom(), compact ? 18 : 18.5), { duration: 0.55 });
      });
      marker.addTo(cameras);
    });

    map.on('click', () => setSelectedFeature(null));

    layerRefs.current = { heat, zones, detections: points, cameras };
    heat.addTo(map);
    zones.addTo(map);
    points.addTo(map);
    cameras.addTo(map);
    mapRef.current = map;

    const resizeFrame = window.requestAnimationFrame(() => map.invalidateSize());
    const onFullscreenChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => {
      window.cancelAnimationFrame(resizeFrame);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      map.remove();
      mapRef.current = null;
      layerRefs.current = {};
      activeMarkerRef.current = null;
    };
  }, [compact]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    Object.entries(layerRefs.current).forEach(([key, layer]) => {
      if (visibleLayers[key] && !map.hasLayer(layer)) layer.addTo(map);
      if (!visibleLayers[key] && map.hasLayer(layer)) map.removeLayer(layer);
    });
  }, [visibleLayers]);

  const resetView = () => {
    setSelectedFeature(null);
    if (activeMarkerRef.current) {
      try { activeMarkerRef.current.setStyle({ radius: 7, weight: 2.5 }); } catch { /* ignore non-circle marker */ }
      activeMarkerRef.current = null;
    }
    mapRef.current?.setView(coastalCenter, compact ? 18 : 18.5, { animate: true });
  };
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await frameRef.current?.requestFullscreen?.();
    } catch {
      // Fullscreen is optional; map controls remain available when the browser blocks it.
    }
  };
  const toggleLayer = (key) => setVisibleLayers((current) => ({ ...current, [key]: !current[key] }));

  return (
    <div className={`map-widget ${compact ? 'map-widget-compact' : ''}`}>
      {!compact && (
        <div className="map-toolbar">
          <div className="map-layer-switches" aria-label="Lapisan peta">
            <button className={visibleLayers.heat ? 'active' : ''} onClick={() => toggleLayer('heat')}><span className="layer-symbol heat-symbol" />Heatmap</button>
            <button className={visibleLayers.zones ? 'active' : ''} onClick={() => toggleLayer('zones')}><span className="layer-symbol zone-symbol" />Zona</button>
            <button className={visibleLayers.detections ? 'active' : ''} onClick={() => toggleLayer('detections')}><span className="layer-symbol point-symbol" />Foto observasi</button>
            <button className={visibleLayers.cameras ? 'active' : ''} onClick={() => toggleLayer('cameras')}><span className="layer-symbol camera-symbol" />CCTV usulan</button>
          </div>
          <div className="map-actions">
            <button className="map-action-button" onClick={resetView} title="Kembalikan tampilan peta"><Crosshair size={14} /><span>Fokus pesisir</span></button>
            <button className="map-action-button map-fullscreen-button" onClick={toggleFullscreen} title={fullscreen ? 'Keluar dari layar penuh' : 'Layar penuh'}>{fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}<span>{fullscreen ? 'Keluar' : 'Perbesar'}</span></button>
          </div>
        </div>
      )}
      <div className={`map-frame ${compact ? 'map-compact' : ''}`} ref={frameRef}>
        <div className="leaflet-map-host" ref={mapElementRef} />
        <div className="map-demo-stamp"><span className="stamp-dot" /> PETA OBSERVASI · DEMO</div>
        {compact && <button className="map-reset-mini" onClick={resetView} aria-label="Reset tampilan peta" title="Reset tampilan peta"><Crosshair size={14} /></button>}
        {fullscreen && <button className="map-fullscreen-exit" onClick={toggleFullscreen} aria-label="Keluar dari layar penuh"><Minimize2 size={14} /> Keluar layar penuh</button>}
      </div>
      {selectedFeature && <MapFeatureDetail feature={selectedFeature} onClose={() => setSelectedFeature(null)} />}
      {!compact && (
        <div className="map-map-footer">
          <span><i className="zone-dot high" />Zona A · Pesisir selatan</span>
          <span><i className="zone-dot high" />Zona B · Permukiman utara</span>
          <span><i className="zone-dot medium" />Zona C · Tambatan perahu</span>
          <small>Marker observasi berasal dari foto GPS 11 Nov 2026. CCTV merupakan titik usulan.</small>
        </div>
      )}
    </div>
  );
}

function ChartCard({ range, setRange }) {
  const chartData = range === 'Hari ini' ? trendToday : range === '7 hari' ? trendWeek : trendMonth;
  return (
    <section className="panel chart-panel">
      <div className="panel-heading">
        <div><h3>Tren deteksi sampah</h3><p>Jumlah objek yang teridentifikasi berdasarkan waktu</p></div>
        <div className="segmented-control">
          {['Hari ini', '7 hari', '30 hari'].map((item) => <button key={item} onClick={() => setRange(item)} className={range === item ? 'active' : ''}>{item}</button>)}
        </div>
      </div>
      <div className="chart-legend">
        <span><i className="legend-dot bottle" />Botol plastik</span>
        <span><i className="legend-dot bag" />Kantong plastik</span>
        <span><i className="legend-dot foam" />Styrofoam</span>
      </div>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="bottleFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#159b91" stopOpacity={0.23} /><stop offset="95%" stopColor="#159b91" stopOpacity={0.01} /></linearGradient>
              <linearGradient id="bagFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e5a84d" stopOpacity={0.2} /><stop offset="95%" stopColor="#e5a84d" stopOpacity={0.01} /></linearGradient>
              <linearGradient id="foamFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6e91c7" stopOpacity={0.18} /><stop offset="95%" stopColor="#6e91c7" stopOpacity={0.01} /></linearGradient>
            </defs>
            <CartesianGrid stroke="#edf1f2" vertical={false} strokeDasharray="3 5" />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#8b989d', fontSize: 11 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8b989d', fontSize: 11 }} />
            <Tooltip contentStyle={{ border: '1px solid #e7edef', borderRadius: 12, boxShadow: '0 8px 24px rgba(15,40,48,.08)', fontSize: 12 }} />
            <Area type="monotone" dataKey="bottle" name="Botol plastik" stackId="1" stroke="#159b91" strokeWidth={2.4} fill="url(#bottleFill)" />
            <Area type="monotone" dataKey="bag" name="Kantong plastik" stackId="1" stroke="#e5a84d" strokeWidth={2.1} fill="url(#bagFill)" />
            <Area type="monotone" dataKey="foam" name="Styrofoam" stackId="1" stroke="#6e91c7" strokeWidth={2.1} fill="url(#foamFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-footnote"><span><i className="tiny-pulse" /> Data demo diperbarui otomatis</span><span>Unit: objek terdeteksi</span></div>
    </section>
  );
}

function CompositionCard() {
  const data = [
    { name: 'Botol plastik', value: 58, color: '#159b91' },
    { name: 'Kantong plastik', value: 27, color: '#e5a84d' },
    { name: 'Styrofoam', value: 15, color: '#6e91c7' },
  ];
  return (
    <section className="panel composition-panel">
      <div className="panel-heading"><div><h3>Komposisi sampah</h3><p>Proporsi berdasarkan hasil deteksi</p></div><Badge tone="neutral">3 kelas</Badge></div>
      <div className="composition-content">
        <div className="donut-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={54} outerRadius={73} paddingAngle={4} stroke="none">{data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip formatter={(value) => `${value}%`} /></PieChart>
          </ResponsiveContainer>
          <div className="donut-center"><strong>248</strong><span>objek</span></div>
        </div>
        <div className="composition-legend">
          {data.map((item) => <div className="composition-row" key={item.name}><span className="composition-name"><i style={{ background: item.color }} />{item.name}</span><strong>{item.value}%</strong></div>)}
        </div>
      </div>
      <div className="composition-note"><Leaf size={15} /> Plastik menjadi kategori dominan pada data simulasi.</div>
    </section>
  );
}

function RecentDetections({ onViewAll }) {
  return (
    <section className="panel recent-panel">
      <div className="panel-heading"><div><h3>Deteksi terbaru</h3><p>Aktivitas AI pada kamera pemantauan</p></div><button className="text-button" onClick={onViewAll}>Lihat semua <ChevronRight size={15} /></button></div>
      <div className="table-scroll">
        <table className="data-table">
          <thead><tr><th>ID DETEKSI</th><th>JENIS SAMPAH</th><th>WAKTU</th><th>LOKASI</th><th>CONFIDENCE</th></tr></thead>
          <tbody>{detections.slice(0, 5).map((item) => <tr key={item.id}>
            <td className="id-cell">{item.id}</td>
            <td><span className="waste-type"><i className={`waste-icon ${item.classKey}`} />{item.type}</span></td>
            <td className="time-cell">{item.time}</td><td>{item.zone}</td><td><span className="confidence">{item.confidence.toFixed(1)}%</span></td>
          </tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}

function AlertsPreview({ alerts, onViewAll, onResolve }) {
  return (
    <section className="panel alerts-panel">
      <div className="panel-heading"><div><h3>Peringatan aktif</h3><p>Perlu perhatian petugas</p></div><button className="text-button" onClick={onViewAll}>Lihat semua <ChevronRight size={15} /></button></div>
      <div className="alert-list compact-alert-list">
        {alerts.filter((a) => a.status !== 'Selesai' && a.status !== 'Ditangani').slice(0, 3).map((alert) => <AlertRow key={alert.id} alert={alert} onResolve={onResolve} />)}
        {alerts.every((a) => a.status === 'Selesai' || a.status === 'Ditangani') && <div className="empty-state"><CheckCircle2 size={22} /><strong>Tidak ada peringatan aktif</strong><span>Semua peringatan sudah ditinjau.</span></div>}
      </div>
      <div className="whatsapp-mini"><span className="wa-icon"><MessageCircle size={16} /></span><div><strong>Notifikasi WhatsApp</strong><small>Mode simulasi · Gateway belum terhubung</small></div><Badge tone="neutral">Demo</Badge></div>
    </section>
  );
}

function AlertRow({ alert, onResolve }) {
  const Icon = alert.level === 'critical' ? AlertOctagon : alert.level === 'warning' ? AlertTriangle : CheckCircle2;
  return (
    <div className={`alert-row alert-${alert.level}`}>
      <span className="alert-symbol"><Icon size={17} /></span>
      <div className="alert-copy"><strong>{alert.title}</strong><p>{alert.description}</p><div className="alert-meta"><span><MapPin size={12} />{alert.zone}</span><span><Clock3 size={12} />{alert.time}</span></div></div>
      {alert.status !== 'Selesai' && alert.status !== 'Ditangani' && <button className="resolve-button" onClick={() => onResolve(alert.id)} title="Tandai ditangani" aria-label={`Tandai ${alert.id} telah ditangani`}><Check size={15} /></button>}
    </div>
  );
}

function OverviewPage({ alerts, onViewAll, onResolve, range, setRange, onNavigate }) {
  return (
    <>
      <div className="metrics-grid">
        <MetricCard title="Foto observasi pesisir" value="09" change="Survei GPS" trend="up" footnote="11 November 2026" icon={Eye} tone="teal" />
        <MetricCard title="Titik CCTV usulan" value="02" change="Belum dipasang" trend="up" footnote="rencana pemantauan" icon={Radio} tone="blue" />
        <MetricCard title="Titik indikasi padat" value="04" change="Prioritas visual" trend="down" footnote="perlu validasi lanjutan" icon={AlertTriangle} tone="orange" />
        <MetricCard title="Area observasi" value="03" change="Zona pesisir" trend="up" footnote="permukiman & tambatan perahu" icon={MapPin} tone="purple" />
      </div>

      <section className="panel map-panel">
        <div className="panel-heading map-heading">
          <div><div className="heading-with-status"><h3>Peta pemantauan</h3><Badge tone="success" dot>Area terpantau</Badge></div><p>Pesisir permukiman & tambatan perahu · Pulomerak, Kota Cilegon</p></div>
          <button className="outline-button" onClick={() => onNavigate('map')}>Buka peta lengkap <ExternalLink size={14} /></button>
        </div>
        <MapPanel compact />
        <div className="map-summary">
          <div className="zone-stat"><span className="zone-dot high"/><div><small>Pesisir selatan</small><strong>Padat</strong></div><b>02 <small>foto</small></b></div>
          <div className="zone-stat"><span className="zone-dot medium"/><div><small>Tambatan perahu</small><strong>Sedang</strong></div><b>03 <small>foto</small></b></div>
          <div className="zone-stat"><span className="zone-dot high"/><div><small>Permukiman utara</small><strong>Padat</strong></div><b>04 <small>foto</small></b></div>
          <div className="map-updated"><RefreshCw size={13} /> Dokumentasi survei 11 Nov 2026</div>
        </div>
      </section>

      <div className="two-column-grid">
        <ChartCard range={range} setRange={setRange} />
        <CompositionCard />
      </div>
      <div className="two-column-grid lower-grid">
        <RecentDetections onViewAll={() => onNavigate('detections')} />
        <AlertsPreview alerts={alerts} onViewAll={() => onViewAll()} onResolve={onResolve} />
      </div>
    </>
  );
}

function MapPage() {
  return (
    <div className="page-stack">
      <div className="metrics-grid map-metrics">
        <MetricCard title="Foto observasi" value="09" change="GPS terlampir" trend="up" footnote="titik dokumentasi" icon={MapPin} tone="teal" />
        <MetricCard title="Titik indikasi padat" value="04" change="Prioritas visual" trend="down" footnote="perlu verifikasi lapangan" icon={AlertTriangle} tone="orange" />
        <MetricCard title="CCTV yang diusulkan" value="02" change="Belum dipasang" trend="up" footnote="posisi indikatif" icon={Radio} tone="blue" />
      </div>
      <section className="panel full-map-panel">
        <div className="panel-heading">
          <div><h3>Peta observasi pesisir Pulomerak</h3><p>Klik marker foto observasi atau ikon CCTV untuk membuka foto dan informasi detail.</p></div>
          <Badge tone="neutral">Koordinat dari survei GPS</Badge>
        </div>
        <MapPanel />
      </section>
      <div className="notice-card"><CircleHelp size={18} /><div><strong>Catatan sumber dan interpretasi data</strong><p>Sembilan marker foto menggunakan koordinat GPS yang tercetak pada dokumentasi lapangan tanggal 11 November 2026. Kategori kepadatan merupakan interpretasi visual awal, bukan hasil hitung AI, pengukuran berat, atau volume sampah. Dua ikon CCTV adalah titik pemasangan yang diusulkan; perangkat belum terpasang dan foto pada panel CCTV hanya referensi area, bukan live stream.</p></div></div>
    </div>
  );
}

function DetectionsPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Semua');
  const filtered = detections.filter((item) => {
    const matchesQuery = `${item.id} ${item.type} ${item.zone}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'Semua' || item.type === filter;
    return matchesQuery && matchesFilter;
  });
  const exportCsv = () => {
    const headers = ['ID Deteksi', 'Tanggal', 'Waktu', 'Jenis Sampah', 'Zona', 'Confidence (%)', 'Status'];
    const rows = filtered.map((r) => [r.id, r.date, r.time, r.type, r.zone, r.confidence, r.status]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = 'eco-monitor-riwayat-deteksi-demo.csv'; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div className="page-stack">
      <div className="metrics-grid map-metrics">
        <MetricCard title="Total data ditampilkan" value={filtered.length.toString().padStart(2, '0')} change="8 record" trend="up" footnote="data contoh" icon={FileText} tone="teal" />
        <MetricCard title="Rata-rata confidence" value="93,3" unit="%" change="Stabil" trend="up" footnote="seluruh kelas" icon={Gauge} tone="purple" />
        <MetricCard title="Kelas teridentifikasi" value="03" change="3 kategori" trend="up" footnote="kelas sampah" icon={Eye} tone="blue" />
      </div>
      <section className="panel table-panel">
        <div className="panel-heading"><div><h3>Log deteksi objek</h3><p>Contoh log hasil deteksi AI pada area observasi pesisir.</p></div><button className="outline-button" onClick={exportCsv}><Download size={15} /> Ekspor CSV</button></div>
        <div className="table-toolbar"><div className="search-field"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari ID, jenis sampah, atau zona..." /></div><div className="filter-field"><Filter size={15} /><select value={filter} onChange={(e) => setFilter(e.target.value)}><option>Semua</option><option>Botol plastik</option><option>Kantong plastik</option><option>Styrofoam</option></select></div></div>
        <div className="table-scroll"><table className="data-table detections-table"><thead><tr><th>ID DETEKSI</th><th>WAKTU</th><th>JENIS SAMPAH</th><th>ZONA</th><th>CONFIDENCE</th><th>KEPADATAN</th><th>STATUS</th></tr></thead><tbody>
          {filtered.map((item) => <tr key={item.id}><td className="id-cell">{item.id}</td><td className="time-cell">{item.time}<small>{item.date}</small></td><td><span className="waste-type"><i className={`waste-icon ${item.classKey}`} />{item.type}</span></td><td>{item.zone}</td><td><span className="confidence">{item.confidence.toFixed(1)}%</span></td><td><Badge tone={item.density === 'Tinggi' ? 'danger' : item.density === 'Sedang' ? 'warning' : 'success'}>{item.density}</Badge></td><td><Badge tone={item.status === 'Ditangani' ? 'success' : item.status === 'Perlu ditangani' ? 'danger' : 'neutral'}>{item.status}</Badge></td></tr>)}
        </tbody></table>{filtered.length === 0 && <div className="empty-state table-empty">Tidak ada data yang cocok dengan pencarian.</div>}</div>
        <div className="table-footer"><span>Menampilkan {filtered.length} dari 8 data simulasi</span><span>Data demonstrasi · data simulasi</span></div>
      </section>
    </div>
  );
}

function AlertsPage({ alerts, onResolve, onTestAlert }) {
  const active = alerts.filter((a) => a.status !== 'Selesai' && a.status !== 'Ditangani');
  return (
    <div className="page-stack">
      <div className="alert-summary-row"><div className="alert-summary danger-summary"><AlertOctagon size={19} /><div><strong>{active.filter((a) => a.level === 'critical').length}</strong><span>Kritis / perlu respons</span></div></div><div className="alert-summary warning-summary"><AlertTriangle size={19} /><div><strong>{active.filter((a) => a.level === 'warning').length}</strong><span>Perlu dipantau</span></div></div><div className="alert-summary success-summary"><CheckCircle2 size={19} /><div><strong>{alerts.length - active.length}</strong><span>Selesai / ditangani</span></div></div></div>
      <section className="panel table-panel">
        <div className="panel-heading"><div><h3>Riwayat peringatan</h3><p>Informasi alert yang dihasilkan berdasarkan ambang batas simulasi.</p></div><button className="primary-button" onClick={onTestAlert}><Send size={15} /> Buat alert demo</button></div>
        <div className="alert-list alert-page-list">{alerts.map((alert) => <div key={alert.id} className="alert-card-row"><AlertRow alert={alert} onResolve={onResolve} /><div className="alert-card-status"><span className="id-cell">{alert.id}</span><Badge tone={alert.status === 'Selesai' || alert.status === 'Ditangani' ? 'success' : alert.level === 'critical' ? 'danger' : 'warning'}>{alert.status}</Badge></div></div>)}</div>
      </section>
      <div className="notice-card"><MessageCircle size={18} /><div><strong>WhatsApp Gateway belum diaktifkan</strong><p>Pengiriman pesan pada versi ini masih berupa simulasi antarmuka. Setelah gateway Go + whatsmeow tersedia, aksi alert dapat diarahkan ke endpoint backend tanpa mengubah tampilan dashboard.</p></div></div>
    </div>
  );
}

function DevicesPage() {
  const devices = [
    { name: 'CCTV-01 · Pesisir permukiman utara', desc: 'Usulan kamera outdoor 4K · Zona B', icon: Radio, status: 'Titik usulan', tone: 'info', value: 'Belum terpasang' },
    { name: 'CCTV-02 · Pesisir selatan', desc: 'Usulan kamera outdoor 4K · Zona A', icon: Radio, status: 'Titik usulan', tone: 'info', value: 'Belum terpasang' },
    { name: 'Edge Computing Unit', desc: 'NVIDIA Jetson · YOLOv8', icon: Cpu, status: 'Mode demo', tone: 'info', value: 'AI inference tidak dijalankan' },
    { name: 'MQTT Broker', desc: 'Jalur komunikasi metadata', icon: Waves, status: 'Belum terhubung', tone: 'neutral', value: 'Menunggu integrasi backend' },
    { name: 'WhatsApp Gateway', desc: 'Go + whatsmeow · Koyeb', icon: MessageCircle, status: 'Belum terhubung', tone: 'warning', value: 'Notifikasi disimulasikan' },
  ];
  return (
    <div className="page-stack">
      <div className="metrics-grid map-metrics">
        <MetricCard title="Perangkat terdaftar" value="05" change="Dalam rancangan" trend="up" footnote="komponen sistem" icon={Cpu} tone="blue" />
        <MetricCard title="Titik CCTV usulan" value="02" change="Belum dipasang" trend="up" footnote="perlu survei penempatan" icon={Wifi} tone="teal" />
        <MetricCard title="Gangguan sistem" value="00" change="Belum ada" trend="down" footnote="belum ada integrasi nyata" icon={ShieldCheck} tone="purple" />
      </div>
      <section className="panel devices-panel"><div className="panel-heading"><div><h3>Inventaris perangkat</h3><p>Status komponen dalam rancangan ECO-MONITOR AI.</p></div><Badge tone="neutral">Mode demonstrasi</Badge></div>
        <div className="device-list">{devices.map((d) => <div className="device-row" key={d.name}><span className="device-icon"><d.icon size={20} /></span><div className="device-main"><strong>{d.name}</strong><span>{d.desc}</span></div><div className="device-value">{d.value}</div><Badge tone={d.tone} dot>{d.status}</Badge></div>)}</div>
      </section>
      <div className="notice-card"><Zap size={18} /><div><strong>Arsitektur integrasi yang direncanakan</strong><p>Edge Device → MQTT → Backend API → Database → Web Dashboard. Layanan WhatsApp Gateway berjalan terpisah di Koyeb dan menerima permintaan alert dari backend.</p></div></div>
    </div>
  );
}

function SkeletonBlock({ className = '', width, height }) {
  return <span className={`skeleton-block ${className}`} style={{ width, height }} aria-hidden="true" />;
}

function SkeletonMetric() {
  return (
    <div className="metric-card skeleton-card">
      <div className="skeleton-metric-head"><SkeletonBlock width="32px" height="32px" /><SkeletonBlock width="58%" height="10px" /></div>
      <SkeletonBlock width="42%" height="27px" className="skeleton-metric-value" />
      <SkeletonBlock width="68%" height="9px" />
    </div>
  );
}

function SkeletonPanel({ kind = 'chart' }) {
  if (kind === 'map') return <section className="panel skeleton-panel"><div className="skeleton-heading"><SkeletonBlock width="190px" height="14px" /><SkeletonBlock width="105px" height="24px" /></div><div className="skeleton-map"><span /><span /><span /><i /><i /><i /></div><div className="skeleton-map-legend"><SkeletonBlock width="27%" height="10px" /><SkeletonBlock width="27%" height="10px" /><SkeletonBlock width="27%" height="10px" /></div></section>;
  if (kind === 'table') return <section className="panel skeleton-panel"><div className="skeleton-heading"><SkeletonBlock width="170px" height="14px" /><SkeletonBlock width="90px" height="27px" /></div><div className="skeleton-table-head"><SkeletonBlock width="20%" height="9px" /><SkeletonBlock width="21%" height="9px" /><SkeletonBlock width="14%" height="9px" /><SkeletonBlock width="15%" height="9px" /></div>{[0,1,2,3,4].map((n) => <div className="skeleton-table-row" key={n}><SkeletonBlock width="20%" height="10px" /><SkeletonBlock width="21%" height="10px" /><SkeletonBlock width="14%" height="10px" /><SkeletonBlock width="15%" height="10px" /></div>)}</section>;
  if (kind === 'alerts') return <section className="panel skeleton-panel"><div className="skeleton-heading"><SkeletonBlock width="160px" height="14px" /><SkeletonBlock width="90px" height="27px" /></div>{[0,1,2].map((n) => <div className="skeleton-alert-row" key={n}><SkeletonBlock width="32px" height="32px" /><div><SkeletonBlock width="190px" height="10px" /><SkeletonBlock width="270px" height="8px" /></div></div>)}</section>;
  if (kind === 'devices') return <section className="panel skeleton-panel"><div className="skeleton-heading"><SkeletonBlock width="170px" height="14px" /><SkeletonBlock width="100px" height="22px" /></div>{[0,1,2,3,4].map((n) => <div className="skeleton-device-row" key={n}><SkeletonBlock width="37px" height="37px" /><SkeletonBlock width="35%" height="10px" /><SkeletonBlock width="20%" height="9px" /></div>)}</section>;
  return <section className="panel skeleton-panel"><div className="skeleton-heading"><SkeletonBlock width="150px" height="14px" /><SkeletonBlock width="100px" height="24px" /></div><SkeletonBlock width="100%" height="165px" className="skeleton-chart" /><SkeletonBlock width="65%" height="9px" /></section>;
}

function PageSkeleton({ page }) {
  const metricCount = page === 'overview' ? 4 : 3;
  return (
    <div className="page-stack page-skeleton" aria-label="Memuat data halaman" aria-busy="true">
      <div className={`metrics-grid ${page === 'overview' ? '' : 'map-metrics'}`}>
        {Array.from({ length: metricCount }, (_, index) => <SkeletonMetric key={index} />)}
      </div>
      {page === 'overview' && <>
        <SkeletonPanel kind="map" />
        <div className="two-column-grid"><SkeletonPanel /><SkeletonPanel /></div>
        <div className="two-column-grid lower-grid"><SkeletonPanel kind="table" /><SkeletonPanel kind="alerts" /></div>
      </>}
      {page === 'map' && <SkeletonPanel kind="map" />}
      {page === 'detections' && <SkeletonPanel kind="table" />}
      {page === 'alerts' && <SkeletonPanel kind="alerts" />}
      {page === 'devices' && <SkeletonPanel kind="devices" />}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('overview');
  const [range, setRange] = useState('Hari ini');
  const [alerts, setAlerts] = useState(alertsSeed);
  const [toast, setToast] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [noticeVisible, setNoticeVisible] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsPageLoading(true);
    const timer = window.setTimeout(() => setIsPageLoading(false), 680);
    return () => window.clearTimeout(timer);
  }, [page, refreshKey]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const unread = alerts.filter((a) => a.status !== 'Selesai' && a.status !== 'Ditangani').length;
  const setPageSafe = (next) => {
    if (next !== page) setPage(next);
    setMobileNavOpen(false);
    setShowProfileMenu(false);
  };
  const refreshPage = () => {
    setRefreshKey((value) => value + 1);
    setToast('Memuat ulang tampilan menggunakan data simulasi.');
  };
  const resolveAlert = (id) => {
    setAlerts((current) => current.map((a) => a.id === id ? { ...a, status: 'Ditangani' } : a));
    setToast('Peringatan ditandai telah ditangani (simulasi).');
  };
  const createTestAlert = () => {
    const id = `ALT-${String(82 + alerts.length - alertsSeed.length).padStart(4, '0')}`;
    const newAlert = {
      id,
      title: 'Uji notifikasi ECO-MONITOR AI',
      description: 'Ini adalah alert uji untuk demonstrasi alur peringatan.',
      time: new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(new Date()) + ' WIB',
      zone: 'Zona A',
      level: 'warning',
      status: 'Belum ditangani',
    };
    setAlerts((current) => [newAlert, ...current]);
    setToast('Alert demo berhasil dibuat. Tidak ada pesan WhatsApp yang dikirim.');
  };

  const [title, subtitle] = pageMeta[page];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-symbol"><Waves size={21} /></div>
          <div><strong>ECO<span>·</span>MONITOR</strong><small>MARINE INTELLIGENCE</small></div>
          <button className="mobile-close icon-button" onClick={() => setMobileNavOpen(false)} aria-label="Tutup menu"><X size={19} /></button>
        </div>
        <div className="workspace-switcher">
          <span className="workspace-avatar">MB</span>
          <span><strong>Merak Besar</strong><small>Project workspace</small></span>
        </div>
        <nav className="side-nav" aria-label="Navigasi utama">
          {navItems.map((item, index) => <React.Fragment key={item.id}>
            {item.section && <div className={`nav-section ${index === 0 ? 'first-section' : ''}`}>{item.section}</div>}
            <button className={`nav-item ${page === item.id ? 'selected' : ''}`} onClick={() => setPageSafe(item.id)} aria-current={page === item.id ? 'page' : undefined}>
              <item.icon size={18} strokeWidth={1.9} /><span>{item.label}</span>
              {item.id === 'alerts' && unread > 0 ? <em>{unread}</em> : item.count && item.id === 'detections' ? <small>{item.count}</small> : null}
            </button>
          </React.Fragment>)}
        </nav>
        <div className="sidebar-bottom">
          <button className="sidebar-help" onClick={() => setHelpOpen(true)}>
            <span className="help-icon"><CircleHelp size={17} /></span>
            <span><strong>Butuh bantuan?</strong><small>Lihat panduan dashboard</small></span>
            <ChevronRight size={15} />
          </button>
          <div className="profile-row">
            <div className="profile-avatar">AD</div>
            <div className="profile-copy"><strong>Administrator</strong><small>Project operator</small></div>
            <button className="icon-button dark-icon" onClick={() => setShowProfileMenu((value) => !value)} aria-label="Informasi akun" aria-expanded={showProfileMenu}><MoreHorizontal size={18} /></button>
            {showProfileMenu && <div className="profile-popover"><strong>Mode demonstrasi</strong><span>Akun administrator contoh.</span><span>Hak akses: operator proyek.</span></div>}
          </div>
        </div>
      </aside>
      {mobileNavOpen && <button className="mobile-scrim" onClick={() => setMobileNavOpen(false)} aria-label="Tutup menu navigasi" />}

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu icon-button" onClick={() => setMobileNavOpen(true)} aria-label="Buka menu"><Menu size={20} /></button>
            <div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>{pageMeta[page][0]}</strong></div>
          </div>
          <div className="topbar-right">
            <span className="top-date">{formatNow(now)}</span><span className="top-divider" />
            <button className="icon-button notification-button" onClick={() => setPageSafe('alerts')} title="Buka peringatan" aria-label={`Buka peringatan, ${unread} belum ditangani`}><Bell size={18} />{unread > 0 && <i />}</button>
            <div className="top-avatar" aria-label="Administrator">AD</div>
          </div>
        </header>

        <div className="content-wrap">
          <div className="page-title-row">
            <div><div className="eyebrow"><span className="eyebrow-line" /> MARINE ENVIRONMENT MONITORING</div><h1>{title}</h1><p>{subtitle}</p></div>
            <div className="page-actions"><Badge tone="warning" dot>DATA SIMULASI</Badge><button className="outline-button refresh-button" onClick={refreshPage}><RefreshCw size={14} /> Refresh</button></div>
          </div>
          {noticeVisible && <div className="demo-notice">
            <span className="demo-notice-icon"><Activity size={15} /></span>
            <span><strong>Mode demonstrasi aktif.</strong> Seluruh angka, status perangkat, dan deteksi merupakan data ilustratif, bukan hasil sensor langsung.</span>
            <button className="notice-dismiss" onClick={() => setNoticeVisible(false)} aria-label="Tutup informasi mode demo">Mengerti <X size={13} /></button>
          </div>}

          {isPageLoading ? <PageSkeleton page={page} /> : <>
            {page === 'overview' && <OverviewPage alerts={alerts} onViewAll={() => setPageSafe('alerts')} onResolve={resolveAlert} range={range} setRange={setRange} onNavigate={setPageSafe} />}
            {page === 'map' && <MapPage />}
            {page === 'detections' && <DetectionsPage />}
            {page === 'alerts' && <AlertsPage alerts={alerts} onResolve={resolveAlert} onTestAlert={createTestAlert} />}
            {page === 'devices' && <DevicesPage />}
          </>}

          <footer className="footer"><span>© 2026 ECO-MONITOR AI · Project ASIK</span><span><i className="tiny-pulse" /> UI prototype <span className="footer-dot">·</span> Pesisir Pulomerak, Banten</span></footer>
        </div>
      </main>
      {helpOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setHelpOpen(false); }}>
        <section className="help-modal" role="dialog" aria-modal="true" aria-labelledby="help-modal-title">
          <div className="help-modal-heading"><span className="help-modal-icon"><BookOpen size={20} /></span><button className="icon-button" onClick={() => setHelpOpen(false)} aria-label="Tutup panduan"><X size={18} /></button></div>
          <h2 id="help-modal-title">Panduan dashboard</h2>
          <p>Dashboard ini merupakan prototipe visual ECO-MONITOR AI. Gunakan navigasi untuk menjelajahi simulasi pemantauan.</p>
          <div className="help-steps">
            <div><strong>Ringkasan</strong><span>Lihat KPI, tren deteksi, dan peringatan terbaru.</span></div>
            <div><strong>Peta Sebaran</strong><span>Aktifkan atau nonaktifkan lapisan heatmap, zona, deteksi, dan kamera. Gunakan kontrol zoom untuk menjelajah peta.</span></div>
            <div><strong>Deteksi AI</strong><span>Cari dan filter riwayat, lalu ekspor hasil ke CSV.</span></div>
            <div><strong>Peringatan</strong><span>Buat alert uji dan tandai peringatan yang sudah ditangani.</span></div>
            <div><strong>Perangkat</strong><span>Lihat status simulasi komponen arsitektur.</span></div>
          </div>
          <button className="primary-button help-modal-close" onClick={() => setHelpOpen(false)}>Mengerti</button>
        </section>
      </div>}
      {toast && <div className="toast-message"><CheckCircle2 size={17} />{toast}<button onClick={() => setToast('')} aria-label="Tutup pesan"><X size={15} /></button></div>}
    </div>
  );
}
