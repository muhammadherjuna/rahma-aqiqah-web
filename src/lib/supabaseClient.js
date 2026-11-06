// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import { KUOTA_JADWAL_INIT, PESANAN_INIT } from '../data/mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sekdwegjlfbtrttdfvny.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNla2R3ZWdqbGZidHJ0dGRmdm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1MTQxNjAsImV4cCI6MjEwOTA5MDE2MH0.u5yWsb2mNuBiSj0_BdNOyLCcmkd_JwkaFV9M7ynOWQA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Mengambil daftar kuota harian dari tabel rahma_daily_quotas
 */
export async function getDailyQuotas() {
  try {
    const { data, error } = await supabase
      .from('rahma_daily_quotas')
      .select('*')
      .order('tanggal', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('Menggunakan fallback kuota lokal:', error?.message);
      return KUOTA_JADWAL_INIT;
    }
    return data;
  } catch (err) {
    console.error('Gagal mengambil kuota dari Supabase:', err);
    return KUOTA_JADWAL_INIT;
  }
}

/**
 * Memperbarui kuota harian (misal: Owner mengunci tanggal libur / membuka kuota)
 */
export async function updateDailyQuota(tanggal, updates) {
  try {
    const { data, error } = await supabase
      .from('rahma_daily_quotas')
      .update(updates)
      .eq('tanggal', tanggal)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Gagal update kuota harian:', err);
    return { success: false, error: err.message };
  }
}

// Helper normalisasi dokumen syariat (bisa array atau object dari Supabase 1-to-1 relation)
function normalizeSyariat(doc) {
  if (!doc) return null;
  const item = Array.isArray(doc) ? (doc.length > 0 ? doc[0] : null) : doc;
  if (!item || !item.foto_penyembelihan) return null;
  return {
    fotoPenyembelihan: item.foto_penyembelihan,
    videoUrl: item.video_url,
    sertifikat: item.sertifikat ?? true,
    catatanSyariat: item.catatan_syariat || '',
  };
}

/**
 * Mengambil semua pesanan beserta dokumentasi syariat
 */
export async function getAllOrders() {
  try {
    const { data: orders, error: orderError } = await supabase
      .from('rahma_orders')
      .select(`
        id, nama_anak, nama_ortu, bin_binti, tgl_lahir, jenis_kelamin,
        jumlah_ekor, paket_id, menu_daging, menu_jeroan, nasi_box_id,
        jumlah_box, tgl_produksi, sesi, catatan, pembayaran,
        status_pembayaran, status_operasional, total_harga, bukti_transfer_url, no_wa,
        rahma_syariat_docs (
          id, foto_penyembelihan, video_url, sertifikat, catatan_syariat
        )
      `)
      .order('created_at', { ascending: false });

    if (orderError || !orders || orders.length === 0) {
      console.warn('Menggunakan fallback pesanan lokal:', orderError?.message);
      return PESANAN_INIT;
    }

    // Normalisasi struktur agar sesuai dengan state frontend
    return orders.map((o) => {
      const syariat = normalizeSyariat(o.rahma_syariat_docs);

      return {
        id: o.id,
        namaAnak: o.nama_anak,
        namaOrtu: o.nama_ortu,
        binBinti: o.bin_binti,
        tglLahir: o.tgl_lahir,
        jenisKelamin: o.jenis_kelamin,
        jumlahEkor: o.jumlah_ekor,
        paketId: o.paket_id,
        menuDaging: o.menu_daging,
        menuJeroan: o.menu_jeroan,
        nasiBoxId: o.nasi_box_id,
        jumlahBox: o.jumlah_box,
        tglProduksi: o.tgl_produksi,
        sesi: o.sesi,
        catatan: o.catatan || '',
        pembayaran: o.pembayaran,
        statusPembayaran: o.status_pembayaran,
        statusOperasional: o.status_operasional,
        totalHarga: Number(o.total_harga),
        buktiTransfer: o.bukti_transfer_url,
        noWa: o.no_wa || '',
        syariat,
      };
    });
  } catch (err) {
    console.error('Gagal mengambil daftar pesanan:', err);
    return PESANAN_INIT;
  }
}

/**
 * Mencari pesanan berdasarkan Nomor Invoice untuk Pelanggan (Lacak Pesanan)
 */
