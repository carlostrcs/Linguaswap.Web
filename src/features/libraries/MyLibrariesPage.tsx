import { useEffect, useState } from "react";
import { getMyLibraries, type LibraryListItem } from "../../api/libraries";

export function MyLibrariesPage() {
    const [libraries, setLibraries] = useState<LibraryListItem[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(()=>{
        getMyLibraries().then(
            (response)=>{
                setLibraries(response);
            }
        ).catch(
            (e)=>{
                setError(e instanceof Error ? e.message : String(e));
            }
        ).finally(
            ()=>{
                setLoading(false);
            }
        )
    }, [])

    return (
        <div className="card">
            <div className="spread" style={{ marginBottom: 12 }}>
                <div>
                    <h3 style={{ margin: 0 }}>Mis bibliotecas</h3>
                </div>
            </div>

            {loading && <p>Cargando...</p>}

            {libraries && libraries.length === 0 && (
                <p style={{ color: "var(--muted-text)" }}>
                No hay bibliotecas propias.
                </p>
            )}

            <ul>
                {libraries?.map((library)=>{
                   return <li key={library.id}>{library.name}</li>
                })}
            </ul>
            <div>
                {error && (
                    <p style={{ color: "var(--danger)" }}>
                    Error: {error}
                    </p>
                )}
            </div>

        </div>
    );
}
