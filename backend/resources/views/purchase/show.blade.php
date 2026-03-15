<x-layout>
<div class="container mx-auto px-4 py-8 max-w-6xl">

    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-bold text-gray-800">
            Purchase Details - Bill {{ $purchase->bill_no }}
        </h2>

        <a href="/purchase"
           class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 shadow-md">
            Back to Purchases
        </a>
    </div>

    <!-- Info -->
    <div class="mb-4 text-gray-600">
        <strong>Purchase Date:</strong> {{ $purchase->purchase_date }}
    </div>

    <!-- Details Table -->
    <div class="overflow-x-auto bg-white rounded-lg shadow">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Generic</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Family</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buy Price</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Bye Pirce</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sale Price</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Profit</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Profit</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                </tr>
            </thead>

            <tbody class="bg-white divide-y divide-gray-200">
                @forelse($purchase->details as $detail)
                <tr class="hover:bg-gray-50">

                    <td class="px-4 py-3 text-sm text-gray-900">
                        {{ $detail->name }}
                    </td>

                    <td class="px-4 py-3 text-sm text-gray-900">
                        {{ $detail->generic_name }}
                    </td>

                    <td class="px-4 py-3 text-sm text-gray-900">
                        {{ $detail->company }}
                    </td>

                      <td class="px-4 py-3 text-sm text-gray-900">
                        {{ $detail->family }}
                    </td>

                    <td class="px-4 py-3 text-sm text-gray-900">
                        {{ $detail->quantity }}
                    </td>

                    <td class="px-4 py-3 text-sm text-gray-900">
                        {{ $detail->buy_price }}
                    </td>

                    <td class="px-4 py-3 text-sm text-gray-900">
                        {{ $detail->total_buyer_price }}
                    </td>

                    <td class="px-4 py-3 text-sm text-gray-900">
                        {{ $detail->sale_price }}
                    </td>

                    <td class="px-4 py-3 text-sm text-gray-900">
                        {{ $detail->profit_per_unit }}
                    </td>

                    <td class="px-4 py-3 text-sm text-gray-900">
                        {{ $detail->total_profit }}
                    </td>


                    <td class="px-4 py-3 text-sm text-gray-900">
                        {{ $detail->expiry_date }}
                    </td>

                </tr>
                @empty
                <tr>
                    <td colspan="8" class="px-6 py-4 text-center text-gray-500">
                        No details found for this purchase.
                    </td>
                </tr>
                @endforelse
            </tbody>

        </table>
    </div>
</div>

</x-layout>
