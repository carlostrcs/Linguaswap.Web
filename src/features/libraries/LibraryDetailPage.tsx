import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { useEffect, useState, type SubmitEvent } from "react";
import { getLibraryItems, type GetLibraryItemsItem } from "../../api/libraries";
import { ErrorMessage } from "../../components/ErrorMessage";
import { TextInput } from "../../components/TextInput";
import { createVocabItem, deleteTerm, deleteVocabItem, updateTerm } from "../../api/vocab";

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
    ]);
    const [deleteVocabItemError, setDeleteVocabItemError] = useState<{vocabItemId: string; message: string} | null>(null);
    const [deleteTermError, setDeleteTermError] = useState<{termId: string; message: string} | null>(null);
    const [updateTermError, setUpdateTermError] = useState<{termId: string; message: string;} | null>(null);
    const [editingTermId, setEditingTermId] = useState<string | null>(null);
    const [editingLanguageCode, setEditingLanguageCode] = useState("");
    const [editingText, setEditingText] = useState("");

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

    async function handleDeleteVocabItem(vocabItemId: string) {
        const ok = window.confirm("¿Seguro que quieres borrar este item?");
        if(!ok) return;

        setDeleteVocabItemError(null);
        setIsSaving(true);
        clearActionErrors();

        try {
            await deleteVocabItem(vocabItemId);
            await loadLibraryItems();
        }catch (e) {
            setDeleteVocabItemError(e instanceof Error ? 
                {vocabItemId:vocabItemId, message: e.message} : 
                {vocabItemId:vocabItemId, message: String(e)});
        }finally{
            setIsSaving(false);
        }
        
    }

    async function handleDeleteTerm(termId: string) {
        const ok = window.confirm("¿Seguro que quieres borrar este term?");
        if(!ok) return;

        setDeleteTermError(null);
        setIsSaving(true);
        clearActionErrors();

        try {
            await deleteTerm(termId);
            await loadLibraryItems();
        }catch (e) {
            setDeleteTermError(e instanceof Error ? 
                {termId:termId, message: e.message} : 
                {termId:termId, message: String(e)});
        }finally{
            setIsSaving(false);
        }
        
    }

    async function handleUpdateTerm(termId: string) {
        const languageCode = editingLanguageCode.trim().toLowerCase();
        const text = editingText.trim();

         if (!languageCode || !text) {
            setUpdateTermError({
                termId,
                message: "Completa el idioma y el texto antes de guardar.",
            });
            return;
        }

        clearActionErrors();
        setIsSaving(true);

        try {
            await updateTerm(termId, languageCode, text);
            await loadLibraryItems();

            setEditingTermId(null);
            setEditingLanguageCode("");
            setEditingText("");
        }catch (e) {
            setUpdateTermError({
                termId,
                message: e instanceof Error ? e.message : String(e),
            });
        }finally{
            setIsSaving(false);
        }
        
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
        clearActionErrors();

        try{
            const terms = termsForm.map((term) => ({
                languageCode: term.languageCode.trim().toLowerCase(),
                text: term.text.trim(),
            }));
            await createVocabItem(libraryId, terms);
            await loadLibraryItems();
            setTermsForm([createEmptyTermRow(), createEmptyTermRow()]);
            setIsCreating(false);
        }catch(e) {
            setCreateError(e instanceof Error ? e.message : String(e))
        }finally{
            setIsSaving(false);
        }
        
    }

    function clearActionErrors() {
        setCreateError(null);
        setDeleteVocabItemError(null);
        setDeleteTermError(null);
        setUpdateTermError(null);
        
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
                        <li key={item.vocabItemId} className="listItem card">
                            <div className="row">
                                <strong>Item</strong>

                                <Button type="button" 
                                    disabled = {isSaving}
                                    onClick={() => {
                                        handleDeleteVocabItem(item.vocabItemId);
                                    }}
                                >
                                    Eliminar
                                </Button>
                            </div>
                            
                            {deleteVocabItemError && deleteVocabItemError.vocabItemId === item.vocabItemId && (
                                <ErrorMessage message={deleteVocabItemError.message} />
                            )}
                            
                            <ul>
                                {item.terms.map((term) => (
                                    <li className="listItem" key={term.id}>
                                        <div>
                                            {editingTermId != term.id && (
                                                <>
                                                    <strong>{term.languageCode}:</strong> {term.text}
                                                </>
                                            )}
                                            {editingTermId === term.id && (
                                                <>
                                                    <label>Código de idioma:</label>
                                                    <TextInput type="text"
                                                        value={editingLanguageCode}
                                                        disabled = {isSaving}
                                                        placeholder="Código de idioma"
                                                        onValueChange={(value)=>{
                                                            setEditingLanguageCode(value);
                                                        }}
                                                    >
                                                    </TextInput>
                                                    <label>Texto:</label>
                                                    <TextInput type="text"
                                                        value={editingText}
                                                        disabled = {isSaving}
                                                        placeholder="Texto"
                                                        onValueChange={(value)=>{
                                                            setEditingText(value);
                                                        }}
                                                    ></TextInput>
                                                </>
                                            )}

                                            {editingTermId != term.id && (
                                                <Button type="button" 
                                                    disabled = {isSaving}
                                                    onClick={() => {
                                                        clearActionErrors();
                                                        setEditingTermId(term.id);
                                                        setEditingLanguageCode(term.languageCode);
                                                        setEditingText(term.text);
                                                    }}
                                                >
                                                    Editar
                                                </Button>
                                            )}

                                            {editingTermId === term.id && (
                                                <Button
                                                    type="button"
                                                    variant="primary"
                                                    disabled={isSaving || !editingLanguageCode.trim() || !editingText.trim()}
                                                    onClick={() => handleUpdateTerm(term.id)}
                                                >
                                                    {isSaving ? "Guardando..." : "Guardar"}
                                                </Button>
                                            )}

                                            {editingTermId === term.id && (
                                                <Button type="button" 
                                                disabled = {isSaving}
                                                onClick={() => {
                                                    setEditingTermId(null);
                                                    setEditingLanguageCode("");
                                                    setEditingText("");
                                                    setUpdateTermError(null);
                                                    clearActionErrors();
                                                }}
                                            >
                                                Cancelar
                                            </Button>
                                            )}

                                            <Button type="button" 
                                                disabled = {isSaving}
                                                onClick={() => {handleDeleteTerm(term.id)}}
                                            >
                                                Eliminar
                                            </Button>

                                        </div>
                                        
                                        {deleteTermError && deleteTermError.termId === term.id && (
                                            <ErrorMessage message={deleteTermError.message} />
                                        )}

                                        {updateTermError && updateTermError.termId === term.id && (
                                            <ErrorMessage message={updateTermError.message} />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}

            <ErrorMessage message={createError} />

            {!isCreating && (
                <Button type="button" onClick={()=>{setIsCreating(true); setCreateError(null); clearActionErrors()}} variant="primary" disabled = {isSaving}>Crear</Button>
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