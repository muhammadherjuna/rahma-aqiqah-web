// src/pages/LacakPesanan.jsx
import { useState, useEffect } from 'react';
import {
  Search, CheckCircle, Clock, Truck, ChefHat, Scissors, FileText,
  Download, Play, Camera, Award, AlertCircle, Info, Loader2, Printer, X, ShieldCheck,
  Maximize2
} from 'lucide-react';
import {
  PESANAN_INIT, STATUS_OPERASIONAL_LIST, formatRupiah,
  getPaketById, getMenuDagingById, getMenuJeroanById, getNasiBoxById
} from '../data/mockData';
import { getOrderById } from '../lib/supabaseClient';
import VideoSyariatModal from '../components/VideoSyariatModal';

const STATUS_ICONS = {
  'Menunggu Verifikasi': { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-100' },
  'Dijadwalkan': { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-100' },
  'Proses Penyembelihan': { icon: Scissors, color: 'text-orange-500', bg: 'bg-orange-100' },
  'Masak Dapur': { icon: ChefHat, color: 'text-purple-500', bg: 'bg-purple-100' },
  'Dikirim': { icon: Truck, color: 'text-cyan-500', bg: 'bg-cyan-100' },
  'Selesai': { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-100' },
};

function StatusStepper({ statusSaat }) {
  const statuses = STATUS_OPERASIONAL_LIST;
  const currentIdx = statuses.indexOf(statusSaat);

  return (
    <div className="relative">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-5 left-5 right-5 h-1 bg-gray-200 z-0">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${(currentIdx / (statuses.length - 1)) * 100}%` }}
          />
        </div>
        {statuses.map((status, idx) => {
          const statusInfo = STATUS_ICONS[status];
          const Icon = statusInfo?.icon || CheckCircle;
          const isDone = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          return (
            <div key={status} className="flex flex-col items-center z-10 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                isDone
                  ? isCurrent
                    ? 'bg-emerald-600 border-emerald-600 shadow-lg shadow-emerald-200 scale-110'
                    : 'bg-emerald-500 border-emerald-500'
                  : 'bg-white border-gray-300'
              }`}>
                <Icon size={16} className={isDone ? 'text-white' : 'text-gray-400'} />
              </div>
              <p className={`text-[9px] font-medium mt-2 text-center leading-tight max-w-[70px] ${
                isCurrent ? 'text-emerald-700 font-bold' : isDone ? 'text-emerald-600' : 'text-gray-400'
              }`}>
                {status}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SertifikatModal({ pesanan, onClose }) {
  if (!pesanan) return null;

  const handlePrint = () => {
    window.print();
  };

  const nomorSertifikat = `SRT/${pesanan.id.replace('INV-', '')}/RA-KBM`;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto" onClick={onClose}>
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-certificate, #printable-certificate * {
            visibility: visible !important;
          }
          #printable-certificate {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 30px !important;
            background: white !important;
            z-index: 999999 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl relative my-auto p-4 sm:p-6 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Action Toolbar */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 no-print">
          <div className="flex items-center gap-2">
            <Award size={20} className="text-emerald-600" />
            <h3 className="font-bold text-gray-800 text-sm sm:text-base">E-Sertifikat Aqiqah Resmi</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow transition-colors"
            >
              <Printer size={15} /> Cetak / Unduh PDF
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Certificate Body Container */}
        <div className="overflow-y-auto pt-3">
          <div
            id="printable-certificate"
            className="border-[6px] border-emerald-800 p-6 sm:p-8 rounded-2xl relative bg-amber-50/20 text-center font-serif shadow-inner"
          >
            {/* Ornamen Garis Ganda Emas */}
            <div className="border border-amber-500/80 p-5 rounded-xl relative">
              {/* Bismillah Arabic Calligraphy */}
              <div className="text-lg sm:text-xl font-bold text-emerald-900 mb-2 font-serif tracking-widest">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>

              <div className="uppercase tracking-widest text-[11px] text-emerald-700 font-sans font-bold">
                Rahma Aqiqah Kebumen
              </div>
              <p className="text-[10px] text-gray-500 font-sans mb-3">
                Jl. Cincin Kota, Karangsari, Kebumen | Telepon / WA: 081 5787 33 874
              </p>

              <div className="my-3 py-1.5 border-y-2 border-amber-600/40">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-900 tracking-wider font-serif">
                  SERTIFIKAT AQIQAH
                </h2>
                <p className="text-[10px] font-sans text-gray-400 mt-0.5">Nomor: {nomorSertifikat}</p>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 italic font-sans mt-3">
                Diberikan sebagai bukti sah penunaian ibadah Aqiqah sesuai syariat Islam atas kelahiran ananda:
              </p>

              {/* Nama Anak */}
              <div className="my-4 py-2 bg-emerald-50/70 border border-emerald-200/60 rounded-xl">
                <h3 className="text-xl sm:text-2xl font-bold text-emerald-900 tracking-wide">
                  {pesanan.namaAnak}
                </h3>
                <p className="text-sm font-sans font-semibold text-emerald-700 mt-0.5">
                  {pesanan.binBinti} {pesanan.namaOrtu}
                </p>
              </div>

              {/* Data Detail Aqiqah */}
              <div className="grid grid-cols-2 gap-2 text-left font-sans text-[11px] sm:text-xs text-gray-700 max-w-md mx-auto my-3 bg-white/80 p-3 rounded-xl border border-gray-200">
                <div>
                  <span className="text-gray-400 block text-[10px]">Tanggal Lahir:</span>
                  <span className="font-semibold">{pesanan.tglLahir}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Jenis Kelamin:</span>
                  <span className="font-semibold">{pesanan.jenisKelamin === 'laki' ? 'Laki-laki' : 'Perempuan'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Hewan Aqiqah:</span>
                  <span className="font-semibold">{pesanan.jumlahEkor} Ekor Kambing Sehat</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Tanggal Pelaksanaan:</span>
                  <span className="font-semibold">{pesanan.tglProduksi}</span>
                </div>
              </div>

              {/* Kutipan Hadits */}
              <div className="my-3 px-4 py-2 bg-amber-50/60 border-l-2 border-amber-500 text-left rounded-r-lg font-sans">
                <p className="text-[10px] sm:text-[11px] text-gray-600 italic leading-relaxed">
                  &ldquo;Setiap anak tergadai dengan aqiqahnya, disembelihkan untuknya pada hari ketujuhnya, dicukur rambutnya dan diberi nama.&rdquo;
                </p>
                <p className="text-[9px] text-gray-400 mt-0.5 font-semibold">(HR. Abu Dawud, At-Tirmidzi, An-Nasa&apos;i)</p>
              </div>

              {/* Tanda Tangan & Legalisasi */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-2 font-sans text-xs">
                <div className="text-center">
                  <p className="text-gray-500 text-[10px]">Petugas Sembelih Syariat</p>
                  <div className="h-12 flex items-center justify-center">
                    <ShieldCheck size={28} className="text-emerald-600 opacity-60" />
                  </div>
                  <p className="font-bold text-gray-800 border-t border-gray-300 pt-1 inline-block min-w-[120px]">
                    Ust. Ahli Syariat
                  </p>
                  <p className="text-[9px] text-gray-400">Juru Sembelih Halal</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-[10px]">Kebumen, {pesanan.tglProduksi}</p>
                  <p className="text-gray-500 text-[10px]">Pimpinan Rahma Aqiqah</p>
                  <div className="h-12 flex items-center justify-center">
                    <span className="font-serif italic font-bold text-emerald-800 text-sm underline decoration-emerald-500">
                      Abdul Ghofar
                    </span>
                  </div>
                  <p className="font-bold text-gray-800 border-t border-gray-300 pt-1 inline-block min-w-[120px]">
                    Bpk. Abdul Ghofar
                  </p>
                  <p className="text-[9px] text-emerald-700 font-semibold">Tervalidasi Digital</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info modal */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 no-print">
          <span>Tips: Pilih &ldquo;Save as PDF&rdquo; pada menu cetak browser Anda.</span>
          <button onClick={onClose} className="text-emerald-700 font-semibold hover:underline">
            Tutup Pratinjau
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LacakPesanan({ pesananList }) {
  const [invoiceInput, setInvoiceInput] = useState('');
  const [hasilCari, setHasilCari] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [showSertifikat, setShowSertifikat] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showFotoModal, setShowFotoModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Auto-search jika ada parameter ?inv= di URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qInv = params.get('inv');
    if (qInv) {
      setInvoiceInput(qInv);
      (async () => {
        setIsSearching(true);
        const liveOrder = await getOrderById(qInv);
        if (liveOrder) {
          setHasilCari(liveOrder);
          setNotFound(false);
        } else {
          const localFound = pesananList?.find(p => p.id.toLowerCase() === qInv.trim().toLowerCase());
          if (localFound) {
            setHasilCari(localFound);
            setNotFound(false);
          } else {
            setNotFound(true);
          }
        }
        setIsSearching(false);
      })();
    }
  }, [pesananList]);

  const handleCari = async (e) => {
    e.preventDefault();
    if (!invoiceInput.trim()) return;

    setIsSearching(true);
    const liveOrder = await getOrderById(invoiceInput);
    if (liveOrder) {
      setHasilCari(liveOrder);
      setNotFound(false);
    } else {
      const localFound = pesananList?.find(p => p.id.toLowerCase() === invoiceInput.trim().toLowerCase());
      if (localFound) {
        setHasilCari(localFound);
        setNotFound(false);
      } else {
        setHasilCari(null);
        setNotFound(true);
      }
    }
    setIsSearching(false);
  };

  const p = hasilCari;
  const paket = p ? getPaketById(p.paketId) : null;
  const nasiBox = p ? getNasiBoxById(p.nasiBoxId) : null;
  const totalHarga = p?.totalHarga || 0;
  const dp50 = Math.ceil(totalHarga * 0.5);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {showSertifikat && <SertifikatModal pesanan={p} onClose={() => setShowSertifikat(false)} />}
      {showVideoModal && (
        <VideoSyariatModal
          videoUrl={p?.syariat?.videoUrl}
          namaAnak={`${p?.namaAnak} ${p?.binBinti} ${p?.namaOrtu}`}
          onClose={() => setShowVideoModal(false)}
        />
      )}
      {showFotoModal && p?.syariat?.fotoPenyembelihan && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowFotoModal(false)}>
          <div className="bg-white rounded-3xl p-4 max-w-2xl w-full shadow-2xl overflow-hidden my-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-sm">Dokumentasi Foto Penyembelihan Syariat</h3>
              <button onClick={() => setShowFotoModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="mt-3 rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              <img src={p.syariat.fotoPenyembelihan} alt="Foto Penyembelihan Lengkap" className="max-h-[70vh] w-auto object-contain" />
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Papan Nama: <strong>{p.namaAnak} {p.binBinti} {p.namaOrtu}</strong>
            </p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-emerald-800">Lacak Pesanan dan Dokumentasi Syariat</h2>
          <p className="text-gray-500 text-sm mt-1">Masukkan nomor invoice untuk melihat status pesanan Anda</p>
        </div>

        <form onSubmit={handleCari} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Invoice</label>
          <div className="flex gap-3">
            <input
              value={invoiceInput}
              onChange={e => setInvoiceInput(e.target.value)}
              placeholder="Contoh: INV-20261104-001"
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none font-mono"
            />
            <button type="submit"
              disabled={isSearching}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-60">
              {isSearching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />} Lacak
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3 items-center">
            <p className="text-xs text-gray-400">Contoh invoice aktif:</p>
            {pesananList.map(p => (
              <button type="button" key={p.id} onClick={() => setInvoiceInput(p.id)}
                className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full hover:bg-emerald-100 font-mono transition-colors">
                {p.id}
              </button>
            ))}
          </div>
        </form>

        {notFound && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
            <h3 className="font-bold text-red-700 mb-1">Invoice Tidak Ditemukan</h3>
            <p className="text-sm text-red-500">Pastikan nomor invoice benar. Hubungi WA kami jika ada pertanyaan.</p>
          </div>
        )}

        {p && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <div>
                  <span className="text-xs text-gray-400 font-mono">{p.id}</span>
                  <h3 className="text-xl font-bold text-emerald-800 mt-0.5">
                    {p.namaAnak} {p.binBinti} {p.namaOrtu}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Lahir: {p.tglLahir} &nbsp;&middot;&nbsp; {p.jenisKelamin === 'laki' ? 'Laki-laki' : 'Perempuan'} &nbsp;&middot;&nbsp; {p.jumlahEkor} Ekor
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${
                    STATUS_ICONS[p.statusOperasional]?.bg
                  } ${STATUS_ICONS[p.statusOperasional]?.color}`}>
                    {p.statusOperasional}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">{p.statusPembayaran}</p>
                </div>
              </div>
              <StatusStepper statusSaat={p.statusOperasional} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h4 className="font-bold text-emerald-800 mb-4">Detail Pesanan</h4>
                <dl className="space-y-2 text-sm">
                  {[
                    ['Paket', `Tipe ${p.paketId} (${paket?.porsiDaging} Porsi Daging dan ${paket?.porsiJeroan} Porsi Jeroan)`],
                    ['Olahan Daging', getMenuDagingById(p.menuDaging)?.nama || 'Standar Dapur'],
                    ['Olahan Jeroan', getMenuJeroanById(p.menuJeroan)?.nama || 'Standar Dapur'],
                    ['Nasi Box', p.nasiBoxId !== 'none' ? `${nasiBox?.nama} \u00d7 ${p.jumlahBox} box` : 'Tanpa Nasi Box'],
                    ['Jadwal Produksi', `${p.tglProduksi} \u00b7 ${p.sesi === 'pagi' ? 'Pagi (08.00 sampai 11.00 WIB)' : 'Sore (13.00 sampai 16.00 WIB)'}`],
                    ['Pembayaran', p.statusPembayaran],
                    ['Total', formatRupiah(totalHarga)],
                    ...(p.pembayaran === 'dp' ? [['DP Dibayar', formatRupiah(dp50)], ['Sisa Lunas', formatRupiah(totalHarga - dp50)]] : []),
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-2">
                      <dt className="text-gray-500 shrink-0">{label}</dt>
                      <dd className="font-semibold text-gray-800 text-right">{value}</dd>
                    </div>
                  ))}
                  {p.catatan && (
                    <div className="pt-2 border-t border-dashed border-gray-100">
                      <dt className="text-gray-500 mb-1">Catatan Dapur</dt>
                      <dd className="text-gray-700 text-xs bg-gray-50 rounded-lg p-2">{p.catatan}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h4 className="font-bold text-emerald-800 mb-4">Transparansi Dokumentasi Syariat</h4>
                {p.syariat ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5"><Camera size={15} className="text-emerald-500" /> Bukti Foto Penyembelihan</span>
                        <span className="text-[11px] text-emerald-600 font-normal">Klik untuk perbesar</span>
                      </p>
                      <div
                        onClick={() => setShowFotoModal(true)}
                        className="relative rounded-xl overflow-hidden border border-gray-200 cursor-pointer group"
                      >
                        <img
                          src={p.syariat.fotoPenyembelihan}
                          alt="Foto Penyembelihan"
                          className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 font-semibold">
                            <Maximize2 size={13} /> Lihat Foto Asli
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                          <p className="text-white text-xs font-semibold">Papan Nama: {p.namaAnak} {p.binBinti} {p.namaOrtu}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                        <Play size={15} className="text-emerald-500" /> Video Pembacaan Doa dan Penyembelihan
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowVideoModal(true)}
                        className="w-full text-left flex items-center gap-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl p-3.5 transition-all shadow-sm hover:shadow"
                      >
                        <div className="w-11 h-11 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow">
                          <Play size={20} className="ml-0.5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            Putar Video Penyembelihan
                            <span className="text-[10px] bg-red-600 text-white font-semibold px-2 py-0.5 rounded-full">
                              Putar di Halaman
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">Doa Bismillah Allahu Akbar oleh Juru Sembelih Halal</p>
                        </div>
                      </button>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                      <p className="text-xs font-semibold text-emerald-800 mb-1">Keterangan Syariat</p>
                      <p className="text-xs text-emerald-700">{p.syariat.catatanSyariat}</p>
                    </div>

                    <button
                      onClick={() => setShowSertifikat(true)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01]"
                    >
                      <Award size={18} /> Unduh E-Sertifikat Aqiqah (PDF)
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <Info size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-semibold mb-1">Dokumentasi Belum Tersedia</p>
                    <p className="text-xs text-gray-400">
                      Dokumentasi syariat akan diunggah setelah proses penyembelihan selesai.
                      Status saat ini: <strong className="text-amber-600">{p.statusOperasional}</strong>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!p && !notFound && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-emerald-500" />
            </div>
            <h3 className="font-bold text-emerald-800 mb-2">Lacak Status Pesanan Anda</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              Masukkan nomor invoice yang diterima saat konfirmasi pesanan. Anda dapat memantau
              setiap tahap mulai dari jadwal hingga dokumentasi syariat.
            </p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-6">
              {STATUS_OPERASIONAL_LIST.map((s) => {
                const info = STATUS_ICONS[s];
                const Icon = info?.icon || CheckCircle;
                return (
                  <div key={s} className="flex flex-col items-center gap-1">
                    <div className={`w-10 h-10 rounded-full ${info?.bg} flex items-center justify-center`}>
                      <Icon size={18} className={info?.color} />
                    </div>
                    <p className="text-[10px] text-gray-500 text-center leading-tight">{s}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
