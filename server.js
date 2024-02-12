const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(cors()); // Activation de CORS
app.use(express.json()); // Permet à l'API de traiter le JSON

const port = 3000;

// Répertoire public pour stocker et servir des images
const uploadDir = 'uploads/';

// Vérifiez si le répertoire 'uploads' existe, sinon créez-le
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configuration de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Nom du fichier : date actuelle + nom original
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Routes
// Route POST pour uploader une image
app.post('/upload', upload.single('image'), (req, res) => {
    res.send({
        message: 'Image uploaded successfully!',
        fileInfo: req.file
    });
});

// Route GET pour afficher toutes les images
app.get('/images', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            res.status(500).send({
                message: 'Unable to scan images directory!',
                error: err
            });
        } else {
            const images = files.map(file => path.join(req.protocol + '://' + req.get('host'), uploadDir, file));
            res.send(images);
        }
    });
});


app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Site en Construction</title>
    </head>
    <body>
        <h1>Le site est en construction.</h1>
    </body>
    </html>
    `);
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});