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
    <div className="mt-8 pt-6 border-t-2 border-teal-200">
      <div className="mb-5">
        <span className="text-[11px] font-bold text-teal-700 uppercase tracking-widest block mb-5 inline-flex items-center gap-2">
          <span className="w-1 h-1 bg-teal-600 rounded-full"></span>
          🔬 Final Verdict
        </span>
      </div>

      <div className="space-y-4">
        {verdicts.slice(0, 2).map((verdict, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-2xl p-5 border-2 transition-all duration-300 ${
              index === 0
                ? `border-emerald-400 bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-transparent hover:shadow-lg hover:shadow-emerald-300/40`
                : `border-slate-200 bg-gradient-to-br from-slate-50/80 via-slate-50/30 to-transparent hover:shadow-md hover:shadow-slate-300/30`
            }`}
          >
            {/* Confidence Bar Background */}
            <div className="absolute inset-y-0 left-0 top-0 opacity-8 pointer-events-none"
              style={{
                width: `${verdict.confidence}%`,
                background: index === 0 ? 'linear-gradient(to right, emerald, green)' : 'linear-gradient(to right, blue, cyan)'
              }}
            />

            <div className="relative z-10 space-y-3">
              {/* Header with Rank and Disease Name */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-white text-xs shadow-md ${
                      index === 0 ? 'bg-gradient-to-br from-emerald-500 to-green-600' : 'bg-gradient-to-br from-slate-400 to-slate-500'
                    }`}>
                      {index + 1}
                    </span>
                    <h3 className={`text-base font-bold leading-tight ${
                      index === 0 ? 'text-emerald-900' : 'text-slate-900'
                    }`}>
                      {verdict.disease}
                    </h3>
                  </div>
                </div>

                {/* Confidence Badge */}
                <div className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${getConfidenceColor(verdict.confidence)} text-white text-xs font-bold whitespace-nowrap flex items-center gap-1.5 shadow-md`}>
                  <span>{getConfidenceIcon(verdict.confidence)}</span>
                  <span>{verdict.confidence}%</span>
                </div>
              </div>

              {/* Visual Confidence Meter */}
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-sm">
                <div
                  className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${getConfidenceColor(verdict.confidence)}`}
                  style={{ width: `${verdict.confidence}%` }}
                />
              </div>

              {/* Reasoning */}
              <p className={`text-sm leading-relaxed mt-3 font-medium ${
                index === 0 ? 'text-emerald-800' : 'text-slate-700'
              }`}>
                {verdict.reasoning}
              </p>

              {/* Sources */}
              {verdict.sources && verdict.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span>📚</span> Evidence-Based Sources
                  </p>
                  <div className="space-y-2">
                    {verdict.sources.map((source, srcIdx) => (
                      <a 
                        key={srcIdx}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 text-xs text-teal-700 hover:text-teal-800 p-2.5 bg-teal-50/80 border border-teal-100 rounded-lg transition-all hover:bg-teal-100 hover:shadow-sm"
                      >
                        <span className="flex-shrink-0 mt-0.5 text-sm">🔗</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-teal-800">{source.organization}</p>
                          <p className="text-teal-600 text-[10px] line-clamp-2">{source.description}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Top Indicator Bar */}
            {index === 0 && (
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-400" />
            )}
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200 border-dashed">
        <p className="text-xs text-blue-700 leading-relaxed font-medium">
          <strong>ℹ️ Note:</strong> These verdicts are AI-generated clinical suggestions based on your described symptoms. 
          A licensed healthcare provider should confirm any diagnosis through physical examination and appropriate testing. 
          Always seek professional medical advice for persistent or worsening symptoms.
        </p>
      </div>
    </div>
  );
};

export default VerdictCard;
