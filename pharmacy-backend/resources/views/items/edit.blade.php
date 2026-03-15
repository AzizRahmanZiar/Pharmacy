<x-layout>
<div class="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">

<h2 class="text-2xl font-bold text-gray-800 mb-6">Update Medicine</h2>

<!-- Success Message -->
@if(session('success'))
    <div class="bg-green-100 text-green-700 p-3 rounded mb-4">
        {{ session('success') }}
    </div>
@endif

<form action="/items/update/{{ $items->id }}" method="POST">
    @csrf

    @method('PUT')

    <!-- Medicine Name -->
    <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">
            Medicine Name
        </label>
        <input type="text" name="name" required value="{{ old('name', $items->name) }}"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500">
    </div>

    <!-- Generic Name -->
    <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">
            Generic Name
        </label>
        <input type="text" name="generic_name" value="{{ old('generic_name', $items->generic_name) }}"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500">
    </div>

    <!-- Company -->
    <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">
            Company
        </label>
        <input type="text" name="company" value="{{ old('company', $items->company) }}"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500">
    </div>

    <!-- Family -->
    <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-1">
            Family / Category
        </label>
        <input type="text" name="family" value="{{ old('family', $items->family) }}"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500">
    </div>

    <!-- Submit -->
    <div class="flex justify-end">
        <button type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg">
            Save Medicine
        </button>
    </div>

</form>

</div>
</x-layout>
