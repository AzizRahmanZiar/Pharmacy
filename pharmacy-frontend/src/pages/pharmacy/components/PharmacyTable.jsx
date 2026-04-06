// src/pages/pharmacy/components/PharmacyTable.jsx
import {
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
  FiAlertCircle,
} from 'react-icons/fi';

export function PharmacyTable({ pharmacies, onToggleStatus, onDelete }) {
  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className='overflow-x-auto'>
      <table className='w-full min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
              ID
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
              Name
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
              Owner
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
              Email
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
              Phone
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
              Status
            </th>
            <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
              Expiry Date
            </th>
            <th className='px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200 bg-white'>
          {pharmacies.map((pharmacy, idx) => {
            const expired = isExpired(pharmacy.expiry_date);
            return (
              <tr key={pharmacy.id} className='hover:bg-gray-50'>
                <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-600'>
                  {idx + 1}
                </td>
                <td className='whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-800'>
                  {pharmacy.name}
                </td>
                <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-600'>
                  {pharmacy.owner_name || '—'}
                </td>
                <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-600'>
                  {pharmacy.email || '—'}
                </td>
                <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-600'>
                  {pharmacy.phone || '—'}
                </td>
                <td className='whitespace-nowrap px-4 py-3 text-sm'>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      pharmacy.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {pharmacy.status || 'active'}
                  </span>
                </td>
                <td className='whitespace-nowrap px-4 py-3 text-sm'>
                  <div className='flex items-center gap-1'>
                    {pharmacy.expiry_date
                      ? new Date(pharmacy.expiry_date).toLocaleDateString()
                      : '—'}
                    {expired && (
                      <span className='text-red-500' title='Expired'>
                        <FiAlertCircle size={14} />
                      </span>
                    )}
                  </div>
                </td>
                <td className='whitespace-nowrap px-4 py-3 text-right text-sm'>
                  <button
                    onClick={() => onToggleStatus(pharmacy)}
                    className={`mr-2 rounded-lg p-2 transition ${
                      pharmacy.status === 'active'
                        ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                    title={
                      pharmacy.status === 'active'
                        ? 'Block Pharmacy'
                        : 'Unblock Pharmacy'
                    }
                  >
                    {pharmacy.status === 'active' ? (
                      <FiToggleLeft size={18} />
                    ) : (
                      <FiToggleRight size={18} />
                    )}
                  </button>
                  <button
                    onClick={() => onDelete(pharmacy)}
                    className='rounded-lg bg-red-50 p-2 text-red-700 transition hover:bg-red-100'
                    title='Delete Pharmacy'
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
