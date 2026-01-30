/**
 * Composant ProgressBar
 * Affiche la progression entre les étapes
 */

export default function ProgressBar({ currentStep, steps }) {
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className={`flex items-center ${i < steps.length - 1 ? 'flex-1' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep >= s.num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {s.num}
                </div>
                <span className={`ml-2 font-medium ${
                  currentStep >= s.num ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 ${
                  currentStep > s.num ? 'bg-blue-600' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}