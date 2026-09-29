const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

// Melayani file statis dari folder "public"
app.use(express.static(path.join(__dirname, "public")));

// Endpoint API Geolocation
app.get("/api/lokasi", async (req, res) => {
    // Mengambil query pencarian dari URL (default jika kosong: "jakarta")
    const query = req.query.q || "jakarta";
    const apiKey = "TmW3n2IbOKaZxkghOoYB";
    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (!data.features || data.features.length === 0) {
            return res.status(404).json({
                message: "Lokasi tidak ditemukan"
            });
        }

        const feature = data.features[0];
        const coordinates = feature.geometry.coordinates; // Format: [Longitude, Latitude]
        const lng = coordinates[0];
        const lat = coordinates[1];

        // Menganalisis hirarki lokasi dari response MapTiler
        let negara = "-";
        let provinsi = "-";
        let kecamatan = "-";

        if (feature.context) {
            feature.context.forEach(item => {
                if (item.id.startsWith("country")) {
                    negara = item.text_id || item.text;
                } else if (item.id.startsWith("region") || item.id.startsWith("province")) {
                    provinsi = item.text;
                } else if (item.id.startsWith("subdistrict") || item.id.startsWith("district") || item.id.startsWith("locality")) {
                    kecamatan = item.text;
                }
            });
        }

        // Mengirimkan response JSON ke frontend
        res.json({
            lokasi: feature.text || query,
            full_address: feature.place_name || feature.text || query,
            negara: negara,
            provinsi: provinsi,
            kecamatan: kecamatan,
            longitude: lng,
            latitude: lat,
            koordinat: coordinates
        });

    } catch (error) {
        console.error("Error MapTiler API:", error.message);
        res.status(500).json({
            message: "Gagal mengambil data dari MapTiler"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});