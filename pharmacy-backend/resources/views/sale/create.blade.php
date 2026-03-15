
<x-layout>

<div class="container mx-auto px-4 py-8 max-w-6xl">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Create Sale Bill</h2>

    <form id="saleForm" action="/sale/store" method="POST" class="bg-white shadow-lg rounded-lg p-8">
        @csrf

        <!-- Header -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            <div>
                <label class="block text-sm font-medium mb-1">Bill No</label>
                <input type="text" name="bill_no" required
                    value="{{ old('bill_no') }}"
                    class="w-full border rounded-lg px-3 py-2">
            </div>

            <div>
                <label class="block text-sm font-medium mb-1">Patient Name</label>
                <input type="text" name="patient_name" required
                    value="{{ old('patient_name') }}"
                    class="w-full border rounded-lg px-3 py-2">
            </div>

            <div>
                <label class="block text-sm font-medium mb-1">Sale Date</label>
                <input type="date" name="sale_date"
                    value="{{ old('sale_date', date('Y-m-d')) }}"
                    required
                    class="w-full border rounded-lg px-3 py-2">
            </div>

        </div>

        <!-- Sale Table -->
        <div class="overflow-x-auto mb-6">
            <table class="min-w-full border rounded-lg" id="saleTable">

                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-3 py-2">Name</th>
                        <th class="px-3 py-2">Generic Name</th>
                        <th class="px-3 py-2">Company</th>
                        <th class="px-3 py-2">Family</th>
                        <th class="px-3 py-2">Quantity</th>
                        <th class="px-3 py-2">Action</th>
                    </tr>
                </thead>

                <tbody>

                    <tr>

                        <!-- Medicine -->
                        <td class="px-3 py-2">
                            <select name="medicine_id[]" required
                                class="medicine-select w-full border rounded px-2 py-1">

                                <option value="">select</option>

                                @foreach($medicines as $medicine)

                                <option value="{{ $medicine->id }}"
                                    data-stock="{{ $medicine->quantity }}"
                                    {{ $medicine->quantity == 0 ? 'disabled' : '' }}>

                                    {{ $medicine->name }} (Stock: {{ $medicine->quantity }})

                                </option>

                                @endforeach

                            </select>
                        </td>

                                                <td class="px-3 py-2">
                            <select name="medicine_id[]" required
                                class="medicine-select w-full border rounded px-2 py-1">

                                <option value="">select</option>

                                @foreach($medicines as $medicine)

                                <option value="{{ $medicine->id }}"
                                    data-stock="{{ $medicine->quantity }}"
                                    {{ $medicine->quantity == 0 ? 'disabled' : '' }}>

                                    {{ $medicine->generic_name }} (Stock: {{ $medicine->quantity }})

                                </option>

                                @endforeach

                            </select>
                        </td>

                                                <td class="px-3 py-2">
                            <select name="medicine_id[]" required
                                class="medicine-select w-full border rounded px-2 py-1">

                                <option value="">select</option>

                                @foreach($medicines as $medicine)

                                <option value="{{ $medicine->id }}"
                                    data-stock="{{ $medicine->quantity }}"
                                    {{ $medicine->quantity == 0 ? 'disabled' : '' }}>

                                    {{ $medicine->company }} (Stock: {{ $medicine->quantity }})

                                </option>

                                @endforeach

                            </select>
                        </td>

                                                <td class="px-3 py-2">
                            <select name="medicine_id[]" required
                                class="medicine-select w-full border rounded px-2 py-1">

                                <option value="">select</option>

                                @foreach($medicines as $medicine)

                                <option value="{{ $medicine->id }}"
                                    data-stock="{{ $medicine->quantity }}"
                                    {{ $medicine->quantity == 0 ? 'disabled' : '' }}>

                                    {{ $medicine->family }} (Stock: {{ $medicine->quantity }})

                                </option>

                                @endforeach

                            </select>
                        </td>

                        <!-- Quantity -->
                        <td class="px-3 py-2">

                            <input type="number"
                                name="quantity[]"
                                min="1"
                                class="quantity-input w-full border rounded px-2 py-1">

                            <p class="stock-error text-red-600 text-sm mt-1 hidden"></p>

                        </td>

                        <!-- Remove -->
                        <td class="px-3 py-2 text-center">

                            <button type="button"
                                onclick="removeRow(this)"
                                class="bg-red-500 text-white px-3 py-1 rounded">

                                Remove

                            </button>

                        </td>

                    </tr>

                </tbody>

            </table>
        </div>

        <!-- Add Row -->
        <div class="mb-6">

            <button type="button"
                onclick="addRow()"
                class="bg-green-500 text-white px-6 py-2 rounded">

                + Add Medicine

            </button>

        </div>

        <!-- Submit -->
        <div class="flex justify-end">

            <button type="submit"
                class="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold">

                Save Sale

            </button>

        </div>

    </form>

