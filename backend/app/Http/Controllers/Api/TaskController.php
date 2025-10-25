<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $tasks = $request->user()->tasks();
        if ($request->has('status')) {
            $tasks->where('status', $request->status);
        }

        // --- Fitur Sorting ---
        $sortDirection = $request->get('sort_direction', 'asc');
        $tasks->orderBy('deadline', $sortDirection);
        return response()->json($tasks->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:To Do,In Progress,Done',
            'deadline' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        $task = $request->user()->tasks()->create($validator->validated());
        return response()->json($task, 201);
    }

    public function show(Request $request, string $id)
    {
        try {
            $task = $request->user()->tasks()->findOrFail($id);
            return response()->json($task);
        
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Task not found'], 404);
        }
    }

    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'status' => 'sometimes|required|in:To Do,In Progress,Done',
            'deadline' => 'sometimes|nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        try {
            $task = $request->user()->tasks()->findOrFail($id);
            
            $task->update($validator->validated());
            return response()->json($task);

        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Task not found'], 404);
        }
    }

    public function destroy(Request $request, string $id)
    {
        try {
            $task = $request->user()->tasks()->findOrFail($id);
    
            $task->delete();
            return response()->json(null, 204);

        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Task not found'], 404);
        }
    }
}