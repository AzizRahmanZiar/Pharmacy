import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';

export function SaleTable({
  sales,
  currentPage,
  perPage,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className='overflow-x-auto'>
      <table className='w-full min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
              ID
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
              Patient
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
              Date
            </th>
            <th className='px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200 bg-white'>
          {sales.map((sale, index) => (
            <tr key={sale.id} className='hover:bg-gray-50'>
              <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-600'>
                {(currentPage - 1) * perPage + index + 1}
              </td>
              <td className='whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-800'>
                {sale.patient_name}
              </td>
              <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-600'>
                {new Date(sale.sale_date).toLocaleDateString()}
              </td>
              <td className='whitespace-nowrap px-4 py-3 text-right text-sm'>
                <button
                  onClick={() => onView(sale.id)}
                  className='mr-2 rounded-lg bg-indigo-50 p-2 text-indigo-700 transition hover:bg-indigo-100'
                  aria-label='View details'
                >
                  <FiEye className='h-4 w-4' />
                </button>
                <button
                  onClick={() => onEdit(sale.id)}
                  className='mr-2 rounded-lg bg-blue-50 p-2 text-blue-700 transition hover:bg-blue-100'
                  aria-label='Edit sale'
                >
                  <FiEdit2 className='h-4 w-4' />
                </button>
                <button
                  onClick={() => onDelete(sale.id)}
                  className='rounded-lg bg-red-50 p-2 text-red-700 transition hover:bg-red-100'
                  aria-label='Delete sale'
                >
                  <FiTrash2 className='h-4 w-4' />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
