import { Link } from "react-router-dom";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";

export function HomePage() {
  return (
    <Card>
      <div className="stack">
        <div>
          <h2 style={{ marginTop: 0 }}>Aprende vocabulario con LinguaSwap</h2>

          <p className="mutedText">
            Crea bibliotecas de palabras, añade traducciones en distintos idiomas
            y practica con sesiones interactivas para reforzar tu memoria.
          </p>
        </div>

        <div className="stack">
          <h3>¿Qué puedes hacer?</h3>

          <ul>
            <li>Probar una demo sin registrarte.</li>
            <li>Crear tus propias bibliotecas al iniciar sesión.</li>
            <li>Añadir, editar y eliminar términos.</li>
            <li>Practicar vocabulario desde tus bibliotecas.</li>
          </ul>
        </div>

        <div className="row">
          <Link to="/demo">
            <Button type="button" variant="buttonPrimary">
              Probar demo
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}