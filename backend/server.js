import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./db/mongoose.js";
import config from "./config/index.js";
import { setupMqtt } from "./mqttHandler.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { io } from "socket.io-client";
import Dashboard from "./components/Dashboard";
import DeteksiHariIni from "./components/DeteksiHariIni";
import RiwayatGrafik from "./components/RiwayatGrafik";
import Profil from "./components/Profil";
import Pengaturan from "./components/Pengaturan";
import Rekomendasi from "./components/Rekomendasi";
import Login from "./components/Login";
import {
    LayoutDashboard, LogOut, Sprout, Lightbulb, Bell, X,
    AlertTriangle, Clock, BarChart3, User, Menu, Settings
} from "lucide-react";

import { WS_URL } from "./config";

// Initialize socket outside or inside? Outside is fine but inside is safer for some react-router setups
const socket = io(WS_URL, {
    transports: ["websocket", "polling"]
});

function App() {
    const [auth, setAuth] = useState(() => {
        try {
            const token = localStorage.getItem("token");
            const userData = localStorage.getItem("user");
            if (token && userData && userData !== "undefined") {
                const user = JSON.parse(userData);
                if (user && typeof user === "object") {
                    return { token, user };
                }
            }
        } catch (err) {
            console.error("Auth Error:", err);
            localStorage.clear(); // Clear corrupted data
        }
        return null;
    });

    const [notification, setNotification] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const onAlert = (data) => {
            console.log("Hama Alert received:", data);
            setNotification(data);
        };
        socket.on("hama-alert", onAlert);
        return () => socket.off("hama-alert", onAlert);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setAuth(null);
    };

    // Auth Routing
    if (!auth) {
        return (
            <Router>
                <Routes>
                    <Route path="/login" element={<Login setAuth={setAuth} />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        );
    }

    return (
        <Router>
            <div className="min-h-screen bg-neutral-50 flex flex-col lg:flex-row font-sans text-slate-900 overflow-x-hidden">

                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-50">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-green-600 rounded-lg">
                            <Sprout className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-lg font-black text-slate-800 tracking-tighter">SiTani <span className="text-green-600 font-medium">Smart</span></h1>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Global Notification Toast */}
                {notification && (
                    <div className="fixed top-20 lg:top-6 right-4 lg:right-6 z-[100] w-[calc(100%-2rem)] md:w-96 animate-in slide-in-from-right duration-500">
                        <div className="bg-white border-2 border-red-100 rounded-[1.5rem] lg:rounded-[2rem] shadow-2xl p-4 lg:p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-red-50 rounded-xl text-red-600 animate-bounce">
                                    <AlertTriangle className="w-5 h-5 lg:w-6 lg:h-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-black text-slate-800 uppercase tracking-tighter text-xs lg:text-sm mb-1">Peringatan!</h4>
                                    <p className="text-xs font-bold text-slate-600 leading-snug">{notification.message}</p>
                                    <div className="mt-3">
                                        <Link
                                            to="/rekomendasi"
                                            onClick={() => setNotification(null)}
                                            className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:underline"
                                        >
                                            Lihat Solusi &rarr;
                                        </Link>
                                    </div>
                                </div>
                                <button onClick={() => setNotification(null)} className="p-1 text-slate-300">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sidebar Overlay (Mobile) */}
                {isSidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[55]"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`
          fixed lg:sticky top-0 left-0 h-full w-72 lg:w-80 bg-white border-r border-slate-200 p-6 lg:p-8 flex flex-col shadow-sm z-[60] transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
                    <div className="flex lg:hidden items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <Sprout className="w-6 h-6 text-green-600" />
                            <h1 className="text-xl font-black">SiTani</h1>
                        </div>
                        <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-slate-100 rounded-xl">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="hidden lg:flex items-center gap-3 mb-10">
                        <div className="p-3 bg-green-600 rounded-2xl shadow-lg shadow-green-200">
                            <Sprout className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-800 uppercase">SiTani <span className="text-green-600 font-medium lowercase">Smart</span></h1>
                    </div>

                    <nav className="space-y-2 lg:space-y-6 flex-1">
                        <NavLink to="/" icon={<LayoutDashboard size={28} />} label="Beranda (Utama)" onClick={() => setIsSidebarOpen(false)} />
                        <NavLink to="/hari-ini" icon={<Clock size={28} />} label="Hama Hari Ini" onClick={() => setIsSidebarOpen(false)} />
                        <NavLink to="/history" icon={<BarChart3 size={28} />} label="Grafik Riwayat" onClick={() => setIsSidebarOpen(false)} />
                        <NavLink to="/rekomendasi" icon={<Lightbulb size={28} />} label="Saran & Solusi" onClick={() => setIsSidebarOpen(false)} />
                        <NavLink to="/profil" icon={<User size={28} />} label="Profil Petani" onClick={() => setIsSidebarOpen(false)} />
                    </nav>

                    <button
                        onClick={handleLogout}
                        className="mt-6 lg:mt-10 flex items-center justify-center gap-3 lg:gap-4 px-6 lg:px-8 py-4 lg:py-6 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-[1.5rem] lg:rounded-[2rem] transition-all font-black text-base lg:text-xl border-2 lg:border-4 border-red-100 shadow-lg"
                    >
                        <LogOut size={28} />
                        Keluar Sistem
                    </button>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-3 md:p-6 lg:p-10 w-full overflow-hidden">
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 lg:gap-6 mb-6 lg:mb-10 bg-white/50 p-4 rounded-2xl lg:p-0 lg:bg-transparent lg:rounded-none">
                        <div>
                            <h2 className="text-[10px] lg:text-sm font-black text-green-600 uppercase tracking-widest mb-0.5 lg:mb-1">Wilayah: Karawang, Tempuran</h2>
                            <h3 className="text-xl lg:text-4xl font-black text-slate-800">Monitoring Sawah</h3>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-3 lg:gap-6">
                            <div className="p-2 lg:p-3 bg-white border border-slate-100 rounded-xl lg:rounded-2xl shadow-sm text-slate-400 cursor-pointer">
                                <Bell size={18} />
                            </div>
                            <Link to="/profil" className="flex items-center gap-2 lg:gap-4 bg-white p-1.5 pr-3 lg:p-3 lg:pr-6 rounded-xl lg:rounded-2xl shadow-sm border border-slate-100 hover:border-green-200 transition-all">
                                <div className="w-7 h-7 lg:w-10 lg:h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 border border-slate-200 uppercase text-xs lg:text-base">
                                    {auth?.user?.username ? auth.user.username[0] : '?'}
                                </div>
                                <div className="text-left">
                                    <p className="text-[7px] lg:text-[10px] text-slate-400 font-black uppercase tracking-tighter leading-none">Petani</p>
                                    <p className="text-[10px] lg:text-sm font-black text-slate-700 leading-tight">{auth?.user?.username || 'User'}</p>
                                </div>
                            </Link>
                        </div>
                    </header>

                    <div className="bg-white/30 backdrop-blur-sm rounded-xl lg:rounded-[2.5rem] min-h-[calc(100vh-14rem)] lg:min-h-[calc(100vh-12rem)] pb-6 lg:pb-10">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/hari-ini" element={<DeteksiHariIni />} />
                            <Route path="/history" element={<RiwayatGrafik />} />
                            <Route path="/rekomendasi" element={<Rekomendasi />} />
                            <Route path="/profil" element={<Profil />} />
                            <Route path="/pengaturan" element={<Pengaturan />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </Router>
    );
}

const NavLink = ({ to, icon, label, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className="flex items-center gap-4 px-4 lg:px-5 py-3 lg:py-4 text-slate-500 hover:text-green-600 hover:bg-green-50/50 rounded-xl lg:rounded-2xl transition-all font-black group text-xs lg:text-sm uppercase tracking-wider"
    >
        <span className="group-hover:rotate-6 transition-transform">{icon}</span>
        {label}
    </Link>
);

export default App;

app.use(express.json());

// connect to DB
connectDB();

// Initialize MQTT with IO instance
setupMqtt(io);

// Basic healthcheck
app.get("/", (req, res) => res.json({ ok: true, service: "iot-backend" }));

// Mount API routes (placeholders)
import authRoutes from "./src/routes/auth.routes.js";
import detectionsRoutes from "./src/routes/detections.routes.js";
import analysisRoutes from "./src/routes/analysis.routes.js";
app.use(`/api${config.apiPrefix}/auth`, authRoutes);
app.use(`/api${config.apiPrefix}/detections`, detectionsRoutes);
app.use(`/api${config.apiPrefix}/analysis`, analysisRoutes);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


