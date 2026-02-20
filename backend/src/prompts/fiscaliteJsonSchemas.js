/**
 * Prompts de conversion JSON pour les outils Fiscalite
 * Chaque fonction prend le texte genere et retourne un prompt pour la conversion JSON
 */

function auditFiscalToJSON(generatedText) {
  return `Tu vas recevoir un audit fiscal complet genere par un expert-comptable.

Ta mission est de transformer cet audit en JSON STRICT.

Regles obligatoires :
- Reponds UNIQUEMENT avec du JSON valide
- Aucun texte explicatif, aucun Markdown
- Toutes les cles doivent etre presentes meme si certaines valeurs sont vides

Structure JSON attendue :

{
  "score_conformite": 0,
  "profil": {
    "type": "",
    "statut": "",
    "regime_tva": "",
    "regime_imposition": ""
  },
  "diagnostics": [
    {
      "categorie": "",
      "statut": "conforme",
      "detail": "",
      "impact_financier": "",
      "action_corrective": ""
    }
  ],
  "optimisations": [
    {
      "titre": "",
      "description": "",
      "economie_estimee": "",
      "difficulte": "facile",
      "reference_legale": ""
    }
  ],
  "alertes_critiques": [],
  "resume_executif": ""
}

Consignes specifiques :
- score_conformite est un entier entre 0 et 100
- categorie dans diagnostics : "TVA", "IS/IR", "Charges", "Cotisations", "Amortissements", "Obligations declaratives"
- statut dans diagnostics : "conforme", "alerte", "erreur"
- difficulte dans optimisations : "facile", "moyen", "complexe"
- economie_estimee au format "X EUR/an" ou "X EUR"
- alertes_critiques : tableau de strings, uniquement les points urgents
- resume_executif : synthese en 3-5 phrases

Voici l'audit a transformer :

${generatedText}`;
}

function declarationToJSON(generatedText) {
  return `Tu vas recevoir la preparation d'une declaration fiscale.

Ta mission est de transformer ce contenu en JSON STRICT.

Regles obligatoires :
- Reponds UNIQUEMENT avec du JSON valide
- Aucun texte explicatif, aucun Markdown

Structure JSON attendue :

{
  "type_declaration": "",
  "periode": "",
  "champs": [
    {
      "case": "",
      "libelle": "",
      "montant": 0,
      "calcul": ""
    }
  ],
  "montant_total": 0,
  "informations_manquantes": [],
  "anomalies": [],
  "points_vigilance": [],
  "recommandations": [],
  "date_limite": "",
  "penalite_retard": ""
}

Consignes :
- montant et montant_total sont des nombres (pas de strings)
- champs est le detail case par case de la declaration
- anomalies : problemes detectes dans les donnees
- date_limite au format "JJ/MM/AAAA"

Voici la declaration a transformer :

${generatedText}`;
}

function calendrierToJSON(generatedText) {
  return `Tu vas recevoir un calendrier fiscal personnalise.

Ta mission est de transformer ce contenu en JSON STRICT.

Regles obligatoires :
- Reponds UNIQUEMENT avec du JSON valide
- Aucun texte explicatif, aucun Markdown

Structure JSON attendue :

{
  "echeances": [
    {
      "date_limite": "2026-01-15",
      "declaration": "",
      "formulaire": "",
      "documents_necessaires": [],
      "rappels": ["J-30", "J-15", "J-7"],
      "penalite_retard": "",
      "montant_estime": ""
    }
  ],
  "prochaine_echeance": {
    "date_limite": "",
    "declaration": "",
    "jours_restants": 0
  },
  "resume": "",
  "conseils_organisation": []
}

Consignes :
- echeances triees par date croissante
- date_limite au format "YYYY-MM-DD"
- prochaine_echeance : la plus proche dans le futur
- jours_restants : nombre entier
- conseils_organisation : 3-5 conseils pratiques

Voici le calendrier a transformer :

${generatedText}`;
}

