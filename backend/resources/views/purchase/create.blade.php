<x-layout>
<div class="container mx-auto px-4 py-8 max-w-6xl">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Create Purchase Bill</h2>

    <!-- Success/Error Alerts -->
    @if(session('success'))
        <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow" role="alert">
            <p class="font-medium">Success</p>
            <p>{{ session('success') }}</p>
        </div>
    @endif

    @if(session('error'))
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow" role="alert">
            <p class="font-medium">Error</p>
            <p>{{ session('error') }}</p>
        </div>
    @endif

    <!-- Form -->
    <form action="/purchase/store" method="POST" class="bg-white shadow-lg rounded-lg p-8">
        @csrf

        <!-- Bill No and Purchase Date -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
                <label for="bill_no" class="block text-sm font-medium text-gray-700 mb-2">Bill No:</label>
                <input type="text" name="bill_no" id="bill_no" required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200">
            </div>
            <div>
                <label for="purchase_date" class="block text-sm font-medium text-gray-700 mb-2">Purchase Date:</label>
                <input type="date" name="purchase_date" id="purchase_date" value="{{ date('Y-m-d') }}" required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200">
            </div>
        </div>

        <!-- Medicines Table -->
        <div class="overflow-x-auto mb-6">
            <table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg" id="purchaseTable">
                <thead class="bg-gray-50">
                    <tr>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generic Name</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                         <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Family</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buy price</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sale price</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expire date</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <!-- Static row with minimum width and placeholders -->
                    <tr>
<td class="px-4 py-2 min-w-[120px]">
    <input type="number" name="quantity[]" required placeholder="Quantity"
        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
</td>

<td class="px-4 py-2 min-w-[160px]">
    <select name="name[]" required
        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
        <option value="">Select Name</option>
        @foreach($names as $item)
            <option value="{{ $item->name }}">{{ $item->name }}</option>
        @endforeach
    </select>
</td>

<td class="px-4 py-2 min-w-[160px]">
    <select name="generic_name[]"
        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
        <option value="">Select Generic</option>
        @foreach($generics as $item)
            <option value="{{ $item->generic_name }}">{{ $item->generic_name }}</option>
        @endforeach
    </select>
</td>

<td class="px-4 py-2 min-w-[160px]">
    <select name="company[]"
        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
        <option value="">Select Company</option>
        @foreach($companies as $item)
            <option value="{{ $item->company }}">{{ $item->company }}</option>
        @endforeach
    </select>
</td>

<td class="px-4 py-2 min-w-[160px]">
    <select name="family[]"
        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
        <option value="">Select Family</option>
        @foreach($families as $item)
            <option value="{{ $item->family }}">{{ $item->family }}</option>
        @endforeach
    </select>
</td>

<td class="px-4 py-2 min-w-[140px]">
    <input type="number" step="0.01" name="buy_price[]" required placeholder="Buy Price"
        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
</td>

<td class="px-4 py-2 min-w-[140px]">
    <input type="number" step="0.01" name="sale_price[]" required placeholder="Sale Price"
        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
</td>

<td class="px-4 py-2">
    <input type="date" name="expiry_date[]"
        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
</td>

<td class="px-4 py-2 text-center">
    <button type="button" onclick="removeRow(this)"
        class="bg-red-500 text-white px-3 py-1 rounded-md text-sm">
        Remove
    </button>
</td>
</tr>
                </tbody>
            </table>
        </div>

        <!-- Add More Button -->
        <div class="flex justify-start mb-8">
            <button type="button" onclick="addRow()"
                class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 shadow-md flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                Add More Medicine
            </button>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
            <button type="submit"
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 shadow-lg text-lg">
                Save Purchase
            </button>
        </div>
    </form>
</div>

<!-- JavaScript -->
<script>
function addRow() {

    let table = document.getElementById("purchaseTable").getElementsByTagName('tbody')[0];
    let newRow = table.insertRow();

    newRow.innerHTML = `
<td class="px-4 py-2 min-w-[120px]">
    <input type="number" name="quantity[]" required placeholder="Quantity"
        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
</td>

<td class="px-4 py-2 min-w-[160px]">
    <select name="name[]" required
        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
        <option value="">Select Name</option>
        @foreach($names as $item)
            <option value="{{ $item->name }}">{{ $item->name }}</option>
        @endforeach
    </select>
</td>

<td class="px-4 py-2 min-w-[160px]">
    <select name="generic_name[]"
        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
        <option value="">Select Generic</option>
        @foreach($generics as $item)
            <option value="{{ $item->generic_name }}">{{ $item->generic_name }}</option>
        @endforeach
    </select>
</td>

<td class="px-4 py-2 min-w-[160px]">
    <select name="company[]"
        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
        <option value="">Select Company</option>
        @foreach($companies as $item)
            <option value="{{ $item->company }}">{{ $item->company }}</option>
        @endforeach
    </select>
</td>

<td class="px-4 py-2 min-w-[160px]">
    <select name="family[]"
        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
        <option value="">Select Family</option>
        @foreach($families as $item)
            <option value="{{ $item->family }}">{{ $item->family }}</option>
        @endforeach
    </select>
</td>

<td class="px-4 py-2">
    <input type="number" step="0.01" name="buy_price[]" required placeholder="Buy Price"
        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
</td>

<td class="px-4 py-2">
    <input type="number" step="0.01" name="sale_price[]" required placeholder="Sale Price"
        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
</td>

<td class="px-4 py-2">
    <input type="date" name="expiry_date[]"
        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
</td>

<td class="px-4 py-2 text-center">
    <button type="button" onclick="removeRow(this)"
        class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm">
        Remove
    </button>
</td>
    `;
}

function removeRow(button) {

    let table = document.getElementById("purchaseTable").getElementsByTagName('tbody')[0];

    if(table.rows.length > 1){
        let row = button.closest('tr');
        row.remove();
    }else{
        alert("At least one row is required.");
    }
}
</script>
</x-layout>
