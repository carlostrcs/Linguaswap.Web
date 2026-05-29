import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { createLibrary, getMyLibraries, type LibraryListItem } from "../../api/libraries";
import { Card } from "../../components/Card";
import { TextInput } from "../../components/TextInput";
import { Button } from "../../components/Button";
import { ErrorMessage } from "../../components/ErrorMessage";

export function MyLibrariesPage() {
    const [libraries, setLibraries] = useState<LibraryListItem[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [createError, setCreateError] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [libraryName, setLibraryName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const libraryNameInputRef = useRef<HTMLInputElement | null>(null);

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

    return (
        <Card>
            <div className="spread" style={{ marginBottom: 12 }}>
                <div>
                    <h3 style={{ margin: 0 }}>Mis bibliotecas</h3>
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
                    return <li key={library.id}>{library.name}</li>
                    })}
                </ul>
            )}
            <div>
                {error && (
                    <ErrorMessage message={error}>
                    </ErrorMessage>
                )}
            </div>

            {!isCreating && (
                <Button type="button" onClick={()=>{setIsCreating(true)}} variant="primary">Crear</Button>
            )}
            
            {isCreating && (
                <form onSubmit={handleCreateLibrary}>
                    <TextInput type="text"
                        ref={libraryNameInputRef}
                        value={libraryName}
                        disabled = {isSaving}
                        placeholder="Nombre de librería"
                        onValueChange={(value)=>{
                            setLibraryName(value);
                        }}
                    />
                    <Button type="submit" variant="primary" 
                        disabled={isSaving || !libraryName.trim()}>
                            {isSaving ? "Guardando..." : "Guardar"}
                    </Button>
                    <Button type="button" 
                        onClick={()=>{
                            setIsCreating(false);
                            setLibraryName("");
                            setCreateError(null);
                        }} 
                        variant="primary"
                        disabled = {isSaving}>
                            Cancelar
                    </Button>
                    <div>
                        {createError && (
                            <ErrorMessage message={createError}>
                            </ErrorMessage>
                        )}
                    </div>
                </form>
            )}
            

        </Card>
    );
}
