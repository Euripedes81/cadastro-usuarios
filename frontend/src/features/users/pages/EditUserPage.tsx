import { useEffect, useState } from "react";

import { ArrowLeft, UserRoundPen } from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import { authService } from "../../auth/services/authService";

import { userService } from "../services/userService";

import { UserForm } from "../components/UserForm";

import type { UpdateUserRequest, User } from "../types/user.types";

import { USER_PROFILE_ADMIN } from "../types/user.types";

import "../styles/user-form.scss";

export function EditUserPage() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        async function loadUser() {

            try {

                setError("");

                const sessionUser = authService.getUser();

                if (!sessionUser?.id) {
                    throw new Error("Usuário autenticado não encontrado.");
                }

                const authenticatedUser = await userService.getById(
                    sessionUser.id
                );

                if (
                    authenticatedUser.perfil.nome !== USER_PROFILE_ADMIN
                ) {
                    throw new Error("Você não possui permissão para editar usuários.");
                }

                if (!id || !/^\d+$/.test(id)) {
                    throw new Error("Identificador de usuário inválido.");
                }

                const userToEdit = await userService.getById(Number(id));

                setUser(userToEdit);

            } catch (err) {

                setError(
                    err instanceof Error
                        ? err.message
                        : "Não foi possível carregar o usuário."
                );

            } finally {

                setLoading(false);

            }
        }

        loadUser();

    }, [id]);

    function handleCancel() {
        navigate("/usuarios");
    }

    async function handleSubmit(userUpdated: UpdateUserRequest) {

        try {

            setError("");

            await userService.update(
                user!.id,
                userUpdated
            );

            navigate("/usuarios", {
                state: {
                    successMessage: "Usuário atualizado com sucesso.",
                },
            });

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "Não foi possível atualizar o usuário."
            );

            throw err;

        }
    }

    if (loading) {

        return (
            <main className="edit-user-loading">
                <div className="loading-spinner" />
                <p>Carregando usuário...</p>
            </main>
        );
    }

    if (error) {

        return (
            <main className="edit-user-error">

                <h2>Não foi possível acessar a edição</h2>

                <p>{error}</p>

                <button
                    type="button"
                    onClick={handleCancel}
                    className="button-secondary"
                >
                    Voltar
                </button>

            </main>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <main className="edit-user-page">

            <header className="edit-user-header">

                <button
                    type="button"
                    className="back-button"
                    onClick={handleCancel}
                >
                    <ArrowLeft size={18} />

                    <span>Voltar para usuários</span>
                </button>

            </header>

            <section className="edit-user-content">

                <div className="edit-user-title">

                    <div className="edit-user-icon">
                        <UserRoundPen size={24} />
                    </div>

                    <div>

                        <h1>Editar usuário</h1>

                        <p>
                            Atualize as informações da conta.
                        </p>

                    </div>

                </div>

                <div className="edit-user-card">

                    <div className="edit-user-card-header">

                        <h2>Dados do usuário</h2>

                        <span>
                            ID: {user.id}
                        </span>

                    </div>

                    <UserForm
                        user={user}
                        onCancel={handleCancel}
                        onSubmit={handleSubmit}
                    />

                </div>

            </section>

        </main>
    );
}