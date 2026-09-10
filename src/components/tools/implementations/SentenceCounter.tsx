import React, { useState } from 'react';
import { ResultActionsRow } from '../ResultActionsRow';
import { BookOpen, RotateCcw } from 'lucide-react';
import { trackEvent } from '../../../utils/analytics';

export const SentenceCounter: React.FC = () => {
  const [text, setText] = useState<string>(
    'SmartTools provides browser-based utilities for daily tasks. Every calculation occurs entirely on your device with complete privacy. Users can format text, generate strong passwords, and convert units without sending data to servers.'
  );

  const cleanText = text.trim();
  const sentencesList = cleanText ? cleanText.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) || [] : [];
  const totalSentences = sentencesList.length;
  const wordsList = cleanText ? cleanText.split(/\s+/).filter(Boolean) : [];
  const totalWords = wordsList.length;

  const avgWordsPerSentence = totalSentences > 0 ? (totalWords / totalSentences).toFixed(1) : '0';

  // Approximate syllable counter
  const countSyllables = (word: string) => {
    word = word.toLowerCase().replace(/(?:[^laeiouy]|ed|es|e)$/, '').replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  };

  const totalSyllables = wordsList.reduce((acc, w) => acc + countSyllables(w), 0);

  // Flesch-Kincaid Reading Ease = 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
  let fleschScore = 0;
  let readingLevel = 'N/A';
  if (totalWords > 0 && totalSentences > 0) {
    fleschScore = Math.max(0, Math.min(100, 206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (totalSyllables / totalWords)));
    if (fleschScore >= 80) readingLevel = 'Easy / Elementary School';
    else if (fleschScore >= 60) readingLevel = 'Standard / Plain English';
    else if (fleschScore >= 50) readingLevel = 'Fairly Difficult / High School';
    else readingLevel = 'Difficult / College Academic';
  }

  const handleClear = () => {
    setText('');
  };

  const resultText = `Sentences: ${totalSentences} | Total Words: ${totalWords} | Avg Words/Sentence: ${avgWordsPerSentence} | Flesch Reading Score: ${fleschScore.toFixed(0)}/100 (${readingLevel})`;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-3.5 text-center">
          <div className="text-3xl font-extrabold text-purple-700 tracking-tight">{totalSentences}</div>
          <div className="text-xs font-semibold text-gray-600 mt-0.5">Total Sentences</div>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3.5 text-center">
          <div className="text-3xl font-extrabold text-indigo-700 tracking-tight">{avgWordsPerSentence}</div>
          <div className="text-xs font-semibold text-gray-600 mt-0.5">Words / Sentence</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 text-center">
          <div className="text-3xl font-extrabold text-emerald-700 tracking-tight">{Math.round(fleschScore)}</div>
          <div className="text-xs font-semibold text-gray-600 mt-0.5">Reading Ease (0-100)</div>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 text-center">
          <div className="text-3xl font-extrabold text-blue-700 tracking-tight">{totalWords}</div>
          <div className="text-xs font-semibold text-gray-600 mt-0.5">Total Words</div>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Document Content</span>
          </label>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-medium text-gray-500 hover:text-rose-600 transition-colors"
          >
            Clear
          </button>
        </div>
        <textarea
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste articles, essays, or copy here to analyze sentence cadence and readability..."
          className="w-full p-4 rounded-xl border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm text-gray-900 leading-relaxed font-sans"
        />
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Readability Grade Level
            </div>
            <div className="text-base font-bold text-gray-900 mt-0.5">
              {readingLevel}
            </div>
          </div>
          <span className="text-xs font-medium text-gray-500 max-w-xs text-right">
            Calculated via standard Flesch Reading Ease algorithm
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-200">
        <ResultActionsRow resultText={resultText} />
      </div>
    </div>
  );
};
