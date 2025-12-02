const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'patient.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serves index.html from the public folder

// Helper: Read Data
const readData = () => {
    if (!fs.existsSync(DATA_FILE)) {
        return []; // Return empty array if file doesn't exist
    }
    const data = fs.readFileSync(DATA_FILE);
    try {
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Helper: Write Data
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// --- ROUTES ---

// Get all patients
app.get('/api/patients', (req, res) => {
    const data = readData();
    res.json(data);
});

// Update/Save all patients (Auto-save)
app.post('/api/patients', (req, res) => {
    const newData = req.body;
    if (!Array.isArray(newData)) {
        return res.status(400).json({ error: 'Data must be an array' });
    }
    writeData(newData);
    console.log(`[${new Date().toLocaleTimeString()}] Data synced to patient.json`);
    res.json({ success: true });
});

// Start Server
app.listen(PORT, () => {
    console.log(`GlucoReminder Server running at http://localhost:${PORT}`);
    console.log(`- Data file: ${DATA_FILE}`);
});