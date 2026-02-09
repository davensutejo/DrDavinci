import React from 'react';
import { VerdictDiagnosis } from '../types';

interface VerdictCardProps {
  verdicts: VerdictDiagnosis[];
}

const VerdictCard: React.FC<VerdictCardProps> = ({ verdicts }) => {
  if (!verdicts || verdicts.length === 0) return null;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'from-emerald-500 to-green-600';
    if (confidence >= 65) return 'from-blue-500 to-cyan-600';
    if (confidence >= 45) return 'from-amber-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 85) return 'HIGH';
    if (confidence >= 65) return 'MODERATE';
    if (confidence >= 45) return 'LOW';
    return 'MINIMAL';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 85) return '✓';
    if (confidence >= 65) return '◐';
    if (confidence >= 45) return '○';
    return '?';
  };

  return (
    <div className="mt-6 pt-5 border-t border-slate-100">
      <div className="mb-4">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">
          🔬 Clinical Verdict
        </span>
      </div>

      <div className="space-y-3">
        {verdicts.slice(0, 2).map((verdict, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-xl p-4 border-2 transition-all duration-300 ${
              index === 0
                ? `border-emerald-400 bg-gradient-to-r from-emerald-50 to-transparent hover:shadow-lg hover:shadow-emerald-300/30`
                : `border-slate-200 bg-gradient-to-r from-slate-50 to-transparent hover:shadow-md hover:shadow-slate-300/20`
            }`}
          >
            {/* Confidence Bar Background */}
            <div className="absolute inset-y-0 left-0 top-0 opacity-10 pointer-events-none"
              style={{
                width: `${verdict.confidence}%`,
                background: index === 0 ? 'linear-gradient(to right, emerald, green)' : 'linear-gradient(to right, blue, cyan)'
              }}
            />

            <div className="relative z-10 space-y-2">
              {/* Header with Rank and Disease Name */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-white text-xs ${
                      index === 0 ? 'bg-gradient-to-r from-emerald-500 to-green-600' : 'bg-slate-400'
                    }`}>
                      {index + 1}
                    </span>
                    <h3 className={`text-sm font-bold ${
                      index === 0 ? 'text-emerald-900' : 'text-slate-900'
                    }`}>
                      {verdict.disease}
                    </h3>
                  </div>
                </div>

                {/* Confidence Badge */}
                <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getConfidenceColor(verdict.confidence)} text-white text-[11px] font-bold whitespace-nowrap flex items-center gap-1`}>
                  <span>{getConfidenceIcon(verdict.confidence)}</span>
                  <span>{verdict.confidence}%</span>
                </div>
              </div>

              {/* Confidence Level Label */}
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Confidence: {getConfidenceLabel(verdict.confidence)}
              </div>

              {/* Visual Confidence Meter */}
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${getConfidenceColor(verdict.confidence)}`}
                  style={{ width: `${verdict.confidence}%` }}
                />
              </div>

              {/* Reasoning */}
              <p className={`text-xs leading-relaxed mt-3 ${
                index === 0 ? 'text-emerald-800' : 'text-slate-700'
              }`}>
                {verdict.reasoning}
              </p>

              {/* Sources */}
              {verdict.sources && verdict.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">📚 Evidence</p>
                  <div className="space-y-1">
                    {verdict.sources.map((source, srcIdx) => (
                      <p key={srcIdx} className="text-[9px] text-slate-600">
                        {source}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Top Indicator Bar */}
            {index === 0 && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-400" />
            )}
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
        <p className="text-[10px] text-slate-600 leading-relaxed">
          <span className="font-bold text-slate-700">⚠️ Important:</span> These verdicts are based on symptom analysis and are not diagnostic. 
          Consult with a healthcare professional for proper diagnosis and treatment.
        </p>
      </div>
    </div>
  );
};

export default VerdictCard;
