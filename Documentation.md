### Especificação Funcional API Notas do Deep

A API Notas do Deep é uma aplicação desenvolvida em **Laravel** para gerenciar notas de usuários, oferecendo funcionalidades de autenticação, registro, visualização, adição, atualização e exclusão de notas.

---

### Funcionalidades do sistema

**Gerenciamento de Usuários:**
1. Registro de novos usuários com validação de email único e senha criptografada.
2. Login que retorna um token JWT, usado para autenticação das operações subsequentes.
3. Logout, que invalida o token JWT.
4. Validação do token JWT.
5. Atualização de token JWT por meio de um endpoint.

**Gerenciamento de Notas:**
1. Adição de novas notas associadas a um usuário autenticado, com validações sobre os campos obrigatórios (user_id, type, title e description).
2. Visualização de todas as notas associadas a um usuário por meio de seu ID.
3. Visualização de uma nota específica pelo seu identificador único (ID).
4. Atualização das informações de uma nota existente (suporte para requisição PUT e PATCH).
5. Exclusão de notas associadas a IDs válidos no banco de dados.

---

### Regras de Negócio

- As operações relacionadas às notas devem estar vinculadas aos usuários autenticados.
- O registro de usuários rejeitará emails que já estejam cadastrados.
- A criação de notas só aceitará o tipo "text".
- Ações como login, logout e validação requerem tokens JWT.
- Para o escopo da API, algumas respostas estão configuradas como objetos JSON (ex.: mensagens de retorno em caso de erro ou sucesso).
- Métodos APIRoute para notas estão protegidos por middleware `jwt.auth` para requerer autenticação.

---

### Validação de Entrada

Os elementos `Models\User` e `Models\Note` possuem validações configuradas:

**Note:**  
- `user_id`: Obrigatório.
- `type`: Obrigatório, mínimo 4 caracteres. Precisa ser igual a "text".
- `title`: Obrigatório, mínimo 1 caractere.
- `description`: Obrigatório.

---

### Endpoints

**Autenticação:**
1. **POST /login**
   - Exige email e senha.
   - Retorna token JWT e dados do usuário autenticado.
   - Mensagem de erro para email ou senha inválidos.

2. **POST /registration**
   - Exige nome, email e senha.
   - Registra novo usuário e retorna dados do usuário.
   - Retorna erro se o email já estiver em uso.

3. **POST /logout**
   - Invalida o token JWT do usuário autenticado.
   - Retorna mensagem de sucesso.

4. **POST /refresh**
   - Atualiza o token JWT.
   - Retorna novo token JWT.

5. **GET /validateToken**
   - Verifica validade do token JWT.
   - Retorna estado do token como válido ou não.

**Notas:**
1. **GET /note**
   - Recepções apenas para usuários autenticados com ID informado.
   - Retorna a lista de notas ou erro caso o usuário não seja encontrado.

2. **POST /note**
   - Requer campos obrigatórios (user_id, type, title, description).
   - Valida as entradas (regras e feedbacks) no modelo.
   - Retorna a nota criada ou erro caso o type seja inválido.

3. **GET /note/{id}**
   - Retorna as informações de uma nota pelo ID informado.
   - Retorna erro se a nota não for encontrada.

4. **PUT | PATCH /note/{id}**
   - Permite a atualização completa (PUT) ou parcial (PATCH) dos campos de uma nota.
   - Valida os campos antes de aplicar as alterações.
   - Retorna nota atualizada ou mensagem de erro em caso de falha.

5. **DELETE /note/{id}**
   - Exclui uma nota.
   - Retorna mensagem de sucesso ou erro se o ID não for encontrado.

---

### Diagrama UML (simplificado)

#### **Caso de uso da aplicação**

```plaintext
+----------------------------+
|         Usuário            |
+----------------------------+
        /          \
POST /login       POST /registration
   \                   \
POST /logout         POST /note
   \                   /
GET /validateToken  GET /note/{id}
                 \    \
                    DELETE /note/{id}
```

---

Se preferir, posso criar um diagrama mais visual em fluxogramas!