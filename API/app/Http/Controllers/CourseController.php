<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        try
        {
            return Course::all();
        } catch(\Exception $ex)
        {
            return response()->json(['error' => $ex->getMessage()], 400);
        } 
    }

    public function store(Request $request)
    {
        try
        {
            $course = Course::create($request->all());
            return response()->json($course, 201);
        } catch(\Exception $ex)
        {
            return response()->json(['error' => $ex->getMessage()], 400);
        } 
    }

    public function show(Course $course)
    {
        try
        {
            $entity = $course->findOrFail($course->id)->get();
            return response()->json($entity, 200);
        } catch(\Exception $ex)
        {
            return response()->json(['error' => $ex->getMessage()], 400);
        } 
    }

    public function update(Request $request, Course $course)
    {
        try
        {
            $course->update($request->all());
            return response()->json($course);
        } catch(\Exception $ex)
        {
            return response()->json(['error' => $ex->getMessage()], 400);
        } 
      
    }

    public function destroy(Course $course)
    {
        try
        {
            $course->delete();
            return response()->json(['message' => 'Course deleted']);
        }catch(\Exception $ex)
        {
             return response()->json(['error' => $ex->getMessage()], 400);
        }
       
    }
}
