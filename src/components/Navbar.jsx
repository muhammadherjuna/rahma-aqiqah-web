// src/components/Navbar.jsx
import { NavLink, Link } from 'react-router-dom';
import { Home, ClipboardList, Search, MapPin, Phone } from 'lucide-react';

export default function Navbar() {
  const publicNavLinks = [
    { to: '/', label: 'Beranda & Katalog', Icon: Home },
    { to: '/kalkulator', label: 'Kalkulator & Pesan', Icon: ClipboardList },
    { to: '/lacak', label: 'Lacak Pesanan', Icon: Search },
  ];

  return (
    <header className="bg-emerald-700 shadow-lg sticky top-0 z-50">
      {/* Top Bar Informasi Kontak */}
      <div className="bg-emerald-800 px-4 py-1">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-200">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <MapPin size={12} />
              Jl. Cincin Kota, Karangsari, Kebumen (Barat SMAN 2 Kebumen)
            </span>
            <span className="flex items-center gap-1.5">
              <Phone size={12} />
              WA: 0815 7873 3874
            </span>
          </div>
          <span className="text-amber-300 font-semibold">Masakan Lezat dan Sesuai Syariat</span>
        </div>
      </div>

      {/* Brand & Navigasi Publik */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-amber-400 rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="white" strokeWidth="1.5">
              <path d="M12 3C9 3 7 5 7 7.5c0 1.5.7 2.8 1.8 3.6C6.5 12 5 14 5 16.5c0 2.5 1.5 4.5 3.5 5H15.5c2-.5 3.5-2.5 3.5-5 0-2.5-1.5-4.5-3.8-5.4C16.3 10.3 17 9 17 7.5 17 5 15 3 12 3z" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9.5" cy="7.5" r="1" fill="white" stroke="none"/>
            </svg>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">
              Rahma Aqiqah <span className="text-amber-300">Kebumen</span>
            </h1>
            <p className="text-emerald-200 text-xs">Jagonya Aqiqah Siap Saji</p>
          </div>
        </Link>

        {/* Tab Navigasi Khusus Publik (Hanya 3 Fitur Pelanggan, Tab Admin telah dipisahkan) */}
        <nav className="flex flex-wrap gap-1.5">
          {publicNavLinks.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-400 text-emerald-950 shadow-md font-bold'
                    : 'text-emerald-100 hover:bg-emerald-600 hover:text-white'
                }`
              }
            >
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
