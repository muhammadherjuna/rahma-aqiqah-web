// src/pages/KalkulatorPesan.jsx
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShoppingCart, Calendar, AlertCircle, CheckCircle, Info,
  Upload, User, Calculator, Package,
  UtensilsCrossed, Box, Clock, Sun, Sunset, Loader2, MessageSquare, ExternalLink,
  Sparkles, Copy, Check, CreditCard, ArrowRight, ArrowLeft, ChevronRight
} from 'lucide-react';
import {
  PAKET_LIST, MENU_DAGING, MENU_JEROAN, PAKET_NASI_BOX,
  KUOTA_JADWAL_INIT, formatRupiah, formatTanggalIndonesia, getPaketById, getNasiBoxById
} from '../data/mockData';
import { getDailyQuotas, createOrder, uploadFileToStorage } from '../lib/supabaseClient';
import { compressImageToWebP } from '../utils/imageCompressor';

export const REKENING_LIST = [
  {
    id: 'bri',
    namaBank: 'Bank BRI',
    noRek: '0068-01-012345-53-8',
    noRekClean: '006801012345538',
    atasNama: 'Abdul Ghofar',
    badge: 'BRI',
  },
  {
    id: 'bsi',
    namaBank: 'Bank Syariah Indonesia (BSI)',
    noRek: '715-787-3387',
    noRekClean: '7157873387',
    atasNama: 'Rahma Aqiqah / Abdul Ghofar',
    badge: 'BSI Syariah',
  },
];

function KuotaBadge({ kuota }) {
  if (!kuota || kuota.terpakai === 0)
    return <span className="text-[9px] text-gray-400 font-medium">Kosong</span>;
  if (kuota.status === 'penuh' || kuota.terpakai >= kuota.maks)
    return <span className="text-[9px] font-bold text-red-600">Penuh</span>;
  return <span className="text-[9px] font-bold text-emerald-600">{kuota.terpakai}/{kuota.maks}</span>;
}

