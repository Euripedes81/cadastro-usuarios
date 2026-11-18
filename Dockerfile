
# ==========================================
# ESTÁGIO 1: BUILD
# ==========================================

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

# Copia os arquivos dos projetos
COPY src/Api/Api.csproj src/Api/
COPY src/Application/Application.csproj src/Application/
COPY src/Domain/Domain.csproj src/Domain/
COPY src/Infrastructure/Infrastructure.csproj src/Infrastructure/

# Restaura as dependências
RUN dotnet restore src/Api/Api.csproj

# Copia o restante do código
COPY . .

# Compila e publica a aplicação
WORKDIR /src/src/Api

RUN dotnet publish Api.csproj \
    -c Release \
    -o /app/publish \
    --no-restore


# ==========================================
# ESTÁGIO 2: RUNTIME
# ==========================================

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

WORKDIR /app

# Copia os arquivos publicados
COPY --from=build /app/publish .

# Porta da aplicação
EXPOSE 8080

#RUN apt-get update && apt-get install -y --no-install-recommends \
    #libgssapi-krb5-2 \
    #&& rm -rf /var/lib/apt/lists/*

# Inicializa a API
ENTRYPOINT ["dotnet", "Api.dll"]
