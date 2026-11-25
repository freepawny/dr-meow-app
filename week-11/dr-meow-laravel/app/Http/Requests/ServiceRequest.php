<?php

namespace App\Http\Requests;

use App\Traits\ApiResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class ServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'category' => ['required', 'in:grooming,hotel,clinic,styling'],
            'price' => ['required', 'numeric', 'min:0'],
            'duration_minutes' => ['nullable', 'integer', 'min:15'],
            'is_active' => ['boolean'],
            'id' => ['nullable', 'string', 'max:100'],
            'badge_label' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'is_popular' => ['boolean'],
            'tier_prices' => ['nullable', 'array'],
            'features' => ['nullable', 'array'],
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            ApiResponse::error('Validasi Input Untuk Service Gagal', 422, $validator->errors()->toArray())
        );
    }
}
