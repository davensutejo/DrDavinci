
import React from 'react';
import { AnalysisResult } from '../types';
import { SYMPTOMS_DB } from '../constants';

interface DiagnosisResultProps {
  results: AnalysisResult[];
}

const DiagnosisResult: React.FC<DiagnosisResultProps> = ({ results }) => {
  if (results.length === 0) return null;

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Cross-Referenced Candidates</span>
        <div className="flex-1 h-px bg-slate-100"></div>
      </div>
      
      {results.map((res, idx) => (
        <div key={idx} className="group bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden transition-all hover:bg-white hover:shadow-md hover:border-slate-200">
          <div className="p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">{res.disease.name}</h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {res.matchedSymptoms.map(sId => (
                    <span key={sId} className="text-[10px] font-medium bg-white text-slate-500 px-2 py-0.5 rounded-full border border-slate-200 shadow-sm">
                      {SYMPTOMS_DB.find(s => s.id === sId)?.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100 whitespace-nowrap">
                  {Math.round(res.score * 100)}% Index
                </span>
              </div>
            </div>
            
            <p className="text-[13px] text-slate-600 leading-relaxed mb-4">
              {res.disease.description}
            </p>
            
            <div className="bg-white/60 p-4 rounded-xl border border-slate-100 group-hover:bg-slate-50 transition-colors">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-2 tracking-wider">
                <svg className="w-3.5 h-3.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Reference Advice
              </h4>
              <p className="text-[13px] text-slate-700 italic font-medium leading-relaxed">
                "{res.disease.generalAdvice}"
              </p>
            </div>
          </div>
        </div>
      ))}
      
      <p className="text-[10px] text-center text-slate-400 font-medium px-4">
        Database reference provided for supplementary educational context.
      </p>
    </div>
  );
};

export default DiagnosisResult;