export default function KalkulatorPesan({ onPesanBerhasil }) {
  const [searchParams] = useSearchParams();

  // Multi-step Wizard state (1: Paket & Olahan, 2: Nasi Box, 3: Jadwal & Sesi, 4: Data Syariat & Bayar)
  const [currentStep, setCurrentStep] = useState(1);
  const [stepError, setStepError] = useState('');

  // Form states
  const [quotas, setQuotas] = useState(KUOTA_JADWAL_INIT);
  const [paketId, setPaketId] = useState('C');
  const [menuDaging, setMenuDaging] = useState('kicik');
  const [menuJeroan, setMenuJeroan] = useState('gule');
  const [nasiBoxId, setNasiBoxId] = useState('none');
  const [jumlahBox, setJumlahBox] = useState(0);
  const [tglProduksi, setTglProduksi] = useState('');
  const [sesi, setSesi] = useState('pagi');
  const [namaAnak, setNamaAnak] = useState('');
  const [namaOrtu, setNamaOrtu] = useState('');
  const [binBinti, setBinBinti] = useState('bin');
  const [tglLahir, setTglLahir] = useState('2026-10-15');
  const [noWa, setNoWa] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('laki');
  const [jumlahEkor, setJumlahEkor] = useState(2);
  const [catatan, setCatatan] = useState('');
  const [pembayaran, setPembayaran] = useState('dp');
  const [buktiFile, setBuktiFile] = useState(null);
  const [buktiPreview, setBuktiPreview] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedInvoice, setSubmittedInvoice] = useState('');
  const [submittedWaUrl, setSubmittedWaUrl] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Sinkronisasi paket dari URL query param (cth: /kalkulator?paket=B) dan pastikan scroll di paling atas
  useEffect(() => {
    const urlPaket = searchParams.get('paket');
    if (urlPaket && ['A', 'B', 'C', 'D', 'E'].includes(urlPaket.toUpperCase())) {
      setPaketId(urlPaket.toUpperCase());
    }
    window.scrollTo(0, 0);
  }, [searchParams]);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Mengambil kuota kalender harian secara real-time dari Supabase
  const loadQuotas = async () => {
    const data = await getDailyQuotas();
    setQuotas(data);
  };

  useEffect(() => {
    loadQuotas();
  }, []);

  const calendarDays = useMemo(() => {
    const days = [];
    for (let d = 1; d <= 30; d++) {
      const dateStr = `2026-11-${String(d).padStart(2, '0')}`;
      const kuota = quotas.find(k => k.tanggal === dateStr);
      days.push({ dateStr, day: d, kuota: kuota || null });
    }
    return days;
  }, [quotas]);

  const paket = getPaketById(paketId);
  const nasiBox = getNasiBoxById(nasiBoxId);

  const handlePaketChange = (id) => {
    setPaketId(id);
    const p = getPaketById(id);
    if (nasiBoxId !== 'none') {
      setJumlahBox(p.porsiDaging * jumlahEkor);
    }
  };

  const handleNasiBoxChange = (id) => {
    setNasiBoxId(id);
    if (id !== 'none') {
      setJumlahBox(paket.porsiDaging * jumlahEkor);
    } else {
      setJumlahBox(0);
    }
  };

  const kuotaTglDipilih = useMemo(() => {
    if (!tglProduksi) return null;
    return quotas.find(k => k.tanggal === tglProduksi) || null;
  }, [tglProduksi, quotas]);

  const tglPenuh = kuotaTglDipilih?.status === 'penuh';

  const totalHarga = useMemo(() => {
    return (paket?.harga || 0) * jumlahEkor + (nasiBox?.harga || 0) * jumlahBox;
  }, [paket, jumlahEkor, nasiBox, jumlahBox]);

  const dp50 = Math.ceil(totalHarga * 0.5);

  const handleJenisKelaminChange = (jk) => {
    setJenisKelamin(jk);
    setBinBinti(jk === 'laki' ? 'bin' : 'binti');
    setJumlahEkor(jk === 'laki' ? 2 : 1);
    if (nasiBoxId !== 'none') {
      setJumlahBox(paket.porsiDaging * (jk === 'laki' ? 2 : 1));
    }
  };

  const handleJumlahEkorChange = (newCount) => {
    const validCount = Math.max(1, newCount);
    setJumlahEkor(validCount);
    if (nasiBoxId !== 'none') {
      setJumlahBox(paket.porsiDaging * validCount);
    }
  };

  // Navigasi langkah wizard dengan validasi per tahap
  const validateStep = (step) => {
    setStepError('');
    if (step === 1) {
      if (!paketId) {
        setStepError('Silakan pilih salah satu tipe paket aqiqah.');
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (nasiBoxId !== 'none' && jumlahBox <= 0) {
        setStepError('Jumlah porsi nasi box minimal 1 box.');
        return false;
      }
      return true;
    }
    if (step === 3) {
      if (!tglProduksi) {
        setStepError('Silakan tentukan tanggal produksi pada kalender.');
        return false;
      }
      if (tglPenuh) {
        setStepError(`Tanggal ${formatTanggalIndonesia(tglProduksi)} sudah penuh (5 dari 5 ekor). Silakan pilih tanggal lain.`);
        return false;
      }
      return true;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setStepError('');
      setCurrentStep(prev => Math.min(4, prev + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStepError('');
    setCurrentStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToStep = (stepTarget) => {
    if (stepTarget < currentStep) {
      setStepError('');
      setCurrentStep(stepTarget);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (stepTarget > currentStep) {
      // Validasi semua tahap sebelum target
      for (let s = currentStep; s < stepTarget; s++) {
        if (!validateStep(s)) return;
      }
      setStepError('');
      setCurrentStep(stepTarget);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSubmitError('');

    if (!namaAnak.trim()) {
      setSubmitError('Nama lengkap anak wajib diisi.');
      return;
    }
    if (!namaOrtu.trim()) {
      setSubmitError('Nama orang tua wajib diisi.');
      return;
    }
    if (!noWa.trim()) {
      setSubmitError('Nomor WhatsApp aktif wajib diisi.');
      return;
    }
    if (!tglProduksi) {
      setSubmitError('Tanggal produksi belum dipilih. Silakan kembali ke Langkah 3.');
      return;
    }
    if (tglPenuh) {
      setSubmitError(`Tanggal ${formatTanggalIndonesia(tglProduksi)} sudah penuh. Silakan kembali ke Langkah 3 untuk memilih tanggal lain.`);
      return;
    }

    setIsSubmitting(true);
    const tgl = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '');
    const inv = `INV-${tgl}-${String(Math.floor(Math.random() * 900) + 100)}`;

    let uploadedBuktiUrl = null;
    if (buktiFile) {
      const uploadRes = await uploadFileToStorage(buktiFile, 'bukti-transfer');
      if (uploadRes.success) {
        uploadedBuktiUrl = uploadRes.publicUrl;
      }
    }

    const orderPayload = {
      id: inv,
      namaAnak,
      namaOrtu,
      binBinti,
      tglLahir: tglLahir || '2026-10-15',
      jenisKelamin,
      jumlahEkor,
      paketId,
      menuDaging,
      menuJeroan,
      nasiBoxId,
      jumlahBox,
      tglProduksi,
      sesi,
      catatan,
      pembayaran,
      statusPembayaran: pembayaran === 'dp' ? 'DP 50% Lunas' : 'Lunas 100%',
      statusOperasional: 'Menunggu Verifikasi',
      totalHarga,
      buktiTransfer: uploadedBuktiUrl,
      noWa: noWa.trim(),
      syariat: null,
    };

    // Eksekusi pemesanan ke Supabase via RPC book_aqiqah_order (Row-Level Locking)
    const result = await createOrder(orderPayload);

    if (result.success) {
      setSubmittedInvoice(inv);
      setSubmitted(true);
      try {
        localStorage.setItem('rahma_last_invoice', inv);
      } catch (err) {
        console.warn('Gagal menyimpan invoice ke localStorage:', err);
      }
      await loadQuotas();
      if (onPesanBerhasil) {
        onPesanBerhasil(orderPayload);
      }

      // Opsi A (Semi-otomatis via WhatsApp): Susun pesan terformat lengkap
      const tagihanBayar = pembayaran === 'dp' ? dp50 : totalHarga;
      const waText = encodeURIComponent(
        `Assalamualaikum Warahmatullahi Wabarakatuh,\n` +
        `Yth. Bapak Abdul Ghofar (Rahma Aqiqah Kebumen),\n\n` +
        `Saya telah mengirimkan formulir pemesanan aqiqah melalui website resmi dengan rincian sebagai berikut:\n\n` +
        `*DATA SHAHIBUL AQIQAH*\n` +
        `- Nomor Invoice: *${inv}*\n` +
        `- Nama Anak: *${namaAnak} ${binBinti} ${namaOrtu}*\n` +
        `- Jenis Kelamin: ${jenisKelamin === 'laki' ? 'Laki-laki (Dianjurkan 2 Ekor)' : 'Perempuan (1 Ekor)'}\n` +
        `- Tanggal Lahir: ${tglLahir}\n` +
        `- WhatsApp Pemesan: ${noWa}\n\n` +
        `*RINCIAN PAKET & MENU OLAHAN*\n` +
        `- Paket Aqiqah: Tipe ${paket?.id} - ${paket?.nama} (${jumlahEkor} Ekor Kambing)\n` +
        `- Olahan Daging: ${menuDaging.toUpperCase()}\n` +
        `- Olahan Jeroan & Tulang: ${menuJeroan.toUpperCase()}\n` +
        `- Paket Nasi Box: ${nasiBox ? `${nasiBox.nama} (${jumlahBox} Box)` : 'Tanpa Nasi Box (Masak Saja)'}\n` +
        `- Tanggal Produksi: *${formatTanggalIndonesia(tglProduksi)}*\n` +
        `- Sesi Pengiriman: *${sesi === 'pagi' ? 'Pagi (08.00 - 11.00 WIB)' : 'Sore (13.00 - 16.00 WIB)'}*\n` +
        (catatan ? `- Catatan Dapur: ${catatan}\n` : '') + `\n` +
        `*RINCIAN TAGIHAN & PEMBAYARAN*\n` +
        `- Total Nilai Pesanan: *${formatRupiah(totalHarga)}*\n` +
        `- Skema Pembayaran: *${pembayaran === 'dp' ? `DP 50% (${formatRupiah(dp50)})` : `Lunas 100% (${formatRupiah(totalHarga)})`}*\n` +
        `- Nominal Yang Ditransfer: *${formatRupiah(tagihanBayar)}*\n` +
        `- Rekening Tujuan: BRI (0068-01-012345-53-8) / BSI (715-787-3387) a.n. Abdul Ghofar\n` +
        (uploadedBuktiUrl ? `- Tautan Bukti Transfer (Cloud): ${uploadedBuktiUrl}\n` : '- Bukti Transfer: Akan saya lampirkan di pesan ini\n') +
        `\nMohon konfirmasi dan verifikasi ketersediaan jadwal kami. Jazakumullah khairan katsiran.`
      );
      const generatedWaUrl = `https://wa.me/6281578733874?text=${waText}`;
      setSubmittedWaUrl(generatedWaUrl);

      // Otomatis membuka aplikasi WhatsApp / Web di tab baru
      try {
        window.open(generatedWaUrl, '_blank');
      } catch (err) {
        console.warn('Otomatisasi popup WhatsApp terhalang browser:', err);
      }
    } else {
      setSubmitError(result.error || 'Gagal menyimpan pesanan ke database.');
      await loadQuotas();
    }
    setIsSubmitting(false);
  };

  // Tampilan Berhasil Dikirim
  if (submitted) {
    const nominalBayar = pembayaran === 'dp' ? dp50 : totalHarga;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-emerald-50/70">
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 max-w-xl w-full text-center border border-emerald-100">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <CheckCircle size={44} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-900 mb-1">Pesanan Berhasil Dicatat</h2>
          <p className="text-gray-600 text-sm mb-4">
            Terima kasih, data aqiqah ananda <strong>{namaAnak} {binBinti} {namaOrtu}</strong> telah tersimpan di sistem Rahma Aqiqah.
          </p>

          {/* Kotak Invoice dengan Tombol Salin */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 mb-5 flex items-center justify-between">
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-wider text-emerald-800 font-bold">Nomor Invoice Anda</p>
              <p className="text-xl font-mono font-extrabold text-emerald-800">{submittedInvoice}</p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(submittedInvoice, 'inv')}
              className="inline-flex items-center gap-1.5 text-xs bg-white text-emerald-700 hover:bg-emerald-100 border border-emerald-300 font-semibold px-3 py-2 rounded-xl transition-all shadow-sm"
            >
              {copiedKey === 'inv' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              {copiedKey === 'inv' ? 'Tersalin' : 'Salin Invoice'}
            </button>
          </div>

          {/* Kotak Instruksi Transfer Bank Resmi */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-5 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
              <div>
                <p className="text-xs text-gray-500 font-medium">Nominal Yang Harus Ditransfer:</p>
                <p className="text-xl font-extrabold text-emerald-700">
                  {formatRupiah(nominalBayar)}
                  {pembayaran === 'dp' && <span className="text-xs font-normal text-amber-700 ml-1.5">(DP 50%)</span>}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(String(nominalBayar), 'nominal')}
                className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-100/80 hover:bg-emerald-200 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                {copiedKey === 'nominal' ? <Check size={13} /> : <Copy size={13} />}
                {copiedKey === 'nominal' ? 'Tersalin' : 'Salin Nominal'}
              </button>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                <CreditCard size={14} className="text-emerald-600" /> Rekening Resmi Rahma Aqiqah:
              </p>
              <div className="space-y-2">
                {REKENING_LIST.map((rek) => (
                  <div
                    key={rek.id}
                    className="p-2.5 bg-white border border-gray-200 rounded-xl flex items-center justify-between shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-800">{rek.namaBank}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded">
                          {rek.badge}
                        </span>
                      </div>
                      <p className="font-mono text-sm font-bold text-emerald-800 mt-0.5">{rek.noRek}</p>
                      <p className="text-[10px] text-gray-500">a.n. {rek.atasNama}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(rek.noRekClean, rek.id)}
                      className="inline-flex items-center gap-1 text-xs bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 border border-gray-200 px-2.5 py-1.5 rounded-lg font-medium transition-colors"
                    >
                      {copiedKey === rek.id ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                      {copiedKey === rek.id ? 'Tersalin' : 'Salin Rek'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tombol Utama Otomasi WhatsApp */}
          <div className="space-y-3">
            <a
              href={submittedWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl text-base group"
            >
              <MessageSquare size={20} className="group-hover:scale-110 transition-transform" />
              Buka WhatsApp Bp. Abdul Ghofar Sekarang
            </a>
            <p className="text-[11px] text-gray-400">
              Pesan terformat otomatis telah disusun. Klik tombol di atas jika jendela WhatsApp belum terbuka otomatis.
            </p>

            <div className="flex gap-2 pt-2">
              <a
                href={`/lacak?inv=${submittedInvoice}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-colors"
              >
                <ExternalLink size={15} />
                Lacak Status Pesanan
              </a>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setCurrentStep(1);
                }}
                className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-colors"
              >
                Pesan Baru
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Definisi metadata langkah wizard
  const STEPS = [
    { num: 1, title: 'Paket & Olahan', desc: 'Pilihan kambing & menu masak', icon: UtensilsCrossed },
    { num: 2, title: 'Paket Nasi Box', desc: 'Kemasan box siap saji', icon: Box },
    { num: 3, title: 'Jadwal & Sesi', desc: 'Cek kuota kalender harian', icon: Calendar },
    { num: 4, title: 'Syariat & Bayar', desc: 'Data anak & konfirmasi WA', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50/60 pb-28 lg:pb-12 pt-6 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header Halaman */}
        <div className="mb-6 text-center sm:text-left">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-1.5">
            Formulir Pemesanan Bertahap
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-900 tracking-tight">
            Kalkulator dan Pemesanan Aqiqah
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Langkah mudah memesan aqiqah siap saji sesuai syariat Islam di Rahma Aqiqah Kebumen
          </p>
        </div>

        {/* Stepper Wizard Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-3 sm:p-4 mb-6">
          <div className="grid grid-cols-4 gap-1 sm:gap-4">
            {STEPS.map((s) => {
              const StepIcon = s.icon;
              const isActive = currentStep === s.num;
              const isPast = currentStep > s.num;

              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => goToStep(s.num)}
                  className={`text-left p-2 sm:p-3 rounded-xl transition-all flex items-center gap-2 sm:gap-3 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md'
                      : isPast
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 cursor-pointer'
                      : 'bg-gray-50 text-gray-400 hover:bg-gray-100 cursor-pointer'
                  }`}
                >
                  <div
                    className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0 ${
                      isActive
                        ? 'bg-white text-emerald-700'
                        : isPast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isPast ? <Check size={16} strokeWidth={3} /> : s.num}
                  </div>
                  <div className="hidden md:block min-w-0">
                    <p className={`text-xs font-bold truncate leading-tight ${isActive ? 'text-white' : isPast ? 'text-emerald-900' : 'text-gray-600'}`}>
                      {s.title}
                    </p>
                    <p className={`text-[10px] truncate ${isActive ? 'text-emerald-100' : 'text-gray-400'}`}>
                      {s.desc}
                    </p>
                  </div>
                  {/* Teks Ringkas Mobile */}
                  <div className="block md:hidden min-w-0">
                    <p className={`text-[11px] font-bold truncate leading-tight ${isActive ? 'text-white' : isPast ? 'text-emerald-900' : 'text-gray-600'}`}>
                      {s.title.split(' ')[0]}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pesan Validasi Langkah */}
        {stepError && (
          <div className="mb-4 bg-amber-50 border border-amber-300 text-amber-900 p-3.5 rounded-xl text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
            <span className="font-medium">{stepError}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 items-start">

          {/* Area Konten Utama Form Langkah (2 Kolom) */}
          <div className="lg:col-span-2 space-y-6">

            {/* ======================================================== */}
            {/* LANGKAH 1: PAKET & OLAHAN MASAKAN */}
            {/* ======================================================== */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-7 space-y-6 animate-fadeIn">
                <div className="border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-lg">
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">1</span>
                    <h3>Pilih Paket Kambing & Kustomisasi Masakan</h3>
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1 ml-10">
                    Semua paket sudah termasuk harga kambing jantan/betina sehat, penyembelihan syariat, dan bumbu dapur lengkap.
                  </p>
                </div>

                {/* Pilihan Paket A - E */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                    Pilih Tipe Paket Kambing Aqiqah
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
                    {PAKET_LIST.map((p) => (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => handlePaketChange(p.id)}
                        className={`relative rounded-xl border-2 p-3 text-center transition-all ${
                          paketId === p.id
                            ? 'border-emerald-600 bg-emerald-50/80 shadow-md ring-2 ring-emerald-500/20'
                            : 'border-gray-200 hover:border-emerald-300 bg-white'
                        }`}
                      >
                        {p.popular && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-emerald-950 text-[9px] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap shadow-xs">
                            Favorit
                          </span>
                        )}
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-1.5 mt-0.5">
                          <Package size={16} className="text-emerald-700" />
                        </div>
                        <div className="font-extrabold text-emerald-900 text-sm">{p.nama}</div>
                        <div className="text-emerald-700 text-xs font-bold mt-0.5">{formatRupiah(p.harga)}</div>
                        <div className="text-gray-500 text-[10px] mt-1 bg-gray-100 rounded py-0.5 font-medium">
                          {p.porsiDaging} Porsi
                        </div>
                      </button>
                    ))}
                  </div>

                  {paket && (
                    <div className="mt-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-center gap-2">
                      <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
                      <span>
                        <strong>Paket {paket.nama}</strong>: Menghasilkan <strong>{paket.porsiDaging} porsi daging</strong> dan <strong>{paket.porsiJeroan} porsi jeroan</strong> ({paket.deskripsi}).
                      </span>
                    </div>
                  )}
                </div>

                {/* Jumlah Ekor Kambing */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="text-sm font-bold text-gray-800 block">Jumlah Ekor Kambing</label>
                    <p className="text-xs text-gray-500">
                      Disunnahkan 2 ekor untuk anak laki-laki, 1 ekor untuk anak perempuan
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleJumlahEkorChange(jumlahEkor - 1)}
                      className="w-9 h-9 rounded-xl bg-white border border-gray-300 hover:bg-gray-100 font-bold text-gray-700 flex items-center justify-center shadow-xs"
                    >
                      <span className="text-lg leading-none">−</span>
                    </button>
                    <span className="text-xl font-mono font-extrabold text-emerald-800 w-8 text-center">
                      {jumlahEkor}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleJumlahEkorChange(jumlahEkor + 1)}
                      className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-white flex items-center justify-center shadow-xs"
                    >
                      <span className="text-lg leading-none">+</span>
                    </button>
                    <span className="text-xs font-semibold text-gray-600">Ekor</span>
                  </div>
                </div>

                {/* Kustomisasi Menu Masakan */}
                <div className="grid sm:grid-cols-2 gap-5 pt-2">
                  {/* Olahan Daging */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                      <UtensilsCrossed size={14} className="text-emerald-600" />
                      Olahan Daging Utama
                    </label>
                    <div className="space-y-2">
                      {MENU_DAGING.map((m) => (
                        <label
                          key={m.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            menuDaging === m.id
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold shadow-xs'
                              : 'border-gray-200 hover:border-emerald-200 text-gray-700 bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="menuDaging"
                            value={m.id}
                            checked={menuDaging === m.id}
                            onChange={() => setMenuDaging(m.id)}
                            className="accent-emerald-600 w-4 h-4"
                          />
                          <span className="text-xs sm:text-sm">{m.nama}</span>
                          {m.badge && (
                            <span className="ml-auto bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap">
                              Menu Khas Favorit
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Olahan Jeroan & Tulang */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                      <UtensilsCrossed size={14} className="text-emerald-600" />
                      Olahan Jeroan & Tulang
                    </label>
                    <div className="space-y-2">
                      {MENU_JEROAN.map((m) => (
                        <label
                          key={m.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            menuJeroan === m.id
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold shadow-xs'
                              : 'border-gray-200 hover:border-emerald-200 text-gray-700 bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="menuJeroan"
                            value={m.id}
                            checked={menuJeroan === m.id}
                            onChange={() => setMenuJeroan(m.id)}
                            className="accent-emerald-600 w-4 h-4"
                          />
                          <span className="text-xs sm:text-sm">{m.nama}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tombol Lanjut ke Langkah 2 */}
                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg text-sm group"
                  >
                    <span>Lanjut ke Pilihan Nasi Box</span>
                    <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* LANGKAH 2: PAKET NASI BOX (PASTI TERLIHAT & JELAS) */}
            {/* ======================================================== */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-7 space-y-6 animate-fadeIn">
                <div className="border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-lg">
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">2</span>
                    <h3>Pilihan Kemasan & Paket Nasi Box</h3>
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1 ml-10">
                    Tentukan apakah hidangan aqiqah ingin sekalian dikemas dalam kotak Nasi Box siap saji untuk memudahkan pembagian.
                  </p>
                </div>

                {/* Pertanyaan Banner Interaktif */}
                <div className="grid sm:grid-cols-2 gap-3.5">
                  <button
                    type="button"
                    onClick={() => handleNasiBoxChange('none')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      nasiBoxId === 'none'
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-gray-200 hover:border-emerald-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 font-bold">
                        <UtensilsCrossed size={18} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-800">Masak Saja (Tanpa Nasi Box)</h4>
                        <p className="text-xs text-emerald-700 font-bold">Tanpa Biaya Tambahan</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Olahan daging dan kuah jeroan dikemas dalam wadah higienis tertutup besar. Cocok untuk prasmanan keluarga di rumah.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (nasiBoxId === 'none') {
                        handleNasiBoxChange('spesial_telur'); // Default ke Spesial Telur
                      }
                    }}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      nasiBoxId !== 'none'
                        ? 'border-amber-500 bg-amber-50/80 shadow-md ring-2 ring-amber-400/20'
                        : 'border-gray-200 hover:border-amber-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 font-bold">
                        <Box size={18} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-900">Kemas Nasi Box Lengkap</h4>
                        <p className="text-xs text-amber-700 font-bold">Paling Praktis & Higienis</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Daging aqiqah langsung dikemas per box lengkap dengan nasi, lauk pendamping, kerupuk, buah pisang, dan sendok.
                    </p>
                  </button>
                </div>

                {/* Jika Memilih Nasi Box: Tampilkan Pilihan Menu Box */}
                {nasiBoxId !== 'none' && (
                  <div className="space-y-4 pt-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Pilih Varian Paket Nasi Box:
                    </label>

                    <div className="grid sm:grid-cols-3 gap-3">
                      {PAKET_NASI_BOX.filter(n => n.id !== 'none').map((n) => (
                        <button
                          type="button"
                          key={n.id}
                          onClick={() => handleNasiBoxChange(n.id)}
                          className={`text-left rounded-xl border-2 p-3.5 transition-all flex flex-col justify-between ${
                            nasiBoxId === n.id
                              ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-400/20'
                              : 'border-gray-200 hover:border-amber-200 bg-white'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-extrabold text-xs sm:text-sm text-gray-900">{n.nama}</span>
                            </div>
                            <p className="text-emerald-700 font-extrabold text-sm mb-2">
                              {formatRupiah(n.harga)} <span className="text-[11px] font-normal text-gray-500">/ box</span>
                            </p>
                            <ul className="text-[11px] text-gray-600 space-y-1">
                              {n.isi.map((item, idx) => (
                                <li key={idx} className="flex items-center gap-1.5">
                                  <Check size={11} className="text-emerald-600 flex-shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-[10px] text-gray-400">Porsi Standar Box</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${nasiBoxId === n.id ? 'bg-amber-400 text-amber-950' : 'bg-gray-100 text-gray-600'}`}>
                              {nasiBoxId === n.id ? 'Dipilih' : 'Pilih Ini'}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Pengaturan Jumlah Box */}
                    <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <label className="text-xs font-bold text-amber-950 block">Jumlah Pemesanan Box</label>
                        <p className="text-xs text-amber-800">
                          Otomatis disesuaikan dengan hasil olahan paket ({paket?.porsiDaging * jumlahEkor} porsi), atau sesuaikan kebutuhan Anda.
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setJumlahBox(Math.max(1, jumlahBox - 5))}
                          className="w-9 h-9 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 font-bold text-amber-900 flex items-center justify-center shadow-xs"
                        >
                          <span className="text-lg leading-none">−</span>
                        </button>
                        <input
                          type="number"
                          value={jumlahBox}
                          onChange={(e) => setJumlahBox(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-20 text-center border-2 border-amber-400 bg-white rounded-xl py-1.5 font-bold text-emerald-800 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          type="button"
                          onClick={() => setJumlahBox(jumlahBox + 5)}
                          className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-600 font-bold text-white flex items-center justify-center shadow-xs"
                        >
                          <span className="text-lg leading-none">+</span>
                        </button>
                        <span className="text-xs font-bold text-amber-950">Box</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tombol Navigasi Langkah */}
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold px-5 py-3 rounded-xl transition-all text-sm"
                  >
                    <ArrowLeft size={16} />
                    <span>Kembali ke Paket & Masakan</span>
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg text-sm group"
                  >
                    <span>Lanjut ke Jadwal & Sesi Pengiriman</span>
                    <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* LANGKAH 3: JADWAL PRODUKSI & SESI PENGIRIMAN */}
            {/* ======================================================== */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-7 space-y-6 animate-fadeIn">
                <div className="border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-lg">
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">3</span>
                    <h3>Pilih Tanggal Produksi & Cek Kuota Dapur</h3>
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1 ml-10">
                    Dapur Rahma Aqiqah membatasi maksimal 5 ekor per hari demi menjaga kelezatan, kesegaran, dan ketepatan syariat.
                  </p>
                </div>

                {/* Kalender Kuota */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Tersedia (Terisi Sebagian)</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> Penuh (Terkunci)</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block"></span> Kosong (Belum Ada Order)</span>
                    </div>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Maks. 5 Ekor / Hari
                    </span>
                  </div>

                  <p className="text-sm font-bold text-gray-700 mb-2">November 2026</p>
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {['Min','Sen','Sel','Rab','Kam','Jum','Sab'].map(h => (
                      <div key={h} className="text-center text-[10px] font-bold text-gray-400 py-1">{h}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map(({ dateStr, day, kuota }) => {
                      const isPenuh = kuota?.status === 'penuh' || (kuota && kuota.terpakai >= kuota.maks);
                      const isTerisi = kuota && kuota.terpakai > 0 && !isPenuh;
                      const isSelected = tglProduksi === dateStr;
                      return (
                        <button
                          type="button"
                          key={dateStr}
                          disabled={isPenuh}
                          onClick={() => !isPenuh && setTglProduksi(dateStr)}
                          className={`rounded-xl p-1.5 text-center transition-all text-xs flex flex-col items-center justify-center min-h-[50px] ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-md scale-105 ring-2 ring-emerald-400'
                              : isPenuh
                              ? 'bg-red-50 border border-red-200 text-red-400 cursor-not-allowed opacity-70'
                              : isTerisi
                              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 cursor-pointer'
                              : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-emerald-50/50 hover:border-emerald-200 cursor-pointer'
                          }`}
                        >
                          <span className="font-extrabold text-sm">{day}</span>
                          <KuotaBadge kuota={kuota} />
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Status Kuota */}
                  {tglProduksi && (
                    (() => {
                      if (tglPenuh) {
                        return (
                          <div className="mt-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-xs sm:text-sm flex items-start gap-2.5">
                            <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-red-500" />
                            <div>
                              <strong>{formatTanggalIndonesia(tglProduksi)}</strong>: Kuota Dapur PENUH ({kuotaTglDipilih?.terpakai || 5} dari {kuotaTglDipilih?.maks || 5} ekor). Sistem mengunci tanggal ini untuk mencegah overbooking.
                            </div>
                          </div>
                        );
                      }
                      if (kuotaTglDipilih && kuotaTglDipilih.terpakai > 0) {
                        return (
                          <div className="mt-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 text-xs sm:text-sm flex items-start gap-2.5">
                            <CheckCircle size={18} className="flex-shrink-0 mt-0.5 text-emerald-600" />
                            <div>
                              <strong>{formatTanggalIndonesia(tglProduksi)}</strong>: Jadwal Tersedia. Sudah ada antrean {kuotaTglDipilih.terpakai} ekor, tersisa {kuotaTglDipilih.maks - kuotaTglDipilih.terpakai} dari {kuotaTglDipilih.maks} ekor.
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div className="mt-3.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-3 text-xs sm:text-sm flex items-center gap-2">
                          <Info size={16} className="text-gray-500 flex-shrink-0" />
                          <span>Hari <strong>{formatTanggalIndonesia(tglProduksi)}</strong> masih kosong (kuota utuh 5 ekor). Kami siap melayani aqiqah Anda.</span>
                        </div>
                      );
                    })()
                  )}
                </div>

                {/* Sesi Pengiriman */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                    Pilih Sesi Waktu Pengiriman
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSesi('pagi')}
                      className={`rounded-xl border-2 p-3.5 text-left transition-all flex items-center gap-3 ${
                        sesi === 'pagi'
                          ? 'border-emerald-600 bg-emerald-50 shadow-xs ring-2 ring-emerald-500/20'
                          : 'border-gray-200 hover:border-emerald-200 bg-white'
                      }`}
                    >
                      <Sun size={22} className="text-amber-500 flex-shrink-0" />
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-gray-900 block">Sesi Pagi</span>
                        <span className="text-xs text-gray-500">08.00 sampai 11.00 WIB (Siap santap siang)</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSesi('sore')}
                      className={`rounded-xl border-2 p-3.5 text-left transition-all flex items-center gap-3 ${
                        sesi === 'sore'
                          ? 'border-emerald-600 bg-emerald-50 shadow-xs ring-2 ring-emerald-500/20'
                          : 'border-gray-200 hover:border-emerald-200 bg-white'
                      }`}
                    >
                      <Sunset size={22} className="text-orange-500 flex-shrink-0" />
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-gray-900 block">Sesi Sore</span>
                        <span className="text-xs text-gray-500">13.00 sampai 16.00 WIB (Siap santap malam)</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Tombol Navigasi Langkah */}
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold px-5 py-3 rounded-xl transition-all text-sm"
                  >
                    <ArrowLeft size={16} />
                    <span>Kembali ke Nasi Box</span>
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg text-sm group"
                  >
                    <span>Lanjut ke Data Syariat & Bayar</span>
                    <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* LANGKAH 4: DATA SYARIAT ANAK & PEMBAYARAN RESMI */}
            {/* ======================================================== */}
            {currentStep === 4 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-7 space-y-6 animate-fadeIn">
                <div className="border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-lg">
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">4</span>
                    <h3>Identitas Syariat Anak & Pembayaran</h3>
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1 ml-10">
                    Data ini dicantumkan pada niat doa penyembelihan ustaz, papan nama dokumentasi syariat, dan e-sertifikat resmi.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Nama Anak */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Nama Lengkap Anak *
                    </label>
                    <input
                      required
                      type="text"
                      value={namaAnak}
                      onChange={e => setNamaAnak(e.target.value)}
                      placeholder="Contoh: Muhammad Herjuna"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* Jenis Kelamin */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Jenis Kelamin Anak *
                    </label>
                    <div className="flex gap-2">
                      {[
                        ['laki', 'Laki-laki (2 Ekor)'],
                        ['perempuan', 'Perempuan (1 Ekor)'],
                      ].map(([val, lab]) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => handleJenisKelaminChange(val)}
                          className={`flex-1 rounded-xl border-2 py-2.5 px-2 text-xs font-semibold whitespace-nowrap transition-all text-center ${
                            jenisKelamin === val
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                              : 'border-gray-200 text-gray-600 hover:border-emerald-200 bg-white'
                          }`}
                        >
                          {lab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nama Orang Tua */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Nama Orang Tua (Bin / Binti) *
                    </label>
                    <div className="flex gap-2">
                      <div className="flex p-1 bg-gray-100 border-2 border-gray-200 rounded-xl flex-shrink-0 items-center">
                        <button
                          type="button"
                          onClick={() => setBinBinti('bin')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            binBinti === 'bin'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-gray-600 hover:text-emerald-800'
                          }`}
                        >
                          bin
                        </button>
                        <button
                          type="button"
                          onClick={() => setBinBinti('binti')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            binBinti === 'binti'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-gray-600 hover:text-emerald-800'
                          }`}
                        >
                          binti
                        </button>
                      </div>
                      <input
                        required
                        type="text"
                        value={namaOrtu}
                        onChange={e => setNamaOrtu(e.target.value)}
                        placeholder="Nama Ayah / Ibu Kandung"
                        className="flex-1 min-w-0 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none bg-white"
                      />
                    </div>
                  </div>

                  {/* Tanggal Lahir */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Tanggal Lahir Anak *
                    </label>
                    <input
                      required
                      type="date"
                      value={tglLahir}
                      onChange={e => setTglLahir(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* WhatsApp Pemesan */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Nomor WhatsApp Aktif Pemesan *
                    </label>
                    <input
                      required
                      type="tel"
                      value={noWa}
                      onChange={e => setNoWa(e.target.value)}
                      placeholder="Contoh: 08123456789"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* Skema Pembayaran */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Skema Pembayaran *
                    </label>
                    <div className="flex gap-2">
                      {[
                        ['dp', 'DP 50% Dulu'],
                        ['lunas', 'Langsung Lunas 100%'],
                      ].map(([val, lab]) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setPembayaran(val)}
                          className={`flex-1 rounded-xl border-2 py-2.5 text-xs font-semibold transition-all ${
                            pembayaran === val
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                              : 'border-gray-200 text-gray-600 hover:border-emerald-200 bg-white'
                          }`}
                        >
                          {lab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rekening Pembayaran Resmi */}
                  <div className="sm:col-span-2 bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                      <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                        <CreditCard size={14} className="text-emerald-700" />
                        Rekening Resmi Pembayaran Rahma Aqiqah
                      </span>
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-200/70 px-2 py-0.5 rounded-full">
                        Nominal Transfer: {formatRupiah(pembayaran === 'dp' ? dp50 : totalHarga)}
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2 text-xs">
                      {REKENING_LIST.map((rek) => (
                        <div key={rek.id} className="bg-white p-2.5 rounded-lg border border-emerald-200 flex items-center justify-between shadow-2xs">
                          <div>
                            <p className="font-bold text-gray-800 text-[11px]">{rek.namaBank}</p>
                            <p className="font-mono font-bold text-emerald-800 text-xs">{rek.noRek}</p>
                            <p className="text-[10px] text-gray-500">a.n. {rek.atasNama}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(rek.noRekClean, `form_${rek.id}`)}
                            className="text-[11px] text-emerald-700 hover:bg-emerald-50 border border-emerald-300 font-semibold px-2 py-1 rounded transition-colors flex items-center gap-1"
                          >
                            {copiedKey === `form_${rek.id}` ? <Check size={12} /> : <Copy size={12} />}
                            {copiedKey === `form_${rek.id}` ? 'Tersalin' : 'Salin'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Catatan Kustom Dapur */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Catatan Tambahan untuk Dapur (Opsional)
                    </label>
                    <textarea
                      value={catatan}
                      onChange={e => setCatatan(e.target.value)}
                      rows={2}
                      placeholder="Contoh: rasa sedikit pedas manis, minta dipisahkan tulang kepala, dll."
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Upload Bukti Transfer */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Unggah Bukti Transfer (Opsional / Bisa kirim via WhatsApp)
                    </label>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-300 rounded-xl p-5 bg-emerald-50/60 hover:bg-emerald-100/60 cursor-pointer transition-colors">
                      {isCompressing ? (
                        <Loader2 size={26} className="text-emerald-600 animate-spin mb-1.5" />
                      ) : (
                        <Upload size={26} className="text-emerald-600 mb-1.5" />
                      )}
                      <span className="text-xs sm:text-sm font-semibold text-gray-700 text-center">
                        {isCompressing
                          ? 'Sedang memproses file...'
                          : buktiFile
                          ? buktiFile.name
                          : 'Klik untuk upload struk transfer atau seret ke sini'}
                      </span>
                      <span className="text-[11px] text-gray-400 mt-0.5">
                        Format gambar JPG, PNG, atau dokumen PDF (maks. 10MB)
                      </span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={async (e) => {
                          const raw = e.target.files?.[0];
                          if (!raw) return;

                          if (raw.type.startsWith('image/')) {
                            setIsCompressing(true);
                            const res = await compressImageToWebP(raw);
                            setBuktiFile(res.file);
                            setBuktiPreview(res.previewUrl);
                            setIsCompressing(false);
                          } else {
                            setBuktiFile(raw);
                            setBuktiPreview(null);
                          }
                        }}
                      />
                    </label>

                    {buktiPreview && (
                      <div className="mt-2.5 flex items-center gap-3 p-2.5 border border-emerald-200 rounded-xl bg-emerald-50/50">
                        <img src={buktiPreview} alt="Bukti Transfer" className="w-12 h-12 object-cover rounded-lg border border-emerald-100" />
                        <div className="text-xs">
                          <p className="font-semibold text-gray-800">{buktiFile?.name}</p>
                          <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                            <CheckCircle size={13} className="text-emerald-600 flex-shrink-0" />
                            Bukti transfer berhasil dipilih
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs sm:text-sm flex items-start gap-2.5">
                    <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Pemesanan Tidak Dapat Diproses</p>
                      <p className="text-xs mt-0.5">{submitError}</p>
                    </div>
                  </div>
                )}

                {/* Tombol Aksi Akhir */}
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold px-5 py-3.5 rounded-xl transition-all text-sm"
                  >
                    <ArrowLeft size={16} />
                    <span>Kembali ke Jadwal</span>
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl text-sm disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Menyimpan ke Sistem...</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare size={18} />
                        <span>Kirim Pesanan & Buka WhatsApp</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Area Ringkasan Samping (Desktop Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-20 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-extrabold text-emerald-900 flex items-center gap-2 text-sm sm:text-base">
                  <Calculator size={18} className="text-emerald-600" />
                  Ringkasan Pesanan
                </h3>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Langkah {currentStep} / 4
                </span>
              </div>

              {/* Rincian Harga */}
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Paket {paketId} &times; {jumlahEkor} Ekor</span>
                  <span className="font-bold text-gray-900">{formatRupiah((paket?.harga || 0) * jumlahEkor)}</span>
                </div>

                {nasiBoxId !== 'none' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nasi Box &times; {jumlahBox} box</span>
                    <span className="font-bold text-gray-900">{formatRupiah((nasiBox?.harga || 0) * jumlahBox)}</span>
                  </div>
                )}

                <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between items-center text-sm font-extrabold">
                  <span className="text-gray-800">Total Harga</span>
                  <span className="text-emerald-700 text-base">{formatRupiah(totalHarga)}</span>
                </div>

                {pembayaran === 'dp' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 mt-2">
                    <div className="flex justify-between text-xs font-bold text-amber-900">
                      <span>DP 50% Yang Ditransfer:</span>
                      <span>{formatRupiah(dp50)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-amber-700 mt-0.5">
                      <span>Sisa Pelunasan Dapur:</span>
                      <span>{formatRupiah(totalHarga - dp50)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Rincian Pilihan Saat Ini */}
              <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 space-y-1.5 border border-gray-100">
                <p className="font-bold text-gray-800 border-b border-gray-200 pb-1">Kustomisasi Terpilih:</p>
                <div className="flex justify-between">
                  <span>Paket:</span>
                  <strong className="text-gray-800">Tipe {paketId} ({paket?.porsiDaging * jumlahEkor} Porsi)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Daging:</span>
                  <strong className="text-gray-800">{MENU_DAGING.find(m => m.id === menuDaging)?.nama}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Jeroan:</span>
                  <strong className="text-gray-800">{MENU_JEROAN.find(m => m.id === menuJeroan)?.nama}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Nasi Box:</span>
                  <strong className="text-gray-800">
                    {nasiBoxId === 'none' ? 'Masak Saja' : `${nasiBox?.nama} (${jumlahBox} box)`}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Jadwal:</span>
                  <strong className="text-gray-800">{tglProduksi ? formatTanggalIndonesia(tglProduksi, false) : 'Belum dipilih'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Sesi:</span>
                  <strong className="text-gray-800">{sesi === 'pagi' ? 'Pagi (08.00-11.00)' : 'Sore (13.00-16.00)'}</strong>
                </div>
                {namaAnak && (
                  <div className="flex justify-between">
                    <span>Nama Anak:</span>
                    <strong className="text-emerald-800 truncate max-w-[130px]">{namaAnak}</strong>
                  </div>
                )}
              </div>

              {/* Rekening Singkat */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-xs space-y-2">
                <p className="font-bold text-emerald-900 flex items-center gap-1">
                  <CreditCard size={13} /> Rekening Bp. Abdul Ghofar
                </p>
                <div className="bg-white p-2 rounded-lg border border-emerald-200 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="font-bold text-gray-800">BRI: 0068-01-012345-53-8</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('006801012345538', 'side_bri')}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    {copiedKey === 'side_bri' ? 'Tersalin' : 'Salin'}
                  </button>
                </div>
                <div className="bg-white p-2 rounded-lg border border-emerald-200 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="font-bold text-gray-800">BSI: 715-787-3387</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('7157873387', 'side_bsi')}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    {copiedKey === 'side_bsi' ? 'Tersalin' : 'Salin'}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Floating Bottom Bar Khusus Mobile (Agar Total & Tombol Aksi Selalu Terlihat) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl p-3 px-4 z-40 lg:hidden flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-gray-500 font-semibold block">
            Langkah {currentStep}/4 &bull; {pembayaran === 'dp' ? 'DP 50%' : 'Total'}
          </span>
          <span className="text-base font-extrabold text-emerald-800 leading-tight">
            {formatRupiah(pembayaran === 'dp' ? dp50 : totalHarga)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="p-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center justify-center"
              title="Langkah Sebelumnya"
            >
              <ArrowLeft size={18} />
            </button>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md"
            >
              <span>Lanjut</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <MessageSquare size={16} />}
              <span>Kirim WA</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
