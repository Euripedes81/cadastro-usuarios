import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../../features/auth/pages/LoginPage";
import { UsersPage } from "../../features/users/pages/UsersPage";
import { EditUserPage } from "../../features/users/pages/EditUserPage";
import { ProtectedRoute } from "./ProtectedRoute";

export function AppRoutes() {

  return (
    <Routes>

      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>

        <Route path="/usuarios" element={<UsersPage />} />
        <Route path="/usuarios/:id/editar" element={<EditUserPage />}
        />

      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}