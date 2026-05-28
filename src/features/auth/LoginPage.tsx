import { useState, type SubmitEvent } from "react";
import { login } from "../../api/authApi";
import { setToken } from "../../auth/auth";
import { Link, useNavigate } from "react-router-dom";

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
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Iniciar sesión</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            style={{
              padding: 12,
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--text)",
            }}
          />
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            style={{
              padding: 12,
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--text)",
            }}
          />
        </div>

        {error && (
          <p style={{ color: "var(--danger)", margin: 0 }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          className="button buttonPrimary"
          disabled={loading || !email.trim() || !password.trim()}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <p style={{marginTop: 16}}>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
    </div>
  );
}