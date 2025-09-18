# Documentação Completa do Software - API de Notas do Deep

---

## Resumo do Software

A **API Notas do Deep** foi projetada como uma aplicação backend para gerenciar tarefas e notas por meio de operações CRUD (Create, Read, Update, Delete). Ela utiliza o framework Laravel, uma solução robusta em PHP, para fornecer funcionalidade escalável e modular. O sistema é baseado em autenticação JWT (JSON Web Tokens) para proteger o acesso às informações e interações dos usuários, garantindo que apenas usuários autenticados possam acessar, criar, atualizar e deletar suas próprias notas.

Este projeto é dividido em várias partes principais, incluindo configuração de autenticação, middleware para segurança, modelos para representação de dados, controladores para lógica de negócios, repositórios para interações com o banco de dados e rotas para manipulação de endpoints.

---

## Estrutura e Descrição Técnica

### Camadas do Sistema

#### 1. **Configurações**
Localizados na pasta `config`, as configurações do software definem os parâmetros globais da aplicação. Entre os arquivos importantes estão:
- `auth.php`: Configurações de autenticação usando JWT como driver principal.
- `jwt.php`: Configurações específicas do JWT, incluindo o segredo, tempo de expiração e comportamento do token.
- Outros arquivos, como `app.php`, `database.php`, `mail.php`, `queue.php`, entre outros, fornecem personalizações gerais para o sistema.

#### 2. **Modelos**
Os modelos representam abstrações das tabelas no banco de dados:
- **User (`App\Models\User`)**:
  - Representa usuários da plataforma.
  - Implementa o contrato `JWTSubject` para compatibilidade com autenticação JWT.
  - Contém os atributos `name`, `email`, `password`.
  - Métodos importantes:
    - `getJWTIdentifier()`: Identificador único do JWT.
    - `getJWTCustomClaims()`: Adiciona claims personalizados ao JWT.

- **Note (`App\Models\Note`)**:
  - Representa notas criadas pelos usuários.
  - Contém atributos como `user_id`, `type`, `title`, `description`.
  - Métodos importantes:
    - `rules()`: Validações para criação/edição de notas.
    - `feedback()`: Mensagens de erro personalizadas para validações.
    - Relacionamento com o usuário: `belongsTo`.

#### 3. **Controladores**
Responsáveis pela logic de negócios e manipulação dos dados enviados às rotas:
- **AuthenticationController**:
  - Gerencia autenticação e registro de usuários.
  - Métodos:
    - `login`: Realiza login e retorna token JWT.
    - `registration`: Registra novos usuários.
    - `logout`: Revoga token JWT do usuário.
    - `refresh`: Renova o token JWT.
    - `validateToken`: Verifica validade do token JWT.

- **NoteController**:
  - Gerencia operações CRUD para notas.
  - Métodos:
    - `index`: Exibe lista de notas de um usuário.
    - `store`: Cria uma nova nota.
    - `show`: Exibe os detalhes de uma nota por ID.
    - `update`: Atualiza campos específicos ou todos os atributos de uma nota.
    - `destroy`: Exclui uma nota específica.

#### 4. **Middlewares**
Camada de segurança para controle de requisições. Inclui:
- **Authenticate**: Redireciona usuários não autenticados para login.
- **VerifyCsrfToken**: Garante proteção contra ataques CSRF (Cross-Site Request Forgery).
- **EncryptCookies**: Protege dados sensíveis armazenados em cookies.
- Diversos outros middlewares, como `TrimStrings`, `TrustProxies` e `RedirectIfAuthenticated`.

#### 5. **Repositórios**
Utilizados para concentrar as interações com o banco de dados:
- **AuthenticationRepository**:
  - Valida credenciais de usuários.
  - Cria novos registros.
  - Interage diretamente com o modelo `User`.
- **NoteRepository**:
  - Gerencia manipulação de dados no modelo `Note`.
  - Funcionalidades:
    - Listar, criar, atualizar e excluir notas.
    - Validações específicas no tipo de conteúdo das notas.

