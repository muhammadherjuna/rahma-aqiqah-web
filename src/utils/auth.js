// src/utils/auth.js
// Layanan Autentikasi Pengelola Rahma Aqiqah Kebumen

const AUTH_STORAGE_KEY = 'rahma_aqiqah_admin_session';
const CUSTOM_PASSWORDS_KEY = 'rahma_custom_passwords';

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
    nama: 'Staf Produksi & Logistik',
    peran: 'Operasional Dapur',
    role: 'kitchen',
    deskripsi: 'Akses operasional: Antrean Masak, Tiket Dapur & Dokumentasi Syariat',
    noWa: '081578733874',
  },
];

function getCustomPasswords() {
  try {
    const raw = localStorage.getItem(CUSTOM_PASSWORDS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getAdminCredentials() {
  const custom = getCustomPasswords();
  return ADMIN_CREDENTIALS.map((acc) => ({
    ...acc,
    password: custom[acc.username] || acc.password,
  }));
}

export function updateAdminPassword(username, oldPassword, newPassword) {
  const credentials = getAdminCredentials();
  const user = credentials.find(
    (acc) => acc.username.toLowerCase() === username.trim().toLowerCase()
  );

  if (!user) {
    return { success: false, error: 'Pengguna tidak ditemukan.' };
  }

  if (user.password !== oldPassword) {
    return { success: false, error: 'Kata sandi saat ini (lama) tidak sesuai.' };
  }

  if (!newPassword || newPassword.trim().length < 6) {
    return { success: false, error: 'Kata sandi baru harus minimal 6 karakter.' };
  }

  const custom = getCustomPasswords();
  custom[user.username] = newPassword.trim();
  localStorage.setItem(CUSTOM_PASSWORDS_KEY, JSON.stringify(custom));

  return { success: true };
}

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
  const list = getAdminCredentials();
  const found = list.find(
    (acc) =>
      acc.username.toLowerCase() === username.trim().toLowerCase() &&
      acc.password === password
  );
  return found || null;
}
