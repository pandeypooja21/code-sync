"use client";

import { LANGUAGE_VERSIONS } from "../constants";

const languages = Object.entries(LANGUAGE_VERSIONS);

export default function LanguageSelector({ language, onSelect }) {
  return (
    <div className="flex items-center">
      <span className="mr-2 text-gray-300">Language:</span>
      <select
        value={language}
        onChange={(e) => onSelect(e.target.value)}
        className="
          bg-gray-800 text-gray-200 text-sm
          rounded-md border border-gray-700
          px-3 py-1.5 outline-none
          hover:border-gray-600 focus:border-blue-500
          transition-colors
        "
      >
        {languages.map(([lang, version]) => (
          <option key={lang} value={lang}>
            {lang} ({version})
          </option>
        ))}
      </select>
    </div>
  );
}