#### 6. **Rotas**
As rotas conectam os endpoints à lógica dos controladores. Três arquivos principais gerenciam as rotas:
- **`routes/api.php`**:
  - Endpoints para CRUD de notas.
  - Rotas abertas: `/login`, `/registration`, `/validateToken`.
  - Rotas protegidas (`middleware jwt.auth`): `/note`, `/logout`, `/refresh`.

- **`routes/web.php`**:
  - Gerencia rotas da interface web.
  - Atualmente retorna uma página `welcome`.

#### 7. **Banco de Dados**
O sistema utiliza o banco de dados relacional para armazenar informações. Algumas migrações importantes:
- **`users`**: Registra informações de usuários.
- **`notes`**: Registra informações de notas/tarefas vinculadas aos usuários.
- Relacionamento:
  - A tabela `notes` utiliza a chave estrangeira `user_id` para vincular-se à tabela `users`.

---

### Funcionamento Geral

#### Ciclo de Autenticação
1. **Login** (`/login`):
   - O cliente envia email e senha.
   - O sistema valida credenciais, gera token JWT e retorna ao cliente.
2. **Acesso Protegido**:
   - O cliente utiliza o token JWT para acessar endpoints protegidos.
3. **Logout**:
   - O token JWT do servidor é invalidado, o cliente deve realizar login novamente.

#### Ciclo CRUD de Notas
1. **Listar Notas** (`/note` - GET):
   - Exibe todas as notas de um usuário autenticado.
2. **Criar Nota** (`/note` - POST):
   - Valida e cria uma nova nota vinculada ao usuário autenticado.
3. **Editar Nota** (`/note/{id}` - PATCH/PUT):
   - Atualiza dados de uma nota especificada pelo ID.
4. **Deletar Nota** (`/note/{id}` - DELETE):
   - Remove uma nota específica.

---

## Diagramas

### Diagrama de Classes (Lógica do Código)
```plaintext
+-------------------+              +-------------------+
|  Authentication   |              |       Note        |
|    Controller     |              |    Controller     |
+-------------------+              +-------------------+
| login()           |              | index()           |
| registration()    |              | store()           |
| logout()          |              | show(id)          |
| refresh()         |              | update(id)        |
| validateToken()   |              | destroy(id)       |
+-------------------+              +-------------------+
         ▲                                    ▲
         |                                    |
         |                                    |
+-------------------+              +-------------------+
| Authentication    |              |       Note        |
|    Repository     |              |    Repository     |
+-------------------+              +-------------------+
| userRegistration()|              | createNote()      |
| login()           |              | showNote(id)      |
| getUser()         |              | deleteNote(id)    |
| refreshToken()    |              | noteList()        |
+-------------------+              +-------------------+
```

### Diagrama de Fluxo (Autenticação)
```plaintext
Cliente
  ↓
/login (POST) → AuthenticationController@login → AuthenticationRepository@login → Token JWT Retornado
  ↓
Token JWT
  ↓
Middleware → Validação JWT → Controle de Acesso
```

---

## Testes
O projeto inclui casos de teste iniciais para validação básica:
- **Testes Unitários**:
  - Verificam integridade das funções principais independentemente da aplicação.
  - Utilizam `PHPUnit`.
- **Testes de Integração (Feature)**:
  - Validam rotas como `GET('/')` para verificar retornos esperados.

---

## Conclusão

O software **API Notas do Deep** foi cuidadosamente construído para fornecer uma experiência confiável de gestão de notas com autenticação robusta. A arquitetura modular facilita manutenção e escalabilidade. Embora esteja funcional, refinamentos adicionais podem ser feitos, como implementar mais testes, otimizar consultas e melhorar a documentação para endpoints.

Esta documentação detalha o funcionamento interno e externo do sistema, ajudando desenvolvedores a expandi-lo ou integrá-lo a outras soluções.