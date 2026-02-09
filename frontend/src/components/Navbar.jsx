export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-primary">🌿 SmartFarm Dashboard</h1>
      <ul className="flex gap-6 text-gray-600 font-medium">
        <li className="hover:text-primary cursor-pointer">Dashboard</li>
        <li className="hover:text-primary cursor-pointer">Riwayat</li>
        <li className="hover:text-primary cursor-pointer">Rekomendasi</li>
      </ul>
    </nav>
  );
}
