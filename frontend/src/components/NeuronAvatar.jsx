/**
 * NeuronAvatar — animated SVG neuron character.
 * variant: 'gym' | 'breathe' | 'habits' | 'profile'
 * size: px number (default 120)
 * animated: bool (default true)
 */
export default function NeuronAvatar({ variant = 'breathe', size = 120, animated = true }) {
  const configs = {
    gym: {
      bodyColor: 'var(--color-avatar-gym-body)',
      glowColor: 'var(--color-avatar-gym-glow)',
      borderColor: 'var(--color-secondary-container)',
      bgColor: 'var(--color-avatar-gym-bg)',
      eyeColor: 'var(--color-avatar-gym-eye)',
    },
    breathe: {
      bodyColor: 'var(--color-avatar-breathe-body)',
      glowColor: 'var(--color-avatar-breathe-glow)',
      borderColor: 'var(--color-secondary-container)',
      bgColor: 'var(--color-avatar-breathe-bg)',
      eyeColor: 'var(--color-avatar-breathe-eye)',
    },
    habits: {
      bodyColor: 'var(--color-avatar-habits-body)',
      glowColor: 'var(--color-avatar-habits-glow)',
      borderColor: 'var(--color-tertiary-container)',
      bgColor: 'var(--color-avatar-habits-bg)',
      eyeColor: 'var(--color-avatar-habits-eye)',
    },
    profile: {
      bodyColor: 'var(--color-avatar-profile-body)',
      glowColor: 'var(--color-avatar-profile-glow)',
      borderColor: 'var(--color-secondary-container)',
      bgColor: 'var(--color-avatar-profile-bg)',
      eyeColor: 'var(--color-avatar-profile-eye)',
    },
  }

  const c = configs[variant] || configs.breathe
  const floatClass = animated ? 'animate-float' : ''

  return (
    <div
      className={`relative rounded-full flex items-center justify-center ${floatClass}`}
      style={{
        width: size,
        height: size,
        background: c.bgColor,
        border: `3px solid ${c.borderColor}`,
        boxShadow: `0 0 0 4px color-mix(in srgb, ${c.borderColor} 20%, transparent), 0 4px 20px color-mix(in srgb, ${c.glowColor} 35%, transparent)`,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size * 0.78}
        height={size * 0.78}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dendrites / axons */}
        <g stroke={c.bodyColor} strokeWidth="3.5" strokeLinecap="round" fill="none">
          <line x1="50" y1="28" x2="42" y2="8" />
          <line x1="50" y1="28" x2="58" y2="8" />
          <line x1="72" y1="50" x2="92" y2="44" />
          <line x1="72" y1="50" x2="92" y2="56" />
          <line x1="50" y1="72" x2="42" y2="92" />
          <line x1="50" y1="72" x2="58" y2="92" />
          <line x1="28" y1="50" x2="8" y2="44" />
          <line x1="28" y1="50" x2="8" y2="56" />
          {variant === 'gym' && (
            <>
              <line x1="65" y1="32" x2="78" y2="20" />
              <line x1="35" y1="32" x2="22" y2="20" />
              <line x1="65" y1="68" x2="78" y2="80" />
              <line x1="35" y1="68" x2="22" y2="80" />
            </>
          )}
        </g>

        {/* Main body circle */}
        <circle
          cx="50"
          cy="50"
          r="24"
          fill={c.bodyColor}
          style={{ filter: `drop-shadow(0 0 6px ${c.glowColor})` }}
        />

        {/* Highlight */}
        <ellipse cx="43" cy="41" rx="6" ry="4" fill="white" opacity="0.35" />

        {/* Eyes */}
        <circle cx="43" cy="50" r="4" fill="white" />
        <circle cx="57" cy="50" r="4" fill="white" />
        <circle cx="44" cy="51" r="2" fill={c.eyeColor} />
        <circle cx="58" cy="51" r="2" fill={c.eyeColor} />
        {/* Eye shine */}
        <circle cx="45" cy="50" r="0.8" fill="white" />
        <circle cx="59" cy="50" r="0.8" fill="white" />

        {/* Smile */}
        <path
          d="M 43 60 Q 50 67 57 60"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Neural glow pulse nodes */}
        <circle cx="50" cy="8" r="2.5" fill={c.glowColor} className="animate-pulse-soft" />
        <circle cx="92" cy="50" r="2.5" fill={c.glowColor} className="animate-pulse-soft" />
        <circle cx="50" cy="92" r="2.5" fill={c.glowColor} className="animate-pulse-soft" />
        <circle cx="8" cy="50" r="2.5" fill={c.glowColor} className="animate-pulse-soft" />
      </svg>
    </div>
  )
}
