<x-layout>
    <div class="py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p class="text-sm text-gray-600 mb-6">Welcome back! Here's an overview of your pharmacy.</p>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <!-- Card Grid -->
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <!-- Total Profit Card -->
                <div class="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-2xl transition-shadow duration-300">
                    <div class="p-6">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 bg-green-100 rounded-lg p-3">
                                <!-- Heroicon: currency-dollar -->
                                <svg class="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 truncate">Total Profit</dt>
                                    <dd class="flex items-baseline">
                                        <div class="text-3xl font-semibold text-gray-900">
                                            ${{ number_format($totalProfit, 2) }}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Total Purchases Card -->
                <div class="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-2xl transition-shadow duration-300">
                    <div class="p-6">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                                <!-- Heroicon: shopping-cart -->
                                <svg class="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 truncate">Total Purchases</dt>
                                    <dd class="flex items-baseline">
                                        <div class="text-3xl font-semibold text-gray-900">
                                            {{ number_format($totalPurchases) }}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                       
                    </div>
                </div>
            </div>

            <!-- Optional extra section: placeholder for chart or recent activity -->
            <div class="mt-8 bg-white shadow-lg rounded-xl p-6">
                <h2 class="text-lg font-medium text-gray-900 mb-2">Recent Activity</h2>
                <p class="text-gray-500 text-sm">No recent transactions to display.</p>
                <!-- You can replace this with a chart component later -->
            </div>
        </div>
    </div>
</x-layout>