export async function getOrderById(invoiceId) {
  try {
    const cleanId = invoiceId.trim();
    const { data, error } = await supabase
      .from('rahma_orders')
      .select(`
        id, nama_anak, nama_ortu, bin_binti, tgl_lahir, jenis_kelamin,
        jumlah_ekor, paket_id, menu_daging, menu_jeroan, nasi_box_id,
        jumlah_box, tgl_produksi, sesi, catatan, pembayaran,
        status_pembayaran, status_operasional, total_harga, bukti_transfer_url, no_wa,
        rahma_syariat_docs (
          id, foto_penyembelihan, video_url, sertifikat, catatan_syariat
        )
      `)
      .ilike('id', cleanId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const syariat = normalizeSyariat(data.rahma_syariat_docs);

    return {
      id: data.id,
      namaAnak: data.nama_anak,
      namaOrtu: data.nama_ortu,
      binBinti: data.bin_binti,
      tglLahir: data.tgl_lahir,
      jenisKelamin: data.jenis_kelamin,
      jumlahEkor: data.jumlah_ekor,
      paketId: data.paket_id,
      menuDaging: data.menu_daging,
      menuJeroan: data.menu_jeroan,
      nasiBoxId: data.nasi_box_id,
      jumlahBox: data.jumlah_box,
      tglProduksi: data.tgl_produksi,
      sesi: data.sesi,
      catatan: data.catatan || '',
      pembayaran: data.pembayaran,
      statusPembayaran: data.status_pembayaran,
      statusOperasional: data.status_operasional,
      totalHarga: Number(data.total_harga),
      buktiTransfer: data.bukti_transfer_url,
      noWa: data.no_wa || '',
      syariat,
    };
  } catch (err) {
    console.error('Gagal melacak pesanan:', err);
    return null;
  }
}

/**
 * Menyimpan pesanan baru secara atomic menggunakan Stored Procedure
 * Dilengkapi Row-Level Locking untuk pencegahan overbooking
 */
export async function createOrder(orderData) {
  try {
    const { data, error } = await supabase.rpc('book_aqiqah_order', {
      p_id: orderData.id,
      p_nama_anak: orderData.namaAnak,
      p_nama_ortu: orderData.namaOrtu,
      p_bin_binti: orderData.binBinti,
      p_tgl_lahir: orderData.tglLahir,
      p_jenis_kelamin: orderData.jenisKelamin,
      p_jumlah_ekor: orderData.jumlahEkor,
      p_paket_id: orderData.paketId,
      p_menu_daging: orderData.menuDaging,
      p_menu_jeroan: orderData.menuJeroan,
      p_nasi_box_id: orderData.nasiBoxId,
      p_jumlah_box: orderData.jumlahBox,
      p_tgl_produksi: orderData.tglProduksi,
      p_sesi: orderData.sesi,
      p_catatan: orderData.catatan || '',
      p_pembayaran: orderData.pembayaran,
      p_status_pembayaran: orderData.statusPembayaran,
      p_total_harga: orderData.totalHarga,
      p_bukti_transfer_url: orderData.buktiTransfer || null,
      p_no_wa: orderData.noWa || null,
    });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (err) {
    console.error('Gagal membuat pesanan di Supabase:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Memperbarui status operasional pesanan dari Dashboard Admin
 */
export async function updateOrderStatus(orderId, newStatus) {
  try {
    const { error } = await supabase
      .from('rahma_orders')
      .update({
        status_operasional: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Gagal update status pesanan:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Memperbarui status pembayaran pesanan dari Dashboard Admin (misal: 'DP 50% Lunas' -> 'Lunas 100%')
 */
export async function updatePaymentStatus(orderId, newPaymentStatus) {
  try {
    const { error } = await supabase
      .from('rahma_orders')
      .update({
        status_pembayaran: newPaymentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Gagal update status pembayaran:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Menyimpan atau memperbarui dokumentasi syariat pesanan
 */
export async function upsertSyariatDoc(orderId, syariatData) {
  try {
    const { error } = await supabase
      .from('rahma_syariat_docs')
      .upsert(
        {
          order_id: orderId,
          foto_penyembelihan: syariatData.fotoPenyembelihan,
          video_url: syariatData.videoUrl,
          sertifikat: syariatData.sertifikat ?? true,
          catatan_syariat: syariatData.catatanSyariat,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'order_id' }
      );

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Gagal menyimpan dokumentasi syariat:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Mengunggah file (bukti transfer / foto syariat) langsung ke Supabase Storage (bucket: rahma-media)
 */
export async function uploadFileToStorage(file, folder = 'general') {
  try {
    const fileExt = file.name ? file.name.split('.').pop() : 'jpg';
    const cleanFolder = folder.replace(/^\/+|\/+$/g, '');
    const uniqueName = `${cleanFolder}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('rahma-media')
      .upload(uniqueName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.warn('Gagal upload ke Supabase Storage, menggunakan representasi data URL:', error.message);
      throw error;
    }

    const { data: publicData } = supabase.storage
      .from('rahma-media')
      .getPublicUrl(uniqueName);

    return {
      success: true,
      publicUrl: publicData.publicUrl,
      path: uniqueName,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
}
