export function PurchaseDetail({ purchase }) {
  return (
    <>
      <div className='mb-4'>
        <p className='text-sm text-gray-600'>
          <span className='font-medium'>Date:</span>{' '}
          {new Date(purchase.purchase_date).toLocaleDateString()}
        </p>
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
                Qty
              </th>
              <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Buy
              </th>
              <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Total Buy
              </th>
              <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Sale
              </th>
              <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Unit Profit
              </th>
              <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Total Profit
              </th>
              <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                Expiry
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {purchase.details.map((d, idx) => (
              <tr key={idx} className='hover:bg-gray-50'>
                <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-800'>
                  {d.name}
                </td>
                <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
                  {d.generic_name}
                </td>
                <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
                  {d.company}
                </td>
                <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
                  {d.family}
                </td>
                <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
                  {d.quantity}
                </td>
                <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
                  ${Number(d.buy_price).toFixed(2)}
                </td>
                <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
                  ${Number(d.total_buyer_price).toFixed(2)}
                </td>
                <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
                  ${Number(d.sale_price).toFixed(2)}
                </td>
                <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
                  ${Number(d.profit_per_unit).toFixed(2)}
                </td>
                <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
                  ${Number(d.total_profit).toFixed(2)}
                </td>
                <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
                  {new Date(d.expiry_date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
