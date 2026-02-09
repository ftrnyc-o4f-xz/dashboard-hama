import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Lightbulb, CheckCircle2, ChevronRight, AlertCircle, Sprout, ShieldCheck, Bug, Info, ArrowUpRight, History, Clock } from "lucide-react";
import { API_URL } from "../config";

export default function Rekomendasi() {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/v1/analysis`);
            if (response.data.success) {
                setRecommendations(response.data.data);
            }
        } catch (err) {
            setError("Gagal memuat rekomendasi.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendations();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-400 font-bold animate-pulse tracking-wider">Menganalisis data lahan...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 lg:space-y-10 animate-in fade-in duration-700">
            {/* Header Premium - Responsive */}
            <div className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl lg:rounded-[3.5rem] p-6 lg:p-14 text-white shadow-2xl">
                <div className="absolute top-0 right-0 -m-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -m-20 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 lg:gap-10">
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-white/20 backdrop-blur-md rounded-full text-[8px] lg:text-xs font-black uppercase tracking-widest mb-4 lg:mb-6 leading-none">
                            <Sprout className="w-3 h-3 lg:w-4 lg:h-4" /> Saran Pintar SiTani
                        </div>
                        <h2 className="text-xl lg:text-5xl font-black mb-2 lg:mb-4 leading-none">Solusi Pengendalian</h2>
                        <p className="text-green-50 text-[10px] lg:text-xl font-bold max-w-2xl leading-snug">
                            Langkah-langkah yang harus Bapak/Ibu lakukan <br className="hidden lg:block" /> sesuai kondisi sawah saat ini.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/hari-ini')}
                        className="w-full md:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border-2 border-white/30 text-white px-6 lg:px-10 py-4 lg:py-6 rounded-xl lg:rounded-[2rem] font-black text-sm lg:text-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95"
                    >
                        <Clock className="w-5 h-5 lg:w-8 lg:h-8" /> CEK ULANG
                    </button>
                </div>
            </div>

            {recommendations && recommendations.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10">
                    {recommendations.map((rec, i) => (
                        <div
                            key={i}
                            className={`group relative overflow-hidden p-6 lg:p-10 rounded-2xl lg:rounded-[2.5rem] border-2 transition-all hover:shadow-2xl ${rec.warna}`}
                        >
                            <div className="flex items-start justify-between mb-6 lg:mb-10">
                                <div className="p-3 lg:p-5 bg-white rounded-xl lg:rounded-3xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="w-6 h-6 lg:w-10 lg:h-10 text-emerald-600" />
                                </div>
                                <span className="flex items-center gap-1 text-[8px] lg:text-sm font-black uppercase tracking-widest bg-white/50 px-3 lg:px-5 py-1 lg:py-2 rounded-full border border-current leading-none">
                                    Penting: {rec.tingkat}
                                </span>
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-lg lg:text-3xl font-black mb-2 lg:mb-4 leading-none">Hama: {rec.hama || "Umum"}</h3>
                                <p className="text-sm lg:text-xl font-bold leading-snug mb-6 lg:mb-8 text-slate-700/80">
                                    {rec.tindakan}
                                </p>
                                <div className="flex items-center gap-3 lg:gap-6">
                                    <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 py-3 lg:py-5 px-6 lg:px-10 bg-white rounded-xl lg:rounded-3xl text-[10px] lg:text-lg font-black uppercase tracking-widest shadow-md hover:shadow-xl active:scale-95 transition-all text-slate-800 border-b-4 border-slate-100">
                                        CARA LENGKAP <ArrowUpRight className="w-4 h-4" />
                                    </button>
                                    <button className="p-3 lg:p-5 bg-white/30 rounded-xl lg:rounded-3xl hover:bg-white/50 transition-colors">
                                        <History className="w-5 h-5 lg:w-8 lg:h-8" />
                                    </button>
                                </div>
                            </div>

                            {/* Background Icon Watermark */}
                            <Bug className="absolute -bottom-4 -right-4 w-24 h-24 lg:w-40 lg:h-40 opacity-5 pointer-events-none" />
                        </div>
                    ))}

                    <div className="lg:col-span-2 flex justify-center py-6 lg:py-12">
                        <button
                            onClick={() => navigate('/hari-ini')}
                            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 text-white px-10 py-5 lg:py-8 rounded-2xl lg:rounded-[3rem] font-black text-sm lg:text-2xl shadow-2xl flex items-center justify-center gap-4 transition-all hover:scale-105 active:scale-95 group leading-none"
                        >
                            <Clock className="w-6 h-6 lg:w-10 lg:h-10 text-green-400 group-hover:rotate-12 transition-transform" />
                            KEMBALI KE PENGECEKAN
                        </button>
                    </div>

                    {/* Tips Tambahan - Optimized for Mobile */}
                    <div className="lg:col-span-2 bg-slate-800 rounded-2xl lg:rounded-[3.5rem] p-6 lg:p-14 text-white flex flex-col md:flex-row items-center gap-6 lg:gap-14 border border-slate-700 shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.1),transparent)] pointer-events-none"></div>
                        <div className="w-16 h-16 lg:w-28 lg:h-28 bg-green-500/20 rounded-2xl lg:rounded-[2.5rem] flex items-center justify-center shrink-0 border border-green-500/30">
                            <Lightbulb className="w-8 h-8 lg:w-16 lg:h-16 text-green-400" />
                        </div>
                        <div className="flex-1 relative z-10 text-center md:text-left">
                            <h4 className="text-lg lg:text-3xl font-black mb-2 lg:mb-4 leading-none">Tips Bapak/Ibu Petani</h4>
                            <p className="text-slate-400 font-bold text-xs lg:text-xl leading-snug mb-6 lg:mb-10 italic opacity-80 decoration-green-500/30">
                                "Pencegahan lebih baik dari pengobatan. Pastikan area sekitar pematang sawah bersih dari semak belukar yang bisa menjadi sarang persembunyian tikus."
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 lg:gap-10">
                                <div className="flex items-center gap-2 lg:gap-3">
                                    <CheckCircle2 className="w-4 h-4 lg:w-7 lg:h-7 text-green-500" />
                                    <span className="text-[10px] lg:text-lg font-black text-slate-200 uppercase tracking-widest">Cek Sensor</span>
                                </div>
                                <div className="flex items-center gap-2 lg:gap-3">
                                    <CheckCircle2 className="w-4 h-4 lg:w-7 lg:h-7 text-green-500" />
                                    <span className="text-[10px] lg:text-lg font-black text-slate-200 uppercase tracking-widest">Update IOT</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Sesuai Diagram: Alur "Tidak memenuhi rule / Belum ada rekomendasi" */
                <div className="bg-white rounded-2xl lg:rounded-[4rem] border-4 border-dashed border-slate-100 p-10 lg:p-32 text-center shadow-inner">
                    <div className="w-20 h-20 lg:w-40 lg:h-40 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 lg:mb-10 shadow-inner border border-slate-50">
                        <Info className="w-10 h-10 lg:w-20 lg:h-20 text-slate-200" />
                    </div>
                    <h3 className="text-xl lg:text-5xl font-black text-slate-800 mb-3 lg:mb-6 tracking-tight leading-none">Belum Ada Solusi</h3>
                    <p className="text-slate-400 text-sm lg:text-2xl font-bold max-w-md mx-auto leading-snug mb-8 lg:mb-14">
                        Alhamdulillah, saat ini belum ada aktivitas hama yang berbahaya. Sawah Bapak/Ibu terpantau aman.
                    </p>
                    <button
                        onClick={fetchRecommendations}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 lg:px-14 py-4 lg:py-7 bg-green-600 text-white rounded-xl lg:rounded-[2.5rem] font-black uppercase tracking-widest shadow-xl shadow-green-100 hover:scale-105 active:scale-95 transition-all text-sm lg:text-2xl border-b-4 lg:border-b-8 border-green-800"
                    >
                        REFRESH ANALISIS <ChevronRight className="w-5 h-5 lg:w-8 lg:h-8" />
                    </button>
                </div>
            )}
        </div>
    );
}
