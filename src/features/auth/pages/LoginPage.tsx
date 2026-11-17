import { useState, type SubmitEvent } from "react";

import { LockKeyhole, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";

import { authService } from "../services/authService";

import type { LoginRequest } from "../types/auth.types";

import "../../../styles/login.scss";

export function LoginPage() {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {

    event.preventDefault();

    setErro("");

    const dadosLogin: LoginRequest = {
      email: email.trim(),
      senha,
    };

    setCarregando(true);

    try {

      await authService.login(dadosLogin);

      window.location.assign("/usuarios");

    } catch (error) {

      const mensagem = error instanceof Error ? error.message : "Não foi possível realizar o login.";

      setErro(mensagem);

    } finally {

      setCarregando(false);

    }
  }

  return (
    <main className="login-page">

      <section className="login-brand">

        <div className="brand-content">

          <div className="brand-icon">
            <ShieldCheck size={38} />
          </div>

          <h1>Gestão de Usuários</h1>

          <p>
            Administração centralizada de usuários,
            acessos e permissões.
          </p>

          <div className="brand-footer">
            Plataforma de gerenciamento
          </div>

        </div>

      </section>

      <section className="login-content">

        <div className="login-card">

          <div className="login-header">

            <span className="login-label">
              ÁREA ADMINISTRATIVA
            </span>

            <h2>Bem-vindo!</h2>

            <p>
              Informe suas credenciais para acessar o sistema.
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label htmlFor="email">
                E-mail
              </label>

              <div className="input-wrapper">

                <Mail size={19} />

                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  autoComplete="username"
                  required
                />

              </div>

            </div>

            <div className="form-group">

              <label htmlFor="senha">
                Senha
              </label>

              <div className="input-wrapper">

                <LockKeyhole size={19} />

                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(event) =>
                    setSenha(event.target.value)
                  }
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setMostrarSenha(!mostrarSenha)
                  }
                  aria-label={
                    mostrarSenha ? "Ocultar senha" : "Mostrar senha"
                  }
                >
                  {mostrarSenha
                    ? <EyeOff size={19} />
                    : <Eye size={19} />
                  }
                </button>

              </div>

            </div>

            {erro && (
              <div className="login-error" role="alert">
                {erro}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={carregando}
            >
              {carregando ? "Autenticando..." : "Entrar"}
            </button>

          </form>

          <div className="login-security">
            <LockKeyhole size={15} />

            <span>
              Acesso restrito a usuários autorizados.
            </span>

          </div>

        </div>

        <footer className="login-footer">
          Sistema de Gestão de Usuários
        </footer>

      </section>

    </main>
  );
}