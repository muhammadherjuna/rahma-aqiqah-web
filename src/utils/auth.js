// src/utils/auth.js
// Layanan Autentikasi Pengelola Rahma Aqiqah Kebumen

const AUTH_STORAGE_KEY = 'rahma_aqiqah_admin_session';

export const ADMIN_CREDENTIALS = [
  {
    username: 'abdul.ghofar',
    password: 'aqiqahsyariat2026',
    nama: 'Bapak Abdul Ghofar',
    peran: 'Pemilik & Pengelola Utama',
    role: 'owner',
    deskripsi: 'Akses penuh: Keuangan, Omzet, Verifikasi Pembayaran & Kuota',
    noWa: '081578733874',
  },
  {
    username: 'admin',
    password: 'admin123',
    nama: 'Tim Operasional Dapur',
    peran: 'Staf Operasional Dapur',
    role: 'kitchen',
    deskripsi: 'Akses operasional: Antrean Masak, Tiket Dapur & Dokumentasi Syariat',
    noWa: '081578733874',
  },
];

export function getAdminSession() {
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session || !session.expiresAt) return null;

    // Cek apakah sesi telah kedaluwarsa
    if (Date.now() > session.expiresAt) {
      clearAdminSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function setAdminSession(user) {
  const session = {
    token: `token_${Math.random().toString(36).substring(2)}_${Date.now()}`,
    username: user.username,
    nama: user.nama,
    peran: user.peran,
    role: user.role || (user.username === 'abdul.ghofar' ? 'owner' : 'kitchen'),
    noWa: user.noWa,
    loginAt: new Date().toISOString(),
    expiresAt: Date.now() + 1000 * 60 * 60 * 4, // Aktif selama 4 jam
  };
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function clearAdminSession() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

export function verifyCredentials(username, password) {
  const found = ADMIN_CREDENTIALS.find(
    (acc) =>
      acc.username.toLowerCase() === username.trim().toLowerCase() &&
      acc.password === password
  );
  return found || null;
}
