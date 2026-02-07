import React, { useState, useMemo } from 'react';
import { ChatSession } from '../types';

interface SearchConsultationsProps {
  sessions: ChatSession[];
  onSelect: (session: ChatSession) => Promise<void> | void;
  isOpen: boolean;
  onClose: () => void;
}

export const SearchConsultations: React.FC<SearchConsultationsProps> = ({
  sessions,
  onSelect,
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'all' | 'title' | 'content'>('all');

  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();

    return sessions.filter((session) => {
      if (searchType === 'title') {
        return session.title.toLowerCase().includes(query);
      }

      if (searchType === 'content') {
        return session.messages.some((msg) =>
          msg.content.toLowerCase().includes(query)
        );
      }

      // 'all' - search both title and content
      const titleMatch = session.title.toLowerCase().includes(query);
      const contentMatch = session.messages.some((msg) =>
        msg.content.toLowerCase().includes(query)
      );
      return titleMatch || contentMatch;
    });
  }, [searchQuery, searchType, sessions]);

  const handleSelect = async (session: ChatSession) => {
    await onSelect(session);
    setSearchQuery('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-start justify-center pt-20 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl mx-4 max-h-[70vh] overflow-hidden flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <h2 className="text-lg font-bold text-slate-800 animate-fade-in">Search Consultations</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200 rounded-lg"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Search Input and Filters */}
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search consultations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            {(['all', 'title', 'content'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSearchType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  searchType === type
                    ? 'bg-teal-600 text-white scale-105'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-105'
                }`}
              >
                {type === 'all' ? 'All' : type === 'title' ? 'Title' : 'Content'}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {searchQuery.trim() === '' ? (
            <div className="p-8 text-center">
              <p className="text-slate-400 text-sm">Enter a search term to find consultations</p>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-400 text-sm">No consultations found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredSessions.map((session) => {
                // Find matching message preview
                const matchingMessage = session.messages.find((msg) =>
                  msg.content.toLowerCase().includes(searchQuery.toLowerCase())
                );

                return (
                  <button
                    key={session.id}
                    onClick={() => handleSelect(session)}
                    className="w-full p-4 text-left hover:bg-slate-50 transition-all duration-200 hover:scale-102 origin-left group"
                  >
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-4 h-4 flex-shrink-0 text-teal-600 mt-1 group-hover:scale-125 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{session.title}</p>
                        {matchingMessage && (
                          <p className="text-sm text-slate-600 line-clamp-2 mt-1">
                            {matchingMessage.content.substring(0, 100)}
                            {matchingMessage.content.length > 100 ? '...' : ''}
                          </p>
                        )}
                        <p className="text-xs text-slate-400 mt-1">
                          {session.updatedAt instanceof Date
                            ? session.updatedAt.toLocaleString()
                            : new Date(session.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredSessions.length > 0 && searchQuery.trim() !== '' && (
          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <p className="text-xs text-slate-500 text-center">
              Found {filteredSessions.length} result{filteredSessions.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchConsultations;
