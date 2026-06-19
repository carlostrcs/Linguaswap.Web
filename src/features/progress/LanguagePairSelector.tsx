// src/features/progress/LanguagePairSelector.tsx

import type { GetProgressByPairResult } from "../../api/progress";

type LanguagePairSelectorProps = {
  pairs: GetProgressByPairResult[];
  sourceLanguage: string;
  targetLanguage: string;
  disabled?: boolean;
  onChange: (value: {
    sourceLanguage: string;
    targetLanguage: string;
  }) => void;
};

const LANGUAGE_LABELS: Record<string, string> = {
  es: "Español",
  en: "Inglés",
  fr: "Francés",
  de: "Alemán",
  it: "Italiano",
  pt: "Portugués",
};

function getLanguageLabel(code: string) {
  return LANGUAGE_LABELS[code] ?? code.toUpperCase();
}

export function LanguagePairSelector({
  pairs,
  sourceLanguage,
  targetLanguage,
  disabled = false,
  onChange,
}: LanguagePairSelectorProps) {
  const sourceLanguages = Array.from(
    new Set(pairs.map((pair) => pair.sourceLanguage))
  ).sort();

  const targetPairs = pairs
    .filter((pair) => pair.sourceLanguage === sourceLanguage)
    .sort((a, b) => a.targetLanguage.localeCompare(b.targetLanguage));

  function handleSourceChange(nextSourceLanguage: string) {
    const firstCompatiblePair = pairs.find(
      (pair) => pair.sourceLanguage === nextSourceLanguage
    );

    onChange({
      sourceLanguage: nextSourceLanguage,
      targetLanguage: firstCompatiblePair?.targetLanguage ?? "",
    });
  }

  function handleTargetChange(nextTargetLanguage: string) {
    onChange({
      sourceLanguage,
      targetLanguage: nextTargetLanguage,
    });
  }

  return (
    <div className="sectionFilters">
      <div className="formField">
        <label>Origen</label>
        <select
          className="input"
          value={sourceLanguage}
          disabled={disabled || sourceLanguages.length === 0}
          onChange={(event) => handleSourceChange(event.target.value)}
        >
          {sourceLanguages.map((language) => (
            <option key={language} value={language}>
              {getLanguageLabel(language)}
            </option>
          ))}
        </select>
      </div>

      <div className="formField">
        <label>Destino</label>
        <select
          className="input"
          value={targetLanguage}
          disabled={disabled || targetPairs.length === 0}
          onChange={(event) => handleTargetChange(event.target.value)}
        >
          {targetPairs.map((pair) => (
            <option key={pair.targetLanguage} value={pair.targetLanguage}>
              {getLanguageLabel(pair.targetLanguage)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}