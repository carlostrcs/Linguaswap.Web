import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { ErrorMessage } from "../../components/ErrorMessage";
import { startPracticeSession, type StartPracticeSessionRequest } from "../../api/practice";
import { getLibraryPracticeOptions, getPublicLibraries, type GetLibraryPracticeOptionsResult, type PublicLibrariesResponse } from "../../api/libraries";
import { PracticeLanguageSelector } from "../../components/PracticeLanguageSelector";


export function PublicLibrariesPage() {
  const navigate = useNavigate();

  const [data, setData] = useState<PublicLibrariesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedLibraryId, setSelectedLibraryId] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
    const [practiceOptionsError, setPracticeOptionsError] = useState<string | null>(null);

  const [practiceOptionsLoading, setPracticeOptionsLoading] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [practiceOptions, setPracticeOptions] =
      useState<GetLibraryPracticeOptionsResult | null>(null);

  useEffect(() => {
    loadPublicLibraries();
  }, []);

  useEffect(() => {
    if (!selectedLibraryId) {
          setPracticeOptions(null);
          setSourceLanguage("");
          setTargetLanguage("");
          setPracticeOptionsError(null);
          return;
    }

    let cancelled = false;

    async function loadPracticeOptions() {
              setPracticeOptionsLoading(true);
              setPracticeOptionsError(null);
    
              try {
              const response = await getLibraryPracticeOptions(selectedLibraryId!);
    
              if (cancelled) return;
    
              setPracticeOptions(response);
    
              const firstPair = response.pairs[0];
    
              if (firstPair) {
                  setSourceLanguage(firstPair.sourceLanguage);
                  setTargetLanguage(firstPair.targetLanguage);
              } else {
                  setSourceLanguage("");
                  setTargetLanguage("");
              }
              } catch (e) {
              if (cancelled) return;
    
              setPracticeOptionsError(e instanceof Error ? e.message : String(e));
              setPracticeOptions(null);
              setSourceLanguage("");
              setTargetLanguage("");
              } finally {
              if (!cancelled) {
                  setPracticeOptionsLoading(false);
              }
              }
          }
    
          loadPracticeOptions();
    
          return () => {
              cancelled = true;
          };

  }, [selectedLibraryId]);

  async function loadPublicLibraries() {
    setLoading(true);
    setError(null);

    try {
      const response = await getPublicLibraries();
      setData(response);
      setSelectedLibraryId(response.items[0]?.id ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  const canStart = useMemo(() => {
    return !loading && !starting && !!selectedLibraryId;
  }, [loading, starting, selectedLibraryId]);

  async function startDemoPractice() {
    if (!selectedLibraryId) return;

    setError(null);
    setStarting(true);

    try {

      const body: StartPracticeSessionRequest = {
        libraryId: selectedLibraryId,
        sourceLanguage: "es",
        targetLanguage: "en",
        direction: 1,
        difficulty: 1
      }
      const response = await startPracticeSession(body);

      navigate(`/practice/${response.sessionId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setStarting(false);
    }
  }

  return (
    <Card>
      <div className="spread" style={{ marginBottom: 12, flexWrap: "wrap" }}>
        <div>
          <h3 style={{ margin: 0 }}>Bibliotecas públicas</h3>
          <p style={{ margin: "6px 0 0", color: "var(--muted-text)" }}>
            Para probar la demo sin registrarte.
          </p>
        </div>
        <div className="toolbarActions">
          {practiceOptionsLoading && !practiceOptions && (
            <p className="mutedText">
                Cargando idiomas disponibles...
            </p>
          )}
          
          {practiceOptions && practiceOptions.pairs.length > 0 && (
            <PracticeLanguageSelector
            pairs={practiceOptions.pairs}
            sourceLanguage={sourceLanguage}
            targetLanguage={targetLanguage}
            disabled={starting}
            onSourceLanguageChange={(nextSourceLanguage, firstCompatibleTarget) => {
                setSourceLanguage(nextSourceLanguage);
                setTargetLanguage(firstCompatibleTarget);
            }}
            onTargetLanguageChange={setTargetLanguage}
            />
          )}

          {practiceOptions && practiceOptions.pairs.length === 0 && (
            <p style={{ color: "var(--muted-text)" }}>
            Esta biblioteca no tiene vocabulario compatible para iniciar una práctica.
            </p>
          )}
          <Button
            variant="buttonPrimary"
            disabled={!canStart}
            onClick={startDemoPractice}
          >
            {starting ? "Iniciando..." : "Practicar demo"}
          </Button>
          <Button type="button" onClick={() => navigate(-1)}>
            Volver
          </Button>
        </div>
      </div>

      {loading && <p>Cargando...</p>}

      <ErrorMessage message={practiceOptionsError} />
      <ErrorMessage message={error} />

      {data && data.items.length === 0 && (
        <p style={{ color: "var(--muted-text)" }}>
          No hay bibliotecas públicas.
        </p>
      )}

      {data && data.items.length > 0 && (
        <ul>
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
                  <Link to={`/libraries/${library.id}`}>
                    {library.name}
                  </Link>
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}