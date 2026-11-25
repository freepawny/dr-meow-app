<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;

class ReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isUpdate = $this->isMethod('put') || $this->isMethod('patch');

        return [
            'reservation_id' => ['nullable', 'string', Rule::when($isUpdate, ['prohibited'])],

            'service_id' => [
                $isUpdate ? 'sometimes' : 'required',
                'required',
                'string',
                Rule::exists('services', 'id'),
            ],

            'customer_id' => [
                'string',
                Rule::when($isUpdate, ['prohibited'], ['required', Rule::exists('customers', 'customer_id')]),
            ],

            'cat_id' => [
                'string',
                Rule::when($isUpdate, ['prohibited'], ['required', Rule::exists('cats', 'cat_id')]),
            ],

            'service_method' => [
                $isUpdate ? 'sometimes' : 'required',
                'required',
                'string',
            ],

            'work_status'     => ['sometimes', 'required', 'string'],
            'notification_h1' => ['sometimes', 'boolean'],
            'total_bill'      => ['sometimes', 'integer', 'min:0'],
            'paymen_status'   => ['sometimes', 'string'],
            'before_after'    => ['nullable', 'array'],
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            ApiResponse::error('Validasi Input Untuk Reservasi Gagal', 422, $validator->errors()->toArray())
        );
    }
}
