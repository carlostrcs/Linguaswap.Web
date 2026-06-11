import { useEffect, useMemo, useRef, useState, type SubmitEvent } from "react";
import { createLibrary, getMyLibraries, type LibraryListItem } from "../../api/libraries";
import { Card } from "../../components/Card";
import { TextInput } from "../../components/TextInput";
import { Button } from "../../components/Button";
import { ErrorMessage } from "../../components/ErrorMessage";
import { Link, useNavigate } from "react-router-dom";
import { startPracticeSession, type StartPracticeSessionRequest } from "../../api/practice";

export function MyLibrariesPage() {
    const navigate = useNavigate();
    const [libraries, setLibraries] = useState<LibraryListItem[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [createError, setCreateError] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [libraryName, setLibraryName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [selectedLibraryId, setSelectedLibraryId] = useState<string | null>(null);
    const libraryNameInputRef = useRef<HTMLInputElement | null>(null);
    const [starting, setStarting] = useState(false);
    const canStart = useMemo(() => {
        return !loading && !starting && !!selectedLibraryId;
      }, [loading, starting, selectedLibraryId]);


    useEffect(()=>{
        loadLibraries();
    }, []);

    useEffect(()=>{
        if(isCreating){
            libraryNameInputRef.current?.focus();
        }
    }, [isCreating]);

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
        if(!name){ return };
        setCreateError(null);
        setIsSaving(true);
        try{
            await createLibrary(name);
            await loadLibraries();
            setLibraryName("");
        }catch(e){
            setCreateError(e instanceof Error ? e.message : String(e));
        }finally{
            setIsSaving(false);
        }
    }

    async function startLibraryPractice() {
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
                <h3 style={{ margin: 0 }}>Mis bibliotecas</h3>
            
                <div className="spread" style={{ flexWrap: "wrap" }}>
                    {!isCreating && (
                        <Button type="button" onClick={()=>{setIsCreating(true)}} variant="buttonPrimary">Crear</Button>
                    )}

                    <Button
                        variant="buttonPrimary"
                        disabled={!canStart}
                        onClick={startLibraryPractice}
                        >
                        {starting ? "Iniciando..." : "Practicar demo"}
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
                    {libraries.map((library)=>{
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
                        )
                    })}
                </ul>
            )}
            <div>
                <ErrorMessage message={error} />
            </div>
            
            {isCreating && (
                <form className="spread" onSubmit={handleCreateLibrary}>
                    <TextInput type="text"
                        ref={libraryNameInputRef}
                        value={libraryName}
                        disabled = {isSaving}
                        placeholder="Nombre de librería"
                        onValueChange={(value)=>{
                            setLibraryName(value);
                        }}
                    />
                    <Button type="submit" variant="buttonPrimary" 
                        disabled={isSaving || !libraryName.trim()}>
                            {isSaving ? "Guardando..." : "Guardar"}
                    </Button>
                    <Button type="button" 
                        onClick={()=>{
                            setIsCreating(false);
                            setLibraryName("");
                            setCreateError(null);
                        }} 
                        disabled = {isSaving}>
                            Cancelar
                    </Button>
                    <div>
                        <ErrorMessage message={createError} />
                    </div>
                </form>
            )}
            

        </Card>
    );
}
