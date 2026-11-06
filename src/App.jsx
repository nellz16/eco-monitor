import React, { useMemo, useState } from 'react';
import {
  Activity, AlertOctagon, AlertTriangle, ArrowDownRight, ArrowUpRight,
  Bell, Check, CheckCircle2, ChevronDown, ChevronRight, CircleHelp,
  Clock3, Cloud, Cpu, Download, Droplets, ExternalLink, Eye, FileText,
  Filter, Gauge, Leaf, Map as MapIcon, MapPin, Menu, MessageCircle,
  MoreHorizontal, Radio, RefreshCw, Search, Send, Settings2, ShieldCheck,
  Signal, Smartphone, Waves, Wifi, X, Zap
} from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis
} from 'recharts';
import { Circle, CircleMarker, MapContainer, Popup, TileLayer, Tooltip as MapTooltip } from 'react-leaflet';
import { alertsSeed, detections, islandCenter, trendMonth, trendToday, trendWeek } from './data/mockData';

const navItems = [
  { id: 'overview', label: 'Ringkasan', icon: Activity, section: 'MONITORING' },
  { id: 'map', label: 'Peta Sebaran', icon: MapIcon },
  { id: 'detections', label: 'Deteksi AI', icon: Eye, count: '248' },
  { id: 'alerts', label: 'Peringatan', icon: Bell, count: '2', alert: true },
  { id: 'devices', label: 'Perangkat', icon: Radio, section: 'SISTEM' },
];

const pageMeta = {
  overview: ['Ringkasan pemantauan', 'Pantau kondisi sampah laut dari satu tempat.'],
  map: ['Peta sebaran sampah', 'Jelajahi zona pengamatan dan titik deteksi pada perairan Pulau Merak Besar.'],
  detections: ['Riwayat deteksi AI', 'Daftar objek sampah yang dikenali oleh model Computer Vision.'],
  alerts: ['Pusat peringatan', 'Pantau kondisi yang membutuhkan perhatian petugas lapangan.'],
  devices: ['Status perangkat', 'Kondisi perangkat pemantauan dan konektivitas sistem.'],
};

function formatNow() {
  return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());
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
        <button className="icon-button subtle" title="Informasi"><CircleHelp size={15} /></button>
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

