import { useEffect, useMemo, useRef, useState, type SubmitEvent } from "react";
import { createLibrary, getLibraryPracticeOptions, getMyLibraries, type GetLibraryPracticeOptionsResult, type LibraryListItem } from "../../api/libraries";
import { Card } from "../../components/Card";
import { TextInput } from "../../components/TextInput";
import { Button } from "../../components/Button";
import { ErrorMessage } from "../../components/ErrorMessage";
import { Link, useNavigate } from "react-router-dom";
import { startPracticeSession, type StartPracticeSessionRequest } from "../../api/practice";
import { PracticeLanguageSelector } from "../../components/PracticeLanguageSelector";

export function MyLibrariesPage() {
  const navigate = useNavigate();

  const [libraries, setLibraries] = useState<LibraryListItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [practiceOptionsError, setPracticeOptionsError] = useState<string | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [libraryName, setLibraryName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [selectedLibraryId, setSelectedLibraryId] = useState<string | null>(null);

  const [practiceOptions, setPracticeOptions] =
    useState<GetLibraryPracticeOptionsResult | null>(null);

  const [practiceOptionsLoading, setPracticeOptionsLoading] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");

  const libraryNameInputRef = useRef<HTMLInputElement | null>(null);

  const [starting, setStarting] = useState(false);

  const selectedPair = useMemo(() => {
    return practiceOptions?.pairs.find(
      (pair) =>
        pair.sourceLanguage === sourceLanguage &&
        pair.targetLanguage === targetLanguage
    );
  }, [practiceOptions, sourceLanguage, targetLanguage]);

  const canStart = useMemo(() => {
    return (
      !loading &&
      !starting &&
      !practiceOptionsLoading &&
      !!selectedLibraryId &&
      !!selectedPair &&
      sourceLanguage !== targetLanguage
    );
  }, [
    loading,
    starting,
    practiceOptionsLoading,
    selectedLibraryId,
    selectedPair,
    sourceLanguage,
    targetLanguage,
  ]);

  useEffect(() => {
    loadLibraries();
  }, []);

  useEffect(() => {
    if (isCreating) {
      libraryNameInputRef.current?.focus();
    }
  }, [isCreating]);

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
            const response = await getLibraryPracticeOptions(selectedLibraryId);

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

  async function loadLibraries() {
    setLoading(true);
    setError(null);

    try {
      const response = await getMyLibraries();
      setLibraries(response);
      setSelectedLibraryId(response[0]?.id ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateLibrary(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const name = libraryName.trim();

    if (!name) return;

    setCreateError(null);
    setIsSaving(true);

    try {
      await createLibrary(name);
      await loadLibraries();
      setLibraryName("");
      setIsCreating(false);
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsSaving(false);
    }
  }

  async function startLibraryPractice() {
    if (!selectedLibraryId || !selectedPair) return;

    if (sourceLanguage === targetLanguage) {
      setError("El idioma origen y el idioma destino deben ser diferentes.");
      return;
    }

    setError(null);
    setStarting(true);

    try {
      const body: StartPracticeSessionRequest = {
        libraryId: selectedLibraryId,
        sourceLanguage,
        targetLanguage,
        direction: 1,
        difficulty: 1,
      };

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
      <div className="spread" style={{ marginBottom: 12, flexWrap: "wrap"}}>
        <h3 style={{ margin: 0 }}>Mis bibliotecas</h3>

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

            {!isCreating && (
                <Button
                type="button"
                onClick={() => {
                    setIsCreating(true);
                }}
                variant="buttonPrimary"
                >
                Crear
                </Button>
            )}

            <Button
                variant="buttonPrimary"
                disabled={!canStart}
                onClick={startLibraryPractice}
            >
                {starting ? "Iniciando..." : "Practicar biblioteca"}
            </Button>

            <Button type="button" onClick={() => navigate(-1)}>
                Volver
            </Button>
        </div>
      </div>

      {loading && <p>Cargando...</p>}

      {!loading && !error && libraries && libraries.length === 0 && (
        <p style={{ color: "var(--muted-text)" }}>
          No hay bibliotecas propias.
        </p>
      )}

      {libraries && libraries.length > 0 && (
        <ul>
          {libraries.map((library) => {
            return (
              <li key={library.id}>
                <input
                  type="radio"
                  name="my-library"
                  checked={selectedLibraryId === library.id}
                  onChange={() => setSelectedLibraryId(library.id)}
                />
                <Link to={`/libraries/${library.id}`}>{library.name}</Link>
              </li>
            );
          })}
        </ul>
      )}

      <ErrorMessage message={practiceOptionsError} />
      <ErrorMessage message={error} />

      {isCreating && (
        <form className="spread" onSubmit={handleCreateLibrary}>
          <TextInput
            type="text"
            ref={libraryNameInputRef}
            value={libraryName}
            disabled={isSaving}
            placeholder="Nombre de librería"
            onValueChange={(value) => {
              setLibraryName(value);
            }}
          />

          <Button
            type="submit"
            variant="buttonPrimary"
            disabled={isSaving || !libraryName.trim()}
          >
            {isSaving ? "Guardando..." : "Guardar"}
          </Button>

          <Button
            type="button"
            onClick={() => {
              setIsCreating(false);
              setLibraryName("");
              setCreateError(null);
            }}
            disabled={isSaving}
          >
            Cancelar
          </Button>

          <ErrorMessage message={createError} />
        </form>
      )}
    </Card>
  );
}