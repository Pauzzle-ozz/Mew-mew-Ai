'use client'
import { useState, useRef, useEffect } from 'react'

function TagInput({ value, onChange, placeholder }) {
  const [input, setInput] = useState('')
  const tags = value ? value.split(',').map(t => t.trim()).filter(Boolean) : []

  const addTag = () => {
    const tag = input.trim()
    if (!tag) return
    onChange([...tags, tag].join(', '))
    setInput('')
  }
  const removeTag = (i) => onChange(tags.filter((_, idx) => idx !== i).join(', '))

  return (
    <div className="border border-border rounded-lg bg-surface-elevated p-2.5 min-h-[56px]">
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {tags.map((tag, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              • {tag}
              <button type="button" onClick={() => removeTag(i)} className="text-primary/50 hover:text-error ml-0.5 text-sm leading-none">×</button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() } }}
          placeholder={tags.length === 0 ? placeholder : 'Ajouter…'}
          className="flex-1 text-xs text-text-primary bg-transparent outline-none placeholder-text-muted min-w-0"
        />
        {input && (
          <button type="button" onClick={addTag} className="text-xs text-primary hover:text-primary font-semibold whitespace-nowrap px-2 py-1 bg-primary/10 rounded-md">↵ Ajouter</button>
        )}
      </div>
      {tags.length === 0 && <p className="text-xs text-text-muted mt-1 opacity-60">Appuie sur Entrée ou virgule pour valider chaque élément</p>}
    </div>
  )
}

const BLOCK_COLORS = [
  { label: 'Transparent', value: 'transparent' },
  { label: 'Blanc', value: '#ffffff' },
  { label: 'Gris clair', value: '#f8fafc' },
  { label: 'Bleu clair', value: '#dbeafe' },
  { label: 'Vert clair', value: '#dcfce7' },
  { label: 'Jaune', value: '#fef9c3' },
  { label: 'Rose clair', value: '#fce7f3' },
  { label: 'Violet clair', value: '#ede9fe' },
]

const BORDER_RADII = [
  { value: 'none', label: 'Carré' },
  { value: 'small', label: 'Petit' },
  { value: 'medium', label: 'Moyen' },
  { value: 'large', label: 'Grand' },
]

const BORDER_STYLES = [
  { value: 'none', label: 'Aucun' },
  { value: 'left_accent', label: 'Barre gauche' },
  { value: 'full_border', label: 'Bordure' },
  { value: 'shadow', label: 'Ombre' },
]

function ColorPicker({ value, onChange }) {
  return (
    <div className="flex gap-1.5 flex-wrap mt-2">
      {BLOCK_COLORS.map(c => (
        <button
          key={c.value}
          title={c.label}
          onClick={() => onChange(c.value)}
          className={`w-6 h-6 rounded-full border-2 transition-all ${value === c.value ? 'border-primary scale-110' : 'border-border'}`}
          style={{ background: c.value === 'transparent' ? 'repeating-conic-gradient(#e5e7eb 0% 25%, white 0% 50%) 0 0 / 8px 8px' : c.value }}
        />
      ))}
    </div>
  )
}

