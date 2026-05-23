/**
 * SpeechBubble — a rounded chat bubble with tail pointing down-center.
 * message: string
 * className: extra classes
 */
export default function SpeechBubble({ message, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-outline-variant text-center">
        <p className="text-on-surface text-sm leading-relaxed font-medium">{message}</p>
      </div>
      {/* Tail */}
      <div
        className="absolute left-1/2 -bottom-3 -translate-x-1/2 w-0 h-0"
        style={{
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderTop: '12px solid white',
          filter: 'drop-shadow(0 2px 1px rgba(0,0,0,0.05))',
        }}
      />
    </div>
  )
}
