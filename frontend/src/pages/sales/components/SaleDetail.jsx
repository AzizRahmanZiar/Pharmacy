export function SaleDetail({ sale }) {
  return (
    <>
      <div className='mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <div>
          <span className='text-xs font-medium text-gray-500 block'>
            Bill No.
          </span>
          <span className='text-sm font-semibold text-gray-900'>
            {sale.bill_no}
          </span>
        </div>
        <div>
          <span className='text-xs font-medium text-gray-500 block'>
            Patient
          </span>
          <span className='text-sm font-semibold text-gray-900'>
            {sale.patient_name}
          </span>
        </div>
        <div>
          <span className='text-xs font-medium text-gray-500 block'>Date</span>
          <span className='text-sm font-semibold text-gray-900'>
            {new Date(sale.sale_date).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Medicine
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
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {sale.details.map((detail, idx) => (
              <tr key={idx} className='hover:bg-gray-50'>
                <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-800'>
                  {detail.medicine.name}
                </td>
                <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
                  {detail.medicine.generic_name}
                </td>
                <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
                  {detail.medicine.company}
                </td>
                <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
                  {detail.medicine.family}
                </td>
                <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
                  {detail.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
