import mqtt from "mqtt";
import Detection from "./src/models/detection.model.js";

const AMBANG_BATAS = 10;

export const setupMqtt = (io) => {
  const client = mqtt.connect(process.env.MQTT_URL || "mqtt://broker.emqx.io:1883");
  const topic = process.env.MQTT_TOPIC || "iot/hama/tempuran_smart_farm_99";

  client.on("connect", () => {
    console.log("📡 MQTT Connected");
    client.subscribe(topic, (err) => {
      if (!err) console.log(`📥 Subscribed to topic: ${topic}`);
    });
  });

  client.on("message", async (t, message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log("Data diterima:", data);

      // 1. Simpan ke database (Validasi dan Simpan Sesuai Class Diagram)
      const payload = {
        ...data,
        waktu_deteksi: data.waktu || new Date()
      };
      const saveData = await Detection.simpanData(payload);


      // 2. Beritahu dashboard untuk refresh data (Real-time update)
      io.emit("new-detection", data);

      // 3. Cek Ambang Batas (Sesuai AD Notifikasi)
      if (data.jumlah > AMBANG_BATAS) {
        console.log("⚠️ Melebihi ambang batas! Mengirim notifikasi...");
        io.emit("hama-alert", {
          message: `🚨 PERINGATAN! Populasi ${data.jenis_hama} terdeteksi ${data.jumlah} ekor. Segera periksa lahan!`,
          data: data
        });
      }
    } catch (err) {
      console.error("⚠️ Error parsing/saving data:", err);
    }
  });
};

