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
    <div className={`border-2 rounded-lg p-5 mt-4 ${getSeverityColor(treatment.severity)}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-gray-800">📋 Management Plan</h3>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${getSeverityBadge(treatment.severity)}`}>
            {treatment.severity.toUpperCase()}
          </span>
        </div>
        <span className="text-sm font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
          {Math.round(confidence)}% confidence
        </span>
      </div>

      {/* Recovery Time */}
      <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r">
        <p className="text-sm text-blue-900">
          <strong>⏱️ Expected Recovery:</strong> {treatment.recoveryTime}
        </p>
      </div>

      {/* Home Care */}
      <div className="mb-5">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span>🏠</span> Home Care
        </h4>
        <ul className="space-y-2 ml-6">
          {treatment.homecare.map((item, idx) => (
            <li key={idx} className="text-sm text-gray-700 flex gap-2">
              <span className="text-teal-600 font-bold">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Medications */}
      <div className="mb-5">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span>💊</span> Medications
        </h4>
        
        {treatment.medications.otc && (
          <div className="mb-4 ml-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">Over-the-Counter:</p>
            <ul className="space-y-1">
              {treatment.medications.otc.map((med, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-green-600">✓</span> {med}
                </li>
              ))}
            </ul>
          </div>
        )}

        {treatment.medications.prescription && (
          <div className="ml-6">
            <p className="text-sm font-semibold text-orange-700 mb-2 flex items-center gap-1">
              <span>⚠️</span> Prescription Required:
            </p>
            <ul className="space-y-1">
              {treatment.medications.prescription.map((med, idx) => (
                <li key={idx} className="text-sm text-orange-700 flex gap-2">
                  <span>→</span> {med}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Seek Care If */}
      <div className="mb-5 p-4 bg-red-50 border-l-4 border-red-400 rounded-r">
        <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
          <span>🚨</span> Seek Immediate Care If:
        </h4>
        <ul className="space-y-2 ml-6">
          {treatment.seekCareIf.map((item, idx) => (
            <li key={idx} className="text-sm text-red-900 flex gap-2">
              <span className="text-red-600 font-bold">•</span> {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Prevention */}
      <div className="mb-4">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span>🛡️</span> Prevention & Transmission Control
        </h4>
        <ul className="space-y-2 ml-6">
          {treatment.preventionTips.map((item, idx) => (
            <li key={idx} className="text-sm text-gray-700 flex gap-2">
              <span className="text-blue-600">✓</span> {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
        <p className="text-xs text-yellow-900 leading-relaxed">
          <strong>⚠️ Important Disclaimer:</strong> This management plan is educational information only 
          and does not replace professional medical advice. Always consult with a licensed healthcare 
          professional for proper diagnosis, treatment, and personalized medical guidance.
        </p>
      </div>
    </div>
  );
};

export default TreatmentPlanComponent;
