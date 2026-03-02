<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            // Data Kontak & Identitas
            'phone_number' => ['nullable', 'string', 'max:20'],
            'whatsapp' => ['nullable', 'string', 'max:20'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:1024'], // Maksimal 1MB

            // Data Sosial Media
            'instagram_username' => ['nullable', 'string', 'max:100'],
            'ig_followers' => ['nullable', 'integer', 'min:0'],
            'ig_profile_url' => ['nullable', 'url', 'max:255'],
            
            'tiktok_username' => ['nullable', 'string', 'max:100'],
            'tiktok_followers' => ['nullable', 'integer', 'min:0'],
            'tiktok_profile_url' => ['nullable', 'url', 'max:255'],

            // Data Perbankan
            'bank_name' => ['nullable', 'string', 'max:100'],
            'bank_account_number' => ['nullable', 'string', 'max:50'],
            'bank_account_name' => ['nullable', 'string', 'max:255'],
        ];
    }
}