import mqtt from "mqtt";

const client = mqtt.connect("mqtt://broker.emqx.io:1883");
const topic = "iot/hama/tempuran_smart_farm_99";

const pests = ["Burung", "Wereng", "Tikus"];

client.on("connect", () => {
    console.log("🚀 MQTT Simulator Started");

    // Send data every 5 seconds
    setInterval(() => {
        const dummyData = {
            jenis_hama: pests[Math.floor(Math.random() * pests.length)],
            jumlah: Math.floor(Math.random() * 20) + 1, // Random 1-20
            lokasi: "Sawah Blok A",
            waktu: new Date().toISOString()
        };

        console.log("📤 Sending data:", dummyData);
        client.publish(topic, JSON.stringify(dummyData));
    }, 5000);
});
