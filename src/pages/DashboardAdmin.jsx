// src/pages/DashboardAdmin.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users, Calendar, TrendingUp, CheckCircle, AlertCircle, Clock,
  Truck, ChefHat, Scissors, Eye, X, FileText, Camera, Award,
  Package, Shield, Upload, Sun, Sunset, LogOut, ExternalLink, UserCheck,
  RefreshCw, Loader2, Printer, MessageSquare, Phone, Film, Play, Sparkles
} from 'lucide-react';
import {
  KUOTA_JADWAL_INIT, STATUS_OPERASIONAL_LIST,
  formatRupiah, formatTanggalIndonesia, getPaketById, getMenuDagingById, getMenuJeroanById, getNasiBoxById
} from '../data/mockData';
import { getAdminSession, clearAdminSession } from '../utils/auth';
import { getDailyQuotas, updateOrderStatus, updatePaymentStatus, upsertSyariatDoc, uploadFileToStorage } from '../lib/supabaseClient';
import { compressImageToWebP } from '../utils/imageCompressor';
import { parseVideoUrl } from '../utils/videoHelper';

const STATUS_COLORS = {
  'Menunggu Verifikasi': 'bg-amber-100 text-amber-700 border-amber-200',
  'Dijadwalkan': 'bg-blue-100 text-blue-700 border-blue-200',
  'Proses Penyembelihan': 'bg-orange-100 text-orange-700 border-orange-200',
  'Masak Dapur': 'bg-purple-100 text-purple-700 border-purple-200',
  'Dikirim': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'Selesai': 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const BAYAR_COLORS = {
  'DP 50% Lunas': 'bg-amber-50 text-amber-700 border-amber-200',
  'Lunas 100%': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const defaultFotoPlaceholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260" fill="%23059669"><rect width="400" height="260" fill="%23047857"/><circle cx="200" cy="100" r="35" fill="%2310b981"/><path d="M140 180 Q200 135 260 180" stroke="%23ecfdf5" stroke-width="6" fill="none"/><text x="200" y="215" font-family="sans-serif" font-size="13" fill="%23ffffff" text-anchor="middle" font-weight="bold">Foto Penyembelihan Syariat</text></svg>';

function UploadSyariatModal({ pesanan, onClose, onSave }) {
  const [catatan, setCatatan] = useState(pesanan.syariat?.catatanSyariat || '');
  const [videoUrl, setVideoUrl] = useState(pesanan.syariat?.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [fotoUrl, setFotoUrl] = useState(pesanan.syariat?.fotoPenyembelihan || defaultFotoPlaceholder);
  const [isUploadingFoto, setIsUploadingFoto] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const [compressionInfo, setCompressionInfo] = useState(null);

  const handleFotoUpload = async (e) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setIsUploadingFoto(true);
    setUploadMsg('Menyiapkan foto dokumentasi...');

    // 1. Kompresi gambar otomatis ke WebP di sisi klien
    const compressed = await compressImageToWebP(rawFile, { maxWidth: 1280, maxHeight: 1280, quality: 0.82 });
    setCompressionInfo({
      original: compressed.originalFormatted,
      compressed: compressed.compressedFormatted,
      ratio: compressed.compressionRatio,
    });

    setUploadMsg('Mengunggah foto ke sistem...');

    // 2. Unggah file WebP ke Supabase Storage bucket rahma-media/syariat-docs
    const result = await uploadFileToStorage(compressed.file, 'syariat-docs');
    if (result.success) {
      setFotoUrl(result.publicUrl);
      setUploadMsg('Foto dokumentasi berhasil tersimpan!');
    } else {
      setUploadMsg('Menggunakan pratinjau foto lokal.');
      setFotoUrl(compressed.previewUrl || URL.createObjectURL(compressed.file));
    }
    setIsUploadingFoto(false);
  };

  const handleVideoUpload = async (e) => {
    const videoFile = e.target.files?.[0];
    if (!videoFile) return;

    setIsUploadingVideo(true);
    const result = await uploadFileToStorage(videoFile, 'syariat-videos');
    if (result.success) {
      setVideoUrl(result.publicUrl);
    } else {
      alert('Gagal mengunggah file video: ' + result.error);
    }
    setIsUploadingVideo(false);
  };

  const parsedVideo = parseVideoUrl(videoUrl);

  const handleSave = async () => {
    setIsSaving(true);
    const syariatData = {
      fotoPenyembelihan: fotoUrl,
      videoUrl: videoUrl,
      sertifikat: true,
      catatanSyariat: catatan,
    };

    // Simpan ke Supabase table rahma_syariat_docs
    await upsertSyariatDoc(pesanan.id, syariatData);

    onSave({
      ...pesanan,
      syariat: syariatData,
    });
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl my-auto max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-emerald-800 text-lg flex items-center gap-2">
            <Shield size={20} className="text-emerald-600" /> Upload Dokumentasi Syariat
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="bg-emerald-50 rounded-xl p-3 mb-4 text-sm">
          <p className="font-semibold text-emerald-800">{pesanan.namaAnak} {pesanan.binBinti} {pesanan.namaOrtu}</p>
          <p className="text-emerald-600 text-xs">{pesanan.id} &middot; Paket {pesanan.paketId}</p>
        </div>

        <div className="space-y-4">
          {/* Upload Foto Syariat + Kompresi WebP */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
              <Camera size={15} /> Foto Penyembelihan dan Papan Nama
            </label>
            <label className="flex flex-col items-center border-2 border-dashed border-emerald-300 rounded-xl p-4 bg-emerald-50 hover:bg-emerald-100 cursor-pointer transition-colors">
              {isUploadingFoto ? (
                <Loader2 size={24} className="text-emerald-500 animate-spin mb-2" />
              ) : (
                <Upload size={24} className="text-emerald-400 mb-2" />
              )}
              <span className="text-sm text-gray-600">
                {isUploadingFoto ? 'Sedang memproses foto...' : 'Pilih file foto dari perangkat'}
              </span>
              <span className="text-xs text-gray-400">Format gambar JPG atau PNG (maks. 10MB)</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFotoUpload} disabled={isUploadingFoto} />
            </label>

            {compressionInfo && (
              <div className="mt-2 p-2 rounded-lg bg-emerald-100/70 border border-emerald-300 text-xs text-emerald-800 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Sparkles size={13} className="text-emerald-600" />
                  WebP: {compressionInfo.original} &rarr; {compressionInfo.compressed}
                </span>
                <span className="bg-emerald-700 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                  Hemat {compressionInfo.ratio}%
                </span>
              </div>
            )}

            {uploadMsg && <p className="text-xs text-emerald-700 mt-1 font-medium">{uploadMsg}</p>}
            <div className="mt-2 rounded-xl overflow-hidden border border-gray-200">
              <img src={fotoUrl} alt="preview" className="w-full h-36 object-cover" />
            </div>
          </div>

          {/* Video Doa Syariat */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <Film size={15} /> Video Penyembelihan (YouTube / Cloud / Drive)
              </label>
              <label className="text-xs text-emerald-700 font-semibold cursor-pointer hover:underline flex items-center gap-1">
                {isUploadingVideo ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                Upload MP4
                <input type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={handleVideoUpload} disabled={isUploadingVideo} />
              </label>
            </div>
            <input
              type="url"
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder="Contoh: https://youtu.be/... atau link Google Drive"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Sumber terdeteksi: <strong>{parsedVideo.label}</strong>
            </p>

            {/* Live Video Preview in Modal */}
            {videoUrl && (
              <div className="mt-2 rounded-xl overflow-hidden border border-gray-200 aspect-video bg-black flex items-center justify-center">
                {parsedVideo.type === 'youtube' || parsedVideo.type === 'gdrive' || parsedVideo.type === 'vimeo' ? (
                  <iframe
                    src={parsedVideo.embedUrl}
                    title="Pratinjau Video"
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                ) : parsedVideo.type === 'direct' ? (
                  <video src={parsedVideo.srcUrl} controls className="w-full h-full object-contain" />
                ) : (
                  <div className="text-xs text-gray-400 p-4 text-center">
                    Pratinjau akan ditampilkan saat pemesan memutar video.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Catatan Syariat */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
              <Award size={15} /> Catatan Syariat / Berita Acara
            </label>
            <textarea
              value={catatan}
              onChange={e => setCatatan(e.target.value)}
              rows={3}
              placeholder="Contoh: Penyembelihan dilaksanakan hari Rabu, 4 November 2026 pukul 06.30 WIB oleh Ustaz..."
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || isUploadingFoto || isUploadingVideo}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />} Simpan Dokumentasi
          </button>
        </div>
      </div>
    </div>
  );
}

function SuratJalanModal({ pesanan, onClose }) {
  if (!pesanan) return null;
  const paket = getPaketById(pesanan.paketId);
  const nasiBox = getNasiBoxById(pesanan.nasiBoxId);
  const daging = getMenuDagingById(pesanan.menuDaging);
  const jeroan = getMenuJeroanById(pesanan.menuJeroan);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto" onClick={onClose}>
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-surat-jalan, #printable-surat-jalan * {
            visibility: visible !important;
          }
          #printable-surat-jalan {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 24px !important;
            background: white !important;
            z-index: 999999 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      <div
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl relative my-auto p-4 sm:p-6 max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 no-print">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-emerald-700" />
            <h3 className="font-bold text-gray-800 text-sm sm:text-base">Surat Jalan dan Lembar Kerja Dapur</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow transition-colors"
            >
              <Printer size={15} /> Cetak Lembar Kerja
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto pt-3">
          <div id="printable-surat-jalan" className="p-6 bg-white border border-gray-300 rounded-xl font-sans text-xs text-gray-800">
            {/* Header Surat Jalan */}
            <div className="border-b-2 border-emerald-800 pb-3 mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-emerald-800">RAHMA AQIQAH KEBUMEN</h1>
                <p className="text-[11px] text-gray-600">Masakan Lezat dan Sesuai Syariat - Jagonya Aqiqah Siap Saji</p>
                <p className="text-[10px] text-gray-400">Jl. Cincin Kota, Karangsari, Kebumen | WA: 081 5787 33 874</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded text-[11px]">
                  SURAT JALAN & TIKET DAPUR
                </span>
                <p className="font-mono text-[11px] font-bold mt-1 text-gray-700">{pesanan.id}</p>
              </div>
            </div>

            {/* Identitas Pesanan */}
            <div className="grid grid-cols-2 gap-4 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold">Shahibul Aqiqah</p>
                <p className="font-bold text-sm text-gray-800">{pesanan.namaAnak}</p>
                <p className="text-gray-600">{pesanan.binBinti} {pesanan.namaOrtu}</p>
                <p className="text-gray-500 text-[10px] mt-1">Jenis Kelamin: {pesanan.jenisKelamin === 'laki' ? 'Laki-laki' : 'Perempuan'}</p>
                {pesanan.noWa && <p className="text-emerald-700 font-semibold text-[10px] mt-0.5">WA: {pesanan.noWa}</p>}
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold">Jadwal & Sesi Pengiriman</p>
                <p className="font-bold text-sm text-gray-800">{pesanan.tglProduksi}</p>
                <p className="text-emerald-700 font-semibold">
                  Sesi: {pesanan.sesi === 'pagi' ? 'Pagi (08.00 - 11.00 WIB)' : 'Sore (13.00 - 16.00 WIB)'}
                </p>
                <p className="text-gray-500 text-[10px] mt-1">Status Bayar: <strong>{pesanan.statusPembayaran}</strong></p>
              </div>
            </div>

            {/* Rincian Menu Dapur */}
            <table className="w-full border-collapse border border-gray-300 mb-4 text-[11px]">
              <thead>
                <tr className="bg-emerald-50 text-emerald-900 border-b border-gray-300">
                  <th className="p-2 border-r border-gray-300 text-left">Item / Olahan Menu</th>
                  <th className="p-2 border-r border-gray-300 text-center w-20">Porsi</th>
                  <th className="p-2 text-center w-24">Cek Dapur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-2 border-r border-gray-300">
                    <p className="font-bold">Paket Aqiqah Tipe {pesanan.paketId} ({pesanan.jumlahEkor} Ekor)</p>
                    <p className="text-gray-500 text-[10px]">{paket?.porsiDaging} Porsi Daging & {paket?.porsiJeroan} Porsi Jeroan</p>
                  </td>
                  <td className="p-2 border-r border-gray-300 text-center font-bold">{pesanan.jumlahEkor} Ekor</td>
                  <td className="p-2 text-center text-gray-400">[ &nbsp; &nbsp; ]</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-gray-300">
                    <p className="font-bold">Menu Olahan Daging</p>
                    <p className="text-emerald-700 font-semibold">{daging?.nama || 'Standar Dapur'}</p>
                  </td>
                  <td className="p-2 border-r border-gray-300 text-center">{paket?.porsiDaging} Porsi</td>
                  <td className="p-2 text-center text-gray-400">[ &nbsp; &nbsp; ]</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-gray-300">
                    <p className="font-bold">Menu Olahan Jeroan & Tulang</p>
                    <p className="text-emerald-700 font-semibold">{jeroan?.nama || 'Standar Dapur'}</p>
                  </td>
                  <td className="p-2 border-r border-gray-300 text-center">{paket?.porsiJeroan} Porsi</td>
                  <td className="p-2 text-center text-gray-400">[ &nbsp; &nbsp; ]</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-gray-300">
                    <p className="font-bold">Paket Nasi Box</p>
                    <p className="text-gray-600">{pesanan.nasiBoxId !== 'none' ? nasiBox?.nama : 'Tanpa Nasi Box (Masak Saja)'}</p>
                  </td>
                  <td className="p-2 border-r border-gray-300 text-center font-bold">
                    {pesanan.nasiBoxId !== 'none' ? `${pesanan.jumlahBox} Box` : '-'}
                  </td>
                  <td className="p-2 text-center text-gray-400">[ &nbsp; &nbsp; ]</td>
                </tr>
              </tbody>
            </table>

            {pesanan.catatan && (
              <div className="mb-4 bg-amber-50 p-2.5 rounded border border-amber-200">
                <p className="font-bold text-amber-800 text-[10px] uppercase">Catatan Khusus Pemesan:</p>
                <p className="text-gray-700 text-[11px]">{pesanan.catatan}</p>
              </div>
            )}

            {/* Tanda Tangan Serah Terima */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2 mt-4 border-t border-gray-200 text-[10px]">
              <div>
                <p className="text-gray-500">Juru Masak / Dapur</p>
                <div className="h-10"></div>
                <p className="font-semibold text-gray-700 border-t border-gray-300 pt-1 mx-2">( ........................ )</p>
              </div>
              <div>
                <p className="text-gray-500">Driver / Kurir Pengantar</p>
                <div className="h-10"></div>
                <p className="font-semibold text-gray-700 border-t border-gray-300 pt-1 mx-2">( ........................ )</p>
              </div>
              <div>
                <p className="text-gray-500">Penerima (Pelanggan)</p>
                <div className="h-10"></div>
                <p className="font-semibold text-gray-700 border-t border-gray-300 pt-1 mx-2">( ........................ )</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 no-print">
          <span>Gunakan kertas A4 untuk hasil cetak optimal.</span>
          <button onClick={onClose} className="text-emerald-700 font-semibold hover:underline">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

function PesananDetailModal({ pesanan, onClose, onPaymentChange }) {
  const paket = getPaketById(pesanan.paketId);
  const nasiBox = getNasiBoxById(pesanan.nasiBoxId);
  const total = pesanan.totalHarga || 0;
  const dp50 = Math.ceil(total * 0.5);
  const isDP = pesanan.statusPembayaran === 'DP 50% Lunas';

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl my-auto max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-emerald-800 text-lg">Detail Pesanan</h3>
            <p className="text-xs text-gray-400 font-mono">{pesanan.id}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X size={20} /></button>
        </div>

        {/* Status Pembayaran Card with 1-click update */}
        <div className={`p-3.5 rounded-2xl border mb-4 flex items-center justify-between gap-3 ${
          isDP ? 'bg-amber-50/80 border-amber-200' : 'bg-emerald-50/80 border-emerald-200'
        }`}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Status Pembayaran</p>
            <p className={`font-bold text-sm ${isDP ? 'text-amber-800' : 'text-emerald-800'}`}>
              {pesanan.statusPembayaran}
            </p>
            {isDP && (
              <p className="text-xs text-amber-700 mt-0.5">
                Sisa pelunasan: <strong>{formatRupiah(total - dp50)}</strong>
              </p>
            )}
          </div>
          {onPaymentChange && (
            <button
              type="button"
              onClick={() => onPaymentChange(pesanan.id, isDP ? 'Lunas 100%' : 'DP 50% Lunas')}
              className={`text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0 ${
                isDP
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-white hover:bg-amber-50 text-amber-700 border border-amber-300'
              }`}
            >
              {isDP ? <><CheckCircle size={14} /> Tandai Lunas 100%</> : 'Ubah ke DP 50%'}
            </button>
          )}
        </div>

        {/* Bukti Transfer jika ada */}
        {pesanan.buktiTransfer && (
          <div className="mb-4 p-3 bg-gray-50 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <FileText size={14} className="text-emerald-600" /> Bukti Transfer Pelanggan
              </span>
              <a
                href={pesanan.buktiTransfer}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-emerald-700 hover:underline font-semibold"
              >
                Lihat Asli
              </a>
            </div>
            <a href={pesanan.buktiTransfer} target="_blank" rel="noopener noreferrer">
              <img
                src={pesanan.buktiTransfer}
                alt="Bukti Transfer"
                className="max-h-48 w-full object-contain rounded-xl bg-white border border-gray-200"
              />
            </a>
          </div>
        )}

        <div className="space-y-2.5 text-sm">
          {[
            ['Nama Anak', `${pesanan.namaAnak} ${pesanan.binBinti} ${pesanan.namaOrtu}`],
            ['Jenis Kelamin', pesanan.jenisKelamin === 'laki' ? 'Laki-laki (2 Ekor)' : 'Perempuan (1 Ekor)'],
            ['Tanggal Lahir', formatTanggalIndonesia(pesanan.tglLahir, false)],
            ['Paket Kambing', `Tipe ${pesanan.paketId} (${paket?.porsiDaging} Porsi Daging & ${paket?.porsiJeroan} Porsi Jeroan)`],
            ['Olahan Daging', getMenuDagingById(pesanan.menuDaging)?.nama || 'Standar Dapur'],
            ['Olahan Jeroan', getMenuJeroanById(pesanan.menuJeroan)?.nama || 'Standar Dapur'],
            ['Nasi Box', pesanan.nasiBoxId !== 'none' ? `${nasiBox?.nama} \u00d7 ${pesanan.jumlahBox} box` : 'Tanpa Nasi Box'],
            ['Jadwal Produksi', `${formatTanggalIndonesia(pesanan.tglProduksi, true)}`],
            ['Sesi Pengiriman', pesanan.sesi === 'pagi' ? 'Pagi (08.00 - 11.00 WIB)' : 'Sore (13.00 - 16.00 WIB)'],
            ['WhatsApp Pemesan', pesanan.noWa || '-'],
            ['Total Tagihan', formatRupiah(pesanan.totalHarga)],
            ...(isDP ? [
              ['DP 50% Yang Diterima', formatRupiah(dp50)],
              ['Sisa Tagihan Pelunasan', formatRupiah(total - dp50)],
            ] : []),
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-2 border-b border-gray-100 pb-2">
              <span className="text-gray-500 text-xs">{k}</span>
              <span className="font-semibold text-gray-800 text-right text-xs">{v}</span>
            </div>
          ))}
          {pesanan.catatan && (
            <div className="pt-1">
              <span className="text-gray-500 text-xs block mb-1">Catatan Khusus Pemesan:</span>
              <p className="text-gray-700 text-xs bg-gray-50 rounded-lg p-2.5 border border-gray-200">{pesanan.catatan}</p>
            </div>
          )}
        </div>

        <button onClick={onClose}
          className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer">
          Tutup Detail
        </button>
      </div>
    </div>
  );
}

function WhatsAppAdminModal({ pesanan, onClose }) {
  if (!pesanan) return null;
  const paket = getPaketById(pesanan.paketId);
  const daging = getMenuDagingById(pesanan.menuDaging);
  const jeroan = getMenuJeroanById(pesanan.menuJeroan);

  const phone = (pesanan.noWa || '').replace(/^0/, '62').replace(/[^0-9]/g, '');

  const templates = [
    {
      id: 'terima_bayar',
      label: 'Konfirmasi Bayar & Jadwal',
      text: `Assalamualaikum Warahmatullahi Wabarakatuh Bpk/Ibu ${pesanan.namaOrtu},\n\nAlhamdulillah, pembayaran untuk pemesanan aqiqah ananda *${pesanan.namaAnak}* (${pesanan.id}) sebesar *${formatRupiah(pesanan.totalHarga)}* (${pesanan.statusPembayaran}) telah kami terima dan kami jadwalkan untuk produksi tanggal *${pesanan.tglProduksi}* (Sesi ${pesanan.sesi === 'pagi' ? 'Pagi 08.00-11.00 WIB' : 'Sore 13.00-16.00 WIB'}).\n\nTerima kasih atas kepercayaan Bpk/Ibu kepada Rahma Aqiqah Kebumen.`,
    },
    {
      id: 'penyembelihan',
      label: 'Proses Sembelih Syariat',
      text: `Assalamualaikum Bpk/Ibu ${pesanan.namaOrtu},\n\nKami mengabarkan bahwa saat ini hewan aqiqah ananda *${pesanan.namaAnak}* sedang dalam proses penyembelihan secara syariat Islam oleh juru sembelih kami dengan pembacaan Bismillah Allahu Akbar. Foto papan nama dan rekaman video akan segera kami siapkan.`,
    },
    {
      id: 'masak_dapur',
      label: 'Proses Masak Dapur',
      text: `Assalamualaikum Bpk/Ibu ${pesanan.namaOrtu},\n\nHewan aqiqah ananda *${pesanan.namaAnak}* telah selesai disembelih. Saat ini menu olahan daging (*${daging?.nama}*) dan jeroan (*${jeroan?.nama}*) sedang dimasak secara higienis di dapur Rahma Aqiqah.`,
    },
    {
      id: 'pengiriman',
      label: 'Kurir Sedang Mengantar',
      text: `Alhamdulillah masakan aqiqah ananda *${pesanan.namaAnak}* telah siap saji dan saat ini sedang dalam perjalanan bersama kurir Rahma Aqiqah menuju alamat Bpk/Ibu. Mohon dipersiapkan penerimaannya. Terima kasih.`,
    },
    {
      id: 'selesai',
      label: 'Syariat Selesai & E-Sertifikat',
      text: `Alhamdulillah seluruh rangkaian aqiqah ananda *${pesanan.namaAnak}* telah selesai ditunaikan dengan lancar. Dokumentasi foto, rekaman video doa, dan E-Sertifikat Aqiqah resmi kini sudah dapat diakses dan diunduh di menu Lacak Pesanan kami dengan nomor invoice: *${pesanan.id}*.\n\nSemoga ananda tumbuh menjadi anak yang saleh/salehah dan berbakti kepada kedua orang tua. Jazakumullah khairan katsiran.`,
    },
    {
      id: 'pelunasan',
      label: 'Konfirmasi Pelunasan 100%',
      text: `Assalamualaikum Warahmatullahi Wabarakatuh Bpk/Ibu ${pesanan.namaOrtu},\n\nAlhamdulillah, sisa pelunasan pembayaran aqiqah ananda *${pesanan.namaAnak}* (${pesanan.id}) telah kami terima dengan status *LUNAS 100%*. Terima kasih banyak atas kelancaran transaksinya.\n\nJazakumullah khairan katsiran.`,
    },
  ];

  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0].id);
  const [customText, setCustomText] = useState(templates[0].text);

  const handleSelectTemplate = (t) => {
    setSelectedTemplateId(t.id);
    setCustomText(t.text);
  };

  const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(customText)}`;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 my-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <MessageSquare size={16} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm sm:text-base">Kirim Update WhatsApp</h3>
              <p className="text-xs text-gray-500">Tujuan: {pesanan.namaOrtu} ({pesanan.noWa || 'Tanpa no WA'})</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={20} />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">Pilih Template Pesan:</label>
            <div className="flex flex-wrap gap-1.5">
              {templates.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelectTemplate(t)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                    selectedTemplateId === t.id
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Isi Pesan (Dapat Disesuaikan):</label>
            <textarea
              rows={6}
              value={customText}
              onChange={e => setCustomText(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl p-3 text-xs text-gray-800 focus:border-emerald-500 focus:outline-none resize-none font-sans"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow"
          >
            <MessageSquare size={15} />
            Buka WhatsApp Pelanggan
          </a>
        </div>
      </div>
    </div>
  );
}

export default function DashboardAdmin({ pesananList, setPesananList, onRefresh, isLoadingOrders }) {
  const [uploadModal, setUploadModal] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const [suratJalanModal, setSuratJalanModal] = useState(null);
  const [waModalPesanan, setWaModalPesanan] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [activeSection, setActiveSection] = useState('pesanan');
  const [kuotaList, setKuotaList] = useState(KUOTA_JADWAL_INIT);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const navigate = useNavigate();
  const session = getAdminSession();

  // Memuat data kuota kalender real-time dari Supabase
  const loadLiveQuotas = async () => {
    const data = await getDailyQuotas();
    setKuotaList(data);
  };

  useEffect(() => {
    loadLiveQuotas();
  }, []);

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    await Promise.all([
      onRefresh ? onRefresh() : Promise.resolve(),
      loadLiveQuotas(),
    ]);
    setIsRefreshing(false);
  };

  const handleLogout = () => {
    clearAdminSession();
    navigate('/admin/login', { replace: true });
  };

  const today = '2026-11-05';

  const totalBulanIni = pesananList.length;
  const kuotaHariIni = kuotaList.find(k => k.tanggal === today);
  const menungguVerifikasi = pesananList.filter(p => p.statusOperasional === 'Menunggu Verifikasi').length;
  const totalPendapatan = pesananList.reduce((sum, p) => sum + p.totalHarga, 0);

  // Perbarui status operasional langsung ke Supabase
  const handleStatusChange = async (id, newStatus) => {
    setPesananList(prev => prev.map(p => p.id === id ? { ...p, statusOperasional: newStatus } : p));
    await updateOrderStatus(id, newStatus);
  };

  // Perbarui status pembayaran langsung ke Supabase (DP 50% <-> Lunas 100%)
  const handlePaymentChange = async (id, newPaymentStatus) => {
    setPesananList(prev => prev.map(p => p.id === id ? { ...p, statusPembayaran: newPaymentStatus } : p));
    if (detailModal && detailModal.id === id) {
      setDetailModal(prev => ({ ...prev, statusPembayaran: newPaymentStatus }));
    }
    await updatePaymentStatus(id, newPaymentStatus);
    if (onRefresh) onRefresh();
  };

  // Simpan dokumentasi syariat langsung ke Supabase
  const handleSyariatSave = async (updatedPesanan) => {
    setPesananList(prev => prev.map(p => p.id === updatedPesanan.id ? updatedPesanan : p));
    if (updatedPesanan.syariat) {
      await upsertSyariatDoc(updatedPesanan.id, updatedPesanan.syariat);
      if (onRefresh) onRefresh();
    }
  };

  const filteredPesanan = filterStatus
    ? pesananList.filter(p => p.statusOperasional === filterStatus)
    : pesananList;

  const sortedKuotaList = [...kuotaList].sort((a, b) => a.tanggal.localeCompare(b.tanggal));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600/80 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500">
                Sesi Terverifikasi
              </span>
              <span className="text-xs text-emerald-200">
                Masuk sebagai: <strong>{session?.nama || 'Bapak Abdul Ghofar'}</strong> ({session?.peran || 'Pengelola Utama'})
              </span>
            </div>
            <h2 className="text-xl font-bold mt-1">Dashboard Operasional Dapur & Syariat</h2>
            <p className="text-emerald-200 text-xs mt-0.5">Rahma Aqiqah Kebumen &middot; {today}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right border-r border-emerald-600/60 pr-4 hidden sm:block">
              <p className="text-xs text-emerald-200">Kuota Dapur Hari Ini</p>
              <p className="text-2xl font-bold leading-tight">
                {kuotaHariIni ? `${kuotaHariIni.terpakai}/${kuotaHariIni.maks}` : '0/5'}
                <span className="text-xs font-normal text-emerald-200 ml-1">Ekor</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRefreshAll}
                disabled={isRefreshing || isLoadingOrders}
                title="Segarkan data dari Supabase"
                className="bg-emerald-600/70 hover:bg-emerald-600 text-emerald-100 hover:text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 border border-emerald-500/50 disabled:opacity-50"
              >
                <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Segarkan Data</span>
              </button>

              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600/70 hover:bg-emerald-600 text-emerald-100 hover:text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 border border-emerald-500/50"
              >
                <ExternalLink size={14} />
                <span className="hidden md:inline">Website Publik</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="bg-red-500/20 hover:bg-red-600 text-red-200 hover:text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 border border-red-400/40 shadow-sm"
              >
                <LogOut size={14} />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {uploadModal && (
        <UploadSyariatModal pesanan={uploadModal} onClose={() => setUploadModal(null)} onSave={handleSyariatSave} />
      )}
      {detailModal && (
        <PesananDetailModal pesanan={detailModal} onClose={() => setDetailModal(null)} onPaymentChange={handlePaymentChange} />
      )}
      {suratJalanModal && (
        <SuratJalanModal pesanan={suratJalanModal} onClose={() => setSuratJalanModal(null)} />
      )}
      {waModalPesanan && (
        <WhatsAppAdminModal pesanan={waModalPesanan} onClose={() => setWaModalPesanan(null)} />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Kartu Metrik */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Total Pesanan Bulan Ini', value: totalBulanIni, Icon: Package,
              color: 'bg-emerald-50 border-emerald-200', iconColor: 'text-emerald-600', iconBg: 'bg-emerald-100',
              sub: 'pesanan aktif'
            },
            {
              label: 'Kuota Dapur Hari Ini', value: `${kuotaHariIni?.terpakai || 0}/${kuotaHariIni?.maks || 5}`,
              Icon: Calendar, color: 'bg-blue-50 border-blue-200', iconColor: 'text-blue-600', iconBg: 'bg-blue-100',
              sub: `${kuotaHariIni ? kuotaHariIni.maks - kuotaHariIni.terpakai : 5} slot tersisa`
            },
            {
              label: 'Menunggu Verifikasi', value: menungguVerifikasi, Icon: Clock,
              color: 'bg-amber-50 border-amber-200', iconColor: 'text-amber-600', iconBg: 'bg-amber-100',
              sub: 'perlu konfirmasi'
            },
            {
              label: 'Pendapatan (Estimasi)', value: formatRupiah(totalPendapatan), Icon: TrendingUp,
              color: 'bg-purple-50 border-purple-200', iconColor: 'text-purple-600', iconBg: 'bg-purple-100',
              sub: 'total semua pesanan'
            },
          ].map(({ label, value, Icon, color, iconColor, iconBg, sub }) => (
            <div key={label} className={`${color} border rounded-2xl p-5 shadow-sm`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
                  <p className="text-2xl font-bold text-gray-800">{value}</p>
                  <p className="text-xs text-gray-400 mt-1">{sub}</p>
                </div>
                <div className={`${iconBg} w-11 h-11 rounded-xl flex items-center justify-center`}>
                  <Icon size={22} className={iconColor} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Admin */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'pesanan', label: 'Manajemen Pesanan dan Dapur' },
            { id: 'kuota', label: 'Kontrol Kuota Kalender Dapur' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveSection(tab.id)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                activeSection === tab.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tabel Pesanan */}
        {activeSection === 'pesanan' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-bold text-emerald-800">Manajemen Pesanan dan Antrean Dapur Harian</h3>
              <div className="flex items-center gap-2">
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="border-2 border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none bg-white"
                >
                  <option value="">Semua Status</option>
                  {STATUS_OPERASIONAL_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <span className="text-sm text-gray-500">{filteredPesanan.length} pesanan</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Invoice dan Anak', 'Detail Kustomisasi', 'Jadwal dan Sesi', 'Pembayaran', 'Status Operasional', 'Aksi'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredPesanan.map((p) => {
                    const paket = getPaketById(p.paketId);
                    const nasiBox = getNasiBoxById(p.nasiBoxId);
                    const daging = getMenuDagingById(p.menuDaging);
                    const jeroan = getMenuJeroanById(p.menuJeroan);
                    return (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <p className="font-mono text-xs text-gray-400">{p.id}</p>
                          <p className="font-bold text-gray-800 text-sm">{p.namaAnak}</p>
                          <p className="text-xs text-gray-500">{p.binBinti} {p.namaOrtu}</p>
                          <p className="text-xs text-gray-400">{p.jumlahEkor} Ekor &middot; {p.jenisKelamin === 'laki' ? 'Laki-laki' : 'Perempuan'}</p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="bg-emerald-50 rounded-lg p-2 text-xs space-y-0.5 min-w-[200px]">
                            <p className="font-semibold text-emerald-800">Tipe {p.paketId} &middot; {paket?.porsiDaging} Porsi</p>
                            <p className="text-gray-600">Daging: <strong>{daging?.nama}</strong></p>
                            <p className="text-gray-600">Jeroan: <strong>{jeroan?.nama}</strong></p>
                            {p.nasiBoxId !== 'none' && nasiBox ? (
                              <p className="text-amber-700">{p.jumlahBox} Box {formatRupiah(nasiBox.harga)}/box</p>
                            ) : (
                              <p className="text-gray-400">Tanpa Nasi Box</p>
                            )}
                            <p className="font-bold text-emerald-700 pt-0.5">{formatRupiah(p.totalHarga)}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <p className="font-semibold text-gray-800">{p.tglProduksi}</p>
                          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                            {p.sesi === 'pagi'
                              ? <><Sun size={11} className="text-amber-500" /> Pagi (08.00 sampai 11.00 WIB)</>
                              : <><Sunset size={11} className="text-orange-400" /> Sore (13.00 sampai 16.00 WIB)</>
                            }
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-1.5 min-w-[125px]">
                            <span className={`inline-block px-2.5 py-0.5 rounded-lg border text-xs font-semibold ${BAYAR_COLORS[p.statusPembayaran] || 'bg-gray-100 text-gray-700'}`}>
                              {p.statusPembayaran}
                            </span>
                            {p.statusPembayaran === 'DP 50% Lunas' ? (
                              <button
                                type="button"
                                onClick={() => handlePaymentChange(p.id, 'Lunas 100%')}
                                className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded-md transition-all shadow-2xs cursor-pointer whitespace-nowrap"
                                title="Klik jika sisa pelunasan telah diterima"
                              >
                                <CheckCircle size={11} /> Tandai Lunas 100%
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handlePaymentChange(p.id, 'DP 50% Lunas')}
                                className="text-[10px] text-gray-400 hover:text-amber-700 block underline cursor-pointer"
                                title="Kembalikan status ke DP 50%"
                              >
                                Ubah ke DP 50%
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <select
                            value={p.statusOperasional}
                            onChange={e => handleStatusChange(p.id, e.target.value)}
                            className={`text-xs font-bold px-2 py-1.5 rounded-lg border-2 focus:outline-none cursor-pointer ${STATUS_COLORS[p.statusOperasional]}`}
                          >
                            {STATUS_OPERASIONAL_LIST.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1.5 min-w-[130px]">
                            <div className="flex gap-1">
                              <button
                                onClick={() => setDetailModal(p)}
                                className="flex-1 flex items-center justify-center gap-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-2 py-1.5 rounded-lg font-semibold transition-colors"
                              >
                                <Eye size={13} /> Detail
                              </button>
                              <button
                                onClick={() => setSuratJalanModal(p)}
                                title="Cetak Surat Jalan & Tiket Dapur"
                                className="flex items-center justify-center gap-1 text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1.5 rounded-lg font-semibold transition-colors"
                              >
                                <Printer size={13} /> Tiket
                              </button>
                            </div>

                            <button
                              onClick={() => setUploadModal(p)}
                              className="w-full flex items-center justify-center gap-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap"
                            >
                              <Upload size={13} />
                              {p.syariat ? 'Update Syariat' : 'Upload Syariat'}
                            </button>

                            <button
                              type="button"
                              onClick={() => setWaModalPesanan(p)}
                              className="w-full flex items-center justify-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1.5 rounded-lg font-semibold transition-colors shadow-sm"
                            >
                              <MessageSquare size={13} /> WA Pelanggan
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tabel Kuota Kalender */}
        {activeSection === 'kuota' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-emerald-800">Kontrol Kuota Kalender Dapur</h3>
              <p className="text-xs text-gray-400 mt-0.5">Kapasitas maksimal dapur: 5 Ekor per Hari (Anti-Overbooking Aktif)</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Tanggal', 'Kuota Maks', 'Kuota Terpakai', 'Sisa Kuota', 'Utilisasi', 'Status Jadwal'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sortedKuotaList.map((k) => {
                    const sisa = k.maks - k.terpakai;
                    const pct = Math.round((k.terpakai / k.maks) * 100);
                    const isPenuh = k.status === 'penuh';
                    const isToday = k.tanggal === today;
                    return (
                      <tr key={k.tanggal} className={`hover:bg-gray-50 transition-colors ${isToday ? 'bg-amber-50' : ''}`}>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-800">
                            {new Date(k.tanggal).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                          {isToday && <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">Hari Ini</span>}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-700">{k.maks} Ekor</td>
                        <td className="px-6 py-4 font-semibold text-gray-700">{k.terpakai} Ekor</td>
                        <td className="px-6 py-4">
                          <span className={`font-bold ${isPenuh ? 'text-red-600' : 'text-emerald-600'}`}>
                            {sisa} Ekor
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${isPenuh ? 'bg-red-500' : pct >= 60 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-gray-600">{pct}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border ${
                            isPenuh
                              ? 'bg-red-100 text-red-700 border-red-200'
                              : k.terpakai > 0
                              ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                              : 'bg-gray-100 text-gray-600 border-gray-200'
                          }`}>
                            {isPenuh
                              ? <><AlertCircle size={12} /> Penuh (Terkunci Otomatis)</>
                              : k.terpakai > 0
                              ? <><CheckCircle size={12} /> Tersedia (Sisa {sisa} dari {k.maks})</>
                              : <>Kosong (5 dari 5 Tersedia)</>
                            }
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Tersedia (utilisasi di bawah 60%)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span> Hampir penuh (utilisasi 60-99%)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Penuh (100%), Anti-overbooking aktif</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
