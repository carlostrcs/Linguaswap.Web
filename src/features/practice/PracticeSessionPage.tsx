import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getNextPracticeWord,
  submitAttempt,
  type GetNextPracticeWordResponse,
  type SubmitAttemptResponse,
} from "../../api/practice";

export function PracticeSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();

  const [currentWord, setCurrentWord] = useState<GetNextPracticeWordResponse | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<SubmitAttemptResponse | null>(null);

  const [loadingWord, setLoadingWord] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadNextWord() {
    if (!sessionId) return;

    setLoadingWord(true);
    setError(null);
    setFeedback(null);
    setAnswer("");

    try {
      const response = await getNextPracticeWord(sessionId);
      setCurrentWord(response);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setCurrentWord(null);
    } finally {
      setLoadingWord(false);
    }
  }

  useEffect(() => {
    loadNextWord();
  }, [sessionId]);

  async function handleSubmit() {
    if (!sessionId || !currentWord || !answer.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await submitAttempt(sessionId, {
        wordId: currentWord.wordId,
        userAnswer: answer,
      });

      setFeedback(response);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card">
      <div className="spread" style={{ marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: 0 }}>Práctica</h3>
          <p style={{ margin: "6px 0 0", color: "var(--muted-text)" }}>
            SessionId: <code>{sessionId}</code>
          </p>
        </div>

        <Link className="button" to="/">
          Volver
        </Link>
      </div>

      {loadingWord && <p>Cargando palabra...</p>}

      {error && (
        <p style={{ color: "var(--danger)" }}>
          Error: {error}
        </p>
      )}

      {!loadingWord && currentWord && (
        <>
          <div
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              background: "var(--bg)",
            }}
          >
            <p style={{ margin: 0, color: "var(--muted-text)" }}>Traduce:</p>
            <h2 style={{ margin: "8px 0 0" }}>{currentWord.prompt}</h2>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            <input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Escribe tu respuesta"
              style={{
                padding: 12,
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "var(--card)",
                color: "var(--text)",
              }}
            />

            {!feedback && (
              <button
                className="button buttonPrimary"
                onClick={handleSubmit}
                disabled={submitting || !answer.trim()}
              >
                {submitting ? "Comprobando..." : "Responder"}
              </button>
            )}

            {feedback && (
              <div
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                }}
              >
                <p style={{ margin: 0 }}>
                  {feedback.isCorrect ? "✅ Correcto" : "❌ Incorrecto"}
                </p>
                <p style={{ margin: "8px 0 0", color: "var(--muted-text)" }}>
                  Respuesta correcta: <strong>{feedback.correctAnswer}</strong>
                </p>

                <button
                  className="button buttonPrimary"
                  style={{ marginTop: 12 }}
                  onClick={loadNextWord}
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}