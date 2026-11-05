// src/pages/LoginAdmin.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldCheck, Lock, User, KeyRound, Phone, ArrowLeft,
  AlertCircle, CheckCircle, Eye, EyeOff, Send, Clock,
  Award, Calendar, ChefHat, Sparkles, Check
} from 'lucide-react';
import {
  ADMIN_CREDENTIALS,
  getAdminSession,
  setAdminSession,
  verifyCredentials
} from '../utils/auth';

export default function LoginAdmin() {
  const navigate = useNavigate();
  const location = useLocation();

  // Tab login: 'password' atau 'otp'
  const [authMode, setAuthMode] = useState('password');

  // Form password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form OTP
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [countdown, setCountdown] = useState(0);

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

  // Countdown timer untuk kirim ulang OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

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

  // Kirim simulasi OTP WhatsApp
  const handleSendOtp = () => {
    if (countdown > 0) return;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    setCountdown(60);
    setErrorMessage('');
  };

  // Verifikasi OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (inputOtp.trim() !== generatedOtp) {
      setErrorMessage('Kode OTP tidak sesuai. Pastikan memasukkan 6 digit yang benar.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // Login sebagai Bp. Abdul Ghofar jika via WhatsApp
      const user = ADMIN_CREDENTIALS[0];
      setAdminSession(user);
      navigate('/admin', { replace: true });
      setIsLoading(false);
    }, 400);
  };

  // Auto-fill untuk demonstrasi pengujian
  const handleAutoFill = (acc) => {
    setUsername(acc.username);
    setPassword(acc.password);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col lg:flex-row">
      {/* Sisi Kiri: Branding & Nilai Syariat (Split Screen Hero) */}
      <div className="w-full lg:w-[48%] xl:w-[45%] bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 text-white p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-emerald-700/50">
        {/* Ornamen Latar Geometris Syariat */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Top Header di Sisi Kiri */}
        <div className="relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-emerald-200 hover:text-white bg-emerald-800/60 hover:bg-emerald-700/70 border border-emerald-600/40 px-3.5 py-1.5 rounded-full transition-all backdrop-blur-sm"
          >
            <ArrowLeft size={15} />
            <span>Kembali ke Beranda Publik</span>
          </Link>

          <div className="mt-8 sm:mt-12">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-amber-400/30 mb-4">
              <Sparkles size={13} />
              <span>Sistem Manajemen Aqiqah Syariat</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Rahma Aqiqah Kebumen
            </h1>
            <p className="text-emerald-200 text-sm sm:text-base mt-2 font-light leading-relaxed">
              Masakan Lezat dan Sesuai Syariat &mdash; Jagonya Aqiqah Siap Saji di Kebumen dan Sekitarnya.
            </p>
          </div>
        </div>

        {/* 3 Nilai Utama Sistem (Pillar Showcase) */}
        <div className="my-8 sm:my-10 space-y-4 relative z-10">
          <div className="bg-emerald-900/60 backdrop-blur-md border border-emerald-700/40 rounded-2xl p-4 transition-all hover:bg-emerald-800/60">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0 text-amber-300">
                <Award size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">100% Sesuai Syariat Islam</h3>
                <p className="text-xs text-emerald-200/90 mt-0.5 leading-relaxed">
                  Penyembelihan oleh juru sembelih syar'i bersertifikat, dokumentasi video doa, dan sertifikat resmi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-900/60 backdrop-blur-md border border-emerald-700/40 rounded-2xl p-4 transition-all hover:bg-emerald-800/60">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-400/20 border border-blue-400/40 flex items-center justify-center shrink-0 text-blue-300">
                <Calendar size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Anti-Overbooking System</h3>
                <p className="text-xs text-emerald-200/90 mt-0.5 leading-relaxed">
                  Kapasitas harian dibatasi maksimal 5 ekor per hari demi menjaga kelezatan rasa & ketepatan jam antar.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-900/60 backdrop-blur-md border border-emerald-700/40 rounded-2xl p-4 transition-all hover:bg-emerald-800/60">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center shrink-0 text-emerald-300">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Pemisahan Hak Akses (RBAC)</h3>
                <p className="text-xs text-emerald-200/90 mt-0.5 leading-relaxed">
                  Pemisahan aman antara wewenang finansial pemilik dan alur operasional produksi staf dapur.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Sisi Kiri: Kutipan Amanah Pengelola */}
        <div className="relative z-10 pt-4 border-t border-emerald-800/80">
          <p className="text-xs italic text-emerald-200/80 leading-relaxed">
            &ldquo;Amanah aqiqah buah hati adalah ibadah seumur hidup. Setiap tahapan kami tunaikan dengan doa dan ketulusan.&rdquo;
          </p>
          <p className="text-xs font-semibold text-amber-300 mt-1">
            Bapak Abdul Ghofar &middot; Pengelola Rahma Aqiqah
          </p>
        </div>
      </div>

      {/* Sisi Kanan: Formulir Masuk & Pemilih Akun Cepat */}
      <div className="w-full lg:w-[52%] xl:w-[55%] bg-slate-50 flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          {/* Card Form */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
            {/* Header Form */}
            <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Portal Masuk Pengelola
                </span>
                <span className="text-[11px] font-mono text-slate-400">v2.4 Syariat RBAC</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                Selamat Datang
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Silakan pilih akun demonstrasi di bawah atau masukkan kredensial Anda.
              </p>
            </div>

            {/* Notifikasi Redirect / Pesan Sesi */}
            {redirectReason && (
              <div className="mx-6 sm:mx-8 mt-4 bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-2xl text-xs flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-600 shrink-0" />
                <span>{redirectReason}</span>
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-6">
              {/* Kotak Demonstrasi Cepat (Quick Role Selector - 2 Kolom) */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-slate-700">Pilih Akses Pengujian Cepat:</span>
                  <span className="text-[10px] text-slate-400">1-Klik Isi Form</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Kartu 1: Bapak Abdul Ghofar (Pemilik) */}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('password');
                      handleAutoFill(ADMIN_CREDENTIALS[0]);
                    }}
                    className={`text-left p-3 rounded-2xl border transition-all cursor-pointer relative ${
                      username === 'abdul.ghofar'
                        ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-300 shadow-sm'
                        : 'bg-slate-50/80 hover:bg-amber-50/40 border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    {username === 'abdul.ghofar' && (
                      <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-white text-[10px]">
                        <Check size={11} />
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center border border-amber-300">
                        AG
                      </div>
                      <span className="text-xs font-bold text-slate-800">Pak Abdul Ghofar</span>
                    </div>
                    <span className="inline-block text-[10px] font-semibold text-amber-800 bg-amber-100/70 border border-amber-300/60 px-2 py-0.5 rounded-full mb-1">
                      Akses Pemilik (Owner)
                    </span>
                    <p className="text-[10px] text-slate-500 line-clamp-2">
                      Omzet, keuangan, verifikasi pelunasan, & kendali kuota.
                    </p>
                  </button>

                  {/* Kartu 2: Staf Dapur (Kitchen Staff) */}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('password');
                      handleAutoFill(ADMIN_CREDENTIALS[1]);
                    }}
                    className={`text-left p-3 rounded-2xl border transition-all cursor-pointer relative ${
                      username === 'admin'
                        ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-300 shadow-sm'
                        : 'bg-slate-50/80 hover:bg-blue-50/40 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    {username === 'admin' && (
                      <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px]">
                        <Check size={11} />
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center border border-blue-300">
                        <ChefHat size={14} />
                      </div>
                      <span className="text-xs font-bold text-slate-800">Staf Produksi Dapur</span>
                    </div>
                    <span className="inline-block text-[10px] font-semibold text-blue-800 bg-blue-100/70 border border-blue-300/60 px-2 py-0.5 rounded-full mb-1">
                      Akses Dapur (Kitchen)
                    </span>
                    <p className="text-[10px] text-slate-500 line-clamp-2">
                      Antrean masak, tiket dapur, & dokumentasi syariat.
                    </p>
                  </button>
                </div>
              </div>

              {/* Pilihan Metode Masuk */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('password');
                    setErrorMessage('');
                  }}
                  className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    authMode === 'password'
                      ? 'bg-white text-emerald-800 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <KeyRound size={14} />
                  <span>Kata Sandi</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('otp');
                    setErrorMessage('');
                  }}
                  className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    authMode === 'otp'
                      ? 'bg-white text-emerald-800 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Phone size={14} />
                  <span>OTP WhatsApp</span>
                </button>
              </div>

              {/* Pesan Kesalahan */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-2xl text-xs flex items-start gap-2.5">
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form Mode 1: Kata Sandi */}
              {authMode === 'password' && (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Nama Pengguna (Username)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User size={16} />
                      </div>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Contoh: abdul.ghofar atau admin"
                        disabled={isLocked || isLoading}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-60"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Kata Sandi
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock size={16} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan kata sandi pengelola"
                        disabled={isLocked || isLoading}
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-60"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLocked || isLoading}
                    className="w-full bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 text-sm mt-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <span>Memverifikasi Sesi...</span>
                    ) : isLocked ? (
                      <span>Terkunci ({lockCountdown}d)</span>
                    ) : (
                      <>
                        <Lock size={16} />
                        <span>Masuk ke Dashboard Operasional</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Form Mode 2: OTP WhatsApp */}
              {authMode === 'otp' && (
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-800">
                    <p className="font-semibold mb-0.5">Nomor Terdaftar:</p>
                    <p className="font-mono text-emerald-950 font-bold">0815 7873 3874 (Bapak Abdul Ghofar)</p>
                    <p className="text-emerald-700 mt-1">
                      Kode verifikasi 6 digit akan dikirim ke akun WhatsApp pengelola resmi.
                    </p>
                  </div>

                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
                    >
                      <Send size={16} />
                      <span>Kirim Kode OTP WhatsApp</span>
                    </button>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-3">
                      {/* Simulasi banner kode OTP (agar penguji dapat langsung mencoba) */}
                      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 text-xs text-amber-900">
                        <p className="font-semibold text-amber-950 flex items-center gap-1.5">
                          <CheckCircle size={14} className="text-amber-600" />
                          <span>Simulasi Pesan Masuk WhatsApp:</span>
                        </p>
                        <p className="mt-1">
                          Kode verifikasi Anda adalah:{' '}
                          <span className="font-mono font-bold text-base text-emerald-800 bg-white px-2 py-0.5 rounded border border-amber-200">
                            {generatedOtp}
                          </span>
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Masukkan 6 Digit Kode OTP
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={inputOtp}
                          onChange={(e) => setInputOtp(e.target.value.replace(/\D/g, ''))}
                          placeholder="Contoh: 482910"
                          className="w-full text-center tracking-widest font-mono text-lg py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={inputOtp.length !== 6 || isLoading}
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl transition-all shadow-md disabled:opacity-50 text-sm cursor-pointer"
                      >
                        {isLoading ? 'Memverifikasi...' : 'Verifikasi & Buka Dashboard'}
                      </button>

                      <div className="text-center pt-1">
                        {countdown > 0 ? (
                          <span className="text-xs text-slate-500 flex items-center justify-center gap-1">
                            <Clock size={12} /> Kirim ulang dalam {countdown} detik
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            className="text-xs text-emerald-700 font-semibold hover:underline cursor-pointer"
                          >
                            Kirim Ulang Kode OTP
                          </button>
                        )}
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Footer Card */}
            <div className="bg-slate-50 px-6 sm:px-8 py-3.5 border-t border-slate-200/80 text-center">
              <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Kerahasiaan data syariat dan finansial dilindungi enkripsi sesi aman.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
