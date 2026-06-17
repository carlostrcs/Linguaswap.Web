import type { PracticeLanguagePairResult } from "../api/libraries";

type PracticeLanguageSelectorProps = {
  pairs: PracticeLanguagePairResult[];
  sourceLanguage: string;
  targetLanguage: string;
  disabled?: boolean;
  onSourceLanguageChange: (sourceLanguage: string, firstCompatibleTarget: string) => void;
  onTargetLanguageChange: (targetLanguage: string) => void;
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

export function PracticeLanguageSelector({
  pairs,
  sourceLanguage,
  targetLanguage,
  disabled = false,
  onSourceLanguageChange,
  onTargetLanguageChange,
}: PracticeLanguageSelectorProps) {
  const sourceLanguages = Array.from(
    new Set(pairs.map((pair) => pair.sourceLanguage))
  ).sort();

  const targetPairs = pairs
    .filter((pair) => pair.sourceLanguage === sourceLanguage)
    .sort((a, b) => a.targetLanguage.localeCompare(b.targetLanguage));

  function handleSourceChange(nextSourceLanguage: string) {
    const firstCompatibleTarget =
      pairs.find((pair) => pair.sourceLanguage === nextSourceLanguage)
        ?.targetLanguage ?? "";

    onSourceLanguageChange(nextSourceLanguage, firstCompatibleTarget);
  }

  return (
    <div className="spread" style={{ flexWrap: "wrap"}}>
      <div>
        <label htmlFor="sourceLanguage">Idioma origen</label>
        <select
          style={{marginTop: "0.5em"}}
          id="sourceLanguage"
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

      <div>
        <label htmlFor="targetLanguage">Idioma destino</label>
        <select
          style={{marginTop: "0.5em"}}
          id="targetLanguage"
          className="input"
          value={targetLanguage}
          disabled={disabled || targetPairs.length === 0}
          onChange={(event) => onTargetLanguageChange(event.target.value)}
        >
          {targetPairs.map((pair) => (
            <option key={pair.targetLanguage} value={pair.targetLanguage}>
              {getLanguageLabel(pair.targetLanguage)} · {pair.vocabItemCount} items
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}