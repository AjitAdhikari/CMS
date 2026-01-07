<?php

namespace App\Http\Controllers;

use App\Models\Fee;
use App\Models\FeeDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        //
       

        try{
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                // 'semester' => 'required|string',
                'total_fee' => 'required|integer'
            ]);

            $entity = new Fee();
            $entity->user_id = $validated['user_id'];
            $entity->semester  = 'none';
            $entity->total_fee = $validated['total_fee'];
            $entity->created_by = 1;
            $entity->save();

            return response()->json([
                'message' => 'Fee Added Successfully',
                'id' => $entity->id
            ]);

        } catch(\Exception $ex)
        {
            return response()->json(['error' => $ex->getMessage()], 400);
        } 
    }


    public function create_fee_details(Request $request)
    {


        try{
            $validated = $request->validate([
                'user_id' => 'required|string ',
                'semester' => 'required|string',
                'payment_date' => 'required|string',
                'amount' =>'required|integer'
            ]);

            $entity = new FeeDetail();
            $entity->user_id = $validated['user_id'];
            $entity->semester  = $validated['semester'];
            $entity->amount = $validated['amount'];
            $entity->payment_date = $validated['payment_date'];
            $entity->created_by = 1;
            $entity->save();

            return response()->json([
                'message' => 'Fee Details Added Successfully',
                'id' => $entity->id
            ]);

        } catch(\Exception $ex)
        {
            return response()->json(['error' => $ex->getMessage()], 400);
        } 
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        try{
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'semester' => 'required|string',
                'total_fee' => 'required|integer'
            ]);

            $entity = Fee::findOrFail($validated['id']);
            $entity->user_id = $validated['user_id'] ?? $entity->user_id;
            $entity->semester  = $validated['semester'] ?? $entity->semester;
            $entity->total_fee = $validated['total_fee'] ?? $entity->total_fee;
            $entity->updated_by = 1;
            $entity->save();

            return response()->json([
                'message' => 'Fee Updated Successfully',
                'id' => $entity->id
            ]);

        } catch(\Exception $ex)
        {
            return response()->json(['error' => $ex->getMessage()], 400);
        } 
    }

    public function update_fee_details(Request $request)
    {
          $validated = $request->validate([
            'user_id' => 'required|string ',
            'semester' => 'required|string',
            'payment_date' => 'required|string',
            'amount' =>'required|integer'
        ]);

        try{
            $entity = FeeDetail::findOrFail($validated['id']);
            $entity->user_id = $validated['user_id'] ?? $entity->user_id;
            $entity->semester  = $validated['semester'] ?? $entity->semester;
            $entity->amount = $validated['amount'] ?? $entity->amount;
            $entity->payment_date = $validated['payment_date'] ?? $entity->payment_date;
            $entity->updated_by = 1;
            $entity->save();

            return response()->json([
                'message' => 'Fee Details Added Successfully',
                'id' => $entity->id
            ]);

        } catch(\Exception $ex)
        {
            return response()->json(['error' => $ex->getMessage()], 400);
        } 
    }

    /**
     * Display the specified resource.
     */
    public function show($user_id)
    {
        //
        try
        {
            $entity = Fee::where('user_id', $user_id)->get();
            return response()->json([
                'data' => $entity
            ], 200);
        } catch(\Exception $ex){
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    public function show_fee_details($user_id)
    {   
        try { 
            $entity = FeeDetail::where('user_id', $user_id)->get();
            return response()->json([
                'data' => $entity
            ], 200);

        } catch(\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }




    /**
     * Remove the specified resource from storage.
     */
    public function delete($id)
    {
        try{
            $entity = Fee::findOrFail($id);
            $entity->delete();

            return response()->json([
                'message' => 'Fee Deleted Successfully',
            ], 201);

        }catch(\Exception $ex)
        {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }

    public function delete_fee_details($id)
    {
        try
        {
            $entity = FeeDetail::findOrFail($id);
            $entity->delete();
            return response()->json([
                'message' => 'Fee Details Deleted Successfully',
            ], 201);
        }catch(\Exception $ex)
        {
            return response()->json(['error'=> $ex->getMessage()], 400);
        }
    }


    public function fee_summary($userId)
    {
        try { 
            $data = DB::table('fees as f')
            ->leftJoin('fee_details as fd', 'f.user_id', '=', 'fd.user_id')
            ->where('f.user_id', $userId)
            ->select(
                'f.total_fee as total_fee',
                DB::raw('COALESCE(SUM(fd.amount), 0) as paid_amount'),
                DB::raw('(f.total_fee - COALESCE(SUM(fd.amount), 0)) as remaining_amount')
            )
            ->groupBy('f.total_fee')
            ->first(); // use get() if multiple rows expected
            return response()->json([
                'data' => $data
            ], 200);

        } catch(\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()], 400);
        }
    }
}
