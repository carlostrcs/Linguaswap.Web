import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../../api/http";

type PublicLibrariesResponse = {
  items: { id: string; name: string }[];
};

type StartPracticeSessionResponse = {
  sessionId: string;
};

export function PublicLibrariesPage() {
  const navigate = useNavigate();

  const [data, setData] = useState<PublicLibrariesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedLibraryId, setSelectedLibraryId] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    apiGet<PublicLibrariesResponse>("/api/libraries/public")
      .then((response) => {
        setData(response);
        setSelectedLibraryId(response.items[0]?.id ?? null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, []);

  const canStart = useMemo(() => {
    return !loading && !starting && !!selectedLibraryId;
  }, [loading, starting, selectedLibraryId]);

  async function startDemoPractice() {
    if (!selectedLibraryId) return;

    setError(null);
    setStarting(true);

    try {
      const response = await apiPost<StartPracticeSessionResponse, {
        libraryId: string;
        sourceLanguage: string;
        targetLanguage: string;
        direction: number;
        difficulty: number;
      }>("/api/practice/sessions", {
        libraryId: selectedLibraryId,
        sourceLanguage: "es",
        targetLanguage: "en",
        direction: 1,
        difficulty: 1,
      });

      navigate(`/practice/${response.sessionId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setStarting(false);
    }
  }

  return (
    <div className="card">
      <div className="spread" style={{ marginBottom: 12 }}>
        <div>
          <h3 style={{ margin: 0 }}>Bibliotecas públicas</h3>
          <p style={{ margin: "6px 0 0", color: "var(--muted-text)" }}>
            Para probar la demo sin registrarte.
          </p>
        </div>

        <button
          className="button buttonPrimary"
          disabled={!canStart}
          onClick={startDemoPractice}
        >
          {starting ? "Iniciando..." : "Practicar demo"}
        </button>
      </div>

      {loading && <p>Cargando...</p>}

      {error && (
        <p style={{ color: "var(--danger)" }}>
          Error: {error}
          <br />
          Tip: abre{" "}
          <code>https://localhost:7019/api/libraries/public</code> en el navegador y comprueba que responde.
        </p>
      )}

      {data && data.items.length === 0 && (
        <p style={{ color: "var(--muted-text)" }}>
          No hay bibliotecas públicas.
        </p>
      )}

      {data && data.items.length > 0 && (
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          {data.items.map((library) => (
            <li key={library.id} style={{ marginBottom: 8 }}>
              <label
                className="spread"
                style={{ cursor: "pointer", gap: 16 }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="radio"
                    name="public-library"
                    checked={selectedLibraryId === library.id}
                    onChange={() => setSelectedLibraryId(library.id)}
                  />
                  {library.name}
                </span>

                <small style={{ color: "var(--muted-text)" }}>
                  {library.id}
                </small>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}