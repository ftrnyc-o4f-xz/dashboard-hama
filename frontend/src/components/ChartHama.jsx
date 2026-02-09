// src/components/ChartHama.js
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const ChartHama = ({ data }) => {
  return (
    <div className="chart-container">
      <h3>📈 Grafik Aktivitas Hama</h3>
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="jumlah" stroke="#8884d8" name="Jumlah Hama" />
      </LineChart>
    </div>
  );
};

export default ChartHama;
