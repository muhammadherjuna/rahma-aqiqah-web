// src/pages/LoginAdmin.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldCheck, Lock, User, ArrowLeft,
  AlertCircle, Eye, EyeOff,
  Award, Calendar, ChefHat, Sparkles, Check
} from 'lucide-react';
import {
  getAdminCredentials,
  getAdminSession,
  setAdminSession,
  verifyCredentials
} from '../utils/auth';

export default function LoginAdmin() {
  const navigate = useNavigate();
  const location = useLocation();

  // Form password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & Keamanan
  const [errorMessage, setErrorMessage] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Cek jika sudah login sebelumnya, langsung arahkan ke dashboard
  useEffect(() => {
    const existing = getAdminSession();
    if (existing) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  // Pesan redirect dari protected route jika ada
  const redirectReason = location.state?.message;

  // Countdown timer untuk penguncian sementara (brute-force prevention)
  useEffect(() => {
    let timer;
    if (isLocked && lockCountdown > 0) {
      timer = setInterval(() => {
        setLockCountdown((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setFailedAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockCountdown]);

  // Login via Password
  const handlePasswordLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (isLocked) {
      setErrorMessage(`Terlalu banyak percobaan. Silakan tunggu ${lockCountdown} detik.`);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const user = verifyCredentials(username, password);
      if (user) {
        setAdminSession(user);
        navigate('/admin', { replace: true });
      } else {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        if (nextAttempts >= 3) {
          setIsLocked(true);
          setLockCountdown(30);
          setErrorMessage('Terlalu banyak percobaan salah. Akses dikunci sementara selama 30 detik.');
        } else {
          setErrorMessage(`Kredensial tidak sesuai. Percobaan tersisa: ${3 - nextAttempts} kali.`);
        }
      }
      setIsLoading(false);
    }, 400);
  };

  // Auto-fill untuk demonstrasi pengujian cepat
  const handleAutoFill = (usernameKey) => {
    const creds = getAdminCredentials();
    const target = creds.find(c => c.username === usernameKey);
    if (target) {
      setUsername(target.username);
      setPassword(target.password);
      setErrorMessage('');
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-900 flex flex-col lg:flex-row overflow-hidden">
      {/* Sisi Kiri: Branding & Nilai Syariat (Fit Screen Tanpa Scroll) */}
      <div className="w-full lg:w-[48%] xl:w-[45%] h-full bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 text-white p-5 sm:p-7 lg:p-8 xl:p-10 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-emerald-700/50">
        {/* Ornamen Latar Halus */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Top Header di Sisi Kiri */}
        <div className="relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-200 hover:text-white bg-emerald-800/60 hover:bg-emerald-700/70 border border-emerald-600/40 px-3 py-1 rounded-full transition-all backdrop-blur-sm"
          >
            <ArrowLeft size={13} />
            <span>Kembali ke Beranda Publik</span>
          </Link>

          <div className="mt-4 lg:mt-6">
            <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-amber-400/30 mb-2">
              <Sparkles size={12} />
              <span>Sistem Manajemen Operasional & Syariat</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Rahma Aqiqah Kebumen
            </h1>
            <p className="text-emerald-200 text-xs sm:text-sm mt-1 font-light leading-relaxed">
              Masakan Lezat dan Sesuai Syariat &mdash; Jagonya Aqiqah Siap Saji.
            </p>
          </div>
        </div>

        {/* 3 Nilai Utama Sistem (Ringkas & Proporsional) */}
        <div className="my-auto py-3 space-y-2.5 relative z-10">
          <div className="bg-emerald-900/60 backdrop-blur-md border border-emerald-700/40 rounded-xl p-3 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0 text-amber-300">
                <Award size={16} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">100% Sesuai Syariat Islam</h3>
                <p className="text-[11px] text-emerald-200/90 leading-tight">
                  Penyembelihan syar'i bersertifikat, rekaman video doa, dan e-sertifikat resmi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-900/60 backdrop-blur-md border border-emerald-700/40 rounded-xl p-3 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-400/20 border border-blue-400/40 flex items-center justify-center shrink-0 text-blue-300">
                <Calendar size={16} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Anti-Overbooking System</h3>
                <p className="text-[11px] text-emerald-200/90 leading-tight">
                  Kapasitas harian maksimal 5 ekor demi menjaga mutu rasa & ketepatan jam saji.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-900/60 backdrop-blur-md border border-emerald-700/40 rounded-xl p-3 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center shrink-0 text-emerald-300">
                <ShieldCheck size={16} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Pemisahan Hak Akses (RBAC)</h3>
                <p className="text-[11px] text-emerald-200/90 leading-tight">
                  Pemisahan aman antara wewenang finansial pemilik dan alur operasional dapur.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Sisi Kiri: Kutipan Amanah Pengelola */}
        <div className="relative z-10 pt-2.5 border-t border-emerald-800/80">
          <p className="text-[11px] italic text-emerald-200/85 leading-snug">
            &ldquo;Amanah aqiqah buah hati adalah ibadah seumur hidup. Setiap tahapan kami tunaikan dengan doa dan ketulusan.&rdquo;
          </p>
          <p className="text-[11px] font-semibold text-amber-300 mt-0.5">
            Bapak Abdul Ghofar &middot; Pengelola Rahma Aqiqah Kebumen
          </p>
        </div>
      </div>

      {/* Sisi Kanan: Formulir Masuk (Fit 1 Layar / Zero Scroll) */}
      <div className="w-full lg:w-[52%] xl:w-[55%] h-full bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
        <div className="w-full max-w-md">
          {/* Card Form */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
            {/* Header Form */}
            <div className="p-5 sm:p-6 pb-3 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Portal Masuk Pengelola
                </span>
                <span className="text-[10px] font-mono text-slate-400">v2.4 Syariat RBAC</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                Selamat Datang
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih akses pengujian cepat di bawah atau masukkan kata sandi Anda.
              </p>
            </div>

            {/* Notifikasi Redirect / Pesan Sesi */}
            {redirectReason && (
              <div className="mx-5 sm:mx-6 mt-3 bg-amber-50 border border-amber-200 text-amber-800 p-2.5 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle size={15} className="text-amber-600 shrink-0" />
                <span>{redirectReason}</span>
              </div>
            )}

            <div className="p-5 sm:p-6 space-y-4">
              {/* Pilihan Akun Cepat Pengujian (2 Kolom Rapi) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-700">Pilih Akses Pengujian Cepat:</span>
                  <span className="text-[10px] text-slate-400">1-Klik Isi Form</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Kartu 1: Bapak Abdul Ghofar (Pemilik) */}
                  <button
                    type="button"
                    onClick={() => handleAutoFill('abdul.ghofar')}
                    className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer relative ${
                      username === 'abdul.ghofar'
                        ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-300 shadow-xs'
                        : 'bg-slate-50 hover:bg-amber-50/50 border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    {username === 'abdul.ghofar' && (
                      <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-amber-500 rounded-full flex items-center justify-center text-white text-[9px]">
                        <Check size={10} />
                      </span>
                    )}
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-5 h-5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center border border-amber-300">
                        AG
                      </div>
                      <span className="text-xs font-bold text-slate-800 leading-tight">Pak Ghofar</span>
                    </div>
                    <span className="inline-block text-[9px] font-semibold text-amber-800 bg-amber-100 border border-amber-300/60 px-1.5 py-0.2 rounded-full mb-0.5">
                      Pemilik (Owner)
                    </span>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Omzet & Verifikasi
                    </p>
                  </button>

                  {/* Kartu 2: Staf Dapur (Kitchen Staff) */}
                  <button
                    type="button"
                    onClick={() => handleAutoFill('admin')}
                    className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer relative ${
                      username === 'admin'
                        ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-300 shadow-xs'
                        : 'bg-slate-50 hover:bg-blue-50/50 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    {username === 'admin' && (
                      <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[9px]">
                        <Check size={10} />
                      </span>
                    )}
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-800 font-bold text-[10px] flex items-center justify-center border border-blue-300">
                        <ChefHat size={11} />
                      </div>
                      <span className="text-xs font-bold text-slate-800 leading-tight">Staf Dapur</span>
                    </div>
                    <span className="inline-block text-[9px] font-semibold text-blue-800 bg-blue-100 border border-blue-300/60 px-1.5 py-0.2 rounded-full mb-0.5">
                      Dapur (Kitchen)
                    </span>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Masak & Syariat
                    </p>
                  </button>
                </div>
              </div>

              {/* Pesan Kesalahan */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-xl text-xs flex items-start gap-2">
                  <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Formulir Masuk Kata Sandi Langsung */}
              <form onSubmit={handlePasswordLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Pengguna (Username)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User size={15} />
                    </div>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="abdul.ghofar atau admin"
                      disabled={isLocked || isLoading}
                      className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock size={15} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi pengelola"
                      disabled={isLocked || isLoading}
                      className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLocked || isLoading}
                  className="w-full bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-bold py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 text-xs sm:text-sm mt-1 cursor-pointer"
                >
                  {isLoading ? (
                    <span>Memverifikasi Sesi...</span>
                  ) : isLocked ? (
                    <span>Terkunci ({lockCountdown}d)</span>
                  ) : (
                    <>
                      <Lock size={15} />
                      <span>Masuk ke Dashboard Operasional</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Footer Keamanan */}
            <div className="bg-slate-50 px-5 sm:px-6 py-2.5 border-t border-slate-200/80 text-center">
              <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-600" />
                <span>Kerahasiaan data syariat dan finansial dilindungi enkripsi sesi.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
