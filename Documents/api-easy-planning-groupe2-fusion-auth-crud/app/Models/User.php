<?php

namespace App\Models;

use App\Notifications\ResetPasswordNotification;
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
    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new ResetPasswordNotification($token));
    }

    /**
     * Vérifie si l'utilisateur est un administrateur
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->role === 'ADMIN';
    }

    /**
     * Vérifie si l'utilisateur est un manager
     * @return bool
     */
    public function isManager(): bool
    {
        return $this->role === 'MANAGER';
    }

    /**
     * Vérifie si l'utilisateur est un employé
     * @return bool
     */
    public function isEmploye(): bool
    {
        return $this->role === 'EMPLOYE';
    }
}
