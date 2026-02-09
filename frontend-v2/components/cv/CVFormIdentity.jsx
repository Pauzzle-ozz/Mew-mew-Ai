export default function CVFormIdentity({ data, onChange }) {
  const inputStyles = "px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors";

  return (
    <div>
      <h3 className="text-xl font-bold text-text-primary mb-4">Identite</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Prenom *"
          value={data.prenom}
          onChange={(e) => onChange('prenom', e.target.value)}
          className={inputStyles}
        />
        <input
          type="text"
          placeholder="Nom *"
          value={data.nom}
          onChange={(e) => onChange('nom', e.target.value)}
          className={inputStyles}
        />
        <input
          type="text"
          placeholder="Titre du poste recherche *"
          value={data.titre_poste}
          onChange={(e) => onChange('titre_poste', e.target.value)}
          className={`${inputStyles} md:col-span-2`}
        />
        <input
          type="email"
          placeholder="Email *"
          value={data.email}
          onChange={(e) => onChange('email', e.target.value)}
          className={inputStyles}
        />
        <input
          type="tel"
          placeholder="Telephone"
          value={data.telephone}
          onChange={(e) => onChange('telephone', e.target.value)}
          className={inputStyles}
        />
        <input
          type="text"
          placeholder="Adresse (ville)"
          value={data.adresse}
          onChange={(e) => onChange('adresse', e.target.value)}
          className={inputStyles}
        />
        <input
          type="text"
          placeholder="LinkedIn (optionnel)"
          value={data.linkedin}
          onChange={(e) => onChange('linkedin', e.target.value)}
          className={inputStyles}
        />
      </div>
    </div>
  );
}
