/**
 * Composant AnalyzerForm
 * Formulaire structuré pour l'analyse de CV
 */

export default function AnalyzerForm({ formData, onChange, onSubmit, processing }) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      
      {/* Identité */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          👤 Identité
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            name="prenom"
            placeholder="Prénom *"
            value={formData.prenom}
            onChange={onChange}
            required
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            name="nom"
            placeholder="Nom *"
            value={formData.nom}
            onChange={onChange}
            required
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Expérience */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          💼 Expérience professionnelle
        </h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <select
              name="niveau_experience"
              value={formData.niveau_experience}
              onChange={onChange}
              className="px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="Junior">Junior (0-2 ans)</option>
              <option value="Confirmé">Confirmé (3-5 ans)</option>
              <option value="Senior">Senior (5-10 ans)</option>
              <option value="Expert">Expert (10+ ans)</option>
            </select>

            <input
              type="number"
              name="annees_experience"
              placeholder="Années d'expérience"
              value={formData.annees_experience}
              onChange={onChange}
              className="px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>

          <select
            name="statut"
            value={formData.statut}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          >
            <option value="En recherche active">En recherche active</option>
            <option value="Ouvert aux opportunités">Ouvert aux opportunités</option>
            <option value="En poste">En poste</option>
          </select>

          <textarea
            name="experience"
            rows={4}
            placeholder="Décris ton parcours professionnel..."
            value={formData.experience}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Compétences */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🛠️ Compétences
        </h3>
        <div className="space-y-4">
          <textarea
            name="competences_principales"
            rows={3}
            placeholder="Compétences principales (ex: JavaScript, React, Python...)"
            value={formData.competences_principales}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />

          <textarea
            name="outils"
            rows={2}
            placeholder="Outils et technologies maîtrisés..."
            value={formData.outils}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />

          <textarea
            name="soft_skills"
            rows={2}
            placeholder="Soft skills (ex: Leadership, Communication...)"
            value={formData.soft_skills}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Objectifs */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🎯 Objectifs
        </h3>
        <div className="space-y-4">
          <input
            type="text"
            name="secteur_preferentiel"
            placeholder="Secteur préférentiel (ex: Tech, Santé, Finance...)"
            value={formData.secteur_preferentiel}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />

          <input
            type="text"
            name="type_poste"
            placeholder="Type de poste recherché *"
            value={formData.type_poste}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Bouton submit */}
      <button
        type="submit"
        disabled={processing}
        className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? '🔄 Analyse en cours...' : '🚀 Analyser mon profil'}
      </button>
    </form>
  );
}