<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Grosarry - Your Marketplace for Groceries">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Grosarry - Marketplace</title>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/marketplace/main.jsx'])
</head>
<body>
    <div id="app"></div>
</body>
</html>
