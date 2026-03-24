export default function ProgressBar({ currentStep, steps }) {
  return (
    <div className="bg-surface-glass backdrop-blur-xl border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className={`flex items-center ${i < steps.length - 1 ? 'flex-1' : ''}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  currentStep >= s.num ? 'bg-primary text-primary-foreground' : 'bg-surface-elevated text-text-muted'
                }`}>
                  {currentStep > s.num ? '\u2713' : s.num}
                </div>
                <span className={`ml-2 text-sm font-semibold hidden sm:inline ${
                  currentStep >= s.num ? 'text-text-primary' : 'text-text-muted'
                }`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 rounded-full transition-colors ${
                  currentStep > s.num ? 'bg-primary' : 'bg-border'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
