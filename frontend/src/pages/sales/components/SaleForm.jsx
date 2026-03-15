import { FiPlus, FiTrash2 } from 'react-icons/fi';

export function SaleForm({
  form,
  medicines,
  addRow,
  removeRow,
  onHeaderChange,
  onSelectMedicine,
  onQuantityChange,
  onSubmit,
  submitLabel,
  onCancel,
}) {
  // Compute errors for each row on the fly
  const getRowErrors = (row) => {
    const errors = {};
    if (!row.medicine_id) {
      errors.medicine = 'Please select a medicine';
    }
    if (!row.quantity || row.quantity <= 0) {
      errors.quantity = 'Quantity must be greater than zero';
    } else if (parseInt(row.quantity) > row.stock) {
      errors.quantity = `Exceeds stock (${row.stock})`;
    }
    return errors;
  };

  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <input
          type='text'
          name='bill_no'
          placeholder='Bill Number'
          value={form.bill_no}
          onChange={onHeaderChange}
          className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
          required
        />
        <input
          type='text'
          name='patient_name'
          placeholder='Patient Name'
          value={form.patient_name}
          onChange={onHeaderChange}
          className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
          required
        />
        <input
          type='date'
          name='sale_date'
          value={form.sale_date}
          onChange={onHeaderChange}
          className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
          required
        />
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Name
              </th>
              <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Generic
              </th>
              <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Company
              </th>
              <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Family
              </th>
              <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Quantity
              </th>
              <th className='px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {form.medicines.map((row, index) => {
              const errors = getRowErrors(row);
              const remaining = row.stock - (parseInt(row.quantity) || 0);
              const isLastRow = form.medicines.length === 1;
              return (
                <tr key={index} className='hover:bg-gray-50'>
                  {/* Name dropdown */}
                  <td className='px-3 py-2'>
                    <select
                      value={row.medicine_id}
                      onChange={(e) => onSelectMedicine(index, e.target.value)}
                      className='w-32 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-200'
                    >
                      <option value=''>Select</option>
                      {medicines.map((med) => (
                        <option
                          key={med.id}
                          value={med.id}
                          disabled={med.quantity === 0}
                        >
                          {med.name}
                        </option>
                      ))}
                    </select>
                    {errors.medicine && (
                      <p className='text-xs text-red-600 mt-1'>
                        {errors.medicine}
                      </p>
                    )}
                  </td>
                  {/* Generic dropdown */}
                  <td className='px-3 py-2'>
                    <select
                      value={row.medicine_id}
                      onChange={(e) => onSelectMedicine(index, e.target.value)}
                      className='w-32 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-200'
                    >
                      <option value=''>Select</option>
                      {medicines.map((med) => (
                        <option
                          key={med.id}
                          value={med.id}
                          disabled={med.quantity === 0}
                        >
                          {med.generic_name}
                        </option>
                      ))}
                    </select>
                  </td>
                  {/* Company dropdown */}
                  <td className='px-3 py-2'>
                    <select
                      value={row.medicine_id}
                      onChange={(e) => onSelectMedicine(index, e.target.value)}
                      className='w-32 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-200'
                    >
                      <option value=''>Select</option>
                      {medicines.map((med) => (
                        <option
                          key={med.id}
                          value={med.id}
                          disabled={med.quantity === 0}
                        >
                          {med.company}
                        </option>
                      ))}
                    </select>
                  </td>
                  {/* Family dropdown */}
                  <td className='px-3 py-2'>
                    <select
                      value={row.medicine_id}
                      onChange={(e) => onSelectMedicine(index, e.target.value)}
                      className='w-32 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-200'
                    >
                      <option value=''>Select</option>
                      {medicines.map((med) => (
                        <option
                          key={med.id}
                          value={med.id}
                          disabled={med.quantity === 0}
                        >
                          {med.family}
                        </option>
                      ))}
                    </select>
                  </td>
                  {/* Quantity with remaining indicator */}
                  <td className='px-3 py-2'>
                    <div>
                      <input
                        type='number'
                        min='1'
                        value={row.quantity}
                        onChange={(e) =>
                          onQuantityChange(index, e.target.value)
                        }
                        className='w-24 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-200'
                      />
                      {row.medicine_id && (
                        <p className='text-xs text-gray-500 mt-1'>
                          Remaining: {remaining >= 0 ? remaining : 0}
                        </p>
                      )}
                      {errors.quantity && (
                        <p className='text-xs text-red-600 mt-1'>
                          {errors.quantity}
                        </p>
                      )}
                    </div>
                  </td>
                  {/* Remove button */}
                  <td className='px-3 py-2 text-right'>
                    <button
                      type='button'
                      onClick={() => removeRow(index)}
                      disabled={isLastRow}
                      className={`text-red-600 hover:text-red-800 ${
                        isLastRow ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <FiTrash2 className='h-4 w-4' />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        type='button'
        onClick={addRow}
        className='flex items-center text-sm text-indigo-600 hover:text-indigo-800'
      >
        <FiPlus className='mr-1 h-4 w-4' />
        Add Medicine
      </button>

      <div className='flex justify-end space-x-3 pt-4 border-t border-gray-100'>
        <button
          type='button'
          onClick={onCancel}
          className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:bg-gray-50'
        >
          Cancel
        </button>
        <button
          type='submit'
          className='rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
