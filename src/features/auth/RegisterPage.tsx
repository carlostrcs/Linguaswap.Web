import type React from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/authApi";
import { useState } from "react";

export function RegisterPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>){ 
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
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Regístrate</h2>

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
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
      <p style={{marginTop: 16}}>¿Ya tienes cuenta? <Link to="/login">Inicia sesión.</Link></p>
    </div>
    );

}