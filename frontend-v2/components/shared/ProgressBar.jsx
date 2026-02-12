export default function ProgressBar({ currentStep, steps }) {
  return (
    <div className="bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className={`flex items-center ${i < steps.length - 1 ? 'flex-1' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep >= s.num ? 'bg-primary text-primary-foreground' : 'bg-surface-elevated text-text-muted'
                }`}>
                  {s.num}
                </div>
                <span className={`ml-2 font-medium ${
                  currentStep >= s.num ? 'text-text-primary' : 'text-text-muted'
                }`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 rounded ${
                  currentStep > s.num ? 'bg-primary' : 'bg-border'
                }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
