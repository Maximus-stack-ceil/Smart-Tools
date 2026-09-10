import React, { useState, useMemo } from 'react';
import { ResultActionsRow } from '../ResultActionsRow';
import { RotateCcw, Clock, Volume2, AlignLeft, Sparkles } from 'lucide-react';

export const WordCounter: React.FC = () => {
  const [text, setText] = useState<string>(
    'SmartTools provides fast, simple and free browser-based tools to calculate, convert, generate and manage everyday tasks with zero registration.'
  );

  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return {
        words: 0,
        charsWithSpaces: 0,
        charsNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTimeMinutes: 0,
        speakingTimeMinutes: 0,
      };
    }

    const words = trimmed.split(/\s+/).filter(Boolean).length;
    const charsWithSpaces = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
    const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0).length;

    const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));
    const speakingTimeMinutes = Math.max(1, Math.ceil(words / 130));

    return {
      words,
      charsWithSpaces,
      charsNoSpaces,
      sentences,
      paragraphs,
      readingTimeMinutes,
      speakingTimeMinutes,
    };
  }, [text]);

  const handleReset = () => {
    setText('');
  };

  const handleLoadSample = () => {
    setText(
      'Online tools should be fast, private, and effortless. By processing logic directly inside the browser using modern client-side JavaScript, SmartTools delivers instant results without sending your text or personal calculations to external servers.'
    );
  };

  const summary = `${stats.words} words, ${stats.charsWithSpaces} characters, ${stats.sentences} sentences, ~${stats.readingTimeMinutes} min read`;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-xs">
      {/* Live Stats Overview Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-100 text-center">
          <span className="text-xs text-indigo-700 font-semibold uppercase tracking-wider block">
            Words
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-indigo-950">
            {stats.words.toLocaleString()}
          </span>
        </div>

        <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200/80 text-center">
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">
            Characters
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {stats.charsWithSpaces.toLocaleString()}
          </span>
        </div>

        <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200/80 text-center">
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">
            Sentences
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {stats.sentences.toLocaleString()}
          </span>
        </div>

        <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200/80 text-center">
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">
            Paragraphs
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {stats.paragraphs.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Editor Textarea */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="word-counter-textarea" className="block text-sm font-semibold text-gray-900">
            Enter or Paste Text
          </label>
          <button
            type="button"
            onClick={handleLoadSample}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Insert Sample Text
          </button>
        </div>

        <textarea
          id="word-counter-textarea"
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text here..."
          className="w-full px-4 py-3 rounded-xl text-sm text-gray-900 bg-white border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 transition-all font-sans leading-relaxed"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              Reading: ~{stats.readingTimeMinutes} min
            </span>
            <span className="flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-gray-400" />
              Speaking: ~{stats.speakingTimeMinutes} min
            </span>
            <span>No spaces: {stats.charsNoSpaces.toLocaleString()}</span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear Text
          </button>
        </div>
      </div>

      {/* Result Actions */}
      <ResultActionsRow resultText={summary} className="mt-6" />
    </div>
  );
};
