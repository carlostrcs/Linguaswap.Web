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

export function ProgressDashboardPage() {
  const [summary, setSummary] = useState<GetProgressSummaryResult | null>(null);
  const [byLanguage, setByLanguage] = useState<GetProgressByLanguageResult[]>([]);
  const [byPair, setByPair] = useState<GetProgressByPairResult[]>([]);
  const [history, setHistory] = useState<GetProgressHistoryResult[]>([]);
  const [topMistakes, setTopMistakes] = useState<GetTopMistakesResult[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const source = "es";
  const target = "en";

  useEffect(() => {
    loadProgress();
  }, []);

  async function loadProgress() {
    setLoading(true);
    setError(null);

    try {
      const [summaryResult, byLanguageResult, byPairResult, history , topMistakes] =
        await Promise.all([
          getProgressSummary({ source, target }),
          getProgressByLanguage(),
          getProgressByPair(),
          getProgressHistory({source, target, days: 30}),
          getTopMistakes({source, target, limit: 10})
        ]);

      setSummary(summaryResult);
      setByLanguage(byLanguageResult);
      setByPair(byPairResult);
      setHistory(history);
      setTopMistakes(topMistakes);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
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

        {loading && <p>Cargando estadísticas...</p>}

        <ErrorMessage message={error} />

        {!loading && !error && summary && (
          <>
            <section className="card">
              <h4 style={{ marginTop: 0 }}>Resumen general</h4>

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
              <h4 style={{ marginTop: 0 }}>Histórico</h4>

              {history.length === 0 ? (
                <p className="mutedText">Todavía no hay datos históricos.</p>
              ) : (
                <ul className="list">
                  {history.map((item) => (
                    <li
                      key={`${item.day}`}
                      className="listItem"
                    >
                      <strong>{item.day}</strong>
                      <p className="mutedText">
                        {item.totalAttempts} intentos · {item.correctAttempts} correctos · {item.incorrectAttempts} incorrectos
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="card">
              <h4 style={{ marginTop: 0 }}>Palabras con más errores</h4>

              {topMistakes.length === 0 ? (
                <p className="mutedText">Todavía no hay errores suficientes.</p>
              ) : (
                <ul className="list">
                  {topMistakes.map((item) => (
                    <li key={item.vocabItemId} className="listItem">
                      <strong>{item.sourceText}</strong>
                      <p className="mutedText">
                        {item.incorrectAttempts} errores · {item.correctAttempts} correctos ·{" "}
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