const express = require('express');
const multer = require('multer');
const Papa = require('papaparse');

const app = express();
app.use(express.static('public'));  // 'public' is the directory where your static files reside
const PORT = 3000;

// Configure multer storage
const storage = multer.memoryStorage()  // Store the file in memory
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');  // Serve your frontend HTML file
});

app.post('/upload', upload.single('csvfile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    
    const csvData = req.file.buffer.toString('utf-8');
    // Parse the CSV data to extract column names
    Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            const columnNames = Object.keys(results.data[0]);
            res.json({columns: columnNames, rows: results.data});  // Send column names to the frontend
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
