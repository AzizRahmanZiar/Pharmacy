<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', config('app.name', 'Laravel'))</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <style>
    /* Toast container – hidden by default */
    #toast {
        visibility: hidden;
        min-width: 300px;
        max-width: 80%;
        background-color: #10b981; /* emerald green */
        color: #fff;
        text-align: center;
        border-radius: 8px;
        padding: 16px 24px;
        position: fixed;
        z-index: 999;
        left: 50%;
        transform: translateX(-50%);
        top: 30px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        font-weight: 500;
        opacity: 0;
        transition: opacity 0.3s, visibility 0.3s;
    }

    /* Show the toast */
    #toast.show {
        visibility: visible;
        opacity: 1;
    }

    /* Optional progress bar at the bottom */
    #toast-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 4px;
        background-color: rgba(255, 255, 255, 0.5);
        border-radius: 0 0 8px 8px;
        transition: width 3s linear;
        width: 100%;
    }

    /* Close button (optional) */
    #toast-close {
        position: absolute;
        top: 8px;
        right: 12px;
        color: white;
        font-weight: bold;
        font-size: 20px;
        cursor: pointer;
        background: transparent;
        border: none;
        outline: none;
        opacity: 0.7;
    }
    #toast-close:hover {
        opacity: 1;
    }
</style>


</head>
<body class="font-sans antialiased bg-gray-100 min-h-screen flex flex-col">

    <!-- Header with gradient and user menu -->
    <header class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg h-16 flex items-center px-6 sticky top-0 z-10">
        <div class="flex items-center justify-between w-full">
            <div class="flex items-center space-x-3">
                <!-- Logo / App Name -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h1 class="text-xl font-semibold">MediTrack</h1>
            </div>
            <!-- User menu (avatar + dropdown) -->
            <div class="flex items-center space-x-4">
                <span class="text-sm hidden md:inline-block">Admin User</span>
                <div class="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center border-2 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
            </div>
        </div>
    </header>

    <!-- Main container with separate scrollbars -->
    <div class="flex flex-1 overflow-hidden">
        <!-- Sidebar - independent scroll -->
        <aside class="w-64 bg-white shadow-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
            <nav class="p-4">
                <!-- Optional: user profile summary for mobile/sidebar -->
                <div class="mb-6 p-3 bg-gray-50 rounded-lg md:hidden">
                    <p class="text-sm font-medium text-gray-800">Admin User</p>
                    <p class="text-xs text-gray-500">admin@example.com</p>
                </div>

                <ul class="space-y-1">
                    <!-- Dashboard -->
                    <li>
                        <a href="/" class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition group {{ request()->routeIs('dashboard') ? 'bg-blue-50 text-blue-600 font-medium' : '' }}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-500 {{ request()->routeIs('dashboard') ? 'text-blue-500' : '' }}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Dashboard
                        </a>
                    </li>

                    <!-- Stock -->
                    <li>
                        <a href="/medicine" class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition group {{ request()->routeIs('medicine.*') ? 'bg-blue-50 text-blue-600 font-medium' : '' }}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-500 {{ request()->routeIs('medicine.*') ? 'text-blue-500' : '' }}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Stock
                        </a>
                    </li>

                    <!-- Sale -->
                    <li>
                        <a href="/sale" class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition group {{ request()->routeIs('sale.*') ? 'bg-blue-50 text-blue-600 font-medium' : '' }}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-500 {{ request()->routeIs('sale.*') ? 'text-blue-500' : '' }}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            Sale
                        </a>
                    </li>

                    <!-- Purchase -->
                    <li>
                        <a href="/purchase" class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition group {{ request()->routeIs('purchase.*') ? 'bg-blue-50 text-blue-600 font-medium' : '' }}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-500 {{ request()->routeIs('purchase.*') ? 'text-blue-500' : '' }}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Purchase
                        </a>
                    </li>

                    <!-- Items (Create) -->
                    <li>
                        <a href="/items/create" class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition group {{ request()->routeIs('items.create') ? 'bg-blue-50 text-blue-600 font-medium' : '' }}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-500 {{ request()->routeIs('items.create') ? 'text-blue-500' : '' }}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Add Item
                        </a>
                    </li>

                    <!-- Items List -->
                    <li>
                        <a href="/items" class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition group {{ request()->routeIs('items.index') ? 'bg-blue-50 text-blue-600 font-medium' : '' }}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-500 {{ request()->routeIs('items.index') ? 'text-blue-500' : '' }}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                            Items List
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>

        <!-- Main content - independent scroll -->
        <main class="flex-1 overflow-y-auto bg-gray-50 p-6">
            @isset($header)
                <div class="bg-white shadow-sm rounded-xl p-6 mb-6 border border-gray-100">
                    {{ $header }}
                </div>
            @endisset

            <div class="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
                {{ $slot }}
            </div>
        </main>
    </div>

    <!-- Simple footer -->
    <footer class="bg-white border-t border-gray-200 py-4 px-6 text-center text-sm text-gray-500">
        © {{ date('Y') }} MediTrack. All rights reserved.
    </footer>

</body>
</html>
