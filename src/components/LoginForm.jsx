import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function LoginForm() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    const fn = mode === "login" ? signIn : signUp;
    const { error } = await fn(email, password);
    setMsg(error ? error.message : "OK ✔️");
  };

  return (
    <div className="min-h-screen grid place-items-center bg-sky-50">
      <form onSubmit={submit} className="bg-white p-6 rounded-2xl shadow max-w-sm w-full space-y-3">
        <h1 className="text-lg font-semibold">{mode === "login" ? "Iniciar sesión" : "Crear cuenta"}</h1>
        <input className="border p-2 rounded w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border p-2 rounded w-full" placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="bg-sky-600 hover:bg-sky-700 text-white rounded px-4 py-2 w-full">
          {mode === "login" ? "Entrar" : "Registrarme"}
        </button>
        <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-sky-600 text-sm">
          {mode === "login" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
        </button>
        {msg && <div className="text-sm text-gray-600">{msg}</div>}
      </form>
    </div>
  );
}
