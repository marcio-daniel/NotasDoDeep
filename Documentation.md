# Documentação Técnica e Funcional do Software API Notas do Deep

## Resumo Funcional do Software

O sistema API Notas do Deep é uma solução para gerenciar anotações de usuários, construída utilizando o framework Laravel. Ele permite a realização de operações CRUD (Create, Read, Update, Delete) sobre as notas, além de funcionalidades de autenticação, registro, login e gestão de tokens JWT para segurança. Dentro do escopo do sistema, usuários podem se registrar, realizar login, criar, listar, editar e deletar suas notas.

## Documentação Técnica

### Arquivo: `app/Console/Kernel.php`

**Descrição Técnica:**

- **Namespace:** `App\Console`
- **Classe:** `Kernel`
    - Classe responsável por definir o agendamento de comandos e registrar comandos da aplicação.
- **Funções:**
    - `schedule`: Define o agendamento de comandos da aplicação. Exemplo (comando comentado) para execução horária.
    - `commands`: Método para registrar os comandos da aplicação. Carrega comandos definidos em `app/Console/Commands` e as rotas de console `routes/console.php`.

### Arquivo: `app/Exceptions/Handler.php`

**Descrição Técnica:**

- **Namespace:** `App\Exceptions`
- **Classe:** `Handler`
    - Classe responsável por gerenciar exceções na aplicação.
- **Propriedades:**
    - `dontReport`: Lista de tipos de exceções que não são reportadas.
    - `dontFlash`: Lista de atributos que nunca são armazenados em sessão para exceções de validação.
- **Funções:**
    - `register`: Método para registrar callbacks de manuseio de exceção.

### Arquivo: `app/Http/Controllers/AuthenticationController.php`

**Descrição Técnica:**

- **Namespace:** `App\Http\Controllers`
- **Classe:** `AuthenticationController`
    - Controlador responsável pelas operações de autenticação.
- **Propriedades:**
    - `$user`: Instância do modelo `User`.
- **Funções:**
    - `__construct`: Inicializa `$user`.
    - `login`: Realiza login do usuário e retorna token JWT em caso de sucesso.
    - `registration`: Registra um novo usuário e retorna informações do usuário criado.
    - `logout`: Realiza logout do usuário.
    - `refresh`: Renova o token JWT.
    - `validateToken`: Verifica a validade do token JWT.

### Arquivo: `app/Http/Controllers/Controller.php`

**Descrição Técnica:**

- **Namespace:** `App\Http\Controllers`
- **Classe:** `Controller`
    - Classe base genérica para outros controladores herdarem.
    - Utiliza traits para autorizar requisições, despachar jobs e validar requisições.

### Arquivo: `app/Http/Controllers/NoteController.php`

**Descrição Técnica:**

- **Namespace:** `App\Http\Controllers`
- **Classe:** `NoteController`
    - Controlador responsável pelas operações CRUD de notas dos usuários.
- **Propriedade:**
    - `$note`: Instância do modelo `Note`.
- **Funções:**
    - `__construct`: Inicializa `$note`.
    - `index`: Lista notas de um usuário específico.
    - `store`: Cria uma nova nota.
    - `show`: Exibe uma nota específica.
    - `update`: Atualiza uma nota existente.
    - `destroy`: Remove uma nota específica.

### Arquivo: `app/Http/Kernel.php`

**Descrição Técnica:**

- **Namespace:** `App\Http`
- **Classe:** `Kernel`
    - Classe principal de middleware para requisições HTTP.
- **Propriedades:**
    - `middleware`: Pilha de middleware global da aplicação.
    - `middlewareGroups`: Grupos de middleware para requisições web e API.
    - `routeMiddleware`: Middleware de rota que podem ser atribuídos a grupos ou utilizados individualmente.

### Arquivo: `app/Http/Middleware/*`

**Descrição Técnica:**

- **Authenticate.php**: Middleware para verificar autenticação de usuários.
- **EncryptCookies.php**: Middleware para encriptar cookies.
- **PreventRequestsDuringMaintenance.php**: Middleware para prevenir requisições durante o modo de manutenção.
- **RedirectIfAuthenticated.php**: Middleware para redirecionar usuários autenticados.
- **TrimStrings.php**: Middleware para remover espaços em branco de strings.
- **TrustHosts.php**: Middleware para confiar em hosts específicos.
- **TrustProxies.php**: Middleware para confiar em proxies específicos.
- **VerifyCsrfToken.php**: Middleware para verificar tokens CSRF.

### Arquivo: `app/Models/*`

**Descrição Técnica:**

- **Note.php**:
    - **Propriedades:** `fillable` (campos permitidos para inserção em massa), `hidden` (campos ocultos na serialização).
    - **Funções:** `rules` (regras de validação), `feedback` (mensagens de feedback), `user` (relacionamento belongsTo com `User`).

- **User.php**:
    - **Interface:** `JWTSubject` para integração com JWT.
    - **Propriedades:** `fillable`, `hidden`, `casts`.
    - **Funções:** `tasks` (relacionamento hasMany com `Task`), `getJWTIdentifier`, `getJWTCustomClaims`.

### Arquivo: `app/Providers/*`

**Descrição Técnica:**

- **AppServiceProvider.php**: Classe para registrar e inicializar serviços da aplicação.
- **AuthServiceProvider.php**: Classe para registrar políticas de autenticação e autorização.
- **BroadcastServiceProvider.php**: Classe para registrar rotas de broadcast.
- **EventServiceProvider.php**: Classe para registrar eventos da aplicação.
- **RouteServiceProvider.php**: Classe para configuração de rotas e limits de requisições.

### Arquivo: `app/Repository/*`

**Descrição Técnica:**

- **AuthenticationRepository.php**:
    - **Funções:** `userRegistration` (registro de usuário), `login` (autenticação e geração de token), `getUser` (busca de usuário), `refresh` (renovação de token), `validateToken` (validação de token).

- **NoteRepository.php**:
    - **Funções:** `createNote` (criação de nota), `showNote` (busca de nota), `deleteNote` (remoção de nota), `noteList` (listagem de notas), `updatedNote` (atualização de nota).

### Arquivo: `bootstrap/app.php`

**Descrição Técnica:**

- Arquivo para criação da instância da aplicação Laravel, registro de kernels de HTTP e Console, e retorno da aplicação para execução.

### Arquivos de Configuração (`config/*.php`)

**Descrição Técnica:**

Set de arquivos responsáveis por configurar várias facetas da aplicação, incluindo:

- `app.php`: Configurações da aplicação.
- `auth.php`: Configurações de autenticação.
- `broadcasting.php`: Configurações de broadcast.
- `cache.php`: Configurações de cache.
- `cors.php`: Configurações de CORS.
- `database.php`: Configurações de banco de dados.
- `filesystems.php`: Configurações de sistema de arquivos.
- `hashing.php`: Configurações de hashing.
- `jwt.php`: Configurações de JWT.
- `logging.php`: Configurações de logging.
- `mail.php`: Configurações de correio eletrônico.

**Conclusão:** 

O software API Notas do Deep é uma robusta aplicação Laravel voltada para gestão de anotações e autenticação de usuários. A estrutura modular permite fácil manutenção e extensibilidade, com várias camadas de abstração desde controladores, repositórios, até middleware e provedores de serviço. As operações de criação, leitura, atualização e deleção de notas são bem definidas e integradas com a segurança proporcionada pelo JWT.