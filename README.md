# Rahma Aqiqah Kebumen - Sistem Informasi E-Commerce & Operasional

> **"Masakan Lezat dan Sesuai Syariat - Jagonya Aqiqah Siap Saji di Kebumen"**  
> Pengelola: Bapak Abdul Ghofar | Jl. Cincin Kota, Karangsari, Kebumen (Barat SMAN 2 Kebumen) | WA: 0815 7873 3874

Aplikasi web modern berbasis Single Page Application (SPA) yang mengintegrasikan layanan e-commerce pemesanan aqiqah siap saji bagi pelanggan dengan sistem manajemen operasional dapur, kontrol kuota harian, serta transparansi dokumentasi syariat Islam.

---

## Fitur Utama

### 1. Sisi Pelanggan (Public Customer Portal)
- **Beranda & Katalog Paket:** Tampilan paket aqiqah Tipe A s/d Tipe E dengan rincian porsi daging, jeroan, deskripsi, dan ulasan pelanggan.
- **Kalkulator & Wizard Pemesanan 4 Langkah:**
  1. *Paket Kambing & Olahan Masakan:* Pilihan tipe kambing, jumlah ekor (disunnahkan 2 ekor laki-laki, 1 ekor perempuan), serta kustomisasi olahan daging (Kicik khas favorit Kebumen, Semur, Rendang, Sate Goreng, Sate Bakar, Tongseng) dan jeroan (Gule, Kare, Tengkleng).
  2. *Paket Nasi Box Siap Saji:* Penawaran visual tegas antara opsi Masak Saja (wadah besar) vs Kemas Nasi Box Lengkap (Ekonomis Rp13rb, Spesial Telur Rp16rb, Istimewa Ayam Rp23rb) dengan sinkronisasi porsi otomatis.
  3. *Kalender Kuota & Sesi Pengiriman:* Kuota dapur harian dibatasi maksimal 5 ekor/hari untuk menjaga kualitas. Proteksi anti-overbooking dengan indikator visual Tersedia (hijau), Kosong (abu-abu), dan Penuh (merah terkunci). Pilihan sesi Pagi (08.00–11.00 WIB) atau Sore (13.00–16.00 WIB).
  4. *Identitas Syariat & Pembayaran:* Formulir nama anak, orang tua (bin/binti), tanggal lahir, skema pembayaran (DP 50% atau Lunas 100%), nomor rekening resmi BRI & BSI dengan tombol salin 1-klik, dan integrasi WhatsApp otomatis.
- **Kompresi Bukti Transfer Klien (WebP):** Mengompres foto bukti transfer langsung di browser sebelum diunggah ke cloud storage (hemat kuota hingga 85–90%).
- **Lacak Pesanan & Transparansi Syariat:**
  - Progress tracker 6 tahap status operasional pesanan.
  - Dokumentasi foto penyembelihan dengan papan nama shahibul aqiqah.
  - Video pemutar syariat doa & penyembelihan terintegrasi (YouTube / Google Drive / MP4).
  - Cetak E-Sertifikat Aqiqah Resmi (PDF printable).

### 2. Sisi Pengelola (Admin Dashboard - Bp. Abdul Ghofar)
- **Ringkasan Metrik Bisnis:** Total pesanan, utilisasi kuota dapur harian, antrean pembayaran, dan total pendapatan.
- **Manajemen Pesanan & Operasional:** Kontrol status tahapan dapur, verifikasi pembayaran, upload dokumentasi syariat foto & video.
- **Surat Jalan & Tiket Dapur Printable:** Cetak lembar kerja produksi dapur dan tanda terima pengiriman lengkap dengan tanda tangan koki, kurir, dan penerima.
- **WhatsApp Quick-Reply Template:** Generator pesan resmi WhatsApp dengan 5 template syariat islami.
- **Kontrol Kuota Kalender Dapur:** Monitoring harian kapasitas dapur maksimal 5 ekor per hari.

---

## Teknologi & Arsitektur

- **Frontend:** React 19, Vite 8, React Router v7
- **Styling:** Tailwind CSS v4, Lucide React Icons
- **Backend & Database:** Supabase (PostgreSQL)
  - Row-Level Locking via Stored Procedure (`book_aqiqah_order`) untuk mencegah *race-condition overbooking*.
  - Row-Level Security (RLS) policies.
  - Supabase Storage Bucket (`rahma-media`) untuk media dokumentasi & bukti transfer.
- **Image Processing:** Client-side Canvas to WebP Compressor

---

## Menjalankan Proyek Secara Lokal

### Prasyarat
- Node.js (v18 atau lebih baru)
- npm atau pnpm

### Langkah Instalasi
1. Klon repositori ini:
   ```bash
   git clone https://github.com/muhammadherjuna/rahma-aqiqah-web.git
   cd rahma-aqiqah-web
   ```

2. Pasang dependensi:
   ```bash
   npm install
   ```

3. Konfigurasi variabel lingkungan:
   Salin `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Isi konfigurasi Supabase Anda di dalam `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```
   Buka peramban pada `http://localhost:5173`.

5. Build untuk produksi:
   ```bash
   npm run build
   ```

---

## Lisensi & Hak Cipta
Hak Cipta &copy; 2026 Rahma Aqiqah Kebumen. Dikembangkan oleh Muhammad Herjuna.