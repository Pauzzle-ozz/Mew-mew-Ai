'use client';

import { useEffect, useRef, useState } from 'react';

const sizes = {
  sm: 32,
  md: 64,
  lg: 120,
  xl: 200,
};

export default function CatMascot({ size = 'md', animate = true, className = '' }) {
  const dimension = sizes[size] || sizes.md;
  const [isBlinking, setIsBlinking] = useState(false);
  const catRef = useRef(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!animate) return;

    let timeout;
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = Math.abs(currentY - lastScrollY.current);

      if (delta > 100) {
        setIsBlinking(true);
        lastScrollY.current = currentY;

        clearTimeout(timeout);
        timeout = setTimeout(() => setIsBlinking(false), 400);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, [animate]);

  return (
    <div ref={catRef} className={`inline-flex items-center justify-center ${className}`}>
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Glow filter for eyes */}
        <defs>
          <filter id={`glow-${size}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id={`eyeGrad-${size}`} cx="50%" cy="40%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </radialGradient>
        </defs>

        {/* Tail - curved behind */}
        <path
          d="M 145 155 Q 175 130 170 100 Q 168 85 155 80"
          stroke="#1F2937"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Body - sitting cat silhouette */}
        <ellipse cx="100" cy="155" rx="40" ry="30" fill="#1F2937" />

        {/* Chest */}
        <ellipse cx="100" cy="125" rx="30" ry="35" fill="#1F2937" />

        {/* Head */}
        <circle cx="100" cy="80" r="30" fill="#1F2937" />

        {/* Left ear */}
        <polygon points="75,60 65,30 88,52" fill="#1F2937" />
        <polygon points="78,58 70,36 86,53" fill="#111827" />

        {/* Right ear */}
        <polygon points="125,60 135,30 112,52" fill="#1F2937" />
        <polygon points="122,58 130,36 114,53" fill="#111827" />

        {/* Eyes container with blink animation */}
        <g
          className={animate ? 'cat-eye-glow' : ''}
          filter={`url(#glow-${size})`}
          style={isBlinking ? { transform: 'scaleY(0.1)', transformOrigin: '100px 78px', transition: 'transform 0.15s ease-in-out' } : { transform: 'scaleY(1)', transformOrigin: '100px 78px', transition: 'transform 0.15s ease-in-out' }}
        >
          {/* Left eye */}
          <ellipse cx="87" cy="78" rx="7" ry="8" fill={`url(#eyeGrad-${size})`} />
          {/* Left pupil */}
          <ellipse cx="87" cy="78" rx="2.5" ry="6" fill="#111827" />

          {/* Right eye */}
          <ellipse cx="113" cy="78" rx="7" ry="8" fill={`url(#eyeGrad-${size})`} />
          {/* Right pupil */}
          <ellipse cx="113" cy="78" rx="2.5" ry="6" fill="#111827" />
        </g>

        {/* Nose */}
        <polygon points="100,90 97,87 103,87" fill="#374151" />

        {/* Mouth */}
        <path
          d="M 95 92 Q 100 96 105 92"
          stroke="#374151"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Whiskers left */}
        <line x1="60" y1="82" x2="82" y2="85" stroke="#374151" strokeWidth="1" />
        <line x1="58" y1="88" x2="82" y2="88" stroke="#374151" strokeWidth="1" />
        <line x1="60" y1="94" x2="82" y2="91" stroke="#374151" strokeWidth="1" />

        {/* Whiskers right */}
        <line x1="118" y1="85" x2="140" y2="82" stroke="#374151" strokeWidth="1" />
        <line x1="118" y1="88" x2="142" y2="88" stroke="#374151" strokeWidth="1" />
        <line x1="118" y1="91" x2="140" y2="94" stroke="#374151" strokeWidth="1" />

        {/* Front paws */}
        <ellipse cx="82" cy="172" rx="10" ry="6" fill="#1F2937" />
        <ellipse cx="118" cy="172" rx="10" ry="6" fill="#1F2937" />
      </svg>
    </div>
  );
}
