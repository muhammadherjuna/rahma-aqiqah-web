// src/pages/BerandaKatalog.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle, Star, ChevronRight, Phone, MapPin, Award, Shield,
  Trophy, BookOpen, Leaf, Truck, Package, UtensilsCrossed, Box, Lock
} from 'lucide-react';
import { PAKET_LIST, MENU_DAGING, MENU_JEROAN, PAKET_NASI_BOX, formatRupiah } from '../data/mockData';

export default function BerandaKatalog() {
  const navigate = useNavigate();
  const [selectedPaket, setSelectedPaket] = useState(null);

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

      {/* CTA */}
      <section className="py-12 px-4 bg-emerald-700 text-center text-white">
        <h3 className="text-2xl font-bold mb-3">Siap Merayakan Aqiqah Buah Hati Anda?</h3>
        <p className="text-emerald-200 mb-6 max-w-xl mx-auto">
          Hubungi Bapak Abdul Ghofar sekarang atau langsung pesan melalui sistem kami.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate('/kalkulator')}
            className="bg-amber-400 hover:bg-amber-500 text-emerald-900 font-bold px-8 py-3 rounded-xl shadow-lg transition-all hover:scale-105 flex items-center gap-2"
          >
            Pesan Sekarang <ChevronRight size={18} />
          </button>
          <a
            href="https://wa.me/6281578733874?text=Assalamu'alaikum, saya ingin pesan aqiqah di Rahma Aqiqah Kebumen"
            target="_blank" rel="noopener noreferrer"
            className="bg-white text-emerald-700 font-bold px-8 py-3 rounded-xl shadow-lg transition-all hover:scale-105 flex items-center gap-2"
          >
            <Phone size={18} /> WhatsApp Langsung
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-900 text-emerald-200 py-8 px-4 text-sm">
        <div className="max-w-6xl mx-auto text-center space-y-1.5">
          <p className="font-semibold text-white">Rahma Aqiqah Kebumen</p>
          <p className="flex items-center justify-center gap-1.5">
            <MapPin size={12} /> Jl. Cincin Kota, Karangsari, Kebumen (Barat SMAN 2 Kebumen)
          </p>
          <p className="flex items-center justify-center gap-1.5">
            <Phone size={12} /> Pengelola: Bapak Abdul Ghofar | WA: 0815 7873 3874
          </p>
          
          <div className="mt-5 pt-4 border-t border-emerald-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <p className="text-emerald-400">&copy; 2026 Rahma Aqiqah Kebumen. Semua Hak Dilindungi.</p>
            <Link
              to="/admin/login"
              className="text-emerald-400/80 hover:text-amber-300 transition-colors flex items-center gap-1 text-[11px] font-medium"
            >
              <Lock size={12} />
              <span>Akses Khusus Pengelola</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
