/**
 * Composant CVFormIdentity
 * Formulaire pour l'identité du candidat
 */

export default function CVFormIdentity({ data, onChange }) {
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">Identité</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Prénom *"
          value={data.prenom}
          onChange={(e) => onChange('prenom', e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Nom *"
          value={data.nom}
          onChange={(e) => onChange('nom', e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Titre du poste recherché *"
          value={data.titre_poste}
          onChange={(e) => onChange('titre_poste', e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
        />
        <input
          type="email"
          placeholder="Email *"
          value={data.email}
          onChange={(e) => onChange('email', e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="tel"
          placeholder="Téléphone"
          value={data.telephone}
          onChange={(e) => onChange('telephone', e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Adresse (ville)"
          value={data.adresse}
          onChange={(e) => onChange('adresse', e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="LinkedIn (optionnel)"
          value={data.linkedin}
          onChange={(e) => onChange('linkedin', e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}