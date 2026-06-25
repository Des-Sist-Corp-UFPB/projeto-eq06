# Relatório de Avaliação — EQ06 (DSC)

| | |
|---|---|
| **Data** | 2026-06-25 |
| **Repositório** | https://github.com/des-sist-corp-ufpb/projeto-eq06 |
| **Aplicação** | https://eq06.dsc.rodrigor.com |
| **Período de atividade** | 2026-06-22 → 2026-06-25 |
| **Total de commits** (sem merges) | 5 |
| **Integrantes** | Samuel Cesar Dantas Mota (@samuelcsar), Sabrina Goncalves De Almeida (@sabrina-goncalves-de-almeida) |

---

## 1. Tecnologias

- Thymeleaf
- Flyway (6 migrations)
- Spring Security
- Testcontainers

---

## 2. Análise Funcional

### Endpoints REST (15 mapeados)

| Método | Path | Arquivo |
|--------|------|---------|
| `GET` | `/api/auditoria` | `AuditLogController.java` |
| `POST` | `/api/auth/login` | `AuthController.java` |
| `POST` | `/api/chat/ia` | `ChatIAController.java` |
| `DELETE` | `/api/usuarios/{usuarioId}/favoritos/{produtoId}` | `FavoritoController.java` |
| `GET` | `/api/usuarios/{usuarioId}/favoritos` | `FavoritoController.java` |
| `POST` | `/api/usuarios/{usuarioId}/favoritos/{produtoId}` | `FavoritoController.java` |
| `GET` | `/api/mensagens/produto/{produtoId}` | `MensagemController.java` |
| `POST` | `/api/mensagens` | `MensagemController.java` |
| `GET` | `/ping` | `PingController.java` |
| `DELETE` | `/api/produtos/{id}` | `ProdutoController.java` |
| `GET` | `/api/produtos` | `ProdutoController.java` |
| `GET` | `/api/produtos/{id}` | `ProdutoController.java` |
| `POST` | `/api/produtos` | `ProdutoController.java` |
| `PUT` | `/api/produtos/{id}` | `ProdutoController.java` |
| `GET` | `/main` | `SpaController.java` |

### Entidades / Tabelas (10 encontradas)

- `mensagem`
- `produto`
- `audit_log`
- `usuario`
- `favorito`
- `favorito (via V4__criar_tabela_favorito.sql)`
- `usuario (via V2__criar_tabela_usuario.sql)`
- `produto (via V1__criar_tabela_produto.sql)`
- `audit_log (via V5__criar_tabela_audit_log.sql)`
- `mensagem (via V6__criar_tabela_mensagem.sql)`

### Migrations (6 arquivos)

- `V1__criar_tabela_produto.sql`
- `V2__criar_tabela_usuario.sql`
- `V3__adicionar_imagem_produto.sql`
- `V4__criar_tabela_favorito.sql`
- `V5__criar_tabela_audit_log.sql`
- `V6__criar_tabela_mensagem.sql`

---

## 3. Análise Arquitetural

| Aspecto | Status | Observação |
|---------|--------|-----------|
| Arquitetura em camadas | ✅ | controller=✅  service=✅  repository=✅ |
| Testes automatizados | ❌ | 0 arquivo(s) de teste |
| Migrations versionadas | ✅ | 6 migration(s) |
| Logging | ❌ | não detectado |
| Autenticação / Segurança | ✅ | Spring Security / JWT / decorator detectado |
| DTOs / Separação de dados | ✅ | classes *DTO / *Request / *Response detectadas |
| Tratamento global de exceções | ✅ | @ControllerAdvice / @ExceptionHandler detectado |
| Documentação de API (OpenAPI) | ❌ | não detectado |
| Variáveis de ambiente | ✅ | .env / @Value / os.environ detectado |
| Dockerfile / docker-compose | ❌ | não encontrado |

---

## 4. Contribuição por Usuário

### Resumo

