import { useEffect, useState } from "react";
import { Card } from "../../components/Card";
import { ErrorMessage } from "../../components/ErrorMessage";
import {
  getProgressByLanguage,
  getProgressByPair,
  getProgressHistory,
  getProgressSummary,
  getTopMistakes,
  type GetTopMistakesResult,
  type GetProgressByLanguageResult,
  type GetProgressByPairResult,
  type GetProgressHistoryResult,
  type GetProgressSummaryResult,
} from "../../api/progress";
import { LanguagePairSelector } from "./LanguagePairSelector";
import { HistoryRangeSelector, type HistoryRangeDays } from "./HistoryRangeSelector";

type PairFilter = {
  sourceLanguage: string;
  targetLanguage: string;
};

const emptyPairFilter: PairFilter = {
  sourceLanguage: "",
  targetLanguage: "",
};

export function ProgressDashboardPage() {
  const [summary, setSummary] = useState<GetProgressSummaryResult | null>(null);
  const [byLanguage, setByLanguage] = useState<GetProgressByLanguageResult[]>([]);
  const [byPair, setByPair] = useState<GetProgressByPairResult[]>([]);
  const [history, setHistory] = useState<GetProgressHistoryResult[]>([]);
  const [topMistakes, setTopMistakes] = useState<GetTopMistakesResult[]>([]);

  const [summaryFilter, setSummaryFilter] =
    useState<PairFilter>(emptyPairFilter);
  const [historyFilter, setHistoryFilter] =
    useState<PairFilter>(emptyPairFilter);
  const [mistakesFilter, setMistakesFilter] =
    useState<PairFilter>(emptyPairFilter);

  const [historyDays, setHistoryDays] = useState<HistoryRangeDays>(30);

  const [overviewLoading, setOverviewLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [mistakesLoading, setMistakesLoading] = useState(false);

  const [overviewError, setOverviewError] = useState<string | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [mistakesError, setMistakesError] = useState<string | null>(null);

  useEffect(() => {
    loadOverview();
  }, []);

  useEffect(() => {
    if (!summaryFilter.sourceLanguage || !summaryFilter.targetLanguage) {
      setSummary(null);
      return;
    }

    let cancelled = false;

    async function loadSummary() {
      setSummaryLoading(true);
      setSummaryError(null);

      try {
        const result = await getProgressSummary({
          source: summaryFilter.sourceLanguage,
          target: summaryFilter.targetLanguage,
        });

        if (!cancelled) {
          setSummary(result);
        }
      } catch (e) {
        if (!cancelled) {
          setSummaryError(e instanceof Error ? e.message : String(e));
        }
      } finally {
        if (!cancelled) {
          setSummaryLoading(false);
        }
      }
    }

    loadSummary();

    return () => {
      cancelled = true;
    };
  }, [summaryFilter.sourceLanguage, summaryFilter.targetLanguage]);

  useEffect(() => {
    if (!historyFilter.sourceLanguage || !historyFilter.targetLanguage) {
      setHistory([]);
      return;
    }

    let cancelled = false;

    async function loadHistory() {
      setHistoryLoading(true);
      setHistoryError(null);

      try {
        const result = await getProgressHistory({
          source: historyFilter.sourceLanguage,
          target: historyFilter.targetLanguage,
          days: historyDays,
        });

        if (!cancelled) {
          setHistory(result);
        }
      } catch (e) {
        if (!cancelled) {
          setHistoryError(e instanceof Error ? e.message : String(e));
        }
      } finally {
        if (!cancelled) {
          setHistoryLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [
    historyFilter.sourceLanguage,
    historyFilter.targetLanguage,
    historyDays,
  ]);

  useEffect(() => {
    if (!mistakesFilter.sourceLanguage || !mistakesFilter.targetLanguage) {
      setTopMistakes([]);
      return;
    }

    let cancelled = false;

    async function loadTopMistakes() {
      setMistakesLoading(true);
      setMistakesError(null);

      try {
        const result = await getTopMistakes({
          source: mistakesFilter.sourceLanguage,
          target: mistakesFilter.targetLanguage,
          limit: 10,
        });

        if (!cancelled) {
          setTopMistakes(result);
        }
      } catch (e) {
        if (!cancelled) {
          setMistakesError(e instanceof Error ? e.message : String(e));
        }
      } finally {
        if (!cancelled) {
          setMistakesLoading(false);
        }
      }
    }

    loadTopMistakes();

    return () => {
      cancelled = true;
    };
  }, [mistakesFilter.sourceLanguage, mistakesFilter.targetLanguage]);

  async function loadOverview() {
    setOverviewLoading(true);
    setOverviewError(null);

    try {
      const [byLanguageResult, byPairResult] = await Promise.all([
        getProgressByLanguage(),
        getProgressByPair(),
      ]);

      setByLanguage(byLanguageResult);
      setByPair(byPairResult);

      const firstPair = byPairResult[0];

      if (firstPair) {
        const initialFilter = {
          sourceLanguage: firstPair.sourceLanguage,
          targetLanguage: firstPair.targetLanguage,
        };

        setSummaryFilter(initialFilter);
        setHistoryFilter(initialFilter);
        setMistakesFilter(initialFilter);
      } else {
        setSummaryFilter(emptyPairFilter);
        setHistoryFilter(emptyPairFilter);
        setMistakesFilter(emptyPairFilter);
      }
    } catch (e) {
      setOverviewError(e instanceof Error ? e.message : String(e));
    } finally {
      setOverviewLoading(false);
    }
  }

  function formatAccuracy(value: number) {
    return `${Math.round(value * 100)}%`;
  }

  return (
    <Card>
      <div className="stack">
        <div>
          <h3 style={{ marginTop: 0 }}>Estadísticas</h3>
          <p className="mutedText">
            Resumen de tu progreso practicando vocabulario.
          </p>
        </div>

        {overviewLoading && <p>Cargando estadísticas...</p>}

        <ErrorMessage message={overviewError} />

        {!overviewLoading && !overviewError && byPair.length === 0 && (
          <p className="mutedText">
            Todavía no hay datos de práctica. Cuando completes sesiones,
            aparecerán aquí tus estadísticas.
          </p>
        )}

        {!overviewLoading && !overviewError && byPair.length > 0 && (
          <>
            <section className="card">
              <div className="sectionHeader">
                <div>
                  <h4 style={{ marginTop: 0 }}>Resumen general</h4>
                  <p className="mutedText">
                    Estadísticas para el par de idiomas seleccionado.
                  </p>
                </div>

                <LanguagePairSelector
                  pairs={byPair}
                  sourceLanguage={summaryFilter.sourceLanguage}
                  targetLanguage={summaryFilter.targetLanguage}
                  disabled={summaryLoading}
                  onChange={setSummaryFilter}
                />
              </div>

              {summaryLoading && (
                <p className="mutedText">Actualizando resumen...</p>
              )}

              <ErrorMessage message={summaryError} />

              {summary && (
                <div className="row">
                  <div>
                    <strong>Precisión total</strong>
                    <p>{formatAccuracy(summary.accuracy)}</p>
                  </div>

                  <div>
                    <strong>Intentos totales</strong>
                    <p>{summary.totalAttempts}</p>
                  </div>

                  <div>
                    <strong>Intentos correctos</strong>
                    <p>{summary.correctAttempts}</p>
                  </div>

                  <div>
                    <strong>Intentos incorrectos</strong>
                    <p>{summary.incorrectAttempts}</p>
                  </div>

                  <div>
                    <strong>Palabras practicadas</strong>
                    <p>{summary.distinctWords}</p>
                  </div>
                </div>
              )}
            </section>

            <section className="card">
              <h4 style={{ marginTop: 0 }}>Stats por idioma</h4>

              {byLanguage.length === 0 ? (
                <p className="mutedText">Todavía no hay datos por idioma.</p>
              ) : (
                <ul className="list">
                  {byLanguage.map((item) => (
                    <li key={item.targetLanguage} className="listItem">
                      <strong>{item.targetLanguage}</strong>
                      <p className="mutedText">
                        {item.totalAttempts} intentos ·{" "}
                        {formatAccuracy(item.accuracy)} precisión ·{" "}
                        {item.distinctWords} palabras ·{" "}
                        {item.correctAttempts} correctos ·{" "}
                        {item.incorrectAttempts} incorrectos
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="card">
              <h4 style={{ marginTop: 0 }}>Stats por par</h4>

              {byPair.length === 0 ? (
                <p className="mutedText">Todavía no hay datos por par.</p>
              ) : (
                <ul className="list">
                  {byPair.map((item) => (
                    <li
                      key={`${item.sourceLanguage}-${item.targetLanguage}`}
                      className="listItem"
                    >
                      <strong>
                        {item.sourceLanguage} → {item.targetLanguage}
                      </strong>
                      <p className="mutedText">
                        {item.totalAttempts} intentos ·{" "}
                        {formatAccuracy(item.accuracy)} precisión ·{" "}
                        {item.distinctWords} palabras ·{" "}
                        {item.correctAttempts} correctos ·{" "}
                        {item.incorrectAttempts} incorrectos
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="card">
              <div className="sectionHeader">
                <div>
                  <h4 style={{ marginTop: 0 }}>Histórico</h4>
                  <p className="mutedText">
                    Evolución de intentos durante el rango seleccionado.
                  </p>
                </div>

                <div className="sectionFilters">
                  <LanguagePairSelector
                    pairs={byPair}
                    sourceLanguage={historyFilter.sourceLanguage}
                    targetLanguage={historyFilter.targetLanguage}
                    disabled={historyLoading}
                    onChange={setHistoryFilter}
                  />

                  <HistoryRangeSelector
                    value={historyDays}
                    disabled={historyLoading}
                    onChange={setHistoryDays}
                  />
                </div>
              </div>

              {historyLoading && (
                <p className="mutedText">Actualizando histórico...</p>
              )}

              <ErrorMessage message={historyError} />

              {history.length === 0 ? (
                <p className="mutedText">Todavía no hay datos históricos.</p>
              ) : (
                <ul className="list">
                  {history.map((item) => (
                    <li key={item.day} className="listItem">
                      <strong>{item.day}</strong>
                      <p className="mutedText">
                        {item.totalAttempts} intentos · {item.correctAttempts} correctos ·{" "}
                        {item.incorrectAttempts} incorrectos ·{" "}
                        {formatAccuracy(item.accuracy)} precisión
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="card">
              <div className="sectionHeader">
                <div>
                  <h4 style={{ marginTop: 0 }}>Palabras con más errores</h4>
                  <p className="mutedText">
                    Vocabulario con peor precisión para el par seleccionado.
                  </p>
                </div>

                <LanguagePairSelector
                  pairs={byPair}
                  sourceLanguage={mistakesFilter.sourceLanguage}
                  targetLanguage={mistakesFilter.targetLanguage}
                  disabled={mistakesLoading}
                  onChange={setMistakesFilter}
                />
              </div>

              {mistakesLoading && (
                <p className="mutedText">Actualizando errores...</p>
              )}

              <ErrorMessage message={mistakesError} />

              {topMistakes.length === 0 ? (
                <p className="mutedText">Todavía no hay errores suficientes.</p>
              ) : (
                <ul className="list">
                  {topMistakes.map((item) => (
                    <li key={item.vocabItemId} className="listItem">
                      <strong>
                        {item.sourceText} → {item.targetText}
                      </strong>
                      <p className="mutedText">
                        {item.incorrectAttempts} errores ·{" "}
                        {item.correctAttempts} correctos ·{" "}
                        {formatAccuracy(item.accuracy)} precisión
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </Card>
  );
}