# Sistema Mercado — Projeto Base DSC/UFPB

Projeto para a disciplina **Desenvolvimento de Sistemas Corporativos**.

**Professor**: Rodrigo Rebouças | **UFPB — Campus IV**

---

## Funcionalidades Implementadas

Até o momento, o sistema conta com as seguintes funcionalidades:

- **Autenticação e Autorização**:
  - Tela de login inteligente com abas (tabs) independentes para **Usuário Comum** e **Administrador**.
  - Controle de acesso no Frontend (ações restritas a administradores).
- **Gestão de Produtos (Catálogo)**:
  - Vitrine principal listando os produtos do banco de dados (com nome, preço, endereço e imagem).
  - Sistema dinâmico de **Ordenação e Filtro**: permite ordenar produtos por Recentes, Menor/Maior Preço e Nome (A-Z ou Z-A).
- **Recursos Exclusivos de Administrador**:
  - Botão Flutuante (FAB) para cadastrar novos produtos rapidamente através de um Modal interativo.
  - Botão de exclusão diretamente nos cards de produtos (com diálogo de confirmação).

---

## Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|-----------|
| Backend | Java 21 + Spring Boot 3.4.5 |
| Frontend | React 18 + Vite |
| Roteamento | React Router DOM v7 |
| Estilização | Vanilla CSS |
| Banco de Dados | PostgreSQL 16 |
| Migrações | Flyway 11 |
| Segurança | Spring Security 6 |
| Build e Gerenciamento | Maven 3.9 (Back) / npm (Front) |
| Containerização | Docker + Docker Compose |
| CI/CD e Segurança | GitHub Actions + Trivy + OWASP Dependency Check |

---

## Como Executar o Projeto

**1. Clone o repositório:**
```bash
git clone <url-do-repositorio>
cd projeto-eq06
```

**2. Suba a aplicação via Docker (Recomendado):**
```bash
docker compose -f docker/docker-compose.dev.yml up --build -d
```

**3. Acesse no navegador:**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Banco de Dados (Adminer)**: http://localhost:8888
