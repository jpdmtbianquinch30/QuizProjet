<?php
require __DIR__ . '/../vendor/autoload.php';

// IMPORTANT : Nettoyer et forcer la configuration
if (file_exists(__DIR__ . '/../bootstrap/cache/config.php')) {
    unlink(__DIR__ . '/../bootstrap/cache/config.php');
}

$app = require_once __DIR__ . '/../bootstrap/app.php';

// Forcer la configuration de la base de données
$app['config']['database.default'] = 'mysql';
$app['config']['database.connections.mysql'] = [
    'driver' => 'mysql',
    'host' => '127.0.0.1',
    'port' => '3306',
    'database' => 'easy_planning',
    'username' => 'root',
    'password' => '',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
];

use Illuminate\Http\Request;

// Créer une requête pour l'API employees
$request = Request::create('/api/employees', 'GET');
$request->headers->set('Accept', 'application/json');

try {
    $response = $app->handle($request);
    
    // Afficher la réponse JSON formatée
    header('Content-Type: application/json');
    echo $response->getContent();
    
    $app->terminate($request, $response);
} catch (\Throwable $e) {
    echo json_encode([
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}