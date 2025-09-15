<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    public function __construct(public string $token) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $frontendUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:4200'));

        // Lien vers ta page Angular avec token + email
        $resetUrl = "{$frontendUrl}/reset-password?token={$this->token}&email=" . urlencode($notifiable->email);

        return (new MailMessage)
            ->subject('Réinitialisation de votre mot de passe')
            ->greeting('Bonjour,')
            ->line('Vous recevez cet e-mail car nous avons reçu une demande de réinitialisation du mot de passe pour votre compte.')
            ->action('Réinitialiser mon mot de passe', $resetUrl)
            ->line('Si vous n’êtes pas à l’origine de cette demande, aucune action n’est requise.');
    }
}
