<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\FeeController;


Route::get('/test', function() {
    return ['message' => 'API is working'];
});

//http://localhost:8000/api/users
Route::prefix('users')->group(function(){
    Route::post('/', [UserController::class, 'create']);
    Route::post('/{id}', [USerController::class, 'update']);
    Route::delete('/{id}',[UserController::class, 'delete']);
    Route::get('/{id}', [UserController::class, 'get']);
    Route::get('/', [UserController::class, 'index']);
});


//http://localhost:8000/api/fees
Route::prefix('fees')->group(function () {
    Route::post('/', [FeeController::class, 'create']);
    Route::post('/details', [FeeController::class, 'create_fee_details']);
    Route::post('/{id}', [FeeController::class, 'store']);
    Route::post('/details/{id}', [FeeController::class], 'update_fee_details');
    Route::delete('/{id}', [FeeController::class, 'delete']);
    Route::delete('/details/{id}', [FeeController::class, 'delete_fee_details']);
    Route::get('/{user_id}', [FeeController::class, 'show']);
    Route::get('/details/{user_id}', [FeeController::class, 'show_fee_details']);
    Route::get('/', [FeeController::class, 'index']);
});

// Route::prefix('members')->group(function () {
//     Route::post('/', [MemberController::class, 'create']);
//     Route::post('/{id}', [MemberController::class, 'store']);
//     Route::get('/', [MemberController::class, 'index']);
//     Route::delete('/{id}', [MemberController::class, 'destroy']);
//     Route::get('/{id}', [MemberController::class, 'get']);
//     Route::get('/active-member', [MemberController::class, 'list_active_members']);
// });

// Route::prefix('documents')->group(function () {
//     Route::post('/', [DocumentController::class, 'create']);
//     Route::put('/', [DocumentController::class, 'store']);
//     Route::delete('/{id}', [DocumentController::class, 'destroy']);
//     Route::get('/{id}', [DocumentController::class, 'get']);
//     Route::get('/download/{id}', [DocumentController::class, 'download']);
//     Route::get('/', [DocumentController::class, 'index']);
// });

// Route::prefix('expenses')->group(function () {
//     Route::post('/', [ExpenseController::class, 'create']);
//     Route::put('/', [ExpenseController::class, 'store']);
//     Route::delete('/{expenseDate}', [ExpenseController::class, 'destroy']);
//     Route::get('/{expenseDate}', [ExpenseController::class, 'get']);
//     Route::get('/', [ExpenseController::class, 'index']);
//     Route::get('/total-expense', [ExpenseController::class, 'total']);
// });

// Route::prefix('incomes')->group(function () {
//     Route::post('/', [IncomeController::class, 'create']);
//     Route::put('/', [IncomeController::class, 'store']);
//     Route::delete('/{incomeDate}', [IncomeController::class, 'destroy']);
//     Route::get('/{incomeDate}', [IncomeController::class, 'get']);
//     Route::get('/', [IncomeController::class, 'index']);
//     Route::get('/total-income', [IncomeController::class, 'total']);
// });
