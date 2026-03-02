<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone_number',
        'bank_name',
        'bank_account_number',
        'bank_account_name',
        'avatar',
        'whatsapp',
        'ig_profile_url',
        'instagram_username',
        'ig_followers',
        'tiktok_profile_url',
        'tiktok_username',
        'tiktok_followers',
        'bio'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function commissions()
    {
        return $this->hasMany(Commission::class);
    }
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
    public function clicks()
    {
        return $this->hasMany(Click::class);
    }
    public function favorites()
    {
        return $this->hasMany(Favorite::class, 'affiliate_id');
    }
    public function products()
    {
        return $this->hasMany(Product::class);
    }
    public function sellerCommissions()
    {
        return $this->hasManyThrough(Commission::class, Product::class);
    }
}