function controleToJSON(generatedText) {
  return `Tu vas recevoir une preparation de controle fiscal.

Ta mission est de transformer ce contenu en JSON STRICT.

Regles obligatoires :
- Reponds UNIQUEMENT avec du JSON valide
- Aucun texte explicatif, aucun Markdown

Structure JSON attendue :

{
  "niveau_risque": 0,
  "risque_label": "",
  "montant_potentiel_redressement": "",
  "checklist_conformite": [
    {
      "point": "",
      "statut": "ok",
      "detail": "",
      "action": ""
    }
  ],
  "documents_a_preparer": [],
  "points_vigilance": [],
  "droits_contribuable": [],
  "conseils_preparation": [],
  "facteurs_risque": [],
  "facteurs_attenuants": []
}

Consignes :
- niveau_risque : entier entre 0 et 100
- risque_label : "faible", "modere", "eleve", "critique"
- statut dans checklist : "ok", "attention", "non_conforme"
- Tous les tableaux doivent contenir au moins 1 element

Voici la preparation a transformer :

${generatedText}`;
}

function questionToJSON(generatedText) {
  return `Tu vas recevoir la reponse d'un expert fiscal a une question.

Ta mission est de transformer cette reponse en JSON STRICT.

Regles obligatoires :
- Reponds UNIQUEMENT avec du JSON valide
- Aucun texte explicatif, aucun Markdown

Structure JSON attendue :

{
  "reponse": "",
  "points_cles": [],
  "references_legales": [],
  "exemples": [],
  "risques": [],
  "prochaines_etapes": []
}

Consignes :
- reponse : la reponse complete et detaillee
- points_cles : 3-5 points essentiels a retenir
- references_legales : articles de loi cites (format "Article XXX du CGI")
- exemples : exemples chiffres si pertinents
- risques : risques ou pieges a eviter

Voici la reponse a transformer :

${generatedText}`;
}

function simulateurToJSON(generatedText) {
  return `Tu vas recevoir une simulation de strategie juridique et fiscale.

Ta mission est de transformer cette simulation en JSON STRICT.

Regles obligatoires :
- Reponds UNIQUEMENT avec du JSON valide
- Aucun texte explicatif, aucun Markdown

Structure JSON attendue :

{
  "situation_actuelle_analyse": {
    "statut": "",
    "regime_fiscal": "",
    "charge_fiscale_totale": "",
    "taux_effectif": "",
    "points_forts": [],
    "points_faibles": []
  },
  "comparaison_regimes": [
    {
      "statut": "",
      "regime": "",
      "impot_societe": "",
      "cotisations_sociales": "",
      "ir_dirigeant": "",
      "charge_totale": "",
      "economie_vs_actuel": "",
      "avantages": [],
      "inconvenients": [],
      "recommande": false
    }
  ],
  "optimisation_remuneration": {
    "mix_optimal": {
      "salaire": "",
      "dividendes": "",
      "avantages_nature": "",
      "per_deductible": ""
    },
    "economie_totale": ""
  },
  "projections": {
    "annee_1": {
      "ca_estime": "",
      "charge_fiscale": "",
      "taux_effectif": ""
    },
    "annee_3": {
      "ca_estime": "",
      "charge_fiscale": "",
      "taux_effectif": ""
    },
    "annee_5": {
      "ca_estime": "",
      "charge_fiscale": "",
      "taux_effectif": ""
    }
  },
  "seuils_critiques": [
    {
      "seuil": "",
      "impact": "",
      "echeance_estimee": "",
      "action_recommandee": ""
    }
  ],
  "recommandation_finale": {
    "statut_recommande": "",
    "justification": "",
    "plan_action": [],
    "cout_transformation": "",
    "calendrier": ""
  }
}

Consignes :
- Tous les montants au format "X EUR" ou "X EUR/an"
- taux_effectif au format "X%"
- recommande : un seul regime doit avoir true
- comparaison_regimes doit contenir au moins 3 scenarios
- plan_action : etapes concretes dans l'ordre chronologique

Voici la simulation a transformer :

${generatedText}`;
}

module.exports = {
  auditFiscalToJSON,
  declarationToJSON,
  calendrierToJSON,
  controleToJSON,
  questionToJSON,
  simulateurToJSON
};
