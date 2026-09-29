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

        
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});