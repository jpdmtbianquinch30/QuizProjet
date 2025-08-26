<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->routes(function () {
            // ⬇️ Charge bien routes/api.php sous le préfixe /api et middleware 'api'
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            // ⬇️ Charge les routes web habituelles
            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });
    }
}
