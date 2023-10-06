<?php

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

        return $this->note->where('id', $this->note->id)->first();
    }

    public function showNote($id)
    {
        $note = $this->note->where('id', $id)->first();
        return $note;
    }

    public function deleteNote($id)
    {
        $note = $this->note->find($id);
        if ($note == null) {
            return false;
        }
        $status = $note->delete();
        return $status;
    }


    public function noteList($attributes)
    {

        $user_id = $attributes['user_id'];
        if (User::find($user_id) ==  null) {
            return null;
        }
        $note_list = $this->note->where('user_id', $user_id)->get();
        return $note_list;
    }

    public function updatedNote($attributes, $note_id)
    {
        $note = $this->note->find($note_id);
        if ($note == null) {
            return null;
        }
        if (isset($attributes['type'])) {
            if (!$attributes['type'] === 'text') {
                return 'O tipo da tarefa precisa ser válido';
            }
        }
        $note->fill($attributes);
        $note->save();
        $note = $this->note->find($note_id);
        return $note;
    }
}