function BlockStyleOptions({ style, onStyleChange }) {
  return (
    <div className="space-y-3 pt-3 border-t border-border mt-3">
      <div>
        <div className="text-xs text-text-muted mb-1">Couleur de fond</div>
        <ColorPicker value={style.bgColor || 'transparent'} onChange={v => onStyleChange('bgColor', v)} />
      </div>
      <div>
        <div className="text-xs text-text-muted mb-1">Arrondis des coins</div>
        <div className="flex gap-1.5">
          {BORDER_RADII.map(r => (
            <button key={r.value} onClick={() => onStyleChange('borderRadius', r.value)}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium border-2 transition-all ${(style.borderRadius || 'none') === r.value ? 'border-primary bg-primary/10 text-primary' : 'border-border text-text-muted hover:border-primary/40'}`}>
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="text-xs text-text-muted mb-1">Style de cadre</div>
        <div className="flex gap-1.5 flex-wrap">
          {BORDER_STYLES.map(b => (
            <button key={b.value} onClick={() => onStyleChange('borderStyle', b.value)}
              className={`flex-1 min-w-fit py-1.5 px-2 rounded-md text-xs font-medium border-2 transition-all ${(style.borderStyle || 'none') === b.value ? 'border-primary bg-primary/10 text-primary' : 'border-border text-text-muted hover:border-primary/40'}`}>
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ------ Bloc Identité ------
function IdentityBlock({ data, style, onChange, onStyleChange, isOpen, onToggle }) {
  const [photoEnabled, setPhotoEnabled] = useState(!!data.photo)
  const fileRef = useRef(null)

  const handlePhotoFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { alert('Image max 2 Mo'); return }
    const reader = new FileReader()
    reader.onload = () => onChange('photo', reader.result)
    reader.readAsDataURL(file)
  }

  const togglePhoto = (enabled) => {
    setPhotoEnabled(enabled)
    if (!enabled) onChange('photo', null)
  }

  return (
    <div className="bg-surface rounded-xl border-2 border-border overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-elevated"
        onClick={onToggle}
        style={{ borderLeft: '4px solid #6366f1' }}
      >
        <div className="flex items-center gap-3">
          {data.photo
            ? <img src={data.photo} alt="photo" className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-border" />
            : <span className="text-xl">👤</span>
          }
          <div>
            <div className="font-bold text-text-primary text-sm">Identité</div>
            <div className="text-xs text-text-muted">{data.prenom} {data.nom} · {data.titre_poste}</div>
          </div>
        </div>
        <span className="text-text-muted text-lg">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className="p-5 border-t border-border space-y-3" style={{ background: style.bgColor && style.bgColor !== 'transparent' ? style.bgColor : undefined }}>
          <div className="grid md:grid-cols-2 gap-3">
            <input placeholder="Prénom *" value={data.prenom || ''} onChange={e => onChange('prenom', e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary text-sm outline-none" />
            <input placeholder="Nom *" value={data.nom || ''} onChange={e => onChange('nom', e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary text-sm outline-none" />
            <input placeholder="Titre du poste *" value={data.titre_poste || ''} onChange={e => onChange('titre_poste', e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary text-sm outline-none md:col-span-2" />
            <input placeholder="Email *" value={data.email || ''} onChange={e => onChange('email', e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary text-sm outline-none" />
            <input placeholder="Téléphone" value={data.telephone || ''} onChange={e => onChange('telephone', e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary text-sm outline-none" />
            <input placeholder="Adresse / Ville" value={data.adresse || ''} onChange={e => onChange('adresse', e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary text-sm outline-none" />
            <input placeholder="LinkedIn (optionnel)" value={data.linkedin || ''} onChange={e => onChange('linkedin', e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary text-sm outline-none" />
          </div>

          {/* Photo */}
          <div className="p-3 bg-surface rounded-lg border border-border">
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input type="checkbox" checked={photoEnabled} onChange={e => togglePhoto(e.target.checked)} className="rounded accent-primary" />
              <span className="text-sm font-medium text-text-primary">Inclure une photo</span>
            </label>
            {photoEnabled && (
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoFile}
                    className="block text-xs text-text-muted border border-border rounded-lg bg-surface-elevated p-2 w-full cursor-pointer" />
                  <p className="text-xs text-text-muted mt-1">JPG, PNG, WEBP — max 2 Mo. Sera affichée en cercle.</p>
                </div>
                {data.photo && (
                  <div className="relative flex-shrink-0">
                    <img src={data.photo} alt="Photo CV" className="w-14 h-14 rounded-full object-cover border-2 border-primary/40" />
                    <button onClick={() => { onChange('photo', null); if (fileRef.current) fileRef.current.value = '' }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-error rounded-full text-white text-xs flex items-center justify-center hover:bg-red-400">✕</button>
                  </div>
                )}
              </div>
            )}
          </div>

          <BlockStyleOptions style={style} onStyleChange={onStyleChange} />
        </div>
      )}
    </div>
  )
}

// ------ Bloc Résumé ------
function ResumeBlock({ data, style, onChange, onStyleChange, isOpen, onToggle }) {
  return (
    <div className="bg-surface rounded-xl border-2 border-border overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-elevated"
        onClick={onToggle}
        style={{ borderLeft: '4px solid #f59e0b' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">📝</span>
          <div>
            <div className="font-bold text-text-primary text-sm">Résumé professionnel</div>
            <div className="text-xs text-text-muted truncate max-w-xs">{(data.resume || '').slice(0, 60)}{data.resume?.length > 60 ? '...' : ''}</div>
          </div>
        </div>
        <span className="text-text-muted text-lg">{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className="p-5 border-t border-border" style={{ background: style.bgColor && style.bgColor !== 'transparent' ? style.bgColor : undefined }}>
          <textarea rows={5} placeholder="Résumé professionnel optimisé par l'IA..." value={data.resume || ''} onChange={e => onChange('resume', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary text-sm outline-none resize-y" />
          <BlockStyleOptions style={style} onStyleChange={onStyleChange} />
        </div>
      )}
    </div>
  )
}

// ------ Bloc Expérience ------
function ExperienceBlock({ exp, index, style, onChange, onStyleChange, onRemove, onMoveUp, onMoveDown, isFirst, isLast, isOpen, onToggle }) {
  return (
    <div className="bg-surface rounded-xl border-2 border-border overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-elevated"
        onClick={onToggle}
        style={{ borderLeft: '4px solid #10b981' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">💼</span>
          <div>
            <div className="font-bold text-text-primary text-sm">{exp.poste || `Expérience #${index + 1}`}</div>
            <div className="text-xs text-text-muted">{exp.entreprise || 'Entreprise'}{exp.date_debut ? ` · ${exp.date_debut}` : ''}{exp.date_fin ? ` – ${exp.date_fin}` : ''}</div>
          </div>
        </div>
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          {!isFirst && <button onClick={onMoveUp} className="text-text-muted hover:text-primary p-1 text-sm" title="Monter">↑</button>}
          {!isLast && <button onClick={onMoveDown} className="text-text-muted hover:text-primary p-1 text-sm" title="Descendre">↓</button>}
          <button onClick={onRemove} className="text-error hover:text-red-400 p-1 text-sm" title="Supprimer">✕</button>
          <span className="text-text-muted text-lg ml-1">{isOpen ? '▲' : '▼'}</span>
        </div>
      </div>
      {isOpen && (
        <div className="p-5 border-t border-border space-y-3" style={{ background: style.bgColor && style.bgColor !== 'transparent' ? style.bgColor : undefined }}>
          <div className="grid md:grid-cols-2 gap-3">
            <input placeholder="Intitulé du poste" value={exp.poste || ''} onChange={e => onChange('poste', e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary text-sm outline-none md:col-span-2" />
            <input placeholder="Entreprise" value={exp.entreprise || ''} onChange={e => onChange('entreprise', e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary text-sm outline-none" />
            <input placeholder="Localisation (ex: Paris)" value={exp.localisation || ''} onChange={e => onChange('localisation', e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary text-sm outline-none" />
            <input placeholder="Date début (ex: Jan 2020)" value={exp.date_debut || ''} onChange={e => onChange('date_debut', e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary text-sm outline-none" />
            <input placeholder="Date fin (ex: Dec 2023 ou Aujourd'hui)" value={exp.date_fin || ''} onChange={e => onChange('date_fin', e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary text-sm outline-none" />
          </div>
          <textarea rows={5} placeholder="Description (bullets optimisés par l'IA, un par ligne...)" value={exp.description || ''} onChange={e => onChange('description', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary text-sm outline-none resize-y" />
          <BlockStyleOptions style={style} onStyleChange={onStyleChange} />
        </div>
      )}
    </div>
  )
}

// ------ Bloc Formation ------
function FormationBlock({ form, index, style, onChange, onStyleChange, onRemove, onMoveUp, onMoveDown, isFirst, isLast, isOpen, onToggle }) {
  return (
    <div className="bg-surface rounded-xl border-2 border-border overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-elevated"
        onClick={onToggle}
        style={{ borderLeft: '4px solid #8b5cf6' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🎓</span>
          <div>
            <div className="font-bold text-text-primary text-sm">{form.diplome || `Formation #${index + 1}`}</div>
            <div className="text-xs text-text-muted">{form.etablissement || 'École'}{(form.date_fin || form.annee) ? ` · ${form.date_fin || form.annee}` : ''}</div>
          </div>
        </div>
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          {!isFirst && <button onClick={onMoveUp} className="text-text-muted hover:text-primary p-1 text-sm">↑</button>}
          {!isLast && <button onClick={onMoveDown} className="text-text-muted hover:text-primary p-1 text-sm">↓</button>}
          <button onClick={onRemove} className="text-error hover:text-red-400 p-1 text-sm">✕</button>
          <span className="text-text-muted text-lg ml-1">{isOpen ? '▲' : '▼'}</span>
        </div>
      </div>
      {isOpen && (
        <div className="p-5 border-t border-border space-y-3" style={{ background: style.bgColor && style.bgColor !== 'transparent' ? style.bgColor : undefined }}>
          <div className="grid md:grid-cols-2 gap-3">
            <input placeholder="Diplôme / Titre" value={form.diplome || ''} onChange={e => onChange('diplome', e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary text-sm outline-none md:col-span-2" />
            <input placeholder="École / Université" value={form.etablissement || ''} onChange={e => onChange('etablissement', e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary text-sm outline-none" />
            <input placeholder="Localisation (optionnel)" value={form.localisation || ''} onChange={e => onChange('localisation', e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary text-sm outline-none" />
            <input placeholder="Année / Date fin (ex: 2022)" value={form.date_fin || form.annee || ''} onChange={e => onChange('date_fin', e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary text-sm outline-none" />
          </div>
          <textarea rows={2} placeholder="Description (optionnel)" value={form.description || ''} onChange={e => onChange('description', e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg bg-surface-elevated text-text-primary text-sm outline-none" />
          <BlockStyleOptions style={style} onStyleChange={onStyleChange} />
        </div>
      )}
    </div>
  )
}

// ------ Bloc Compétences ------
function SkillsBlock({ data, style, onChange, onStyleChange, isOpen, onToggle }) {
  return (
    <div className="bg-surface rounded-xl border-2 border-border overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-elevated"
        onClick={onToggle}
        style={{ borderLeft: '4px solid #f97316' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🛠️</span>
          <div>
            <div className="font-bold text-text-primary text-sm">Compétences & Langues</div>
            <div className="text-xs text-text-muted">{(data.competences_techniques || '').slice(0, 50) || 'Techniques, soft skills, langues...'}</div>
          </div>
        </div>
        <span className="text-text-muted text-lg">{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className="p-5 border-t border-border space-y-4" style={{ background: style.bgColor && style.bgColor !== 'transparent' ? style.bgColor : undefined }}>
          <div>
            <div className="text-xs font-semibold text-text-muted mb-1.5">🔧 Compétences techniques</div>
            <TagInput value={data.competences_techniques || ''} onChange={v => onChange('competences_techniques', v)} placeholder="Ex: React, Node.js, Python… (Entrée pour valider)" />
          </div>
          <div>
            <div className="text-xs font-semibold text-text-muted mb-1.5">🤝 Soft skills</div>
            <TagInput value={data.competences_soft || ''} onChange={v => onChange('competences_soft', v)} placeholder="Ex: Leadership, Communication… (Entrée pour valider)" />
          </div>
          <div>
            <div className="text-xs font-semibold text-text-muted mb-1.5">🌍 Langues</div>
            <TagInput value={data.langues || ''} onChange={v => onChange('langues', v)} placeholder="Ex: Français natif, Anglais C1… (Entrée pour valider)" />
          </div>
          <div>
            <div className="text-xs font-semibold text-text-muted mb-1.5">⭐ Centres d'intérêt (optionnel)</div>
            <TagInput value={data.interets || ''} onChange={v => onChange('interets', v)} placeholder="Ex: Photographie, Tennis… (Entrée pour valider)" />
          </div>
          <BlockStyleOptions style={style} onStyleChange={onStyleChange} />
        </div>
      )}
    </div>
  )
}

/* ========================================================
   COMPOSANT PRINCIPAL — CVBlockEditor
   ======================================================== */
export default function CVBlockEditor({ cvData, blockStyles, onCvDataChange, onBlockStyleChange, activeBlock }) {
  const [openBlocks, setOpenBlocks] = useState({ identity: true })

  // Ouvre automatiquement le bloc actif sélectionné dans le panneau d'ordre
  useEffect(() => {
    if (!activeBlock) return
    const keyMap = {
      identity: 'identity',
      resume: 'resume',
      experiences: 'exp_0',
      formations: 'form_0',
      competences: 'skills',
    }
    const key = keyMap[activeBlock]
    if (key) setOpenBlocks(prev => ({ ...prev, [key]: true }))
  }, [activeBlock])

  const toggleBlock = (key) => setOpenBlocks(prev => ({ ...prev, [key]: !prev[key] }))

  const updateIdentity = (field, val) => onCvDataChange({ ...cvData, [field]: val })
  const updateSkills = (field, val) => onCvDataChange({ ...cvData, [field]: val })

  const updateExp = (i, field, val) => {
    const exps = [...(cvData.experiences || [])]
    exps[i] = { ...exps[i], [field]: val }
    onCvDataChange({ ...cvData, experiences: exps })
  }
  const addExp = () => onCvDataChange({
    ...cvData,
    experiences: [...(cvData.experiences || []), { poste: '', entreprise: '', localisation: '', date_debut: '', date_fin: '', description: '' }]
  })
  const removeExp = (i) => onCvDataChange({ ...cvData, experiences: (cvData.experiences || []).filter((_, idx) => idx !== i) })
  const moveExp = (i, dir) => {
    const exps = [...(cvData.experiences || [])]
    const j = i + dir
    if (j < 0 || j >= exps.length) return
    ;[exps[i], exps[j]] = [exps[j], exps[i]]
    onCvDataChange({ ...cvData, experiences: exps })
  }

  const updateForm = (i, field, val) => {
    const forms = [...(cvData.formations || [])]
    forms[i] = { ...forms[i], [field]: val }
    onCvDataChange({ ...cvData, formations: forms })
  }
  const addForm = () => onCvDataChange({
    ...cvData,
    formations: [...(cvData.formations || []), { diplome: '', etablissement: '', localisation: '', date_fin: '', description: '' }]
  })
  const removeForm = (i) => onCvDataChange({ ...cvData, formations: (cvData.formations || []).filter((_, idx) => idx !== i) })
  const moveForm = (i, dir) => {
    const forms = [...(cvData.formations || [])]
    const j = i + dir
    if (j < 0 || j >= forms.length) return
    ;[forms[i], forms[j]] = [forms[j], forms[i]]
    onCvDataChange({ ...cvData, formations: forms })
  }

  const getStyle = (key) => blockStyles[key] || { bgColor: 'transparent', borderRadius: 'none', borderStyle: 'none' }
  const setStyle = (key, prop, val) => onBlockStyleChange(key, prop, val)

  return (
    <div className="space-y-4">

      {/* IDENTITÉ */}
      <IdentityBlock
        data={cvData}
        style={getStyle('identity')}
        onChange={updateIdentity}
        onStyleChange={(prop, val) => setStyle('identity', prop, val)}
        isOpen={!!openBlocks.identity}
        onToggle={() => toggleBlock('identity')}
      />

      {/* RÉSUMÉ */}
      <ResumeBlock
        data={cvData}
        style={getStyle('resume')}
        onChange={(field, val) => onCvDataChange({ ...cvData, [field]: val })}
        onStyleChange={(prop, val) => setStyle('resume', prop, val)}
        isOpen={!!openBlocks.resume}
        onToggle={() => toggleBlock('resume')}
      />

      {/* EXPÉRIENCES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-text-primary">Expériences professionnelles</h4>
          <button onClick={addExp} className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20">+ Ajouter</button>
        </div>
        {(cvData.experiences || []).map((exp, i) => (
          <ExperienceBlock
            key={i}
            exp={exp}
            index={i}
            style={getStyle(`exp_${i}`)}
            onChange={(field, val) => updateExp(i, field, val)}
            onStyleChange={(prop, val) => setStyle(`exp_${i}`, prop, val)}
            onRemove={() => removeExp(i)}
            onMoveUp={() => moveExp(i, -1)}
            onMoveDown={() => moveExp(i, 1)}
            isFirst={i === 0}
            isLast={i === (cvData.experiences || []).length - 1}
            isOpen={!!openBlocks[`exp_${i}`]}
            onToggle={() => toggleBlock(`exp_${i}`)}
          />
        ))}
      </div>

      {/* FORMATIONS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-text-primary">Formations</h4>
          <button onClick={addForm} className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20">+ Ajouter</button>
        </div>
        {(cvData.formations || []).map((form, i) => (
          <FormationBlock
            key={i}
            form={form}
            index={i}
            style={getStyle(`form_${i}`)}
            onChange={(field, val) => updateForm(i, field, val)}
            onStyleChange={(prop, val) => setStyle(`form_${i}`, prop, val)}
            onRemove={() => removeForm(i)}
            onMoveUp={() => moveForm(i, -1)}
            onMoveDown={() => moveForm(i, 1)}
            isFirst={i === 0}
            isLast={i === (cvData.formations || []).length - 1}
            isOpen={!!openBlocks[`form_${i}`]}
            onToggle={() => toggleBlock(`form_${i}`)}
          />
        ))}
      </div>

      {/* COMPÉTENCES */}
      <SkillsBlock
        data={cvData}
        style={getStyle('skills')}
        onChange={updateSkills}
        onStyleChange={(prop, val) => setStyle('skills', prop, val)}
        isOpen={!!openBlocks.skills}
        onToggle={() => toggleBlock('skills')}
      />
    </div>
  )
}
