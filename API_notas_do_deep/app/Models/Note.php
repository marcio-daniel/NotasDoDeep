<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'type', 'title','description'];

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
