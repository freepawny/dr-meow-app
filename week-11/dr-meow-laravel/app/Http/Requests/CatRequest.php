<?php

namespace App\Http\Requests;

use App\Traits\ApiResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class CatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_id' => ['required', Rule::exists('customers', 'customer_id')],
            'name' => ['required', 'string', 'max:50'],
            'breed' => ['nullable', 'string', 'max:50'],
            'age_years' => ['nullable', 'numeric', 'min:0'],
            'weight_kg' => ['nullable', 'numeric', 'min:0'],
            'cat_id' => ['nullable', 'string', 'max:100'],
            'vital_temperature' => ['nullable', 'numeric'],
            'tempramen' => ['nullable', 'string', 'max:50'],
            'medical_history' => ['nullable', 'string'],
            'last_picture' => ['nullable', 'string', 'max:255'],
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            ApiResponse::error('Validasi Input Untuk Cat Gagal', 422, $validator->errors()->toArray())
        );
    }
}
