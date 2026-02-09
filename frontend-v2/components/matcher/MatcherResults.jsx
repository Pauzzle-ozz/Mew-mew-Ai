'use client';

import { downloadAllDocuments } from '@/lib/api/matcherApi';

/**
 * Composant d'affichage des résultats du Matcher
 * Affiche les 3 documents générés avec boutons de téléchargement
 */
export default function MatcherResults({ results }) {
  // Vérifie seulement que results existe
  if (!results) {
    return null;
  }

  const { personalizedCV, idealCV, coverLetter } = results;

  // Compter le nombre de documents générés
  const documentsGenerated = [personalizedCV, idealCV, coverLetter].filter(Boolean).length;

  // Télécharger un document individuel
  const downloadDocument = (base64Pdf, filename) => {
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${base64Pdf}`;
    link.download = filename;
    link.click();
  };

  // Télécharger tous les documents (seulement ceux qui ont été générés)
  const downloadAll = () => {
    const documents = [];
    if (personalizedCV?.pdf) {
      documents.push({ pdf: personalizedCV.pdf, filename: personalizedCV.filename });
    }
    if (idealCV?.pdf) {
      documents.push({ pdf: idealCV.pdf, filename: idealCV.filename });
    }
    if (coverLetter?.pdf) {
      documents.push({ pdf: coverLetter.pdf, filename: coverLetter.filename });
    }
    downloadAllDocuments(documents, 'Candidature_Complete.zip');
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-white mb-2">Documents générés avec succès !</h2>
        <p className="text-gray-400">
          {documentsGenerated === 1
            ? 'Votre document est prêt à être téléchargé'
            : `Vos ${documentsGenerated} documents sont prêts à être téléchargés`}
        </p>
      </div>

      {/* Bouton télécharger tout (seulement si plus d'un document) */}
      {documentsGenerated > 1 && (
        <div className="flex justify-center">
          <button
            onClick={downloadAll}
            className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
          >
            <span className="text-2xl">📦</span>
            <span>Télécharger tout ({documentsGenerated} fichiers)</span>
          </button>
        </div>
      )}

      {/* Liste des documents */}
      <div className={`grid grid-cols-1 gap-6 ${
        documentsGenerated === 1 ? 'md:grid-cols-1 max-w-md mx-auto' :
        documentsGenerated === 2 ? 'md:grid-cols-2' :
        'md:grid-cols-3'
      }`}>
        {/* CV Personnalisé */}
        {personalizedCV && (
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-500/30 rounded-lg p-6 space-y-4">
          <div className="text-center">
            <div className="text-5xl mb-3">📄</div>
            <h3 className="text-xl font-bold text-white mb-2">CV Personnalisé</h3>
            <p className="text-sm text-gray-400 mb-4">
              Votre CV optimisé pour cette offre
            </p>
          </div>

          {personalizedCV.pdf && (
            <button
              onClick={() => downloadDocument(personalizedCV.pdf, personalizedCV.filename)}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Télécharger PDF
            </button>
          )}

          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Contenu :</strong></p>
            <ul className="list-disc list-inside">
              <li>Expériences réorganisées</li>
              <li>Compétences clés mises en avant</li>
              <li>Résumé adapté à l'offre</li>
            </ul>
          </div>
          </div>
        )}

        {/* CV Idéal */}
        {idealCV && (
          <div className="bg-gradient-to-br from-green-600/20 to-green-900/20 border border-green-500/30 rounded-lg p-6 space-y-4">
          <div className="text-center">
            <div className="text-5xl mb-3">⭐</div>
            <h3 className="text-xl font-bold text-white mb-2">CV Idéal</h3>
            <p className="text-sm text-gray-400 mb-4">
              Le profil recherché par l'employeur
            </p>
          </div>

          {idealCV.pdf && (
            <button
              onClick={() => downloadDocument(idealCV.pdf, idealCV.filename)}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              Télécharger PDF
            </button>
          )}

          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Contenu :</strong></p>
            <ul className="list-disc list-inside">
              <li>Profil type recherché</li>
              <li>Compétences attendues</li>
              <li>Expériences idéales</li>
            </ul>
          </div>
          </div>
        )}

        {/* Lettre de Motivation */}
        {coverLetter && (
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border border-purple-500/30 rounded-lg p-6 space-y-4">
          <div className="text-center">
            <div className="text-5xl mb-3">✉️</div>
            <h3 className="text-xl font-bold text-white mb-2">Lettre de Motivation</h3>
            <p className="text-sm text-gray-400 mb-4">
              Lettre personnalisée pour l'offre
            </p>
          </div>

          {coverLetter.pdf && (
            <button
              onClick={() => downloadDocument(coverLetter.pdf, coverLetter.filename)}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
            >
              Télécharger PDF
            </button>
          )}

          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Contenu :</strong></p>
            <ul className="list-disc list-inside">
              <li>Introduction percutante</li>
              <li>Lien profil-offre</li>
              <li>Motivation personnalisée</li>
            </ul>
          </div>
          </div>
        )}
      </div>

      {/* Conseils */}
      <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <div className="text-3xl">💡</div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-yellow-500 mb-2">Conseils d'utilisation</h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>
                <strong>CV Personnalisé :</strong> Envoyez-le avec votre candidature
              </li>
              <li>
                <strong>CV Idéal :</strong> Comparez avec votre profil pour identifier les écarts et vous préparer à l'entretien
              </li>
              <li>
                <strong>Lettre :</strong> Personnalisez-la si besoin avant l'envoi (ajoutez des détails spécifiques)
              </li>
              <li>
                <strong>Important :</strong> Relisez tous les documents et adaptez-les si nécessaire !
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Stats du match */}
      {results.matchScore && (
        <div className="bg-gray-800/50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Score de matching</h4>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-700 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-600 to-purple-600 rounded-full transition-all duration-1000"
                style={{ width: `${results.matchScore}%` }}
              />
            </div>
            <span className="text-2xl font-bold text-white">{results.matchScore}%</span>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {results.matchScore >= 80 && '🎯 Excellent match ! Vous correspondez parfaitement à cette offre.'}
            {results.matchScore >= 60 && results.matchScore < 80 && '✅ Bon match ! Quelques ajustements peuvent améliorer votre candidature.'}
            {results.matchScore < 60 && '📝 Match modéré. Consultez le CV idéal pour voir les compétences manquantes.'}
          </p>
        </div>
      )}
    </div>
  );
}
