import { useState, type SubmitEvent } from "react";
import { login } from "../../api/authApi";
import { setToken } from "../../auth/auth";
import { Link, useNavigate } from "react-router-dom";
import { TextInput } from "../../components/TextInput";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { ErrorMessage } from "../../components/ErrorMessage";

export function LoginPage() {
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
            const response = await login({email, password});

            setToken(response.token);
            navigate("/libraries");
        }catch (e) {
            setError(e instanceof Error ? e.message : "Login failed");
        }finally{
            setLoading(false);
        }
    }

    return (
    <Card>
      <h2 style={{ marginTop: 0 }}>Iniciar sesión</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <label htmlFor="email">Email</label>
          <TextInput 
            value={email} 
            id="email"
            onValueChange={(value)=>{setEmail(value)}}
            type="email"
            placeholder="tu@email.com">
          </TextInput>
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <label htmlFor="password">Contraseña</label>
          <TextInput 
            value={password} 
            id="password"
            onValueChange={(value) => setPassword(value)}
            type="password"
            placeholder="********">
          </TextInput>
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
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
      <p style={{marginTop: 16}}>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
    </Card>
  );
}