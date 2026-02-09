import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { History, Search, Download, Filter, Calendar, Bug, AlertCircle, TrendingUp, ChevronRight } from "lucide-react";
import { API_URL } from "../config";

export default function HistoryPanen() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      // Mengambil lebih banyak data untuk riwayat (limit 100)
      const response = await axios.get(`${API_URL}/api/v1/detections`);
      if (response.data.success) {
        setHistoryData(response.data.data);
      }
    } catch (err) {
      setError("Gagal mengambil data historis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Mengolah data menjadi format grafik (mengelompokkan per jam/hari)
  // Di sini kita ambil 10 data terbaru untuk bar chart agar tidak penuh
  const chartData = [...historyData].slice(0, 10).reverse().map(item => ({
    name: new Date(item.waktu_deteksi).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    jumlah: item.jumlah,
    rawDate: item.waktu_deteksi
  }));


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold animate-pulse">Memuat riwayat historis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-700">
      {/* Header View */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[100px] -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <History className="w-6 h-6 text-green-400" />
            </div>
            <h2 className="text-3xl font-black">Riwayat & Grafik Hama</h2>
          </div>
          <p className="text-slate-400 max-w-2xl font-medium">
            Analisis data historis untuk memantau tren serangan hama di lahan pertanian Anda.
            Gunakan data ini untuk perencanaan pengendalian yang lebih efektif.
          </p>
        </div>
      </div>

      {historyData.length > 0 ? (
        <>
          {/* Grafik Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-800">Visualisasi Frekuensi</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase mt-1">10 Deteksi Terakhir</p>
                </div>
                <div className="p-2 bg-green-50 text-green-600 rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                    />
                    <Tooltip
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '1.25rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="jumlah" radius={[10, 10, 0, 0]} barSize={40}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.jumlah > 10 ? '#ef4444' : '#10b981'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-center text-center">
              <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-amber-600 shadow-inner">
                <AlertCircle className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-black text-slate-800 mb-2">Insight Mingguan</h4>
              <p className="text-slate-500 text-sm font-medium px-4">
                Berdasarkan grafik, aktivitas hama paling tinggi tercatat pada pukul
                <span className="font-extrabold text-slate-800 ml-1 italic">
                  {chartData.sort((a, b) => b.jumlah - a.jumlah)[0]?.name || '--:--'}
                </span>.
                Pastikan pengawasan ditingkatkan pada jam tersebut.
              </p>
            </div>
          </div>

          {/* Table View */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                <Filter className="w-5 h-5 text-slate-400" /> Daftar Riwayat Lengkap
              </h3>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-colors">
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto px-4 pb-4">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">
                    <th className="p-6">Informasi Hama</th>
                    <th className="p-6">Tanggal & Waktu</th>
                    <th className="p-6 text-center">Status Lahan</th>
                    <th className="p-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {historyData.map((log, i) => (
                    <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                            <Bug className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{log.jenis_hama}</p>
                            <p className="text-xs font-bold text-green-600">{log.jumlah} Ekor Terdeteksi</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                          <Calendar className="w-4 h-4 text-slate-300" />
                          {new Date(log.waktu_deteksi).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                          <span className="text-slate-300 mx-1">|</span>
                          {new Date(log.waktu_deteksi).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td className="p-6">
                        <div className="flex justify-center">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${log.jumlah > 10 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                            }`}>
                            {log.jumlah > 10 ? 'Bahaya' : 'Normal'}
                          </span>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-200 p-20 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-12 h-12 text-slate-300" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-2">Data Tidak Tersedia</h3>
          <p className="text-slate-400 font-medium max-w-sm">
            Sistem belum menemukan data historis deteksi hama. Pastikan perangkat IoT telah aktif untuk mulai merekam data.
          </p>
        </div>
      )}
    </div>
  );
}

