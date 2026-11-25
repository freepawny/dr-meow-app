<?php

namespace Tests\Feature;

use App\Models\Cat;
use App\Models\Customer;
use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MasterDataValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_service_index_and_show_return_200(): void
    {
        $this->getJson('/api/v1/services')
            ->assertOk()
            ->assertJsonPath('success', true);

        Service::create([
            'id' => 'grooming-test',
            'name' => 'Grooming Test',
            'base_price' => 50000,
            'category' => 'grooming',
        ]);

        $this->getJson('/api/v1/services/grooming-test')
            ->assertOk()
            ->assertJsonPath('data.name', 'Grooming Test');
    }

    public function test_service_store_valid_returns_201_and_maps_fields(): void
    {
        $this->postJson('/api/v1/services', [
            'name' => 'Hotel Test',
            'category' => 'hotel',
            'price' => 75000,
            'duration_minutes' => 45,
            'is_active' => true,
        ])->assertStatus(201)->assertJsonPath('success', true);

        $this->assertDatabaseHas('services', [
            'id' => 'hotel-test',
            'name' => 'Hotel Test',
            'category' => 'hotel',
            'base_price' => 75000,
            'duration_minutes' => 45,
            'is_active' => 1,
        ]);
    }

    public function test_service_store_empty_returns_422(): void
    {
        $this->postJson('/api/v1/services', [])
            ->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonStructure(['errors' => ['name', 'category', 'price']]);
    }

    public function test_service_store_invalid_category_returns_422(): void
    {
        $this->postJson('/api/v1/services', [
            'name' => 'Invalid',
            'category' => 'unknown',
            'price' => 1000,
        ])->assertStatus(422)->assertJsonPath('success', false);
    }

    public function test_service_show_missing_returns_404(): void
    {
        $this->getJson('/api/v1/services/does-not-exist')
            ->assertStatus(404)
            ->assertJsonPath('success', false);
    }

    public function test_service_update_valid_returns_200(): void
    {
        Service::create([
            'id' => 'grooming-test',
            'name' => 'Old Name',
            'base_price' => 10000,
            'category' => 'grooming',
        ]);

        $this->putJson('/api/v1/services/grooming-test', [
            'name' => 'New Name',
            'category' => 'clinic',
            'price' => 20000,
            'duration_minutes' => 30,
            'is_active' => false,
        ])->assertOk()->assertJsonPath('data.name', 'New Name');

        $this->assertDatabaseHas('services', [
            'id' => 'grooming-test',
            'base_price' => 20000,
            'is_active' => 0,
        ]);
    }

    public function test_service_update_invalid_returns_422(): void
    {
        Service::create([
            'id' => 'grooming-test',
            'name' => 'Old Name',
            'base_price' => 10000,
            'category' => 'grooming',
        ]);

        $this->putJson('/api/v1/services/grooming-test', [])
            ->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_service_delete_returns_200(): void
    {
        Service::create([
            'id' => 'grooming-test',
            'name' => 'Hapus',
            'base_price' => 10000,
            'category' => 'grooming',
        ]);

        $this->deleteJson('/api/v1/services/grooming-test')->assertOk();
        $this->getJson('/api/v1/services/grooming-test')->assertStatus(404);
    }

    public function test_customer_store_valid_returns_201_and_maps_fields(): void
    {
        $this->postJson('/api/v1/customers', [
            'name' => 'Nadia Putri',
            'phone' => '081234567890',
            'email' => 'nadia@example.com',
            'address' => 'Jl. Test No. 1',
        ])->assertStatus(201)->assertJsonPath('success', true);

        $this->assertDatabaseHas('customers', [
            'name' => 'Nadia Putri',
            'phone_number' => '081234567890',
            'email' => 'nadia@example.com',
            'address' => 'Jl. Test No. 1',
        ]);
    }

    public function test_customer_store_empty_returns_422(): void
    {
        $this->postJson('/api/v1/customers', [])
            ->assertStatus(422)
            ->assertJsonStructure(['errors' => ['name', 'phone']]);
    }

    public function test_customer_show_missing_returns_404(): void
    {
        $this->getJson('/api/v1/customers/CUS-MISSING')->assertStatus(404);
    }

    public function test_customer_update_valid_returns_200(): void
    {
        $this->makeCustomer();

        $this->putJson('/api/v1/customers/CUS-TEST', [
            'name' => 'Nama Baru',
            'phone' => '081111111111',
            'email' => 'baru@example.com',
            'address' => 'Alamat Baru',
        ])->assertOk()->assertJsonPath('data.name', 'Nama Baru');

        $this->assertDatabaseHas('customers', [
            'customer_id' => 'CUS-TEST',
            'phone_number' => '081111111111',
            'email' => 'baru@example.com',
        ]);
    }

    public function test_customer_delete_returns_200(): void
    {
        $this->makeCustomer();

        $this->deleteJson('/api/v1/customers/CUS-TEST')->assertOk();
        $this->getJson('/api/v1/customers/CUS-TEST')->assertStatus(404);
    }

    public function test_cat_store_valid_returns_201_and_maps_fields(): void
    {
        $this->makeCustomer();

        $this->postJson('/api/v1/cats', [
            'customer_id' => 'CUS-TEST',
            'name' => 'Mochi',
            'breed' => 'Persian',
            'age_years' => 2.5,
            'weight_kg' => 3.2,
        ])->assertStatus(201)->assertJsonPath('success', true);

        $this->assertDatabaseHas('cats', [
            'customer_id' => 'CUS-TEST',
            'name' => 'Mochi',
            'breeds' => 'Persian',
            'age_years' => 2.5,
            'weight' => 3.2,
        ]);
    }

    public function test_cat_store_with_missing_customer_returns_422(): void
    {
        $this->postJson('/api/v1/cats', [
            'customer_id' => 'CUS-MISSING',
            'name' => 'Mimi',
        ])->assertStatus(422)->assertJsonStructure(['errors' => ['customer_id']]);
    }

    public function test_cat_store_empty_returns_422(): void
    {
        $this->postJson('/api/v1/cats', [])
            ->assertStatus(422)
            ->assertJsonStructure(['errors' => ['customer_id', 'name']]);
    }

    public function test_cat_show_missing_returns_404(): void
    {
        $this->getJson('/api/v1/cats/CAT-MISSING')->assertStatus(404);
    }

    public function test_cat_update_valid_returns_200(): void
    {
        $this->makeCustomer();

        Cat::create([
            'cat_id' => 'CAT-TEST',
            'customer_id' => 'CUS-TEST',
            'name' => 'Old Cat',
            'breeds' => 'Persian',
            'weight' => 1.5,
        ]);

        $this->putJson('/api/v1/cats/CAT-TEST', [
            'customer_id' => 'CUS-TEST',
            'name' => 'New Cat',
            'breed' => 'Siamese',
            'age_years' => 4,
            'weight_kg' => 4.1,
        ])->assertOk()->assertJsonPath('data.name', 'New Cat');

        $this->assertDatabaseHas('cats', [
            'cat_id' => 'CAT-TEST',
            'breeds' => 'Siamese',
            'age_years' => 4,
            'weight' => 4.1,
        ]);
    }

    public function test_cat_delete_returns_200(): void
    {
        $this->makeCustomer();

        Cat::create([
            'cat_id' => 'CAT-TEST',
            'customer_id' => 'CUS-TEST',
            'name' => 'Hapus',
            'breeds' => 'Persian',
            'weight' => 1.5,
        ]);

        $this->deleteJson('/api/v1/cats/CAT-TEST')->assertOk();
        $this->getJson('/api/v1/cats/CAT-TEST')->assertStatus(404);
    }

    private function makeCustomer(string $id = 'CUS-TEST'): Customer
    {
        return Customer::create([
            'customer_id' => $id,
            'name' => 'Owner Test',
            'phone_number' => '081234567890',
            'schedule' => '2026-11-30T10:00:00',
            'address' => 'Jl. Test No. 1',
            'preference_notification' => true,
        ]);
    }
}
