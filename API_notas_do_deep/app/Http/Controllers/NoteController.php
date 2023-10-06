<?php

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


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
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


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
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

    /**
     * Display the specified resource.
     *
     * @param  Integer
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $noteRepository = new NoteRepository($this->note);
        $note = $noteRepository->showNote($id);
        if ($note == null) {
            return response()->json(['msg' => 'Não existe tarefa com o id informado!'], 400);
        }
        return response()->json($note, 200);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  Integer
     * @return \Illuminate\Http\Response
     */
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

    /**
     * Remove the specified resource from storage.
     *
     * @param  Integer
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $noteRepository = new NoteRepository($this->note);
        $deleted = $noteRepository->deleteNote($id);
        if (!$deleted) {
            return response()->json(['msg' => 'Não existe tarefa com o id informado!'], 400);
        }
        return response()->json(['msg' => 'Tarefa excluida com sucesso!'], 200);
    }
}
