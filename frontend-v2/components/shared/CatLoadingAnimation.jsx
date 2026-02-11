'use client'

const CSS = `
@keyframes lick-arm {
  0%,100%{transform:translateY(0) rotate(0deg)}
  35%,65%{transform:translateY(-14px) rotate(-32deg)}
}
@keyframes tongue-show {
  0%,28%,78%,100%{opacity:0;transform:scaleY(0)}
  42%,62%{opacity:1;transform:scaleY(1)}
}
@keyframes eye-blink {
  0%,88%,100%{transform:scaleY(1)}
  92%{transform:scaleY(0.08)}
}
@keyframes d1 { 0%,70%,100%{opacity:0.2} 20%,50%{opacity:1} }
@keyframes d2 { 0%,20%,90%,100%{opacity:0.2} 40%,70%{opacity:1} }
@keyframes d3 { 0%,40%,100%{opacity:0.2} 60%,90%{opacity:1} }
`

export default function CatLoadingAnimation({ label = 'Optimisation en cours' }) {
  return (
    <div className="flex items-center gap-4 py-8 select-none justify-center">
      <style>{CSS}</style>

      {/* Chat pixel art — se lèche la patte */}
      <svg viewBox="0 0 38 46" width="56" height="68" xmlns="http://www.w3.org/2000/svg">
        {/* Oreilles */}
        <polygon points="5,13 8,4 13,13" fill="#374151"/>
        <polygon points="25,13 30,4 33,13" fill="#374151"/>
        <polygon points="6.5,13 8,8 11,13" fill="#f87171"/>
        <polygon points="26.5,13 30,8 31.5,13" fill="#f87171"/>
        {/* Tête */}
        <circle cx="19" cy="19" r="12" fill="#374151"/>
        {/* Yeux gauche */}
        <ellipse cx="13.5" cy="18" rx="2.5" ry="3" fill="#fbbf24"
          style={{transformOrigin:'13.5px 18px', animation:'eye-blink 3.5s ease-in-out infinite'}}/>
        <ellipse cx="13.5" cy="18" rx="1" ry="2.2" fill="#111"/>
        <circle cx="14.2" cy="16.5" r="0.7" fill="white"/>
        {/* Yeux droit */}
        <ellipse cx="24.5" cy="18" rx="2.5" ry="3" fill="#fbbf24"
          style={{transformOrigin:'24.5px 18px', animation:'eye-blink 3.5s ease-in-out 0.4s infinite'}}/>
        <ellipse cx="24.5" cy="18" rx="1" ry="2.2" fill="#111"/>
        <circle cx="25.2" cy="16.5" r="0.7" fill="white"/>
        {/* Nez */}
        <ellipse cx="19" cy="23.5" rx="1.8" ry="1.3" fill="#f87171"/>
        {/* Moustaches */}
        <line x1="3" y1="22" x2="12" y2="23.5" stroke="#9ca3af" strokeWidth="0.7"/>
        <line x1="3" y1="25" x2="12" y2="25" stroke="#9ca3af" strokeWidth="0.7"/>
        <line x1="26" y1="23.5" x2="35" y2="22" stroke="#9ca3af" strokeWidth="0.7"/>
        <line x1="26" y1="25" x2="35" y2="25" stroke="#9ca3af" strokeWidth="0.7"/>
        {/* Corps */}
        <ellipse cx="19" cy="37" rx="11" ry="8.5" fill="#374151"/>
        {/* Patte gauche (statique) */}
        <ellipse cx="10" cy="44.5" rx="4.5" ry="2.5" fill="#2d3748"/>
        {/* Langue (apparaît quand la patte monte) */}
        <ellipse cx="22" cy="27" rx="1.8" ry="2.8" fill="#ec4899"
          style={{transformOrigin:'22px 25px', animation:'tongue-show 2.4s ease-in-out infinite'}}/>
        {/* Patte droite qui se lève (animation léchage) */}
        <g style={{transformOrigin:'27px 40px', animation:'lick-arm 2.4s ease-in-out infinite'}}>
          <rect x="23" y="33" width="7" height="11" rx="3.5" fill="#374151"/>
          <ellipse cx="26.5" cy="43" rx="4" ry="2.5" fill="#2d3748"/>
        </g>
      </svg>

      {/* Texte */}
      <div>
        <p className="text-text-primary font-semibold text-sm">
          {label}
          <span style={{animation:'d1 1.4s ease-in-out infinite'}} className="text-primary">.</span>
          <span style={{animation:'d2 1.4s ease-in-out infinite'}} className="text-primary">.</span>
          <span style={{animation:'d3 1.4s ease-in-out infinite'}} className="text-primary">.</span>
        </p>
        <p className="text-text-muted text-xs mt-1">Analyse ATS · Réécriture · Optimisation des mots-clés</p>
      </div>
    </div>
  )
}
