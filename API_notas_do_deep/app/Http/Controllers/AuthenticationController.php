<?php

namespace App\Http\Controllers;

use App\Repository\AuthenticationRepository;
use App\Models\User;
use Illuminate\Http\Request;

class AuthenticationController extends Controller
{
    private $user;

    public function __construct(User $user) {
        $this->user = $user;
    }

    public function login(Request $request){

        $authenticationRepository = new AuthenticationRepository($this->user);
        $data =$request->all(['email','password']);
        $token = $authenticationRepository->login($data);
        if(!$token){
            return response()->json(['msg' => 'Email ou senha inválidos!'],403);
        }
        $user = $authenticationRepository->getUser($data);
        return response()->json(['token'=>$token,'user'=>$user],200);
    }

    public function registration(Request $request){
        $authenticationRepository = new AuthenticationRepository($this->user);

        $this->user= $authenticationRepository->userRegistration($request->all());
        if($this->user === null){
            return response()->json(['msg' => 'Já existe usuário com o email informado'],409);
        }
        return response()->json($this->user,201);
    }

    public function logout(){
        auth('api')->logout();
        return response()->json(['msg' => 'Usuário deslogado com sucesso!'],200);
    }

    public function refresh(){
        $authenticationRepository = new AuthenticationRepository($this->user);
        $token = $authenticationRepository->refresh();
        return response()->json(['token'=>$token],200);
    }
}
