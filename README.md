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
  - **Chatbot Gerencial IA**: Um assistente virtual inteligente integrado ao **Google Gemini 3.1 Flash Lite**, restrito a administradores. Ele utiliza injeção dinâmica de contexto do banco de dados (Data-Augmented Prompting) para responder sobre estoque e produtos em tempo real. Possui regras estritas de segurança (Guardrails NLP) para prevenir ataques de *Prompt Injection* e bloquear sumariamente assuntos fora do escopo corporativo do PBX.

---

## Sistema de Auditoria (Audit Logs)

O sistema conta com uma infraestrutura de auditoria transparente para rastrear as ações dos usuários, garantindo um histórico de atividades seguro sem acoplar regras de auditoria diretamente nas lógicas de negócio.

### O que é auditado?
O sistema intercepta e grava automaticamente eventos de **Sucesso** ou **Falha** nas seguintes ações:
- **Autenticação**: Tentativas de acesso ao sistema (`USER_LOGIN`).
- **Gerenciamento de Produtos**: Criação (`CRIAR_PRODUTO`), atualização (`ATUALIZAR_PRODUTO`) e remoção de produtos (`EXCLUIR_PRODUTO`).
- **Ações de Usuário**: Inclusão (`ADD_FAVORITO`) e exclusão (`REMOVE_FAVORITO`) de produtos na lista de favoritos.

### Como funciona sob o capô?
A implementação foi feita utilizando o paradigma **AOP (Programação Orientada a Aspectos)** integrado ao Spring Boot:
1. **Anotação `@AuditAction`**: Marcamos os endpoints REST (nos Controllers) que desejamos rastrear.
2. **Interceptação (Aspecto)**: O `AuditAspect` "ouve" (intercepta) essas chamadas. Após a execução do método (seja sucesso ou exceção), ele entra em ação.
3. **Coleta de Dados**: O Aspecto extrai dados importantes do contexto em tempo real: qual usuário está logado (pelo Spring Security), o IP da requisição, a classe, o método executado e o payload (argumentos) passados.
4. **Armazenamento**: Esses dados são serializados e salvos na tabela dedicada `audit_log` (gerenciada por uma migração automática do Flyway).

### Acesso ao Painel de Auditoria
A aplicação fornece uma interface dedicada para administradores visualizarem o histórico de auditoria:
1. Logue na plataforma utilizando a aba **Administrador** (Email: `admin`, Senha: `admin123`).
2. No menu superior (cabeçalho), clique no **Ícone de Escudo** (`FiShield`).
3. Você será redirecionado ao Painel de Auditoria (`/auditoria`), onde os logs são apresentados em tempo real (paginados), destacando com cores os sucessos e falhas, além de revelar detalhes como horário, usuário e endereço de IP da requisição.

---

## Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|-----------|
| Backend | Java 21 + Spring Boot 3.4.5 |
| Frontend | React 18 + Vite |
| Roteamento | React Router DOM v7 |
| Estilização | Vanilla CSS |
| Inteligência Artificial | Google Gemini API (gemini-3.1-flash-lite) + Prompt Guardrails |
| Banco de Dados | PostgreSQL 16 |
| Migrações | Flyway 11 |
| Segurança | Spring Security 6 |
| Auditoria | Spring AOP + AspectJ |
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

---

## Como Executar os Testes Automatizados

O projeto foi configurado com a exigência de **85% de cobertura de testes** tanto no Backend quanto no Frontend.

### 1. Backend (Java 21 + Spring Boot)
Os testes do backend utilizam as seguintes tecnologias:
- **JUnit 5** e **Mockito** para Testes Unitários das regras de negócio (`Services` e `Controllers`).
- **Testcontainers** e **@SpringBootTest** para Testes de Integração com banco de dados PostgreSQL real. *(Atenção: O Docker Desktop/Daemon **precisa estar rodando** na sua máquina para os testes de integração passarem).*
- **JaCoCo** para auditoria de cobertura de código.

Para rodar os testes e verificar a cobertura no backend:
```bash
# Na pasta backend do projeto:
cd backend
mvn clean verify
```
*Se a cobertura ficar abaixo de 85%, a build falhará.*

### 2. Frontend (React + Vite)
Os testes do frontend utilizam as seguintes tecnologias:
- **Vitest** como motor de testes (rápido e compatível nativamente com Vite).
- **React Testing Library (RTL)** para simulação de renderização de componentes e eventos de usuários (como cliques).
- **@vitest/coverage-v8** para relatórios de cobertura.

Para rodar os testes do frontend:
```bash
# Entre na pasta frontend
cd frontend

# Para instalar as dependências de testes (se for a primeira vez)
npm install

# Para rodar os testes
npm run test

# Para rodar os testes exigindo a cobertura de 85%
npm run coverage
```
