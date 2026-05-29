import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/authApi";
import { useState, type SubmitEvent } from "react";
import { Card } from "../../components/Card";
import { TextInput } from "../../components/TextInput";
import { ErrorMessage } from "../../components/ErrorMessage";
import { Button } from "../../components/Button";

export function RegisterPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>){ 
        e.preventDefault();

        setError(null);
        setLoading(true);

        try{
            await register({email, password});
            navigate("/login");
        }catch(e) {
            setError(e instanceof Error ? e.message : "Register failed");
        }finally{
            setLoading(false);
        }

    }

    return(
    <Card>
      <h2 style={{ marginTop: 0 }}>Regístrate</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <label htmlFor="email">Email</label>
          <TextInput
            id="email"
            type="email"
            value={email}
            onValueChange={(value) => setEmail(value)}
            placeholder="tu@email.com"
          />
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <label htmlFor="password">Contraseña</label>
          <TextInput
            id="password"
            type="password"
            value={password}
            onValueChange={(value) => setPassword(value)}
            placeholder="********"
          />
        </div>

        {error && (
                  <ErrorMessage message={error}>
                  </ErrorMessage>
        )}

        <Button
          type="submit"
          variant="primary"
          disabled={loading || !email.trim() || !password.trim()}
        >
          {loading ? "Registrando..." : "Registrarse"}
        </Button>
      </form>
      <p style={{marginTop: 16}}>¿Ya tienes cuenta? <Link to="/login">Inicia sesión.</Link></p>
    </Card>
    );

}