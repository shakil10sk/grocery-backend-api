<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Grosarry - Admin Panel">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Grosarry - Admin Panel</title>
    @viteReactRefresh
    @vite('resources/js/admin/main.jsx')
</head>
<body>
    <div id="admin"></div>
</body>
</html>
