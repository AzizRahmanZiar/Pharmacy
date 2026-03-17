import { FiPlus, FiTrash2 } from 'react-icons/fi';

export function PurchaseForm({
  form,
  setForm,
  names,
  generics,
  companies,
  families,
  addRow,
  removeRow,
  changeMedicine,
  onSubmit,
  submitLabel,
  onCancel,
}) {
  // Calculate total amount from medicines
  const totalAmount = form.medicines.reduce(
    (sum, med) => sum + (Number(med.quantity) * Number(med.buy_price) || 0),
    0,
  );

  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      {/* Bill, Date and Paid Amount */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <input
          type='text'
          placeholder='Bill Number'
          value={form.bill_no}
          onChange={(e) => setForm({ ...form, bill_no: e.target.value })}
          className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
          required
        />
        <input
          type='date'
          value={form.purchase_date}
          onChange={(e) => setForm({ ...form, purchase_date: e.target.value })}
          className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
          required
        />
        <input
          type='number'
          min='0'
          step='0.01'
          placeholder='Paid Amount'
          value={form.paid_amount}
          onChange={(e) =>
            setForm({ ...form, paid_amount: parseFloat(e.target.value) || 0 })
          }
          className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
        />
      </div>

      {/* Optional: Show calculated totals */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm bg-gray-50 p-3 rounded-lg'>
        <div>
          <span className='font-medium text-gray-700'>Total Amount: </span>
          <span className='text-gray-900'>${totalAmount.toFixed(2)}</span>
        </div>
        <div>
          <span className='font-medium text-gray-700'>Paid: </span>
          <span className='text-gray-900'>
            ${Number(form.paid_amount).toFixed(2)}
          </span>
        </div>
        <div>
          <span className='font-medium text-gray-700'>Due: </span>
          <span className='text-gray-900'>
            ${(totalAmount - (form.paid_amount || 0)).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Medicines table (unchanged) */}
      <div className='overflow-x-auto border border-gray-200 rounded-lg'>
        <div className='max-h-[10rem] overflow-y-auto relative'>
          <table className='w-full min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50 sticky top-0 z-10'>
              <tr>
                <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Qty
                </th>
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
                  Buy Price
                </th>
                <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Sale Price
                </th>
                <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Expiry
                </th>
                <th className='px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white'>
              {form.medicines.map((med, index) => (
                <tr key={index} className='hover:bg-gray-50'>
                  <td className='px-3 py-2'>
                    <input
                      type='number'
                      value={med.quantity}
                      placeholder='90...'
                      onChange={(e) =>
                        changeMedicine(index, 'quantity', e.target.value)
                      }
                      className='w-20 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-black text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-200'
                      required
                    />
                  </td>
                  <td className='px-3 py-2'>
                    <select
                      value={med.name}
                      onChange={(e) =>
                        changeMedicine(index, 'name', e.target.value)
                      }
                      className='w-32 rounded-lg border border-gray-200 bg-gray-50 text-black px-2 py-1 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-200 z-50'
                      required
                    >
                      <option value=''>Select</option>
                      {names.map((n, i) => (
                        <option key={i} value={n.name}>
                          {n.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className='px-3 py-2'>
                    <select
                      value={med.generic_name}
                      onChange={(e) =>
                        changeMedicine(index, 'generic_name', e.target.value)
                      }
                      className='w-32 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm focus:border-indigo-400 text-black focus:outline-none focus:ring-1 focus:ring-indigo-200 z-50'
                    >
                      <option value=''>Select</option>
                      {generics.map((g, i) => (
                        <option key={i} value={g.generic_name}>
                          {g.generic_name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className='px-3 py-2'>
                    <select
                      value={med.company}
                      onChange={(e) =>
                        changeMedicine(index, 'company', e.target.value)
                      }
                      className='w-32 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm focus:border-indigo-400 text-black focus:outline-none focus:ring-1 focus:ring-indigo-200 z-50'
                    >
                      <option value=''>Select</option>
                      {companies.map((c, i) => (
                        <option key={i} value={c.company}>
                          {c.company}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className='px-3 py-2'>
                    <select
                      value={med.family}
                      onChange={(e) =>
                        changeMedicine(index, 'family', e.target.value)
                      }
                      className='w-32 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm focus:border-indigo-400 text-black focus:outline-none focus:ring-1 focus:ring-indigo-200 z-50'
                    >
                      <option value=''>Select</option>
                      {families.map((f, i) => (
                        <option key={i} value={f.family}>
                          {f.family}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className='px-3 py-2'>
                    <input
                      type='number'
                      step='0.01'
                      value={med.buy_price}
                      placeholder='90...'
                      onChange={(e) =>
                        changeMedicine(index, 'buy_price', e.target.value)
                      }
                      className='w-24 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm focus:border-indigo-400 text-black focus:outline-none focus:ring-1 focus:ring-indigo-200'
                      required
                    />
                  </td>
                  <td className='px-3 py-2'>
                    <input
                      type='number'
                      step='0.01'
                      value={med.sale_price}
                      placeholder='90...'
                      onChange={(e) =>
                        changeMedicine(index, 'sale_price', e.target.value)
                      }
                      className='w-24 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm focus:border-indigo-400 text-black focus:outline-none focus:ring-1 focus:ring-indigo-200'
                      required
                    />
                  </td>
                  <td className='px-3 py-2'>
                    <input
                      type='date'
                      value={med.expiry_date}
                      onChange={(e) =>
                        changeMedicine(index, 'expiry_date', e.target.value)
                      }
                      className='w-32 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm focus:border-indigo-400 text-black focus:outline-none focus:ring-1 focus:ring-indigo-200'
                      required
                    />
                  </td>
                  <td className='px-3 py-2 text-right'>
                    <button
                      type='button'
                      onClick={() => removeRow(index)}
                      className='text-red-600 hover:text-red-800'
                    >
                      <FiTrash2 className='h-4 w-4' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
