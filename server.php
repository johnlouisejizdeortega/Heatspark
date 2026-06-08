<?php

$publicPath = getcwd();

$uri = urldecode(
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? ''
);

if ($uri !== '/' && $uri !== '' && file_exists($publicPath.$uri) && ! is_dir($publicPath.$uri)) {
    $filePath = $publicPath.$uri;
    $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

    $contentTypes = [
        'css' => 'text/css; charset=UTF-8',
        'js' => 'application/javascript; charset=UTF-8',
        'json' => 'application/json; charset=UTF-8',
        'map' => 'application/json; charset=UTF-8',
        'svg' => 'image/svg+xml',
        'txt' => 'text/plain; charset=UTF-8',
        'xml' => 'application/xml; charset=UTF-8',
        'html' => 'text/html; charset=UTF-8',
        'ico' => 'image/x-icon',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'webp' => 'image/webp',
        'avif' => 'image/avif',
        'woff' => 'font/woff',
        'woff2' => 'font/woff2',
    ];

    if (isset($contentTypes[$extension])) {
        header('Content-Type: '.$contentTypes[$extension]);
    }

    if (str_starts_with($uri, '/build/')) {
        header('Cache-Control: public, max-age=31536000, immutable');
    }

    $acceptEncoding = $_SERVER['HTTP_ACCEPT_ENCODING'] ?? '';
    $supportsGzip = stripos($acceptEncoding, 'gzip') !== false;

    $compressible = in_array($extension, ['css', 'js', 'json', 'map', 'svg', 'txt', 'xml', 'html'], true);

    if ($supportsGzip && $compressible) {
        header('Vary: Accept-Encoding');
        header('Content-Encoding: gzip');

        $contents = file_get_contents($filePath);
        $gzipped = gzencode($contents === false ? '' : $contents, 6);

        if ($gzipped !== false) {
            header('Content-Length: '.strlen($gzipped));

            if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'HEAD') {
                echo $gzipped;
            }

            return true;
        }
    }

    $size = filesize($filePath);

    if ($size !== false) {
        header('Content-Length: '.$size);
    }

    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'HEAD') {
        readfile($filePath);
    }

    return true;
}

$formattedDateTime = date('D M j H:i:s Y');

$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$remoteAddress = ($_SERVER['REMOTE_ADDR'] ?? 'unknown').':'.($_SERVER['REMOTE_PORT'] ?? '0');

file_put_contents('php://stdout', "[$formattedDateTime] $remoteAddress [$requestMethod] URI: $uri\n");

require_once $publicPath.'/index.php';
