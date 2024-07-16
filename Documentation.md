# Documentação Técnica e Funcional

## Resumo Funcional do Software

O software "API Notas do Deep" é uma aplicação de gerenciamento de tarefas e autenticação de usuários. A API permite aos usuários registrarem-se, fazer login, criar, listar, atualizar e excluir notas (tarefas). Além disso, gerencia tokens de autenticação por meio de JWT, garantindo sessões seguras. A aplicação foi desenvolvida utilizando o framework Laravel e integra características como middleware de segurança, controle de exceções, e rate limiting.

## Documentação Técnica

### app/Console/Kernel.php

Classe `Kernel` responsável pela programação e registro dos comandos do console.

```php
namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule)
    {
        // $schedule->command('inspire')->hourly();
    }

    protected function commands()
    {
        $this->load(__DIR__.'/Commands');
        require base_path('routes/console.php');
    }
}
```

### app/Exceptions/Handler.php

Classe `Handler` responsável pelo tratamento de exceções na aplicação.

```php
namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontReport = [];

    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }
}
```

### app/Http/Controllers/AuthenticationController.php

Controlador responsável pelas rotas de autenticação de usuários.

```php
namespace App\Http\Controllers;

use App\Repository\AuthenticationRepository;
use App\Models\User;
use Illuminate\Http\Request;

class AuthenticationController extends Controller
{
    private $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function login(Request $request)
    {
        $authenticationRepository = new AuthenticationRepository($this->user);
        $data = $request->all(['email','password']);
        $token = $authenticationRepository->login($data);
        if (!$token) {
            return response()->json(['msg' => 'Email ou senha inválidos!'], 403);
        }
        $user = $authenticationRepository->getUser($data);
        return response()->json(['token' => $token, 'user' => $user], 200);
    }

    public function registration(Request $request)
    {
        $authenticationRepository = new AuthenticationRepository($this->user);
        $this->user = $authenticationRepository->userRegistration($request->all());
        if ($this->user === null) {
            return response()->json(['msg' => 'Já existe usuário com o email informado'], 409);
        }
        return response()->json($this->user, 201);
    }

    public function logout()
    {
        auth('api')->logout();
        return response()->json(['msg' => 'Usuário deslogado com sucesso!'], 200);
    }

    public function refresh()
    {
        $authenticationRepository = new AuthenticationRepository($this->user);
        $token = $authenticationRepository->refresh();
        return response()->json(['token' => $token], 200);
    }

    public function validateToken()
    {
        $authenticationRepository = new AuthenticationRepository($this->user);
        $validToken = $authenticationRepository->validateToken();
        return response()->json(['validToken' => $validToken], 200);
    }
}
```

### app/Http/Controllers/Controller.php

Controller padrão que todos os outros controladores herdam.

```php
namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
}
```

### app/Http/Controllers/NoteController.php

Controlador responsável pelas operações CRUD para as notas/tarefas.

```php
namespace App\Http\Controllers;

use App\Models\Note;
use App\Repository\NoteRepository;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    private $note;

    public function __construct(Note $note)
    {
        $this->note = $note;
    }

    public function index(Request $request)
    {
        $rules = [
            'user_id' => 'required'
        ];
        $feedback = [
            'required' => 'O campo :attribute é obrigatório!'
        ];
        $request->validate($rules, $feedback);
        $noteRepository = new NoteRepository($this->note);
        $note_list = $noteRepository->noteList($request->all(['user_id']));
        if ($note_list == null) {
            return response()->json(['msg' => 'Não existe usuário com a credencial informada!'], 400);
        }
        return response()->json($note_list, 200);
    }

    public function store(Request $request)
    {
        $request->validate($this->note->rules(), $this->note->feedback());
        $noteRepository = new NoteRepository($this->note);
        $note = $noteRepository->createNote($request->all());
        if ($note == null) {
            return response()->json(['msg' => 'O tipo da tarefa precisa ser válido'], 400);
        }
        return response()->json($note, 201);
    }

    public function show($id)
    {
        $noteRepository = new NoteRepository($this->note);
        $note = $noteRepository->showNote($id);
        if ($note == null) {
            return response()->json(['msg' => 'Não existe tarefa com o id informado!'], 400);
        }
        return response()->json($note, 200);
    }

    public function update(Request $request, $id)
    {
        $noteRepository = new NoteRepository($this->note);
        $rules = $this->note->rules();
        if($request->getMethod() == "PATCH"){
            $dynamicRules = array();
            $attributes = $request->all();
            foreach ($attributes as $key => $value) {
               $dynamicRules[$key] = $rules[$key];
            }
            $rules = $dynamicRules;
        }
        $request->validate($rules,$this->note->feedback());
        $updatedNotes = $noteRepository->updatedNote($request->all(),$id);
        if(is_string($updatedNotes)){
            return response()->json(['msg'=> $updatedNotes],400);
        }
        if($updatedNotes == null){
            return response()->json(['msg'=> 'Não existe tarefa com essa credencial'],400);
        }
        return response()->json($updatedNotes,200);
    }

    public function destroy($id)
    {
        $noteRepository = new NoteRepository($this->note);
        $deleted = $noteRepository->deleteNote($id);
        if (!$deleted) {
            return response()->json(['msg' => 'Não existe tarefa com o id informado!'], 400);
        }
        return response()->json(['msg' => 'Tarefa excluída com sucesso!'], 200);
    }
}
```

