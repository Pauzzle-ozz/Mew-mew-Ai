// Import des modules nécessaires
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Chargement des variables d'environnement
dotenv.config({ path: './src/.env', override: true });
const solutionsRoutes = require('./routes/solutions');
const portfolioRoutes = require('./routes/portfolio');
const portfolioStatsRoutes = require('./routes/portfolioStats');
const contactRoutes = require('./routes/contact');
const matcherRoutes = require('./routes/matcher');
const applicationsRoutes = require('./routes/applications');

// Création de l'application Express
const app = express();

// Port du serveur
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors()); // Permet la communication frontend <-> backend
app.use(express.json()); // Permet de lire les données JSON

// Routes des solutions IA
app.use('/api/solutions', solutionsRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/portfolio-stats', portfolioStatsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/matcher', matcherRoutes);
app.use('/api/applications', applicationsRoutes);

// Route de test (pour vérifier que le serveur fonctionne)
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ Backend fonctionne !',
    status: 'OK'
  });
});

// Route de test pour l'API
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
});