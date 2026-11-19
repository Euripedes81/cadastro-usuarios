import { Navigate, Route, Routes } from "react-router-dom";

import { LoginPage } from "../../features/auth/pages/LoginPage";

import { ProtectedRoute } from "./ProtectedRoute";

import { authService } from "../../features/auth/services/authService";

function UsersPage() {

  const usuario = authService.getUser();
  console.log("Usuário autenticado:", usuario);

  return (
    <main style={{ padding: "40px", color: "#1e293b" }}>

      <h1>Painel administrativo</h1>

      <p>
        Bem-vindo, <strong>{usuario?.nome}!</strong>
      </p>
      <pre>
    {JSON.stringify(usuario, null, 2)}
    <p>JWT:{authService.getToken()}</p>
</pre>
    
      <button
        onClick={() => {
          authService.logout();
          window.location.assign("/login");
        }}
      >
        Sair
      </button>

    </main>
  );
}

export function AppRoutes() {

  return (
    <Routes>

      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>

        <Route path="/usuarios" element={<UsersPage />} />

      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}