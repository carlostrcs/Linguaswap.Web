import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { useEffect, useState } from "react";
import { getLibraryItems, type GetLibraryItemsItem } from "../../api/libraries";
import { ErrorMessage } from "../../components/ErrorMessage";

export function LibraryDetailPage () {
    const navigate = useNavigate();
    const { libraryId }  = useParams<{ libraryId: string }>();
    const [items, setItems] = useState<GetLibraryItemsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        </Card>
    );
}