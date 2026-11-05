// src/pages/LoginAdmin.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldCheck, Lock, User, KeyRound, Phone, ArrowLeft,
  AlertCircle, CheckCircle, Eye, EyeOff, Send, Clock
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
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      {/* Tombol Kembali ke Website Pelanggan */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center text-sm">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Beranda Publik
        </Link>
        <span className="text-slate-500 text-xs font-mono">Keamanan Sesi v2.1</span>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Header Portal */}
        <div className="bg-gradient-to-br from-emerald-800 to-emerald-700 p-6 text-white text-center relative">
          <div className="w-14 h-14 bg-emerald-600/60 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-emerald-400/40 shadow-inner">
            <ShieldCheck size={28} className="text-amber-300" />
          </div>
          <h2 className="text-xl font-bold leading-snug">Portal Masuk Pengelola</h2>
          <p className="text-emerald-100 text-xs mt-1">
            Rahma Aqiqah Kebumen &middot; Akses Khusus Manajemen Operasional
          </p>
        </div>

        {/* Notifikasi Redirect / Pesan Sesi */}
        {redirectReason && (
          <div className="m-4 mb-0 bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
            <span>{redirectReason}</span>
          </div>
        )}

        <div className="p-6">
          {/* Pilihan Metode Masuk */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('password');
                setErrorMessage('');
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'password'
                  ? 'bg-white text-emerald-800 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound size={14} />
              Kata Sandi
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('otp');
                setErrorMessage('');
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'otp'
                  ? 'bg-white text-emerald-800 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Phone size={14} />
              OTP WhatsApp
            </button>
          </div>

          {/* Pesan Kesalahan */}
          {errorMessage && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
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
                    placeholder="Contoh: abdul.ghofar"
                    disabled={isLocked || isLoading}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all disabled:opacity-60"
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
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLocked || isLoading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 text-sm mt-2"
              >
                {isLoading ? (
                  <span>Memverifikasi Sesi...</span>
                ) : isLocked ? (
                  <span>Terkunci ({lockCountdown}d)</span>
                ) : (
                  <>
                    <Lock size={16} /> Masuk ke Dashboard Operasional
                  </>
                )}
              </button>
            </form>
          )}

          {/* Form Mode 2: OTP WhatsApp */}
          {authMode === 'otp' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800">
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
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm"
                >
                  <Send size={16} /> Kirim Kode OTP WhatsApp
                </button>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3">
                  {/* Simulasi banner kode OTP (agar penguji dapat langsung mencoba) */}
                  <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs text-amber-900">
                    <p className="font-semibold text-amber-950 flex items-center gap-1.5">
                      <CheckCircle size={14} className="text-amber-600" /> Simulasi Pesan Masuk WhatsApp:
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
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl transition-all shadow-md disabled:opacity-50 text-sm"
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
                        className="text-xs text-emerald-700 font-semibold hover:underline"
                      >
                        Kirim Ulang Kode OTP
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Kotak Demonstrasi Cepat untuk Tim Penguji */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <p className="text-[11px] text-slate-500 font-medium mb-2">
              Akun Demonstrasi Pengelola:
            </p>
            <div className="space-y-1.5">
              {ADMIN_CREDENTIALS.map((acc) => (
                <button
                  key={acc.username}
                  type="button"
                  onClick={() => {
                    setAuthMode('password');
                    handleAutoFill(acc);
                  }}
                  className="w-full text-left text-xs bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 p-2 rounded-lg transition-colors flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-slate-800">{acc.nama}</span>
                    <span className="text-slate-500 text-[10px] ml-1">({acc.peran})</span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    Gunakan
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Card */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-500">
            Kerahasiaan data syariat dan operasional dilindungi sistem autentikasi aman.
          </p>
        </div>
      </div>
    </div>
  );
}
