<x-layout>

<div class="container mx-auto px-4 py-8 max-w-6xl">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Edit Sale Bill</h2>

    <form id="saleForm" action="/sale/update/{{ $sale->id }}" method="POST" class="bg-white shadow-lg rounded-lg p-8">
        @csrf
        @method('PUT')

        <!-- Header -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

<div>
<label class="block text-sm font-medium mb-1">Bill No</label>
<input type="text" name="bill_no"
value="{{ old('bill_no', $sale->bill_no) }}"
class="w-full border rounded-lg px-3 py-2">
</div>

<div>
<label class="block text-sm font-medium mb-1">Patient Name</label>
<input type="text" name="patient_name"
value="{{ old('patient_name', $sale->patient_name) }}"
class="w-full border rounded-lg px-3 py-2">
</div>

<div>
<label class="block text-sm font-medium mb-1">Sale Date</label>
<input type="date" name="sale_date"
value="{{ old('sale_date', $sale->sale_date) }}"
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

@foreach($sale->details as $detail)

<tr>

<td class="px-3 py-2">
<select name="medicine_id[]" class="medicine-select w-full border rounded px-2 py-1">

<option value="">select</option>

@foreach($medicines as $medicine)

<option value="{{ $medicine->id }}"
data-stock="{{ $medicine->quantity }}"
{{ $medicine->id == $detail->medicine_id ? 'selected' : '' }}>

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
{{ $medicine->id == $detail->medicine_id ? 'selected' : '' }}>

{{ $medicine->generic_name }} (Stock: {{ $medicine->quantity }})

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
{{ $medicine->id == $detail->medicine_id ? 'selected' : '' }}>

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
{{ $medicine->id == $detail->medicine_id ? 'selected' : '' }}>

{{ $medicine->family }} (Stock: {{ $medicine->quantity }})

</option>

@endforeach

</select>
</td>

<td class="px-3 py-2">
<input type="number"
name="quantity[]"
value="{{ $detail->quantity }}"
class="quantity-input w-full border rounded px-2 py-1">
</td>

<td class="px-3 py-2 text-center">
<button type="button"
onclick="removeRow(this)"
class="bg-red-500 text-white px-3 py-1 rounded">
Remove
</button>
</td>

</tr>

@endforeach

</tbody>




            </table>

            <div class="flex mb-6">

<button type="button"
onclick="addRow()"
class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">

Add Medicine

</button>

</div>
        </div>
        <!-- Submit -->
        <div class="flex justify-end">

            <button type="submit"
                class="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold">

                Edit Sale

            </button>

        </div>

    </form>

</div>


<script>

function addRow(){

let table = document.getElementById("saleTable").getElementsByTagName('tbody')[0];

let newRow = table.insertRow();

newRow.innerHTML = `

<td class="px-3 py-2">

<select name="medicine_id[]" class="w-full border rounded px-2 py-1">

<option value="">select</option>

@foreach($medicines as $medicine)

<option value="{{ $medicine->id }}" data-stock="{{ $medicine->quantity }}">

{{ $medicine->name }} (Stock: {{ $medicine->quantity }})

</option>

@endforeach

</select>

</td>

<td class="px-3 py-2">

<select name="medicine_id[]" class="w-full border rounded px-2 py-1">

<option value="">select</option>

@foreach($medicines as $medicine)

<option value="{{ $medicine->id }}" data-stock="{{ $medicine->quantity }}">

{{ $medicine->generic_name }} (Stock: {{ $medicine->quantity }})

</option>

@endforeach

</select>

</td>

<td class="px-3 py-2">

<select name="medicine_id[]" class="w-full border rounded px-2 py-1">

<option value="">select</option>

@foreach($medicines as $medicine)

<option value="{{ $medicine->id }}" data-stock="{{ $medicine->quantity }}">

{{ $medicine->company }} (Stock: {{ $medicine->quantity }})

</option>

@endforeach

</select>

</td>


<td class="px-3 py-2">

<select name="medicine_id[]" class="w-full border rounded px-2 py-1">

<option value="">select</option>

@foreach($medicines as $medicine)

<option value="{{ $medicine->id }}" data-stock="{{ $medicine->quantity }}">

{{ $medicine->family }} (Stock: {{ $medicine->quantity }})

</option>

@endforeach

</select>

</td>
<td class="px-3 py-2">

<input type="number"
name="quantity[]"
class="w-full border rounded px-2 py-1">

</td>

<td class="px-3 py-2 text-center">

<button type="button"
onclick="removeRow(this)"
class="bg-red-500 text-white px-3 py-1 rounded">

Remove

</button>

</td>

`;

}


function removeRow(button){

let table = document.getElementById("saleTable").getElementsByTagName('tbody')[0];

if(table.rows.length > 1){

let row = button.closest('tr');

row.remove();

}else{

alert("At least one medicine is required.");

}

}

</script>
</x-layout>

