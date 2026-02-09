import React, { useEffect, useState } from "react";
import axios from "axios";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, Bug, History, Lightbulb, AlertCircle, RefreshCw, Calendar, Clock, TrendingUp } from "lucide-react";

import { API_URL } from "../config";

export default function Dashboard() {
  const [dataLog, setDataLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const response = await axios.get(`${API_URL}/api/v1/detections`);

      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setDataLog(response.data.data);
        setError(null);
      } else {
        // Jika data tidak valid, tetap gunakan array kosong agar tidak crash
        setDataLog([]);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      if (dataLog.length === 0) {
        setError("Tidak dapat memuat data. Pastikan Backend & Database sudah aktif.");
      }
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => fetchData(false), 15000);
    return () => clearInterval(interval);
  }, []);

  // Safety checks for statistics
  const safeData = Array.isArray(dataLog) ? dataLog : [];
  const totalHama = safeData.reduce((acc, curr) => acc + (Number(curr?.jumlah) || 0), 0);
  const uniqueHama = [...new Set(safeData.map((d) => d?.jenis_hama).filter(Boolean))].length;

  const getRekomendasi = () => {
    if (safeData.length === 0) return "Menunggu data sensor masuk...";
    const latest = safeData[0];
    if (latest && latest.jumlah > 10) return "Bahaya! Populasi hama sangat tinggi.";
    return "Kondisi lahan saat ini terpantau aman.";
  };

  if (error && dataLog.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-12">
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-red-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative p-8 bg-white rounded-[2.5rem] shadow-2xl shadow-red-100 border border-red-50">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
        </div>
        <h3 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Koneksi Terputus</h3>
        <p className="text-slate-400 font-bold max-w-sm mx-auto mb-10 leading-relaxed uppercase text-xs tracking-[0.2em]">
          Belum bisa mengambil data dari server. <br />Pastikan backend & database sudah online.
        </p>
        <button
          onClick={() => fetchData(true)}
          className="group flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-2xl"
        >
          <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
          Coba Hubungkan Lagi
        </button>
      </div>
    );
  }

  if (loading && dataLog.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
        <div className="relative">
          <div className="w-24 h-24 border-[6px] border-slate-100 border-t-green-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="w-8 h-8 text-slate-200" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs animate-pulse">Menghubungkan ke IoT...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-10 animate-in fade-in duration-700">
      {/* Big Status Banner for Elderly Ease */}
      <div className={`p-5 lg:p-10 rounded-2xl lg:rounded-[3rem] shadow-xl border-4 ${safeData.length > 0 && safeData[0].jumlah > 10 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} transition-all`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 lg:gap-6">
            <div className={`p-3 lg:p-6 rounded-2xl lg:rounded-3xl ${safeData.length > 0 && safeData[0].jumlah > 10 ? 'bg-red-600 text-white' : 'bg-green-600 text-white'} shadow-lg animate-pulse`}>
              <Activity className="w-8 h-8 lg:w-16 lg:h-16" />
            </div>
            <div>
              <p className="text-[10px] lg:text-sm font-black uppercase tracking-widest text-slate-400 mb-1 leading-none">Status Sawah:</p>
              <h2 className={`text-2xl lg:text-6xl font-black leading-none ${safeData.length > 0 && safeData[0].jumlah > 10 ? 'text-red-600' : 'text-green-700'}`}>
                {safeData.length > 0 && safeData[0].jumlah > 10 ? 'BAHAYA!' : 'AMAN'}
              </h2>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-md p-4 lg:p-6 rounded-2xl lg:rounded-[2rem] border border-white shadow-inner max-w-md w-full">
            <h4 className="text-[10px] lg:text-sm font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" /> Saran Petani:
            </h4>
            <p className="text-sm lg:text-lg font-bold text-slate-700 leading-snug">
              {getRekomendasi()}
            </p>
          </div>
        </div>
      </div>

      {/* Main Stats with Big Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-10">
        <StatCard
          icon={<Bug className="w-6 h-6 lg:w-10 lg:h-10" />}
          title="Ada Berapa Jenis?"
          value={uniqueHama}
          subtitle="Jenis Hama"
          color="bg-amber-50 text-amber-600 border-amber-200"
        />
        <StatCard
          icon={<Activity className="w-6 h-6 lg:w-10 lg:h-10" />}
          title="Total Terlihat"
          value={totalHama}
          subtitle="Ekor Hama"
          color="bg-emerald-50 text-emerald-600 border-emerald-200"
        />
        <StatCard
          icon={<History className="w-6 h-6 lg:w-10 lg:h-10" />}
          title="Laporan Masuk"
          value={dataLog.length}
          subtitle="Catatan"
          color="bg-blue-50 text-blue-600 border-blue-200"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
        {/* Real-time Chart - Simplified for elderly */}
        <div className="lg:col-span-2 bg-white p-5 lg:p-10 rounded-2xl lg:rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 lg:mb-12 gap-2">
            <div>
              <h3 className="text-lg lg:text-3xl font-black text-slate-800 tracking-tight leading-none">Grafik Naik Turun Hama</h3>
              <p className="text-[10px] lg:text-sm font-bold text-slate-400 uppercase mt-1 tracking-widest">Melihat hama setiap waktu</p>
            </div>
          </div>

          {dataLog.length > 0 ? (
            <div className="h-[220px] lg:h-[450px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[...safeData].reverse()}>
                  <defs>
                    <linearGradient id="colorJumlah" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="waktu_deteksi"
                    tickFormatter={(tick) => {
                      try {
                        return new Date(tick).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      } catch {
                        return tick;
                      }
                    }}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '0.75rem' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="jumlah"
                    stroke="#059669"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorJumlah)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[200px] flex flex-col items-center justify-center bg-slate-50 border-4 border-dashed border-slate-200 rounded-2xl">
              <AlertCircle className="w-12 h-12 text-slate-300 mb-2" />
              <p className="text-base text-slate-500 font-black">Belum ada data</p>
            </div>
          )}
        </div>

        {/* Recent Activity Log - More Readable */}
        <div className="bg-white p-5 lg:p-10 rounded-2xl lg:rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col h-[400px] lg:h-auto">
          <h3 className="text-lg lg:text-3xl font-black text-slate-800 mb-6 lg:mb-10 flex items-center gap-3">
            Hama Terbaru
          </h3>
          <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            {safeData.length > 0 ? (
              safeData.slice(0, 10).map((log, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 lg:p-6 hover:bg-slate-50 rounded-xl lg:rounded-[2rem] transition-all border-l-4 lg:border-l-8 border-green-500 bg-green-50/30">
                  <div className="p-2 lg:p-4 bg-white rounded-xl shadow-md">
                    <Bug className="w-5 h-5 lg:w-8 lg:h-8 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-black text-slate-800 text-sm lg:text-xl truncate leading-none">{log.jenis_hama}</p>
                      <span className="shrink-0 text-[10px] lg:text-lg bg-green-600 text-white font-black px-2 lg:px-4 py-1 lg:py-1.5 rounded-full shadow-lg">
                        {log.jumlah}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <p className="text-[9px] lg:text-sm text-slate-500 font-bold uppercase tracking-wider">
                        {new Date(log.waktu_deteksi).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                <History className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-base font-black italic opacity-50">Kosong</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle, color }) {
  return (
    <div className={`bg-white p-5 lg:p-10 rounded-2xl lg:rounded-[2.5rem] border-2 border-slate-100 shadow-xl transition-all hover:scale-[1.02] bg-gradient-to-b from-white to-slate-50/50`}>
      <div className="flex items-center gap-3 lg:gap-6 mb-4 lg:mb-8">
        <div className={`p-3 lg:p-5 rounded-xl lg:rounded-3xl ${color} shadow-inner`}>
          {icon}
        </div>
        <h3 className="font-black text-slate-500 text-[10px] lg:text-lg uppercase tracking-widest leading-none">{title}</h3>
      </div>
      <div>
        <p className="text-4xl lg:text-7xl font-black text-slate-800 mb-1 leading-none">{value}</p>
        <p className="text-[10px] lg:text-xl font-black text-slate-400 uppercase tracking-tighter opacity-80 leading-none">{subtitle}</p>
      </div>
    </div>
  );
}

