import { useEffect, useState } from "react";

import { Pencil, Users, LogOut } from "lucide-react";

import { authService } from "../../auth/services/authService";

import { userService } from "../services/userService";

import type { User } from "../types/user.types";

import { USER_PROFILE_ADMIN, } from "../types/user.types";

import "../styles/users.scss";

export function UsersPage() {

  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState<User | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  
  console.log("Usuario autenticado:", usuarioAutenticado, USER_PROFILE_ADMIN);

  const isAdmin = usuarioAutenticado?.perfil.nome === USER_PROFILE_ADMIN;

  useEffect(() => {

    async function carregarUsuarios() {

      try {

        setErro("");

        const dadosSessao = authService.getUser();

        if (!dadosSessao?.id) {
          throw new Error("Usuário autenticado não encontrado.");
        }

        const usuario = await userService.getById(dadosSessao.id);

        setUsuarioAutenticado(usuario);

        if (usuario.perfil.nome === USER_PROFILE_ADMIN) {

          const listaUsuarios = await userService.getAll();

          setUsuarios(listaUsuarios);

        } else {

          setUsuarios([usuario]);

        }

      } catch (error) {

        const mensagem = error instanceof Error ? error.message : "Não foi possível carregar os usuários.";

        setErro(mensagem);

      } finally {

        setCarregando(false);

      }
    }

    carregarUsuarios();

  }, []);

  function handleLogout() {

    authService.logout();

    window.location.assign("/login");
  }

  if (carregando) {

    return (
      <main className="users-loading">
        <div className="loading-spinner" />
        <p>Carregando usuários...</p>
      </main>
    );
  }

  if (erro) {

    return (
      <main className="users-error">
        <p>{erro}</p>

        <button onClick={() => window.location.reload()}>
          Tentar novamente
        </button>
      </main>
    );
  }

  return (
    <main className="users-page">

      <header className="users-header">

        <div className="users-brand">

          <div className="users-brand-icon">
            <Users size={24} />
          </div>

          <div>
            <h1>Gestão de Usuários</h1>
            <p>Administração de contas e acessos</p>
          </div>

        </div>

        <div className="users-header-actions">

          <div className="users-account">

            <div className="users-avatar">
              {usuarioAutenticado?.nome.charAt(0).toUpperCase()}
            </div>

            <div className="users-account-info">

              <strong>{usuarioAutenticado?.nome}</strong>

              <span>{usuarioAutenticado?.perfil.nome}</span>

            </div>

          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
            aria-label="Sair do sistema"
            title="Sair"
          >
            <LogOut size={19} />
          </button>

        </div>

      </header>

      <section className="users-content">

        <div className="users-title-section">

          <div>

            <span className="users-overline">
              PAINEL ADMINISTRATIVO
            </span>

            <h2>Usuários</h2>

            <p>
              {isAdmin
                ? "Gerencie os usuários cadastrados no sistema."
                : "Visualização dos seus dados de cadastro."}
            </p>

          </div>

          <div className="users-count">

            <Users size={20} />

            <span>
              {usuarios.length}
              {usuarios.length === 1
                ? " usuário"
                : " usuários"}
            </span>

          </div>

        </div>

        <div className="users-table-container">

          <table className="users-table">

            <thead>

              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th>Status</th>
                <th className="actions-column">Ações</th>
              </tr>

            </thead>

            <tbody>

              {usuarios.map((usuario) => (

                <tr key={usuario.id}>

                  <td>
                    <div className="user-name-cell">

                      <div className="user-table-avatar">
                        {usuario.nome.charAt(0).toUpperCase()}
                      </div>

                      <span>{usuario.nome}</span>

                    </div>
                  </td>

                  <td>{usuario.email}</td>

                  <td>
                    <span className="profile-badge">
                      {usuario.perfil.nome}
                    </span>
                  </td>

                  <td>

                    <span
                      className={`status-badge ${
                        usuario.inativo
                          ? "status-inactive"
                          : "status-active"
                      }`}
                    >
                      {usuario.inativo ? "Inativo" : "Ativo"}
                    </span>

                  </td>

                  <td className="actions-column">

                    <button
                      type="button"
                      className="edit-user-button"
                      disabled={!isAdmin}
                      title={
                        isAdmin
                          ? "Editar usuário"
                          : "Você não possui permissão para editar"
                      }
                      aria-label={`Editar ${usuario.nome}`}
                      onClick={() => {
                        window.location.assign(
                          `/usuarios/${usuario.id}/editar`
                        );
                      }}
                    >
                      <Pencil size={17} />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {usuarios.length === 0 && (
            <div className="users-empty">
              Nenhum usuário encontrado.
            </div>
          )}

        </div>

      </section>

    </main>
  );
}