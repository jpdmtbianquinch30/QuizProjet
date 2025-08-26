<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = ['name','email','password','role'];
    protected $hidden = ['password','remember_token'];

    protected function casts(): array {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Helpers simples
    public function isAdmin(): bool   { return $this->role === 'ADMIN'; }
    public function isManager(): bool { return $this->role === 'MANAGER'; }
    public function isEmploye(): bool { return $this->role === 'EMPLOYE'; }
}
