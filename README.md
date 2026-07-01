# Sistema Mercado — Projeto Base DSC/UFPB

Projeto para a disciplina **Desenvolvimento de Sistemas Corporativos**.

**Professor**: Rodrigo Rebouças | **UFPB — Campus IV**
**Alunos**:
Samuel César Dantas Mota. username do git: samuelcsar
Sabrina Gonçalves de Almeida. username do git: sabrina-goncalves-de-almeida


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

## Integração com Serviço Externo

O sistema está integrado à API de inteligência artificial do **Google Gemini** para disponibilizar assistentes virtuais de conversação tanto para clientes comuns (dúvidas sobre o projeto) quanto para administradores (gestão de estoque e inventário).

- **Serviço Externo**: Google Gemini API (modelos `gemini-3.1-flash-lite` e `gemini-2.5-flash`).
- **Funcionalidade**: 
  - Chatbot para administradores com injeção de contexto do banco de dados local (quantidade de produtos e valor estimado em estoque) e guardrails para evitar *prompt injection*.
  - Chatbot para usuários comuns nas telas de chat para dúvidas gerais sobre os produtos.
- **Classes Participantes (Backend)**:
  - [GeminiService](file:///c:/Users/samuel.dantas/Downloads/projeto-eq06/backend/src/main/java/br/ufpb/dsc/mercado/service/GeminiService.java) - Serviço que realiza as requisições REST para a API do Google Gemini.
  - [AdminChatController](file:///c:/Users/samuel.dantas/Downloads/projeto-eq06/backend/src/main/java/br/ufpb/dsc/mercado/controller/AdminChatController.java) - Endpoint REST de chat gerencial (`/api/admin/chat`) com injeção de contexto e guardrails de NLP.
  - [ChatIAController](file:///c:/Users/samuel.dantas/Downloads/projeto-eq06/backend/src/main/java/br/ufpb/dsc/mercado/controller/ChatIAController.java) - Endpoint REST de chat comum com IA (`/api/chat/ia`).
  - [GeminiResponse](file:///c:/Users/samuel.dantas/Downloads/projeto-eq06/backend/src/main/java/br/ufpb/dsc/mercado/dto/GeminiResponse.java) - DTO de mapeamento de resposta JSON do Gemini.
- **Configuração**:
  - A integração requer a definição da variável de ambiente **`GEMINI_API_KEY`**, configurada nos arquivos `application.yml`, `application-dev.yml` e `application-prod.yml`.

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

## Como Executar os Testes Automatizados e Relatórios de Cobertura

O projeto exige uma cobertura de testes de no mínimo **85%** em ambas as camadas (Backend e Frontend). Atualmente, a cobertura atinge os seguintes patamares:

- **Backend**: **93.87%** de cobertura de linhas (91.71% de cobertura de instruções).
  - Relatório JaCoCo: [cobertura/backend/index.html](file:///c:/Users/samuel.dantas/Downloads/projeto-eq06/cobertura/backend/index.html)
- **Frontend**: **93.97%** de cobertura de linhas (93.01% de cobertura de statements).
  - Relatório Vitest: [cobertura/frontend/index.html](file:///c:/Users/samuel.dantas/Downloads/projeto-eq06/cobertura/frontend/index.html)

### 1. Backend (Java 21/25 + Spring Boot)
Os testes do backend utilizam **JUnit 5**, **Mockito** e **Testcontainers** para testes de integração com banco real. Devido ao ambiente executar Java 25, o build está configurado para habilitar propriedades experimentais do Byte Buddy no Surefire.

Para rodar os testes e gerar o relatório JaCoCo:
```bash
# Na pasta backend do projeto:
cd backend
mvn clean test jacoco:report
```
O relatório final gerado pelo JaCoCo é exportado para `target/site/jacoco/`. Para submetê-lo, copiamos para `cobertura/backend/`.

### 2. Frontend (React + Vite)
Os testes do frontend utilizam **Vitest** e **React Testing Library (RTL)**.

Para instalar as dependências (primeira execução):
```bash
cd frontend
npm install
```

Para rodar os testes com o cálculo de cobertura:
```bash
npm run coverage
```
O relatório final gerado pelo Vitest é exportado para `coverage/`. Para submetê-lo, copiamos para `cobertura/frontend/`.

