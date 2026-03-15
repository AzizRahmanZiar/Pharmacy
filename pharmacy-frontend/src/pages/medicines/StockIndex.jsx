// import { useEffect, useState, useMemo } from 'react';
// import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
// import api from '../../api';

// export default function StockList() {
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   // Pagination state (server‑side)
//   const [currentPage, setCurrentPage] = useState(1);
//   const [perPage] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);

//   useEffect(() => {
//     fetchMedicines(currentPage);
//   }, [currentPage]);

//   const fetchMedicines = (page = 1) => {
//     setLoading(true);
//     api
//       .get(`/medicine?page=${page}`)
//       .then((res) => {
//         setMedicines(res.data.data || res.data);
//         setTotalPages(res.data.last_page || 1);
//       })
//       .catch((err) => console.error(err))
//       .finally(() => setLoading(false));
//   };

//   // Filter medicines based on search term (client‑side, on current page)
//   const filteredMedicines = useMemo(() => {
//     if (!searchTerm.trim()) return medicines;

//     const lowerSearch = searchTerm.toLowerCase();
//     return medicines.filter((med) => {
//       // Combine all fields into one string for easy searching
//       const searchable = [
//         med.id,
//         med.name,
//         med.generic_name,
//         med.company,
//         med.family,
//         med.buy_price,
//         med.sale_price,
//         med.quantity,
//         med.expiry_date,
//       ]
//         .map((field) => String(field ?? '').toLowerCase())
//         .join(' ');
//       return searchable.includes(lowerSearch);
//     });
//   }, [medicines, searchTerm]);

//   const handlePrev = () => {
//     if (currentPage > 1) setCurrentPage((prev) => prev - 1);
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
//   };

//   const LoadingSpinner = () => (
//     <div className='flex justify-center items-center py-12'>
//       <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600' />
//     </div>
//   );

//   return (
//     <div className='space-y-6'>
//       {/* Header */}
//       <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
//         <h1 className='text-2xl font-semibold text-gray-800'>Stock List</h1>
//         <div className='mt-4 sm:mt-0 sm:w-72'>
//           <div className='relative'>
//             <input
//               type='text'
//               placeholder='Search medicines...'
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className='w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
//             />
//             <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
//           </div>
//         </div>
//       </div>

//       {/* Table Card */}
//       <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
//         {loading ? (
//           <LoadingSpinner />
//         ) : filteredMedicines.length === 0 ? (
//           <div className='text-center py-12'>
//             <p className='text-gray-500 text-lg'>No medicines found.</p>
//           </div>
//         ) : (
//           <>
//             <div className='overflow-x-auto'>
//               <table className='w-full min-w-full divide-y divide-gray-200'>
//                 <thead className='bg-gray-50'>
//                   <tr>
//                     {[
//                       'ID',
//                       'Name',
//                       'Generic Name',
//                       'Company',
//                       'Family',
//                       'Buy Price',
//                       'Sale Price',
//                       'Stock',
//                       'Expiry Date',
//                     ].map((col) => (
//                       <th
//                         key={col}
//                         className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'
//                       >
//                         {col}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className='divide-y divide-gray-200 bg-white'>
//                   {filteredMedicines.map((med, index) => (
//                     <tr key={med.id} className='hover:bg-gray-50'>
//                       <td className='whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-800'>
//                         {(currentPage - 1) * perPage + index + 1}
//                       </td>
//                       <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-800'>
//                         {med.name}
//                       </td>
//                       <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-600'>
//                         {med.generic_name}
//                       </td>
//                       <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-600'>
//                         {med.company}
//                       </td>
//                       <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-600'>
//                         {med.family}
//                       </td>
//                       <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-800'>
//                         ${Number(med.buy_price).toFixed(2)}
//                       </td>
//                       <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-800'>
//                         ${Number(med.sale_price).toFixed(2)}
//                       </td>
//                       <td className='whitespace-nowrap px-4 py-3'>
//                         {med.quantity < 100 ? (
//                           <span className='inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700'>
//                             {med.quantity} low
//                           </span>
//                         ) : (
//                           <span className='text-sm text-gray-800'>
//                             {med.quantity}
//                           </span>
//                         )}
//                       </td>
//                       <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-600'>
//                         {new Date(med.expiry_date).toLocaleDateString()}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination - only shown if there is more than one page */}
//             {totalPages > 1 && (
//               <div className='mt-6 flex items-center justify-between border-t border-gray-100 pt-4'>
//                 <div className='text-sm text-gray-600'>
//                   Page{' '}
//                   <span className='font-medium text-indigo-600'>
//                     {currentPage}
//                   </span>{' '}
//                   of{' '}
//                   <span className='font-medium text-indigo-600'>
//                     {totalPages}
//                   </span>
//                 </div>
//                 <div className='flex space-x-2'>
//                   <button
//                     onClick={handlePrev}
//                     disabled={currentPage === 1}
//                     className='flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
//                   >
//                     <FiChevronLeft className='mr-1 h-4 w-4' />
//                     Previous
//                   </button>
//                   <button
//                     onClick={handleNext}
//                     disabled={currentPage === totalPages}
//                     className='flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
//                   >
//                     Next
//                     <FiChevronRight className='ml-1 h-4 w-4' />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// src/pages/medicines/StockList.jsx
import { useEffect, useState, useMemo } from 'react';
import api from '../../api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { SearchInput } from '../../components/SearchInput';
import { TablePagination } from '../../components/TablePagination';
import { StockTable } from '../../components/StockTable';

export default function StockList() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state (server‑side)
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMedicines(currentPage);
  }, [currentPage]);

  const fetchMedicines = (page = 1) => {
    setLoading(true);
    api
      .get(`/medicine?page=${page}`)
      .then((res) => {
        setMedicines(res.data.data || res.data);
        setTotalPages(res.data.last_page || 1);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  // Filter medicines based on search term (client‑side, on current page)
  const filteredMedicines = useMemo(() => {
    if (!searchTerm.trim()) return medicines;

    const lowerSearch = searchTerm.toLowerCase();
    return medicines.filter((med) => {
      const searchable = [
        med.id,
        med.name,
        med.generic_name,
        med.company,
        med.family,
        med.buy_price,
        med.sale_price,
        med.quantity,
        med.expiry_date,
      ]
        .map((field) => String(field ?? '').toLowerCase())
        .join(' ');
      return searchable.includes(lowerSearch);
    });
  }, [medicines, searchTerm]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl font-semibold text-gray-800'>Stock List</h1>
        <div className='mt-4 sm:mt-0'>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder='Search medicines...'
          />
        </div>
      </div>

      {/* Table Card */}
      <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
        {loading ? (
          <LoadingSpinner />
        ) : filteredMedicines.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>No medicines found.</p>
          </div>
        ) : (
          <>
            <StockTable
              medicines={filteredMedicines}
              currentPage={currentPage}
              perPage={perPage}
            />
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          </>
        )}
      </div>
    </div>
  );
}
