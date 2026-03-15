<x-layout>
<div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- Header -->
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Sale Details</h2>

    <!-- Patient Information Card -->
    <div class="bg-gray-50 rounded-lg shadow p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <span class="text-sm font-medium text-gray-500 block">Patient</span>
                <span class="text-lg font-semibold text-gray-900">{{ $sale->patient_name }}</span>
            </div>
            <div>
                <span class="text-sm font-medium text-gray-500 block">Date</span>
                <span class="text-lg font-semibold text-gray-900">{{ $sale->sale_date }}</span>
            </div>
        </div>
    </div>

    <!-- Details Table -->
    <div class="overflow-x-auto bg-white rounded-lg shadow mb-8">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                @forelse($sale->details as $detail)
                <tr class="hover:bg-gray-50 transition duration-150">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $detail->medicine->name }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ $detail->quantity }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">No details found for this sale.</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <!-- Back Button -->
    <div class="flex justify-end">
        <a href="/sale"
           class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 shadow-md flex items-center">
            Back
        </a>
    </div>
</div>
</x-layout>
