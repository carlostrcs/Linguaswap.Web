import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { useEffect, useState, type SubmitEvent } from "react";
import { getLibraryItems, type GetLibraryItemsItem } from "../../api/libraries";
import { ErrorMessage } from "../../components/ErrorMessage";
import { TextInput } from "../../components/TextInput";
import { createVocabItem } from "../../api/vocab";

export function LibraryDetailPage () {
    const navigate = useNavigate();
    const { libraryId }  = useParams<{ libraryId: string }>();
    const [items, setItems] = useState<GetLibraryItemsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);
    const [termsForm, setTermsForm] = useState([
        { id: crypto.randomUUID(), languageCode: "", text: "" },
        { id: crypto.randomUUID(), languageCode: "", text: "" }
    ])


    useEffect(()=>{
        loadLibraryItems();
    }, [libraryId]);

    async function loadLibraryItems() {
        if (!libraryId) {
            setError("Library id missing.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await getLibraryItems(libraryId);
            setItems(result.items);
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e))
        } finally {
            setLoading(false);
        }

    }

    function createEmptyTermRow() {
        return {
            id: crypto.randomUUID(),
            languageCode: "",
            text: "",
        };
    }

    function updateTermRow(id: string, field: string, value: string) {
        setTermsForm((current) => {
            return current.map((term)=>{
                return term.id === id ? { ...term, [field]: value } : term
            });
        });
    }

    function addTermRow() {
        setTermsForm((current) => [...current, createEmptyTermRow()]);
    }

    function removeTermRow(id: string) {
        setTermsForm((current) => {
            if (current.length <= 2) return current;
            return current.filter((term) => term.id !== id);
        });
    }

    function areEmptyTermRows() {
        return termsForm.some(
            (term) => term.languageCode.trim() === "" || term.text.trim() === ""
        );
    }

    async function handleCreateVocabItem(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!libraryId) {
            setCreateError("Library id missing.");
            return;
        }

        if (areEmptyTermRows()) {
            setCreateError("Completa todos los términos antes de guardar.");
            return;
        }

        setIsSaving(true);
        setCreateError(null);

        try{
            const terms = termsForm.map((term) => ({
                languageCode: term.languageCode.trim().toLowerCase(),
                text: term.text.trim(),
            }));
            await createVocabItem(libraryId, terms);
            await loadLibraryItems();
            setTermsForm([createEmptyTermRow(), createEmptyTermRow()]);
        }catch(e) {
            setCreateError(e instanceof Error ? e.message : String(e))
        }finally{
            setIsSaving(false);
            setIsCreating(false);
        }
        
    }

    return(
        <Card>
            <div className="spread" style={{ marginBottom: 16 }}>
                <div>
                    <h3 style={{ margin: 0 }}>Detalles de biblioteca</h3>
                </div>

                <Button type="button" onClick={() => navigate(-1)}>
                    Volver
                </Button>
            </div>

            {loading && <p>Cargando palabras...</p>}

            <ErrorMessage message={error} />

            {!loading && !error && items.length === 0 && (
                <p className="mutedText">Esta biblioteca todavía no tiene palabras.</p>
            )}

            {!loading && !error && items.length > 0 && (
                <ul className="list">
                    {items.map((item) => (
                    <li key={item.vocabItemId} className="listItem">
                        <strong>Item</strong>

                        <ul>
                        {item.terms.map((term) => (
                            <li key={term.id}>
                            <strong>{term.languageCode}</strong>: {term.text}
                            </li>
                        ))}
                        </ul>
                    </li>
                    ))}
                </ul>
            )}

            <ErrorMessage message={createError} />

            {!isCreating && (
                <Button type="button" onClick={()=>{setIsCreating(true)}} variant="primary">Crear</Button>
            )}

            {isCreating && (
                <form onSubmit={handleCreateVocabItem}>
                    {termsForm.map((term)=>(
                        <div key={term.id} className="row">
                            <label>Código de idioma:</label>
                            <TextInput type="text"
                                value={term.languageCode}
                                disabled = {isSaving}
                                placeholder="Código de idioma"
                                onValueChange={(value)=>{
                                    updateTermRow(term.id, "languageCode", value);
                                }}
                            >
                            </TextInput>
                            <label>Texto:</label>
                            <TextInput type="text"
                                value={term.text}
                                disabled = {isSaving}
                                placeholder="Texto"
                                onValueChange={(value)=>{
                                    updateTermRow(term.id, "text", value);
                                }}
                            ></TextInput>
                            <Button type="button" 
                                disabled = {isSaving || termsForm.length <= 2}
                                onClick={() => {removeTermRow(term.id)}}
                            >
                                Eliminar
                            </Button>
                        </div>
                    ))}

                    <Button type="submit" 
                        variant="primary"
                        disabled = {isSaving || termsForm.length < 2 || areEmptyTermRows()}
                    >
                        {isSaving ? "Guardando..." : "Guardar"}
                    </Button>
                    <Button type="button" 
                        onClick={()=>{
                            setIsCreating(false);
                            setTermsForm([createEmptyTermRow(), createEmptyTermRow()]);
                            setCreateError(null);
                        }} 
                        variant="primary"
                        disabled = {isSaving}>
                            Cancelar
                    </Button>
                    <Button type="button" 
                        disabled = {isSaving}
                        onClick={() => {addTermRow()}}
                    >
                        Añadir term
                    </Button>
                    
                </form>
            )}
        </Card>
    );
}