| Usuário | Commits | % commits | Linhas adicionadas | Linhas no código atual | % código atual |
|---------|---------|-----------|-------------------|----------------------|----------------|
| Samuel Cesar Dantas Mota (@samuelcsar) | 1 | 20% | 24.045 | 13.910 | 98% |
| Sabrina Goncalves De Almeida (@sabrina-goncalves-de-almeida) | 4 | 80% | 1.429 | 305 | 2% |

### Contribuição por Camada

| Camada | Total linhas | Samuel Cesar Dantas Mota (@samuelcsar) | Sabrina Goncalves De Almeida (@sabrina-goncalves-de-almeida) |
|--------|-------------|---------|---------|
| Controller | 3.018 | 97% | 3% |
| Frontend | 8.855 | 100% | 0% |
| Repository | 114 | 88% | 12% |
| Service | 714 | 88% | 12% |
| Test | 91 | 100% | 0% |

---

## 5. Contribuição por Funcionalidade

Baseado em `git blame` nos arquivos de controller e service.

| Arquivo | Total linhas | Samuel Cesar Dantas Mota (@samuelcsar) | Sabrina Goncalves De Almeida (@sabrina-goncalves-de-almeida) |
|---------|-------------|---------|---------|
| `index-DKlVRAaT.js` | 902 | 100% | 0% |
| `ProdutoServiceTest.java` | 261 | 100% | 0% |
| `login.html` | 220 | 100% | 0% |
| `form.html` | 216 | 100% | 0% |
| `layout.html` | 207 | 100% | 0% |
| `RoutesApp.jsx.html` | 172 | 100% | 0% |
| `ProdutoService.java` | 165 | 100% | 0% |
| `index.html` | 130 | 100% | 0% |
| `lista.html` | 122 | 100% | 0% |
| `linha.html` | 113 | 100% | 0% |
| `ProdutoControllerTest.java` | 108 | 100% | 0% |
| `tabela.html` | 107 | 100% | 0% |
| `FavoritoControllerTest.java` | 102 | 100% | 0% |
| `index-BGrNEMMD.js` | 96 | 100% | 0% |
| `AuthServiceTest.java` | 78 | 100% | 0% |
| `ProdutoController.java` | 70 | 100% | 0% |
| `AuthControllerTest.java` | 65 | 100% | 0% |
| `FavoritoController.java` | 61 | 100% | 0% |
| `GeminiService.java` | 53 | 0% | 100% |
| `MensagemController.java` | 50 | 0% | 100% |
| `MercadoApplicationTests.java` | 46 | 100% | 0% |
| `MercadoApplication.java` | 40 | 100% | 0% |
| `AuthService.java` | 36 | 100% | 0% |
| `MensagemService.java` | 35 | 0% | 100% |
| `AuditLogController.java` | 33 | 100% | 0% |
| `AuthController.java` | 32 | 100% | 0% |
| `SpaControllerTest.java` | 31 | 100% | 0% |
| `ChatIAController.java` | 29 | 0% | 100% |
| `PingControllerTest.java` | 29 | 100% | 0% |
| `SpaController.java` | 26 | 100% | 0% |
| `V1__criar_tabela_produto.sql` | 25 | 100% | 0% |
| `PingController.java` | 20 | 100% | 0% |
| `V5__criar_tabela_audit_log.sql` | 19 | 100% | 0% |
| `V2__criar_tabela_usuario.sql` | 13 | 100% | 0% |
| `V4__criar_tabela_favorito.sql` | 9 | 100% | 0% |
| `V6__criar_tabela_mensagem.sql` | 7 | 0% | 100% |
| `V3__adicionar_imagem_produto.sql` | 2 | 100% | 0% |
| `index-CZDJIaSs.css` | 1 | 100% | 0% |
| `index-DAxjXYLG.css` | 1 | 100% | 0% |

---

*Relatório gerado automaticamente em 2026-06-25.*
*Os dados de contribuição são baseados em `git log --numstat` (linhas adicionadas) e `git blame` (linhas no código atual), excluindo commits de merge.*