function MapPanel({ compact = false }) {
  const points = detections.slice(0, 6);
  return (
    <div className={`map-frame ${compact ? 'map-compact' : ''}`}>
      <MapContainer center={islandCenter} zoom={15} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle center={[-5.93325, 105.98835]} radius={105} pathOptions={{ color: '#e69a3a', fillColor: '#f2b65e', fillOpacity: 0.16, weight: 1.5, dashArray: '5 6' }}>
          <MapTooltip sticky>Zona A · Kepadatan tinggi</MapTooltip>
        </Circle>
        <Circle center={[-5.9348, 105.9906]} radius={95} pathOptions={{ color: '#d4a84f', fillColor: '#e9c56d', fillOpacity: 0.13, weight: 1.5, dashArray: '5 6' }}>
          <MapTooltip sticky>Zona B · Kepadatan sedang</MapTooltip>
        </Circle>
        <Circle center={[-5.93195, 105.99185]} radius={85} pathOptions={{ color: '#32a79a', fillColor: '#43c4ae', fillOpacity: 0.12, weight: 1.5, dashArray: '5 6' }}>
          <MapTooltip sticky>Zona C · Kepadatan rendah</MapTooltip>
        </Circle>
        {points.map((point, index) => (
          <CircleMarker
            key={point.id}
            center={[point.lat, point.lng]}
            radius={index < 2 ? 8 : 6}
            pathOptions={{ color: '#ffffff', weight: 2, fillColor: point.density === 'Tinggi' ? '#e26b54' : point.density === 'Sedang' ? '#e5a949' : '#2da99c', fillOpacity: 0.95 }}
          >
            <Popup>
              <div className="map-popup">
                <strong>{point.type}</strong>
                <span>{point.id}</span>
                <span>{point.zone} · {point.time} WIB</span>
                <b>{point.confidence}% confidence</b>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      <div className="map-demo-stamp"><span className="stamp-dot" /> PETA SIMULASI</div>
      <div className="map-scale"><span /> 100 m</div>
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
      <div className="panel-heading"><div><h3>Komposisi sampah</h3><p>Proporsi berdasarkan hasil deteksi</p></div><button className="icon-button"><MoreHorizontal size={18} /></button></div>
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
      {alert.status !== 'Selesai' && alert.status !== 'Ditangani' && <button className="resolve-button" onClick={() => onResolve(alert.id)} title="Tandai ditinjau"><Check size={15} /></button>}
    </div>
  );
}

function OverviewPage({ alerts, onViewAll, onResolve, range, setRange, onNavigate }) {
  return (
    <>
      <div className="metrics-grid">
        <MetricCard title="Total deteksi hari ini" value="248" change="12,8%" trend="up" footnote="vs. hari sebelumnya" icon={Eye} tone="teal" />
        <MetricCard title="Kamera aktif" value="02" unit="/ 02" change="Semua aktif" trend="up" footnote="kamera pemantauan" icon={Radio} tone="blue" />
        <MetricCard title="Zona perlu perhatian" value="01" change="Zona A" trend="down" footnote="kepadatan tinggi" icon={AlertTriangle} tone="orange" />
        <MetricCard title="Confidence rata-rata" value="93,6" unit="%" change="2,4%" trend="up" footnote="model deteksi AI" icon={Gauge} tone="purple" />
      </div>

      <section className="panel map-panel">
        <div className="panel-heading map-heading">
          <div><div className="heading-with-status"><h3>Peta pemantauan</h3><Badge tone="success" dot>Area terpantau</Badge></div><p>Perairan Pulau Merak Besar · Kota Cilegon, Banten</p></div>
          <button className="outline-button" onClick={() => onNavigate('map')}>Buka peta lengkap <ExternalLink size={14} /></button>
        </div>
        <MapPanel compact />
        <div className="map-summary">
          <div className="zone-stat"><span className="zone-dot high"/><div><small>Zona A</small><strong>Padat</strong></div><b>86 <small>objek</small></b></div>
          <div className="zone-stat"><span className="zone-dot medium"/><div><small>Zona B</small><strong>Sedang</strong></div><b>42 <small>objek</small></b></div>
          <div className="zone-stat"><span className="zone-dot low"/><div><small>Zona C</small><strong>Rendah</strong></div><b>18 <small>objek</small></b></div>
          <div className="map-updated"><RefreshCw size={13} /> Update simulasi 11:32 WIB</div>
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
        <MetricCard title="Total objek di peta" value="146" change="8,2%" trend="up" footnote="hasil agregasi simulasi" icon={MapPin} tone="teal" />
        <MetricCard title="Zona kepadatan tinggi" value="01" change="Zona A" trend="down" footnote="perlu prioritas" icon={AlertTriangle} tone="orange" />
        <MetricCard title="Titik kamera" value="02" change="Terpetakan" trend="up" footnote="CCTV-01 dan CCTV-02" icon={Radio} tone="blue" />
      </div>
      <section className="panel full-map-panel">
        <div className="panel-heading"><div><h3>Peta interaktif Pulau Merak Besar</h3><p>Klik titik deteksi untuk melihat detail objek dan waktu pengamatan.</p></div><Badge tone="neutral">Koordinat indikatif</Badge></div>
        <MapPanel />
        <div className="map-key-row"><span><i className="zone-dot high"/>Kepadatan tinggi</span><span><i className="zone-dot medium"/>Kepadatan sedang</span><span><i className="zone-dot low"/>Kepadatan rendah</span><span><i className="map-point-key"/>Titik deteksi</span></div>
      </section>
      <div className="notice-card"><CircleHelp size={18} /><div><strong>Catatan data lokasi</strong><p>Marker dan zona pada peta merupakan koordinat ilustratif untuk kebutuhan demonstrasi. Koordinat aktual perlu diperoleh melalui survei GPS dan kalibrasi kamera sebelum sistem digunakan di lapangan.</p></div></div>
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
    const link = document.createElement('a'); link.href = url; link.download = 'eco-monitor-riwayat-deteksi-demo.csv'; link.click(); URL.revokeObjectURL(url);
  };
  return (
    <div className="page-stack">
      <div className="metrics-grid map-metrics">
        <MetricCard title="Total data ditampilkan" value={filtered.length.toString().padStart(2, '0')} change="8 record" trend="up" footnote="data contoh" icon={FileText} tone="teal" />
        <MetricCard title="Rata-rata confidence" value="93,3" unit="%" change="Stabil" trend="up" footnote="seluruh kelas" icon={Gauge} tone="purple" />
        <MetricCard title="Kelas teridentifikasi" value="03" change="3 kategori" trend="up" footnote="kelas sampah" icon={Eye} tone="blue" />
      </div>
      <section className="panel table-panel">
        <div className="panel-heading"><div><h3>Log deteksi objek</h3><p>Catatan identifikasi sampah dari kamera pemantauan.</p></div><button className="outline-button" onClick={exportCsv}><Download size={15} /> Ekspor CSV</button></div>
        <div className="table-toolbar"><div className="search-field"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari ID, jenis sampah, atau zona..." /></div><div className="filter-field"><Filter size={15} /><select value={filter} onChange={(e) => setFilter(e.target.value)}><option>Semua</option><option>Botol plastik</option><option>Kantong plastik</option><option>Styrofoam</option></select></div></div>
        <div className="table-scroll"><table className="data-table detections-table"><thead><tr><th>ID DETEKSI</th><th>WAKTU</th><th>JENIS SAMPAH</th><th>ZONA</th><th>CONFIDENCE</th><th>KEPADATAN</th><th>STATUS</th></tr></thead><tbody>
          {filtered.map((item) => <tr key={item.id}><td className="id-cell">{item.id}</td><td className="time-cell">{item.time}<small>{item.date}</small></td><td><span className="waste-type"><i className={`waste-icon ${item.classKey}`} />{item.type}</span></td><td>{item.zone}</td><td><span className="confidence">{item.confidence.toFixed(1)}%</span></td><td><Badge tone={item.density === 'Tinggi' ? 'danger' : item.density === 'Sedang' ? 'warning' : 'success'}>{item.density}</Badge></td><td><Badge tone={item.status === 'Ditangani' ? 'success' : item.status === 'Perlu ditangani' ? 'danger' : 'neutral'}>{item.status}</Badge></td></tr>)}
        </tbody></table>{filtered.length === 0 && <div className="empty-state table-empty">Tidak ada data yang cocok dengan pencarian.</div>}</div>
        <div className="table-footer"><span>Menampilkan {filtered.length} dari 8 data simulasi</span><span>Data demonstrasi · 06 November 2026</span></div>
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
    { name: 'CCTV-01 · Dermaga Utara', desc: 'Kamera outdoor 4K · Zona A', icon: Radio, status: 'Aktif (simulasi)', tone: 'success', value: 'Streaming demo' },
    { name: 'CCTV-02 · Area Barat', desc: 'Kamera outdoor 4K · Zona B–C', icon: Radio, status: 'Aktif (simulasi)', tone: 'success', value: 'Streaming demo' },
    { name: 'Edge Computing Unit', desc: 'NVIDIA Jetson · YOLOv8', icon: Cpu, status: 'Mode demo', tone: 'info', value: 'AI inference tidak dijalankan' },
    { name: 'MQTT Broker', desc: 'Jalur komunikasi metadata', icon: Waves, status: 'Belum terhubung', tone: 'neutral', value: 'Menunggu integrasi backend' },
    { name: 'WhatsApp Gateway', desc: 'Go + whatsmeow · Koyeb', icon: MessageCircle, status: 'Belum terhubung', tone: 'warning', value: 'Notifikasi disimulasikan' },
  ];
  return (
    <div className="page-stack">
      <div className="metrics-grid map-metrics">
        <MetricCard title="Perangkat terdaftar" value="05" change="Dalam rancangan" trend="up" footnote="komponen sistem" icon={Cpu} tone="blue" />
        <MetricCard title="Koneksi aktif" value="02" change="Simulasi UI" trend="up" footnote="status tampilan demo" icon={Wifi} tone="teal" />
        <MetricCard title="Gangguan sistem" value="00" change="Belum ada" trend="down" footnote="belum ada integrasi nyata" icon={ShieldCheck} tone="purple" />
      </div>
      <section className="panel devices-panel"><div className="panel-heading"><div><h3>Inventaris perangkat</h3><p>Status komponen dalam rancangan ECO-MONITOR AI.</p></div><Badge tone="neutral">Mode demonstrasi</Badge></div>
        <div className="device-list">{devices.map((d) => <div className="device-row" key={d.name}><span className="device-icon"><d.icon size={20} /></span><div className="device-main"><strong>{d.name}</strong><span>{d.desc}</span></div><div className="device-value">{d.value}</div><Badge tone={d.tone} dot>{d.status}</Badge><button className="icon-button subtle"><MoreHorizontal size={17} /></button></div>)}</div>
      </section>
      <div className="notice-card"><Zap size={18} /><div><strong>Arsitektur integrasi yang direncanakan</strong><p>Edge Device → MQTT → Backend API → Database → Web Dashboard. Layanan WhatsApp Gateway berjalan terpisah di Koyeb dan menerima permintaan alert dari backend.</p></div></div>
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

  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const unread = alerts.filter((a) => a.status !== 'Selesai' && a.status !== 'Ditangani').length;
  const setPageSafe = (next) => { setPage(next); setMobileNavOpen(false); };
  const resolveAlert = (id) => {
    setAlerts((current) => current.map((a) => a.id === id ? { ...a, status: 'Ditangani' } : a));
    setToast('Peringatan ditandai telah ditinjau (simulasi).');
  };
  const createTestAlert = () => {
    const id = `ALT-${String(82 + alerts.length - alertsSeed.length).padStart(4, '0')}`;
    const newAlert = { id, title: 'Uji notifikasi ECO-MONITOR AI', description: 'Ini adalah alert uji untuk demonstrasi alur peringatan.', time: new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(new Date()) + ' WIB', zone: 'Zona A', level: 'warning', status: 'Belum ditangani' };
    setAlerts((current) => [newAlert, ...current]);
    setToast('Alert demo berhasil dibuat. Tidak ada pesan WhatsApp yang dikirim.');
  };
  const [title, subtitle] = pageMeta[page];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup"><div className="brand-symbol"><Waves size={21} /></div><div><strong>ECO<span>·</span>MONITOR</strong><small>MARINE INTELLIGENCE</small></div><button className="mobile-close icon-button" onClick={() => setMobileNavOpen(false)}><X size={19} /></button></div>
        <div className="workspace-switcher"><span className="workspace-avatar">MB</span><span><strong>Merak Besar</strong><small>Project workspace</small></span><ChevronDown size={15} /></div>
        <nav className="side-nav">
          {navItems.map((item, index) => <React.Fragment key={item.id}>
            {item.section && <div className={`nav-section ${index === 0 ? 'first-section' : ''}`}>{item.section}</div>}
            <button className={`nav-item ${page === item.id ? 'selected' : ''}`} onClick={() => setPageSafe(item.id)}><item.icon size={18} strokeWidth={1.9} /><span>{item.label}</span>{item.id === 'alerts' && unread > 0 ? <em>{unread}</em> : item.count && item.id === 'detections' ? <small>{item.count}</small> : null}</button>
          </React.Fragment>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-help"><span className="help-icon"><CircleHelp size={17} /></span><div><strong>Butuh bantuan?</strong><small>Lihat panduan dashboard</small></div><ChevronRight size={15} /></div>
          <div className="profile-row"><div className="profile-avatar">AD</div><div className="profile-copy"><strong>Administrator</strong><small>Project operator</small></div><button className="icon-button dark-icon" onClick={() => setShowProfileMenu((v) => !v)}><MoreHorizontal size={18} /></button>{showProfileMenu && <div className="profile-popover"><strong>Mode demonstrasi</strong><span>Akun administrator contoh.</span></div>}</div>
        </div>
      </aside>
      {mobileNavOpen && <button className="mobile-scrim" onClick={() => setMobileNavOpen(false)} aria-label="Tutup menu" />}

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left"><button className="mobile-menu icon-button" onClick={() => setMobileNavOpen(true)}><Menu size={20} /></button><div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>{pageMeta[page][0]}</strong></div></div>
          <div className="topbar-right"><span className="top-date">{formatNow()}</span><span className="top-divider"/><button className="icon-button notification-button" onClick={() => setPageSafe('alerts')} title="Peringatan"><Bell size={18} />{unread > 0 && <i />}</button><div className="top-avatar">AD</div></div>
        </header>

        <div className="content-wrap">
          <div className="page-title-row"><div><div className="eyebrow"><span className="eyebrow-line"/> MARINE ENVIRONMENT MONITORING</div><h1>{title}</h1><p>{subtitle}</p></div><div className="page-actions"><Badge tone="warning" dot>DATA SIMULASI</Badge><button className="outline-button refresh-button" onClick={() => setToast('Tampilan diperbarui menggunakan data simulasi.')}><RefreshCw size={14} /> Refresh</button></div></div>
          <div className="demo-notice"><span className="demo-notice-icon"><Activity size={15} /></span><span><strong>Mode demonstrasi aktif.</strong> Seluruh angka, status perangkat, dan deteksi pada halaman ini merupakan data ilustratif, bukan hasil sensor langsung.</span><button onClick={() => setToast('Terima kasih. Mode demonstrasi tetap aktif.')}>Mengerti</button></div>

          {page === 'overview' && <OverviewPage alerts={alerts} onViewAll={() => setPageSafe('alerts')} onResolve={resolveAlert} range={range} setRange={setRange} onNavigate={setPageSafe} />}
          {page === 'map' && <MapPage />}
          {page === 'detections' && <DetectionsPage />}
          {page === 'alerts' && <AlertsPage alerts={alerts} onResolve={resolveAlert} onTestAlert={createTestAlert} />}
          {page === 'devices' && <DevicesPage />}

          <footer className="footer"><span>© 2026 ECO-MONITOR AI · Project ASIK</span><span><i className="tiny-pulse" /> UI prototype <span className="footer-dot">·</span> Pulau Merak Besar, Banten</span></footer>
        </div>
      </main>
      {toast && <div className="toast-message"><CheckCircle2 size={17} />{toast}<button onClick={() => setToast('')}><X size={15} /></button></div>}
    </div>
  );
}