### app/Http/Kernel.php

Definição dos middleware globais, middleware de grupo e middleware de rota.

```php
namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    protected $middleware = [
        \App\Http\Middleware\TrustProxies::class,
        \Fruitcake\Cors\HandleCors::class,
        \App\Http\Middleware\PreventRequestsDuringMaintenance::class,
        \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
        \App\Http\Middleware\TrimStrings::class,
        \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
    ];

    protected $middlewareGroups = [
        'web' => [
            \App\Http\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \App\Http\Middleware\VerifyCsrfToken::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
        'api' => [
            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ];

    protected $routeMiddleware = [
        'auth' => \App\Http\Middleware\Authenticate::class,
        'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
        'cache.headers' => \Illuminate\Http\Middleware\SetCacheHeaders::class,
        'can' => \Illuminate\Auth\Middleware\Authorize::class,
        'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
        'password.confirm' => \Illuminate\Auth\Middleware\RequirePassword::class,
        'signed' => \Illuminate\Routing\Middleware\ValidateSignature::class,
        'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
        'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
        'jwt.auth' => \Tymon\JWTAuth\Http\Middleware\Authenticate::class,
    ];
}
```

### app/Http/Middleware/Authenticate.php

Middleware responsável pela autenticação dos usuários.

```php
namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    protected function redirectTo($request)
    {
        if (! $request->expectsJson()) {
            return route('login');
        }
    }
}
```

### app/Http/Middleware/EncryptCookies.php

Middleware que criptografa cookies.

```php
namespace App\Http\Middleware;

use Illuminate\Cookie\Middleware\EncryptCookies as Middleware;

class EncryptCookies extends Middleware
{
    protected $except = [];
}
```

### app/Http/Middleware/PreventRequestsDuringMaintenance.php

Middleware que previne requisições durante o modo de manutenção.

```php
namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance as Middleware;

class PreventRequestsDuringMaintenance extends Middleware
{
    protected $except = [];
}
```

### app/Http/Middleware/RedirectIfAuthenticated.php

Middleware que redireciona usuários autenticados.

```php
namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectIfAuthenticated
{
    public function handle(Request $request, Closure $next, ...$guards)
    {
        $guards = empty($guards) ? [null] : $guards;
        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                return redirect(RouteServiceProvider::HOME);
            }
        }
        return $next($request);
    }
}
```

### app/Http/Middleware/TrimStrings.php

Middleware que remove espaços em branco.

```php
namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\TrimStrings as Middleware;

class TrimStrings extends Middleware
{
    protected $except = [
        'current_password',
        'password',
        'password_confirmation',
    ];
}
```

### app/Http/Middleware/TrustHosts.php

Middleware que define hosts confiáveis.

```php
namespace App\Http\Middleware;

use Illuminate\Http\Middleware\TrustHosts as Middleware;

class TrustHosts extends Middleware
{
    public function hosts()
    {
        return [
            $this->allSubdomainsOfApplicationUrl(),
        ];
    }
}
```

### app/Http/Middleware/TrustProxies.php

Middleware que ajusta proxies confiáveis.

