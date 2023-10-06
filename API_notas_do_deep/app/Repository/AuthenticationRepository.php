<?php

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
        $user =  $this->model->where('email',$data['email'])->first();
        return $user;
    }

    public function refresh()
    {
        $token = auth('api')->refresh();
        return $token;
    }
}
