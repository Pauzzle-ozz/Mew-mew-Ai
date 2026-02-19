// Import des modules nécessaires
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// Chargement des variables d'environnement
dotenv.config({ path: './src/.env', override: true });

// Validation des variables d'environnement requises
const requiredEnvVars = ['OPENAI_API_KEY', 'SUPABASE_URL', 'SUPABASE_SERVICE_KEY'];
const missingVars = requiredEnvVars.filter(key => !process.env[key]);
if (missingVars.length > 0) {
  console.error(`\n❌ Variables d'environnement manquantes : ${missingVars.join(', ')}`);
  console.error('   Vérifiez votre fichier backend/src/.env\n');
  process.exit(1);
}

const solutionsRoutes = require('./routes/solutions');
const portfolioRoutes = require('./routes/portfolio');
const portfolioStatsRoutes = require('./routes/portfolioStats');
const contactRoutes = require('./routes/contact');
const matcherRoutes = require('./routes/matcher');
const applicationsRoutes = require('./routes/applications');
const candidatureSpontaneeRoutes = require('./routes/candidatureSpontanee');
const redacteurRoutes = require('./routes/redacteur');
const strategieRoutes = require('./routes/strategie');
const veilleRoutes = require('./routes/veille');
const concurrenceRoutes = require('./routes/concurrence');
const performanceRoutes = require('./routes/performance');
const seoRoutes = require('./routes/seo');

// Création de l'application Express
const app = express();

// Port du serveur
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // Permet de lire les données JSON

// Rate limiting pour les routes IA (protection crédits OpenAI)
const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requêtes par fenêtre de 15 min par IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Trop de requêtes. Veuillez réessayer dans quelques minutes.'
  }
});

// Routes des solutions IA
app.use('/api/solutions', aiRateLimiter, solutionsRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/portfolio-stats', portfolioStatsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/matcher', aiRateLimiter, matcherRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/candidature-spontanee', aiRateLimiter, candidatureSpontaneeRoutes);
app.use('/api/marketing/redacteur', aiRateLimiter, redacteurRoutes);
app.use('/api/marketing/strategie', aiRateLimiter, strategieRoutes);
app.use('/api/marketing/veille', aiRateLimiter, veilleRoutes);
app.use('/api/marketing/concurrence', aiRateLimiter, concurrenceRoutes);
app.use('/api/marketing/performance', aiRateLimiter, performanceRoutes);
app.use('/api/marketing/seo', aiRateLimiter, seoRoutes);

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