```php
namespace App\Http\Middleware;

use Illuminate\Http\Middleware\TrustProxies as Middleware;
use Illuminate\Http\Request;

class TrustProxies extends Middleware
{
    protected $proxies;

    protected $headers =
        Request::HEADER_X_FORWARDED_FOR |
        Request::HEADER_X_FORWARDED_HOST |
        Request::HEADER_X_FORWARDED_PORT |
        Request::HEADER_X_FORWARDED_PROTO |
        Request::HEADER_X_FORWARDED_AWS_ELB;
}
```

### app/Http/Middleware/VerifyCsrfToken.php

Middleware de verificação de token CSRF.

```php
namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    protected $except = [];
}
```

### app/Models/Note.php

Modelo Eloquent para as notas/tarefas.

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'type', 'title', 'description'];
    protected $hidden = ['created_at', 'updated_at'];

    public function rules()
    {
        return [
            'user_id' => 'required',
            'type' => 'required|min:4',
            'title' => 'required|min:1',
            'description' => 'required'
        ];
    }

    public function feedback()
    {
        return [
            'required' => 'O campo :attribute é obrigatório',
            'type.min' => 'O campo :attribute precisa conter pelo menos 4 caracteres',
            'title.min' => 'O campo :attribute precisa conter pelo menos 1 caractere'
        ];
    }

    public function user()
    {
        return $this->belongsTo('App\\Models\\User');
    }
}
```

### app/Models/User.php

Modelo Eloquent para os usuários.

```php
namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];
    protected $hidden = [
        'password',
        'remember_token',
        'created_at',
        'updated_at',
    ];
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function tasks()
    {
        return $this->hasMany('App\\Models\\Task');
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
```

### app/Providers/AppServiceProvider.php

Classe `AppServiceProvider` responsável pelo registro e boot de serviços centrais.

```php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        //
    }

    public function boot()
    {
        //
    }
}
```

### app/Providers/AuthServiceProvider.php

Classe responsável pela autorização e autenticação.

```php
namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [];

    public function boot()
    {
        $this->registerPolicies();
    }
}
```

### app/Providers/BroadcastServiceProvider.php

Classe responsável pelas configurações de broadcast.

```php
namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    public function boot()
    {
        Broadcast::routes();
        require base_path('routes/channels.php');
    }
}
```

### app/Providers/EventServiceProvider.php

Classe responsável pelo registro de eventos e listeners.

```php
namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
    ];

    public function boot()
    {
        //
    }
}
```

### app/Providers/RouteServiceProvider.php

Classe responsável pelas rotas da aplicação.

```php
namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    public const HOME = '/home';
    protected $namespace = 'App\\Http\\Controllers';

    public function boot()
    {
        $this->configureRateLimiting();

        $this->routes(function () {
            Route::prefix('api')
                ->middleware('api')
                ->namespace($this->namespace)
                ->group(base_path('routes/api.php'));

            Route::middleware('web')
                ->namespace($this->namespace)
                ->group(base_path('routes/web.php'));
        });
    }

    protected function configureRateLimiting()
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by(optional($request->user())->id ?: $request->ip());
        });
    }
}
```

### app/Repository/AuthenticationRepository.php

Repositório de autenticação responsável pelas operações de login, registro e gerenciamento de tokens.

```php
namespace App\Repository;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class AuthenticationRepository
{
    private $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function userRegistration($attributes)
    {
        if ($this->model->where('email', $attributes['email'])->first() != null) {
            return null;
        }
        $attributes['password'] = bcrypt($attributes['password']);
        return $this->model->create($attributes);
    }

    public function login($credentials)
    {
        $token = auth('api')->attempt($credentials);
        return $token;
    }

    public function getUser($data)
    {
        $user = $this->model->where('email', $data['email'])->first();
        return $user;
    }

    public function refresh()
    {
        $token = auth('api')->refresh();
        return $token;
    }

    public function validateToken()
    {
        return auth('api')->check();
    }
}
```

### app/Repository/NoteRepository.php

Repositório de notas responsável pelas operações de CRUD.

```php
namespace App\Repository;

use App\Models\Note;
use App\Models\User;

class NoteRepository
{
    private $note;

    public function __construct(Note $note)
    {
        $this->note = $note;
    }

    public function createNote($noteData)
    {
        if (!($noteData['type'] === 'text')) {
            return null;
        }
        $this->note = $this->note->create([
            'user_id' => $noteData['user_id'],
            'title' => $noteData['title'],
            'type' => $noteData['type'],
            'description' => $noteData['description']
        ]);

        return $this