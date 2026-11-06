// src/data/mockData.js
// =====================================================
// DATA MOCK LENGKAP: RAHMA AQIQAH KEBUMEN
// =====================================================

export const PAKET_LIST = [
  {
    id: 'A',
    nama: 'Tipe A',
    harga: 1500000,
    porsiDaging: 65,
    porsiJeroan: 65,
    popular: false,
    deskripsi: 'Cocok untuk keluarga kecil & tetangga dekat',
  },
  {
    id: 'B',
    nama: 'Tipe B',
    harga: 1750000,
    porsiDaging: 80,
    porsiJeroan: 80,
    popular: false,
    deskripsi: 'Pilihan hemat dengan porsi lebih luas',
  },
  {
    id: 'C',
    nama: 'Tipe C',
    harga: 2000000,
    porsiDaging: 95,
    porsiJeroan: 95,
    popular: true,
    deskripsi: 'Paket terpopuler, serasi untuk arisan & warga RT',
  },
  {
    id: 'D',
    nama: 'Tipe D',
    harga: 2500000,
    porsiDaging: 115,
    porsiJeroan: 115,
    popular: false,
    deskripsi: 'Ideal untuk jamaah masjid dan acara besar',
  },
  {
    id: 'E',
    nama: 'Tipe E',
    harga: 3000000,
    porsiDaging: 130,
    porsiJeroan: 130,
    popular: false,
    deskripsi: 'Paket premium untuk undangan besar & korporat',
  },
];

export const MENU_DAGING = [
  { id: 'kicik', nama: 'Kicik', badge: 'Menu Favorit Khas Rahma Aqiqah' },
  { id: 'semur', nama: 'Semur', badge: null },
  { id: 'rendang', nama: 'Rendang', badge: null },
  { id: 'sate_goreng', nama: 'Sate Goreng', badge: null },
  { id: 'sate_bakar', nama: 'Sate Bakar', badge: null },
  { id: 'tongseng', nama: 'Tongseng', badge: null },
];

export const MENU_JEROAN = [
  { id: 'kare', nama: 'Kare' },
  { id: 'gule', nama: 'Gule' },
  { id: 'tengkleng', nama: 'Tengkleng' },
];

export const PAKET_NASI_BOX = [
  {
    id: 'none',
    nama: 'Masak Saja / Tanpa Nasi Box',
    harga: 0,
    isi: [],
  },
  {
    id: 'ekonomis',
    nama: 'Paket Ekonomis',
    harga: 13000,
    isi: ['Nasi', 'Tumis Bihun', 'Kerupuk Udang', 'Buah Pisang'],
  },
  {
    id: 'spesial_telur',
    nama: 'Paket Spesial Telur',
    harga: 16000,
    isi: ['Nasi', 'Telur Balado', 'Tumis Bihun', 'Kerupuk Udang', 'Buah Pisang'],
  },
  {
    id: 'istimewa_ayam',
    nama: 'Paket Istimewa Ayam',
    harga: 23000,
    isi: ['Nasi', 'Ayam Goreng', 'Telur Balado', 'Tumis Bihun', 'Kerupuk Udang', 'Buah Pisang'],
  },
];

export const SESI_KIRIM = [
  { id: 'pagi', label: 'Pagi (08.00 sampai 11.00 WIB)' },
  { id: 'sore', label: 'Sore (13.00 sampai 16.00 WIB)' },
];

// Kuota jadwal harian (tanggal dalam format YYYY-MM-DD)
export const KUOTA_JADWAL_INIT = [
  { tanggal: '2026-11-05', maks: 5, terpakai: 4, status: 'tersedia' },
  { tanggal: '2026-11-06', maks: 5, terpakai: 5, status: 'penuh' },
  { tanggal: '2026-11-07', maks: 5, terpakai: 5, status: 'penuh' },
  { tanggal: '2026-11-08', maks: 5, terpakai: 2, status: 'tersedia' },
  { tanggal: '2026-11-09', maks: 5, terpakai: 1, status: 'tersedia' },
  { tanggal: '2026-11-10', maks: 5, terpakai: 3, status: 'tersedia' },
  { tanggal: '2026-11-11', maks: 5, terpakai: 0, status: 'tersedia' },
  { tanggal: '2026-11-12', maks: 5, terpakai: 5, status: 'penuh' },
  { tanggal: '2026-11-13', maks: 5, terpakai: 5, status: 'penuh' },
  { tanggal: '2026-11-14', maks: 5, terpakai: 1, status: 'tersedia' },
  { tanggal: '2026-11-15', maks: 5, terpakai: 0, status: 'tersedia' },
  { tanggal: '2026-11-16', maks: 5, terpakai: 2, status: 'tersedia' },
];

export const FOTO_SYARIAT_DEFAULT =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='600' height='400' fill='%23064e3b'/><circle cx='300' cy='180' r='110' fill='%23047857'/><circle cx='300' cy='180' r='90' fill='%23059669'/><path d='M230 250 C260 210, 340 210, 370 250' stroke='%23d1fae5' stroke-width='8' fill='none' stroke-linecap='round'/><circle cx='270' cy='160' r='10' fill='%23ffffff'/><circle cx='330' cy='160' r='10' fill='%23ffffff'/><rect x='150' y='300' width='300' height='55' rx='12' fill='%23022c22' stroke='%2310b981' stroke-width='2'/><text x='300' y='325' font-family='sans-serif' font-size='14' fill='%23a7f3d0' text-anchor='middle' font-weight='bold'>DOKUMENTASI SYARIAT RAHMA AQIQAH</text><text x='300' y='345' font-family='sans-serif' font-size='12' fill='%23ffffff' text-anchor='middle'>Sesuai Syariat Islam - Kebumen</text></svg>";