</div>

<script>

function addRow(){

    let tbody = document.querySelector('#saleTable tbody');

    let row = document.createElement('tr');

    row.innerHTML = `
        <td class="px-3 py-2">
            <select name="medicine_id[]" class="medicine-select w-full border rounded px-2 py-1">

                <option value="">select</option>

                @foreach($medicines as $medicine)

                <option value="{{ $medicine->id }}"
                    data-stock="{{ $medicine->quantity }}"
                    {{ $medicine->quantity == 0 ? 'disabled' : '' }}>

                    {{ $medicine->name }} (Stock: {{ $medicine->quantity }})

                </option>

                @endforeach

            </select>
        </td>

            <td class="px-3 py-2">
            <select name="medicine_id[]" class="medicine-select w-full border rounded px-2 py-1">

                <option value="">select</option>

                @foreach($medicines as $medicine)

                <option value="{{ $medicine->id }}"
                    data-stock="{{ $medicine->quantity }}"
                    {{ $medicine->quantity == 0 ? 'disabled' : '' }}>

                    {{ $medicine->generic }} (Stock: {{ $medicine->quantity }})

                </option>

                @endforeach

            </select>
        </td>

                <td class="px-3 py-2">
            <select name="medicine_id[]" class="medicine-select w-full border rounded px-2 py-1">

                <option value="">select</option>

                @foreach($medicines as $medicine)

                <option value="{{ $medicine->id }}"
                    data-stock="{{ $medicine->quantity }}"
                    {{ $medicine->quantity == 0 ? 'disabled' : '' }}>

                    {{ $medicine->company }} (Stock: {{ $medicine->quantity }})

                </option>

                @endforeach

            </select>
        </td>

                <td class="px-3 py-2">
            <select name="medicine_id[]" class="medicine-select w-full border rounded px-2 py-1">

                <option value="">select</option>

                @foreach($medicines as $medicine)

                <option value="{{ $medicine->id }}"
                    data-stock="{{ $medicine->quantity }}"
                    {{ $medicine->quantity == 0 ? 'disabled' : '' }}>

                    {{ $medicine->family }} (Stock: {{ $medicine->quantity }})

                </option>

                @endforeach

            </select>
        </td>

        <td class="px-3 py-2">

            <input type="number"
                name="quantity[]"
                min="1"
                class="quantity-input w-full border rounded px-2 py-1">

            <p class="stock-error text-red-600 text-sm mt-1 hidden"></p>

        </td>

        <td class="px-3 py-2 text-center">

            <button type="button"
                onclick="removeRow(this)"
                class="bg-red-500 text-white px-3 py-1 rounded">

                Remove

            </button>

        </td>
    `;

    tbody.appendChild(row);
}

function removeRow(btn){
    btn.closest('tr').remove();
}

document.addEventListener("input", function(e){

    if(e.target.classList.contains("quantity-input")){

        let row = e.target.closest("tr");

        let qtyInput = row.querySelector(".quantity-input");
        let medicineSelect = row.querySelector(".medicine-select");
        let errorText = row.querySelector(".stock-error");

        let selected = medicineSelect.options[medicineSelect.selectedIndex];
        let stock = selected.getAttribute("data-stock");

        if(!stock) return;

        if(parseInt(qtyInput.value) > parseInt(stock)){

            errorText.innerText = "Quantity exceeds available stock (" + stock + ")";
            errorText.classList.remove("hidden");

        }else{

            errorText.classList.add("hidden");

        }

    }

});

document.getElementById("saleForm").addEventListener("submit", function(e){

    let rows = document.querySelectorAll("#saleTable tbody tr");
    let hasError = false;

    rows.forEach(function(row){

        let qtyInput = row.querySelector(".quantity-input");
        let medicineSelect = row.querySelector(".medicine-select");
        let errorText = row.querySelector(".stock-error");

        if(!qtyInput || !medicineSelect) return;

        let selected = medicineSelect.options[medicineSelect.selectedIndex];
        let stock = selected.getAttribute("data-stock");

        if(!stock) return;

        if(parseInt(qtyInput.value) > parseInt(stock)){

            errorText.innerText = "Quantity exceeds available stock (" + stock + ")";
            errorText.classList.remove("hidden");

            hasError = true;

        }

    });
});

</script>

</x-layout>

