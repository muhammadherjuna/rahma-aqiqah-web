// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import BerandaKatalog from './pages/BerandaKatalog';
import KalkulatorPesan from './pages/KalkulatorPesan';
import LacakPesanan from './pages/LacakPesanan';
import LoginAdmin from './pages/LoginAdmin';
import DashboardAdmin from './pages/DashboardAdmin';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import { PESANAN_INIT } from './data/mockData';
import { getAllOrders } from './lib/supabaseClient';

// Layout Publik untuk Antarmuka Pelanggan (Hanya menampilkan navigasi publik)
function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  const [pesananList, setPesananList] = useState(PESANAN_INIT);
  const [isLoading, setIsLoading] = useState(true);

  // Ambil data pesanan langsung dari Supabase saat aplikasi dimuat
  const refreshOrders = async () => {
    setIsLoading(true);
    const data = await getAllOrders();
    setPesananList(data);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshOrders();
  }, []);

  const handlePesanBerhasil = (pesananBaru) => {
    setPesananList((prev) => [pesananBaru, ...prev]);
    refreshOrders();
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Rute Publik Pelanggan */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<BerandaKatalog />} />
          <Route
            path="/kalkulator"
            element={<KalkulatorPesan onPesanBerhasil={handlePesanBerhasil} />}
          />
          <Route
            path="/lacak"
            element={<LacakPesanan pesananList={pesananList} onRefresh={refreshOrders} />}
          />
        </Route>

        {/* Rute Autentikasi Pengelola Terpisah */}
        <Route path="/admin/login" element={<LoginAdmin />} />

        {/* Rute Khusus Dashboard Admin yang Terproteksi Sesi */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <DashboardAdmin
                pesananList={pesananList}
                setPesananList={setPesananList}
                onRefresh={refreshOrders}
                isLoadingOrders={isLoading}
              />
            </ProtectedAdminRoute>
          }
        />

        {/* Fallback Navigasi */}
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