// Pesanan mock
export const PESANAN_INIT = [
  {
    id: 'INV-20261104-001',
    namaAnak: 'Ahmad Fatih',
    namaOrtu: 'Budi Santoso',
    binBinti: 'bin',
    tglLahir: '2026-10-29',
    jenisKelamin: 'laki',
    jumlahEkor: 2,
    paketId: 'C',
    menuDaging: 'kicik',
    menuJeroan: 'gule',
    nasiBoxId: 'spesial_telur',
    jumlahBox: 95,
    tglProduksi: '2026-11-06',
    sesi: 'pagi',
    catatan: 'Mohon diberi label nama anak di setiap kemasan',
    pembayaran: 'dp',
    statusPembayaran: 'DP 50% Lunas',
    statusOperasional: 'Dijadwalkan',
    totalHarga: 2 * 2000000 + 95 * 16000,
    buktiTransfer: null,
    syariat: {
      fotoPenyembelihan: FOTO_SYARIAT_DEFAULT,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      sertifikat: true,
      catatanSyariat: 'Penyembelihan dilaksanakan hari Rabu, 4 November 2026 pukul 06.30 WIB oleh Ust. Ahmad Fauzi. Bismillah Allahu Akbar.',
    },
  },
  {
    id: 'INV-20261104-002',
    namaAnak: 'Aisyah Nur',
    namaOrtu: 'Hendra Wijaya',
    binBinti: 'binti',
    tglLahir: '2026-10-31',
    jenisKelamin: 'perempuan',
    jumlahEkor: 1,
    paketId: 'B',
    menuDaging: 'semur',
    menuJeroan: 'kare',
    nasiBoxId: 'ekonomis',
    jumlahBox: 80,
    tglProduksi: '2026-11-07',
    sesi: 'sore',
    catatan: '',
    pembayaran: 'lunas',
    statusPembayaran: 'Lunas 100%',
    statusOperasional: 'Proses Penyembelihan',
    totalHarga: 1 * 1750000 + 80 * 13000,
    buktiTransfer: null,
    syariat: null,
  },
  {
    id: 'INV-20261103-005',
    namaAnak: 'Muhammad Rafi',
    namaOrtu: 'Agus Purnomo',
    binBinti: 'bin',
    tglLahir: '2026-10-20',
    jenisKelamin: 'laki',
    jumlahEkor: 2,
    paketId: 'D',
    menuDaging: 'rendang',
    menuJeroan: 'tengkleng',
    nasiBoxId: 'istimewa_ayam',
    jumlahBox: 115,
    tglProduksi: '2026-11-08',
    sesi: 'pagi',
    catatan: 'Tambah sambal di setiap box',
    pembayaran: 'lunas',
    statusPembayaran: 'Lunas 100%',
    statusOperasional: 'Menunggu Verifikasi',
    totalHarga: 2 * 2500000 + 115 * 23000,
    buktiTransfer: null,
    syariat: null,
  },
  {
    id: 'INV-20261101-003',
    namaAnak: 'Zara Fadhila',
    namaOrtu: 'Irwan Setiawan',
    binBinti: 'binti',
    tglLahir: '2026-10-10',
    jenisKelamin: 'perempuan',
    jumlahEkor: 1,
    paketId: 'A',
    menuDaging: 'sate_bakar',
    menuJeroan: 'gule',
    nasiBoxId: 'none',
    jumlahBox: 0,
    tglProduksi: '2026-11-01',
    sesi: 'pagi',
    catatan: '',
    pembayaran: 'lunas',
    statusPembayaran: 'Lunas 100%',
    statusOperasional: 'Selesai',
    totalHarga: 1 * 1500000,
    buktiTransfer: null,
    syariat: {
      fotoPenyembelihan: FOTO_SYARIAT_DEFAULT,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      sertifikat: true,
      catatanSyariat: 'Alhamdulillah selesai dengan sempurna.',
    },
  },
];

export const STATUS_OPERASIONAL_LIST = [
  'Menunggu Verifikasi',
  'Dijadwalkan',
  'Proses Penyembelihan',
  'Masak Dapur',
  'Dikirim',
  'Selesai',
];

export const formatRupiah = (angka) =>
  'Rp ' + angka.toLocaleString('id-ID');

export const formatTanggalIndonesia = (dateStr, withDay = true) => {
  if (!dateStr) return '';
  const parts = String(dateStr).split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('id-ID', {
        ...(withDay ? { weekday: 'long' } : {}),
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  }
  return dateStr;
};

export const getPaketById = (id) => PAKET_LIST.find((p) => p.id === id);
export const getNasiBoxById = (id) => PAKET_NASI_BOX.find((n) => n.id === id);
export const getMenuDagingById = (id) => MENU_DAGING.find((m) => m.id === id);
export const getMenuJeroanById = (id) => MENU_JEROAN.find((m) => m.id === id);
