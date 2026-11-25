<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@drmeow.test'],
            [
                'name' => 'Admin Dr. Meow',
                'password' => Hash::make('password123'),
            ]
        );
    }
}
