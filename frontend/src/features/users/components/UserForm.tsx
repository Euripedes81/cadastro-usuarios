import { useState, type ChangeEvent, type SubmitEvent } from "react";

import type { User } from "../types/user.types";
import type { UpdateUserRequest } from "../types/user.types";

interface UserFormProps {
  user: User;
  onCancel: () => void;
  onSubmit: (user: UpdateUserRequest) => Promise<void>;
}

export function UserForm({ user, onCancel, onSubmit }: UserFormProps) {

  const [nome, setNome] = useState(user.nome);
  const [email, setEmail] = useState(user.email);
  const [senha, setSenha] = useState("");
  const [inativo, setInativo] = useState(user.inativo);
  const [perfilId, setPerfilId] = useState(user.perfil.id);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function validate(): boolean {

    const newErrors: Record<string, string> = {};

    if (!nome.trim()) {
      newErrors.nome = "O nome é obrigatório.";
    }

    if (!email.trim()) {
      newErrors.email = "O e-mail é obrigatório.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Informe um e-mail válido.";
    }

    if (!perfilId) {
      newErrors.perfil = "Selecione um perfil.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {

    event.preventDefault();

    if (!validate()) {
      return;
    }

    const payload: UpdateUserRequest = {
      nome: nome.trim(),
      email: email.trim(),
      perfil: {
        id: perfilId,
      },
      inativo,
    };

    if (senha.trim()) {
      payload.senha = senha;
    }

    setSaving(true);

      try {

          await onSubmit(payload);

      } catch {

          // O erro já é tratado pela página.
          // Mantemos o formulário aberto para permitir nova tentativa.

      } finally {

          setSaving(false);

      }
  }

  function handleNomeChange(event: ChangeEvent<HTMLInputElement>) {
    setNome(event.target.value);
  }

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handleSenhaChange(event: ChangeEvent<HTMLInputElement>) {
    setSenha(event.target.value);
  }

  function handlePerfilChange(event: ChangeEvent<HTMLSelectElement>) {
    setPerfilId(Number(event.target.value));
  }

  function handleStatusChange(event: ChangeEvent<HTMLInputElement>) {
    setInativo(event.target.checked);
  }

  return (
    <form className="user-form" onSubmit={handleSubmit}>

      <div className="user-form-fields">

        <div className="form-field">

          <label htmlFor="nome">
            Nome
          </label>

          <input
            id="nome"
            type="text"
            value={nome}
            onChange={handleNomeChange}
            placeholder="Digite o nome"
          />

          {errors.nome && (
            <span className="form-error">
              {errors.nome}
            </span>
          )}

        </div>

        <div className="form-field">

          <label htmlFor="email">
            E-mail
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Digite o e-mail"
          />

          {errors.email && (
            <span className="form-error">
              {errors.email}
            </span>
          )}

        </div>

        <div className="form-field">

          <label htmlFor="senha">
            Nova senha
          </label>

          <input
            id="senha"
            type="password"
            value={senha}
            onChange={handleSenhaChange}
            placeholder="Deixe em branco para não alterar"
            autoComplete="new-password"
          />

          <span className="form-hint">
            Preencha somente se desejar alterar a senha.
          </span>

        </div>

        <div className="form-field">

          <label htmlFor="perfil">
            Perfil
          </label>

          <select
            id="perfil"
            value={perfilId}
            onChange={handlePerfilChange}
          >
            <option value={1}>Administrador</option>
            <option value={2}>Usuário</option>
          </select>

          {errors.perfil && (
            <span className="form-error">
              {errors.perfil}
            </span>
          )}

        </div>

        <div className="form-field form-field-status">

          <label htmlFor="inativo">
            Status da conta
          </label>

          <label className="status-toggle">

            <input
              id="inativo"
              type="checkbox"
              checked={inativo}
              onChange={handleStatusChange}
            />

            <span>
              {inativo ? "Conta inativa" : "Conta ativa"}
            </span>

          </label>

        </div>

      </div>

      <div className="user-form-actions">

        <button
          type="button"
          className="button-secondary"
          onClick={onCancel}
          disabled={saving}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="button-primary"
          disabled={saving}
        >
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>

      </div>

    </form>
  );
}