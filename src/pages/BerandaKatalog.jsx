// src/pages/BerandaKatalog.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle, Star, ChevronRight, ChevronDown, Phone, MapPin, Award, Shield,
  Trophy, BookOpen, Leaf, Truck, Package, UtensilsCrossed, Box, Lock,
  HelpCircle, Clock, ExternalLink, ShieldCheck, HeartHandshake, Check, MessageSquare
} from 'lucide-react';
import { PAKET_LIST, MENU_DAGING, MENU_JEROAN, PAKET_NASI_BOX, formatRupiah } from '../data/mockData';

export default function BerandaKatalog() {
  const navigate = useNavigate();
  const [selectedPaket, setSelectedPaket] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(prev => prev === idx ? null : idx);
  };

  const fiturUnggulan = [
    { Icon: Trophy, judul: 'Jagonya Aqiqah Siap Saji', desc: 'Pengalaman 10+ tahun melayani ribuan keluarga di Kebumen dan sekitarnya.' },
    { Icon: BookOpen, judul: 'Sesuai Syariat Islam', desc: 'Penyembelihan oleh ustaz bersertifikat dengan doa dan dokumentasi lengkap untuk setiap pesanan.' },
    { Icon: Leaf, judul: 'Bahan Segar Pilihan', desc: 'Kambing dipilih sesuai standar aqiqah, sehat, cukup umur, dan tidak cacat.' },
    { Icon: Truck, judul: 'Antar ke Rumah', desc: 'Dua sesi pengiriman: Pagi (08.00-11.00) dan Sore (13.00-16.00) langsung ke alamat Anda.' },
  ];

  const testimonial = [
    { nama: 'Ibu Ratna, Kebumen', bintang: 5, komentar: 'Masakannya enak banget, terutama Kiciknya! Tamu undangan pada nambah. Penyembelihan juga dapat video dan sertifikat. Alhamdulillah.', paket: 'Tipe C' },
    { nama: 'Bapak Heri, Gombong', bintang: 5, komentar: 'Pelayanan cepat dan profesional. Sudah 2x pesan di sini, selalu memuaskan. Harganya terjangkau untuk kualitas sebagus ini.', paket: 'Tipe D' },
    { nama: 'Ibu Sari, Prembun', bintang: 5, komentar: 'Nasi boxnya lengkap dan harga bersaing. Semua tamu bilang enak. Sangat direkomendasikan!', paket: 'Tipe B + Nasi Box Istimewa' },
  ];

  const faqList = [
    {
      q: 'Berapa hari sebelum hari H sebaiknya melakukan pemesanan?',
      a: 'Kami menyarankan pemesanan dilakukan minimal H-3 atau H-7 sebelum hari pelaksanaan. Hal ini penting untuk memastikan ketersediaan slot kuota dapur harian kami (dibatasi maksimal 5 ekor per hari demi menjaga higienitas dan cita rasa masakan).'
    },
    {
      q: 'Apakah shahibul aqiqah boleh menyaksikan langsung proses penyembelihan?',
      a: 'Sangat diperbolehkan dan kami persilakan. Anda dapat hadir langsung di kandang/dapur kami di Jl. Cincin Kota, Karangsari, Kebumen. Jika berhalangan hadir, tim kami akan mendokumentasikan foto papan nama dan rekaman video penyembelihan berikrar doa yang dapat diakses langsung di menu Lacak Pesanan.'
    },
    {
      q: 'Bagaimana kondisi masakan saat diantar ke rumah pemesan?',
      a: 'Seluruh olahan dimasak secara segar (fresh on the day) pada hari pelaksanaan dan dikemas rapi dalam kondisi hangat. Kami menyediakan 2 pilihan sesi pengantaran: Sesi Pagi (08.00 - 11.00 WIB) atau Sesi Sore (13.00 - 16.00 WIB) tepat waktu sebelum tamu undangan tiba.'
    },
    {
      q: 'Apakah Rahma Aqiqah melayani penyaluran masakan ke panti asuhan atau pesantren?',
      a: 'Bisa. Bagi keluarga yang ingin menyedekahkan sebagian atau seluruh porsi aqiqah ke panti asuhan, pondok pesantren, atau dhuafa di wilayah Kebumen, tim kami siap membantu menyalurkan secara amanah lengkap dengan foto dan tanda terima serah terima.'
    },
    {
      q: 'Bagaimana sistem pembayaran dan pelunasannya?',
      a: 'Pemesanan dapat dimulai dengan Down Payment (DP) 50% untuk mengunci kuota tanggal produksi. Sisa pelunasan (50%) dapat dibayarkan secara fleksibel saat masakan tiba di lokasi Anda (COD) atau melalui transfer bank resmi (BRI / BSI Syariah).'
    },
  ];

  const areaLayanan = [
    'Kebumen Kota', 'Gombong', 'Karanganyar', 'Prembun', 'Kutowinangun', 'Alian',
    'Petanahan', 'Klirong', 'Buluspesantren', 'Ambal', 'Mirit', 'Puring',
    'Ayah', 'Rowokele', 'Buayan', 'Kuwarasan', 'Adimulyo', 'Sruweng',
    'Pejagoan', 'Sempor', 'Karanggayam', 'Sadang', 'Padureso', 'Bonorowo'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-600 text-white py-16 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block bg-amber-400 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
                Jagonya Aqiqah Siap Saji di Kebumen
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                Rahma Aqiqah<br />
                <span className="text-amber-300">Masakan Lezat</span><br />
                Sesuai Syariat Islam
              </h2>
              <p className="text-emerald-100 text-lg mb-6 leading-relaxed">
                Layanan aqiqah terpercaya di Kebumen. Dari pemilihan kambing hingga sajian di meja tamu,
                kami tangani semua dengan penuh amanah dan cita rasa autentik.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/kalkulator')}
                  className="bg-amber-400 hover:bg-amber-500 text-emerald-900 font-bold px-6 py-3 rounded-xl shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                >
                  Pesan Sekarang <ChevronRight size={18} />
                </button>
                <a
                  href="https://wa.me/6281578733874"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-xl border border-white/30 transition-all flex items-center gap-2"
                >
                  <Phone size={16} /> Hubungi WA
                </a>
              </div>
              <div className="flex flex-wrap gap-8 mt-8 text-sm">
                {[['1000+', 'Keluarga Dilayani'], ['5 Bintang', 'Rating Kepuasan'], ['10+ Tahun', 'Pengalaman'], ['6 Varian', 'Menu Masakan']].map(([val, label]) => (
                  <div key={label}>
                    <div className="text-xl font-bold text-amber-300">{val}</div>
                    <div className="text-emerald-200 text-xs mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="w-72 h-72 bg-white/10 rounded-full flex items-center justify-center border-4 border-amber-400/50 shadow-2xl">
                  <Package size={96} className="text-white/60" strokeWidth={0.75} />
                </div>
                <div className="absolute -top-4 -right-4 bg-amber-400 text-emerald-900 rounded-full p-3 shadow-lg">
                  <Shield size={28} />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-emerald-500 text-white rounded-full p-3 shadow-lg">
                  <Award size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur Unggulan */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-emerald-800 mb-2">Mengapa Memilih Rahma Aqiqah?</h3>
            <p className="text-gray-500">Kepercayaan ribuan keluarga bukan tanpa alasan</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fiturUnggulan.map(({ Icon, judul, desc }) => (
              <div key={judul} className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-emerald-600 text-white rounded-xl flex items-center justify-center mb-4">
                  <Icon size={22} />
                </div>
                <h4 className="font-bold text-emerald-800 mb-2">{judul}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Katalog Paket */}
      <section className="py-14 px-4 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-emerald-800 mb-2">Katalog Paket Aqiqah</h3>
            <p className="text-gray-500">Pilih paket sesuai kebutuhan. Semua sudah termasuk harga kambing dan ongkos masak.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {PAKET_LIST.map((paket) => (
              <div
                key={paket.id}
                onClick={() => setSelectedPaket(selectedPaket?.id === paket.id ? null : paket)}
                className={`relative rounded-2xl border-2 p-5 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  paket.popular
                    ? 'border-amber-400 bg-gradient-to-b from-amber-50 to-white shadow-md'
                    : selectedPaket?.id === paket.id
                    ? 'border-emerald-500 bg-emerald-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-emerald-300'
                }`}
              >
                {paket.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-emerald-900 text-xs font-bold px-3 py-0.5 rounded-full whitespace-nowrap">
                    Terpopuler
                  </div>
                )}
                <div className="text-center mb-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Package size={24} className="text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-emerald-800 text-lg">{paket.nama}</h4>
                  <p className="text-2xl font-extrabold text-emerald-600 mt-1">
                    {formatRupiah(paket.harga)}
                  </p>
                  <p className="text-xs text-gray-400">per ekor</p>
                </div>
                <ul className="space-y-1.5 text-sm">
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                    {paket.porsiDaging} Porsi Daging
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                    {paket.porsiJeroan} Porsi Jeroan
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                    Dokumentasi Syariat
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                    E-Sertifikat PDF
                  </li>
                </ul>
                <p className="text-xs text-gray-500 mt-3 leading-snug">{paket.deskripsi}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/kalkulator?paket=${paket.id}`); }}
                  className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
                >
                  Pesan Paket Ini
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Masakan */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-emerald-800 mb-2">Varian Menu Masakan</h3>
            <p className="text-gray-500">Setiap paket bisa dikustomisasi sesuai selera keluarga</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-emerald-700 mb-4 flex items-center gap-2">
                <UtensilsCrossed size={16} className="text-emerald-600" />
                Olahan Daging
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {MENU_DAGING.map((m) => (
                  <div key={m.id} className="border border-emerald-100 rounded-xl p-3 bg-emerald-50 relative">
                    {m.badge && (
                      <span className="absolute -top-2 left-2 bg-amber-400 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                        Menu Favorit
                      </span>
                    )}
                    <p className="font-semibold text-emerald-800 mt-2">{m.nama}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-emerald-700 mb-4 flex items-center gap-2">
                <UtensilsCrossed size={16} className="text-emerald-600" />
                Olahan Jeroan dan Tulang
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {MENU_JEROAN.map((m) => (
                  <div key={m.id} className="border border-emerald-100 rounded-xl p-3 bg-emerald-50">
                    <p className="font-semibold text-emerald-800">{m.nama}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <h4 className="font-bold text-emerald-700 mb-4 flex items-center gap-2">
                  <Box size={16} className="text-amber-600" />
                  Paket Nasi Box (Opsional)
                </h4>
                <div className="space-y-2">
                  {PAKET_NASI_BOX.filter(n => n.id !== 'none').map((n) => (
                    <div key={n.id} className="border border-amber-100 rounded-xl p-3 bg-amber-50 flex items-start gap-3">
                      <div className="w-8 h-8 bg-amber-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Box size={16} className="text-amber-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-amber-800 text-sm">{n.nama} ({formatRupiah(n.harga)} per box)</p>
                        <p className="text-xs text-gray-500">{n.isi.join(', ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimoni */}
      <section className="py-14 px-4 bg-gradient-to-b from-emerald-50 to-emerald-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-emerald-800 mb-2">Testimoni Pelanggan</h3>
            <p className="text-gray-500">Kepuasan keluarga adalah prioritas kami</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonial.map((t) => (
              <div key={t.nama} className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.bintang)].map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{t.komentar}"</p>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-emerald-800 text-sm">{t.nama}</p>
                  <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">{t.paket}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Area Jangkauan Pengantaran */}
      <section className="py-14 px-4 bg-white border-t border-emerald-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="inline-flex items-center gap-1.5 bg-emerald-100/70 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
              <Truck size={14} /> Jangkauan Pengiriman Luas
            </span>
            <h3 className="text-2xl font-bold text-emerald-900 mb-2">
              Layanan Antar Tepat Waktu Se-Kabupaten Kebumen
            </h3>
            <p className="text-gray-500 text-sm">
              Pesanan aqiqah siap saji diantar menggunakan armada khusus tertutup dalam kondisi hangat langsung ke rumah, masjid, atau lokasi syukuran Anda.
            </p>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-3xl p-6 sm:p-8 shadow-xs">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 text-center mb-4">
              Kecamatan yang Siap Kami Layani:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {areaLayanan.map((kec) => (
                <span
                  key={kec}
                  className="bg-white text-emerald-900 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-2xs hover:border-emerald-400 hover:bg-emerald-100/50 transition-colors"
                >
                  {kec}
                </span>
              ))}
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-emerald-200/60 text-xs text-gray-600">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-200/80 text-emerald-800 flex items-center justify-center shrink-0">
                  <Clock size={16} />
                </div>
                <span>Tiba tepat waktu sesuai pilihan sesi (Pagi / Sore).</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-200/80 text-emerald-800 flex items-center justify-center shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <span>Kemasan higienis, rapat, dan terjaga kehangatannya.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-200/80 text-emerald-800 flex items-center justify-center shrink-0">
                  <HeartHandshake size={16} />
                </div>
                <span>Siap bantu penyaluran amanah ke panti/pesantren.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-14 px-4 bg-gray-50/80 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
              <HelpCircle size={14} /> Panduan Shahibul Aqiqah
            </span>
            <h3 className="text-2xl font-bold text-emerald-900 mb-2">Pertanyaan yang Sering Diajukan</h3>
            <p className="text-gray-500 text-sm">Informasi penting seputar pelaksanaan, syariat, dan pemesanan di Rahma Aqiqah</p>
          </div>

          <div className="space-y-3">
            {faqList.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                    isOpen ? 'border-emerald-500 shadow-md ring-2 ring-emerald-50' : 'border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-semibold text-gray-800 text-sm sm:text-base cursor-pointer"
                  >
                    <span className={isOpen ? 'text-emerald-800 font-bold' : ''}>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-emerald-600 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-emerald-50/20">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-600/70 border border-emerald-400/40 text-amber-300 text-xs px-3 py-1 rounded-full font-bold mb-3">
            <Award size={14} /> Berkah & Sesuai Syariat Islam
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-3 leading-tight">
            Wujudkan Aqiqah Terbaik untuk Buah Hati Tercinta
          </h3>
          <p className="text-emerald-100 mb-8 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Pesan paket aqiqah siap saji secara praktis dengan kalkulator online kami, atau konsultasikan kebutuhan menu dan jadwal bersama Bapak Abdul Ghofar via WhatsApp.
          </p>
          <div className="flex flex-wrap justify-center gap-3.5">
            <button
              onClick={() => navigate('/kalkulator')}
              className="bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold px-7 py-3.5 rounded-2xl shadow-xl transition-all hover:scale-105 flex items-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              Hitung Biaya & Pesan Online <ChevronRight size={18} />
            </button>
            <a
              href="https://wa.me/6281578733874?text=Assalamu'alaikum%20Bapak%20Abdul%20Ghofar,%20saya%20ingin%20konsultasi%20pemesanan%20aqiqah%20di%20Rahma%20Aqiqah%20Kebumen"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white text-white hover:text-emerald-900 border border-white/30 font-bold px-7 py-3.5 rounded-2xl shadow-lg transition-all hover:scale-105 flex items-center gap-2 text-sm sm:text-base cursor-pointer backdrop-blur-xs"
            >
              <Phone size={18} /> Hubungi WhatsApp Langsung
            </a>
          </div>
        </div>
      </section>

      {/* Footer 4 Kolom Profesional */}
      <footer className="bg-emerald-950 text-emerald-200 pt-14 pb-8 px-4 text-xs sm:text-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-emerald-900">
            {/* Kolom 1: Profil Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold text-lg shadow">
                  R
                </div>
                <div>
                  <h4 className="font-bold text-white text-base leading-tight">Rahma Aqiqah</h4>
                  <p className="text-[11px] text-emerald-400 font-medium">Jagonya Aqiqah Siap Saji</p>
                </div>
              </div>
              <p className="text-emerald-300/90 text-xs leading-relaxed">
                Layanan aqiqah siap saji terpercaya di Kebumen. Mengutamakan syariat Islam yang sah, cita rasa masakan lezat khas rempah Kebumen, dan transparansi dokumentasi lengkap.
              </p>
              <div className="pt-2 text-xs text-emerald-400 space-y-1">
                <p className="flex items-center gap-1.5">
                  <Clock size={13} className="text-amber-400" />
                  <span>Layanan Order: Buka Setiap Hari (06.00 - 21.00 WIB)</span>
                </p>
              </div>
            </div>

            {/* Kolom 2: Paket & Menu Olahan */}
            <div>
              <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-3.5 border-b border-emerald-800/80 pb-1.5 inline-block">
                Paket & Olahan
              </h5>
              <ul className="space-y-2 text-xs text-emerald-300/90">
                <li>
                  <Link to="/kalkulator" className="hover:text-amber-300 transition-colors">
                    Paket Tipe A (65 Porsi)
                  </Link>
                </li>
                <li>
                  <Link to="/kalkulator" className="hover:text-amber-300 transition-colors">
                    Paket Tipe B (80 Porsi)
                  </Link>
                </li>
                <li>
                  <Link to="/kalkulator" className="hover:text-amber-300 transition-colors">
                    Paket Tipe C (95 Porsi - Terpopuler)
                  </Link>
                </li>
                <li>
                  <Link to="/kalkulator" className="hover:text-amber-300 transition-colors">
                    Paket Tipe D & Tipe E (115 & 130 Porsi)
                  </Link>
                </li>
                <li className="pt-1 text-emerald-400 font-semibold">
                  Olahan: Kicik, Gule, Rendang, Sate, Tengkleng
                </li>
                <li>Pilihan Nasi Box Standar & Bento Istimewa</li>
              </ul>
            </div>

            {/* Kolom 3: Dapur Pusat & Kontak */}
            <div>
              <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-3.5 border-b border-emerald-800/80 pb-1.5 inline-block">
                Dapur & Kontak
              </h5>
              <div className="space-y-2.5 text-xs text-emerald-300/90">
                <div className="flex items-start gap-2">
                  <MapPin size={15} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Dapur Pusat Rahma Aqiqah</p>
                    <p>Jl. Cincin Kota, Karangsari, Kebumen (Barat SMAN 2 Kebumen)</p>
                    <a
                      href="https://maps.google.com/?q=SMAN+2+Kebumen"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline inline-flex items-center gap-1 mt-1 font-semibold"
                    >
                      Buka Rute Google Maps <ExternalLink size={11} />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <Phone size={14} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Bapak Abdul Ghofar (Pengelola)</p>
                    <a
                      href="https://wa.me/6281578733874"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-200 hover:text-white font-mono"
                    >
                      0815 7873 3874
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Kolom 4: Jaminan Syariat & Rekening */}
            <div>
              <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-3.5 border-b border-emerald-800/80 pb-1.5 inline-block">
                Jaminan & Rekening
              </h5>
              <div className="space-y-2.5 text-xs">
                <div className="bg-emerald-900/60 p-2.5 rounded-xl border border-emerald-800/60">
                  <p className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                    <ShieldCheck size={13} /> Sesuai Syariat Islam
                  </p>
                  <p className="text-emerald-300 text-[11px] mt-0.5">
                    Hewan sehat cukup umur (poel), disembelih Juru Sembelih Halal dengan doa atas nama ananda.
                  </p>
                </div>

                <div className="pt-1">
                  <p className="text-[11px] font-semibold text-gray-300 mb-1">Rekening Resmi Pembayaran:</p>
                  <div className="space-y-1 font-mono text-[11px] text-emerald-200">
                    <p className="bg-emerald-900/40 px-2 py-1 rounded border border-emerald-800/40">
                      <strong>BRI:</strong> 0068-01-012345-53-8 (Abdul Ghofar)
                    </p>
                    <p className="bg-emerald-900/40 px-2 py-1 rounded border border-emerald-800/40">
                      <strong>BSI:</strong> 715-787-3387 (Abdul Ghofar)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Baris Bawah Hak Cipta & Akses Admin */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-400/80">
            <p>&copy; 2026 Rahma Aqiqah Kebumen. Seluruh Hak Cipta Dilindungi.</p>
            <div className="flex items-center gap-4">
              <Link to="/lacak" className="hover:text-emerald-200 transition-colors">
                Lacak Pesanan
              </Link>
              <span className="text-emerald-800">&bull;</span>
              <Link
                to="/admin/login"
                className="hover:text-amber-300 transition-colors inline-flex items-center gap-1 text-[11px] font-semibold"
              >
                <Lock size={12} />
                <span>Akses Pengelola Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
