import React from 'react';
import { TREATMENT_DATABASE } from '../constants';

interface TreatmentPlanProps {
  disease: string;
  confidence: number;
}

export const TreatmentPlanComponent: React.FC<TreatmentPlanProps> = ({ 
  disease, 
  confidence 
}) => {
  const treatment = TREATMENT_DATABASE.find(t => t.disease === disease);
  
  if (!treatment) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-green-50 border-green-200';
      case 'moderate': return 'bg-yellow-50 border-yellow-200';
      case 'severe': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`border-2 rounded-2xl p-6 mt-6 transition-all ${getSeverityColor(treatment.severity)} shadow-sm`}>
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-opacity-20">
        <div className="flex items-center gap-3">
          <div className="text-2xl">📋</div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Management Plan</h3>
            <p className="text-xs text-slate-600 font-medium">{treatment.disease}</p>
          </div>
        </div>
        <span className={`text-xs font-bold px-4 py-2 rounded-full ${getSeverityBadge(treatment.severity)} shadow-sm`}>
          {treatment.severity.toUpperCase()} Severity
        </span>
      </div>

      {/* Recovery Time */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-400 rounded-r-lg">
        <p className="text-sm text-blue-900 font-medium flex items-center gap-2">
          <span className="text-xl">⏱️</span>
          <strong>Expected Recovery:</strong> <span className="text-blue-700 font-bold">{treatment.recoveryTime}</span>
        </p>
      </div>

      {/* Home Care */}
      <div className="mb-6">
        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-base">
          <span className="text-xl">🏠</span> Home Care Essentials
        </h4>
        <ul className="space-y-2.5 ml-8">
          {treatment.homecare.map((item, idx) => (
            <li key={idx} className="text-sm text-slate-700 flex gap-3 leading-relaxed">
              <span className="text-teal-600 font-bold text-lg leading-none mt-0.5">▪</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Medications */}
      <div className="mb-6">
        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-base">
          <span className="text-xl">💊</span> Medication Options
        </h4>
        
        {treatment.medications.otc && (
          <div className="mb-5 ml-8">
            <p className="text-sm font-bold text-green-800 mb-3 inline-flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg">
              <span>✓</span> Over-the-Counter
            </p>
            <ul className="space-y-2 mt-3">
              {treatment.medications.otc.map((med, idx) => (
                <li key={idx} className="text-sm text-slate-700 flex gap-3">
                  <span className="text-green-600 font-bold text-lg leading-none mt-0.5">✓</span> 
                  <span className="leading-relaxed">{med}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {treatment.medications.prescription && (
          <div className="ml-8 p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-400 rounded-r-lg">
            <p className="text-sm font-bold text-orange-900 mb-3 flex items-center gap-2">
              <span className="text-lg">⚠️</span> Prescription Required:
            </p>
            <ul className="space-y-2.5 ml-6">
              {treatment.medications.prescription.map((med, idx) => (
                <li key={idx} className="text-sm text-orange-800 flex gap-3 leading-relaxed">
                  <span className="font-bold text-orange-600 text-lg leading-none mt-0.5">→</span> {med}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Seek Care If */}
      <div className="mb-6 p-5 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-lg">
        <h4 className="font-bold text-red-900 mb-4 flex items-center gap-2 text-base">
          <span className="text-xl">🚨</span> Seek Immediate Care If:
        </h4>
        <ul className="space-y-2.5 ml-8">
          {treatment.seekCareIf.map((item, idx) => (
            <li key={idx} className="text-sm text-red-900 flex gap-3 font-medium leading-relaxed">
              <span className="text-red-600 font-bold text-lg leading-none mt-0.5">●</span> {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Prevention */}
      <div className="mb-6">
        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-base">
          <span className="text-xl">🛡️</span> Prevention & Transmission Control
        </h4>
        <ul className="space-y-2.5 ml-8">
          {treatment.preventionTips.map((item, idx) => (
            <li key={idx} className="text-sm text-slate-700 flex gap-3 leading-relaxed">
              <span className="text-blue-600 font-bold text-lg leading-none mt-0.5">✓</span> {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 rounded-r-lg">
        <p className="text-xs text-yellow-900 leading-relaxed font-medium">
          <strong>⚠️ Important Notice:</strong> This management plan provides educational guidance only. 
          It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult 
          with a licensed healthcare provider before starting any treatment. If symptoms worsen, call your doctor immediately.
        </p>
      </div>
    </div>
  );
};

export default TreatmentPlanComponent;
