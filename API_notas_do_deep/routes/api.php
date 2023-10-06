<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('jwt.auth')->group(function () {
    Route::apiResource('/note','NoteController');
    Route::post('/logout','AuthenticationController@logout');
    Route::post('/refresh','AuthenticationController@refresh');
});


Route::post('/login','AuthenticationController@login');
Route::post('/registration','AuthenticationController@registration');

