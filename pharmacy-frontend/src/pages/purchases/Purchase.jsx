// import { useEffect, useState, useMemo } from 'react';
// import {
//   FiPlus,
//   FiEdit2,
//   FiTrash2,
//   FiEye,
//   FiX,
//   FiSearch,
// } from 'react-icons/fi';
// import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
// import api from '../../api';

// export default function Purchase() {
//   const [purchases, setPurchases] = useState([]);
//   const [purchase, setPurchase] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Modal states
//   const [showDetail, setShowDetail] = useState(false);
//   const [showCreate, setShowCreate] = useState(false);
//   const [showEdit, setShowEdit] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const [editId, setEditId] = useState(null);

//   // Pagination state
//   const [perPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);

//   const [searchTerm, setSearchTerm] = useState('');

//   // Form state (shared for create & edit)
//   const [form, setForm] = useState({
//     bill_no: '',
//     purchase_date: new Date().toISOString().slice(0, 10),
//     medicines: [
//       {
//         quantity: '',
//         name: '',
//         generic_name: '',
//         company: '',
//         family: '',
//         buy_price: '',
//         sale_price: '',
//         expiry_date: '',
//       },
//     ],
//   });

//   // Dropdown data
//   const [names, setNames] = useState([]);
//   const [generics, setGenerics] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [families, setFamilies] = useState([]);

//   // Lock body scroll when any modal is open
//   useEffect(() => {
//     if (showCreate || showEdit || showDetail || showDeleteConfirm) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = '';
//     }
//     return () => {
//       document.body.style.overflow = '';
//     };
//   }, [showCreate, showEdit, showDetail, showDeleteConfirm]);

//   // Load initial data
//   useEffect(() => {
//     fetchPurchases(currentPage);
//   }, [currentPage]);

//   useEffect(() => {
//     fetchDropdownData();
//   }, []);

//   const fetchPurchases = async (page = 1) => {
//     setLoading(true);
//     try {
//       const res = await api.get(`/purchases?page=${page}`);
//       console.log('API response:', res.data); // Check structure
//       setPurchases(res.data.data || res.data);
//       setTotalPages(res.data.last_page || 1);
//       setTotalItems(res.data.total || res.data.data?.length || 0);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDropdownData = async () => {
//     try {
//       const res = await api.get('/purchase-form-data');
//       setNames(res.data.names);
//       setGenerics(res.data.generics);
//       setCompanies(res.data.companies);
//       setFamilies(res.data.families);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // Form handlers
//   const addRow = () => {
//     setForm({
//       ...form,
//       medicines: [
//         ...form.medicines,
//         {
//           quantity: '',
//           name: '',
//           generic_name: '',
//           company: '',
//           family: '',
//           buy_price: '',
//           sale_price: '',
//           expiry_date: '',
//         },
//       ],
//     });
//   };

//   const removeRow = (index) => {
//     if (form.medicines.length === 1) {
//       alert('At least one row required');
//       return;
//     }
//     const rows = [...form.medicines];
//     rows.splice(index, 1);
//     setForm({ ...form, medicines: rows });
//   };

//   const changeMedicine = (index, field, value) => {
//     const rows = [...form.medicines];
//     rows[index][field] = value;
//     setForm({ ...form, medicines: rows });
//   };

//   const resetForm = () => {
//     setForm({
//       bill_no: '',
//       purchase_date: new Date().toISOString().slice(0, 10),
//       medicines: [
//         {
//           quantity: '',
//           name: '',
//           generic_name: '',
//           company: '',
//           family: '',
//           buy_price: '',
//           sale_price: '',
//           expiry_date: '',
//         },
//       ],
//     });
//   };

//   // Create
//   const handleCreateSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post('/purchases', form);
//       setShowCreate(false);
//       resetForm();
//       fetchPurchases();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // Edit
//   const handleEditClick = async (id) => {
//     try {
//       const res = await api.get(`/purchases/${id}`);
//       const data = res.data;
//       setEditId(id);
//       setForm({
//         bill_no: data.bill_no,
//         purchase_date: data.purchase_date,
//         medicines: data.details.map((d) => ({
//           quantity: d.quantity,
//           name: d.name,
//           generic_name: d.generic_name,
//           company: d.company,
//           family: d.family,
//           buy_price: d.buy_price,
//           sale_price: d.sale_price,
//           expiry_date: d.expiry_date,
//         })),
//       });
//       setShowEdit(true);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.put(`/purchases/${editId}`, form);
//       setShowEdit(false);
//       resetForm();
//       fetchPurchases();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // Delete
//   const handleDeleteClick = (id) => {
//     setDeleteId(id);
//     setShowDeleteConfirm(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       await api.delete(`/purchases/${deleteId}`);
//       setShowDeleteConfirm(false);
//       setDeleteId(null);
//       fetchPurchases();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handlePrev = () => {
//     if (currentPage > 1) setCurrentPage((prev) => prev - 1);
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
//   };

//   // Detail view
//   const handleViewDetails = async (id) => {
//     try {
//       const res = await api.get(`/purchases/${id}`);
//       setPurchase(res.data);
//       setShowDetail(true);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const closeModals = () => {
//     setShowCreate(false);
//     setShowEdit(false);
//     setShowDetail(false);
//     setShowDeleteConfirm(false);
//     setDeleteId(null);
//     resetForm();
//   };

//   const LoadingSpinner = () => (
//     <div className='flex justify-center items-center py-12'>
//       <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600' />
//     </div>
//   );

//   const filteredPurchases = useMemo(() => {
//     if (!searchTerm.trim()) return purchases;
//     const lowerSearch = searchTerm.toLowerCase();
//     return purchases.filter((p) => {
//       const searchable = [p.id, p.bill_no, p.purchase_date]
//         .map((field) => String(field ?? '').toLowerCase())
//         .join(' ');
//       return searchable.includes(lowerSearch);
//     });
//   }, [purchases, searchTerm]);

//   return (
//     <div className='space-y-6'>
//       {/* Header */}
//       <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
//         <h1 className='text-2xl font-semibold text-gray-800'>
//           Purchase Orders
//         </h1>
//         <button
//           onClick={() => setShowCreate(true)}
//           className='mt-4 sm:mt-0 flex items-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
//         >
//           <FiPlus className='mr-2 h-5 w-5' />
//           New Purchase
//         </button>
//       </div>

//       {/* Search input */}
//       <div className='sm:w-72'>
//         <div className='relative'>
//           <input
//             type='text'
//             placeholder='Search purchases...'
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className='w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
//           />
//           <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
//         </div>
//       </div>

//       {/* Table Card */}
//       <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
//         {loading ? (
//           <LoadingSpinner />
//         ) : filteredPurchases.length === 0 ? (
//           <div className='text-center py-12'>
//             <p className='text-gray-500 text-lg'>No purchases found.</p>
//           </div>
//         ) : (
//           <>
//             <div className='overflow-x-auto'>
//               <table className='w-full min-w-full divide-y divide-gray-200'>
//                 <thead className='bg-gray-50'>
//                   <tr>
//                     <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                       ID
//                     </th>
//                     <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                       Bill No.
//                     </th>
//                     <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                       Total Cost
//                     </th>
//                     <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                       Total Profit
//                     </th>
//                     <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                       Date
//                     </th>
//                     <th className='px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className='divide-y divide-gray-200 bg-white'>
//                   {filteredPurchases.map((p, index) => (
//                     <tr key={p.id} className='hover:bg-gray-50'>
//                       <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-600'>
//                         {(currentPage - 1) * perPage + index + 1}
//                       </td>
//                       <td className='whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-800'>
//                         {p.bill_no}
//                       </td>
//                       <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-600'>
//                         $
//                         {Number(p.details_sum_total_buyer_price ?? 0).toFixed(
//                           2,
//                         )}
//                       </td>
//                       <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-600'>
//                         ${Number(p.details_sum_total_profit ?? 0).toFixed(2)}
//                       </td>
//                       <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-600'>
//                         {new Date(p.purchase_date).toLocaleDateString()}
//                       </td>
//                       <td className='whitespace-nowrap px-4 py-3 text-right text-sm'>
//                         <button
//                           onClick={() => handleViewDetails(p.id)}
//                           className='mr-2 rounded-lg bg-indigo-50 p-2 text-indigo-700 transition hover:bg-indigo-100'
//                           aria-label='View details'
//                         >
//                           <FiEye className='h-4 w-4' />
//                         </button>
//                         <button
//                           onClick={() => handleEditClick(p.id)}
//                           className='mr-2 rounded-lg bg-blue-50 p-2 text-blue-700 transition hover:bg-blue-100'
//                           aria-label='Edit purchase'
//                         >
//                           <FiEdit2 className='h-4 w-4' />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteClick(p.id)}
//                           className='rounded-lg bg-red-50 p-2 text-red-700 transition hover:bg-red-100'
//                           aria-label='Delete purchase'
//                         >
//                           <FiTrash2 className='h-4 w-4' />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination - only if more than one page */}
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

//       {/* Create Modal */}
//       {showCreate && (
//         <Modal title='Create Purchase' onClose={closeModals}>
//           <PurchaseForm
//             form={form}
//             setForm={setForm}
//             names={names}
//             generics={generics}
//             companies={companies}
//             families={families}
//             addRow={addRow}
//             removeRow={removeRow}
//             changeMedicine={changeMedicine}
//             onSubmit={handleCreateSubmit}
//             submitLabel='Save Purchase'
//             onCancel={closeModals}
//           />
//         </Modal>
//       )}

//       {/* Edit Modal */}
//       {showEdit && (
//         <Modal title='Edit Purchase' onClose={closeModals}>
//           <PurchaseForm
//             form={form}
//             setForm={setForm}
//             names={names}
//             generics={generics}
//             companies={companies}
//             families={families}
//             addRow={addRow}
//             removeRow={removeRow}
//             changeMedicine={changeMedicine}
//             onSubmit={handleEditSubmit}
//             submitLabel='Update Purchase'
//             onCancel={closeModals}
//           />
//         </Modal>
//       )}

//       {/* Detail Modal */}
//       {showDetail && purchase && (
//         <Modal
//           title={`Purchase Details - Bill ${purchase.bill_no}`}
//           onClose={closeModals}
//         >
//           <div className='mb-4'>
//             <p className='text-sm text-gray-600'>
//               <span className='font-medium'>Date:</span>{' '}
//               {new Date(purchase.purchase_date).toLocaleDateString()}
//             </p>
//           </div>
//           <div className='overflow-x-auto'>
//             <table className='w-full min-w-full divide-y divide-gray-200'>
//               <thead className='bg-gray-50'>
//                 <tr>
//                   <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                     Name
//                   </th>
//                   <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                     Generic
//                   </th>
//                   <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                     Company
//                   </th>
//                   <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                     Family
//                   </th>
//                   <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                     Qty
//                   </th>
//                   <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                     Buy
//                   </th>
//                   <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                     Total Buy
//                   </th>
//                   <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                     Sale
//                   </th>
//                   <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                     Unit Profit
//                   </th>
//                   <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                     Total Profit
//                   </th>
//                   <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                     Expiry
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className='divide-y divide-gray-200 bg-white'>
//                 {purchase.details.map((d, idx) => (
//                   <tr key={idx} className='hover:bg-gray-50'>
//                     <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-800'>
//                       {d.name}
//                     </td>
//                     <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
//                       {d.generic_name}
//                     </td>
//                     <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
//                       {d.company}
//                     </td>
//                     <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
//                       {d.family}
//                     </td>
//                     <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
//                       {d.quantity}
//                     </td>
//                     <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
//                       ${Number(d.buy_price).toFixed(2)}
//                     </td>
//                     <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
//                       ${Number(d.total_buyer_price).toFixed(2)}
//                     </td>
//                     <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
//                       ${Number(d.sale_price).toFixed(2)}
//                     </td>
//                     <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
//                       ${Number(d.profit_per_unit).toFixed(2)}
//                     </td>
//                     <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
//                       ${Number(d.total_profit).toFixed(2)}
//                     </td>
//                     <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
//                       {new Date(d.expiry_date).toLocaleDateString()}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           <div className='mt-6 flex justify-end'>
//             <button
//               onClick={closeModals}
//               className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:bg-gray-50'
//             >
//               Close
//             </button>
//           </div>
//         </Modal>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteConfirm && (
//         <Modal title='Confirm Delete' onClose={closeModals}>
//           <div className='py-4'>
//             <p className='text-gray-700'>
//               Are you sure you want to delete this purchase? This action cannot
//               be undone.
//             </p>
//           </div>
//           <div className='flex justify-end space-x-3'>
//             <button
//               onClick={closeModals}
//               className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:bg-gray-50'
//             >
//               Cancel
//             </button>
//             <button
//               onClick={confirmDelete}
//               className='rounded-lg bg-red-600 px-4 py-2 text-white shadow-md transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2'
//             >
//               Delete
//             </button>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }

// // Modal Component (with improved z-index and backdrop)
// function Modal({ title, onClose, children }) {
//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.key === 'Escape') onClose();
//     };
//     window.addEventListener('keydown', handleEsc);
//     return () => window.removeEventListener('keydown', handleEsc);
//   }, [onClose]);

//   return (
//     <div
//       className='fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/0 backdrop-blur-sm'
//       onClick={onClose}
//     >
//       <div
//         className='w-full max-w-6xl my-8 rounded-2xl bg-white shadow-2xl'
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className='flex items-center justify-between border-b border-gray-100 px-6 py-4'>
//           <h3 className='text-lg font-semibold text-gray-800'>{title}</h3>
//           <button
//             onClick={onClose}
//             className='rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
//           >
//             <FiX className='h-5 w-5' />
//           </button>
//         </div>
//         <div className='px-6 py-4 max-h-[70vh] overflow-y-auto'>{children}</div>
//       </div>
//     </div>
//   );
// }

// // Purchase Form (with select improvements)
// function PurchaseForm({
//   form,
//   setForm,
//   names,
//   generics,
//   companies,
//   families,
//   addRow,
//   removeRow,
//   changeMedicine,
//   onSubmit,
//   submitLabel,
//   onCancel,
// }) {
//   return (
//     <form onSubmit={onSubmit} className='space-y-6'>
//       <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
//         <input
//           type='text'
//           placeholder='Bill Number'
//           value={form.bill_no}
//           onChange={(e) => setForm({ ...form, bill_no: e.target.value })}
//           className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
//           required
//         />
//         <input
//           type='date'
//           value={form.purchase_date}
//           onChange={(e) => setForm({ ...form, purchase_date: e.target.value })}
//           className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
//           required
//         />
//       </div>

//       <div className='overflow-x-auto'>
//         <table className='w-full min-w-full divide-y divide-gray-200'>
//           <thead className='bg-gray-50'>
//             <tr>
//               <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                 Qty
//               </th>
//               <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                 Name
//               </th>
//               <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                 Generic
//               </th>
//               <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                 Company
//               </th>
//               <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                 Family
//               </th>
//               <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                 Buy Price
//               </th>
//               <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                 Sale Price
//               </th>
//               <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                 Expiry
//               </th>
//               <th className='px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className='divide-y divide-gray-200 bg-white'>
//             {form.medicines.map((med, index) => (
//               <tr key={index} className='hover:bg-gray-50'>
//                 <td className='px-3 py-2'>
//                   <input
//                     type='number'
//                     value={med.quantity}
//                     placeholder='90...'
//                     onChange={(e) =>
//                       changeMedicine(index, 'quantity', e.target.value)
//                     }
//                     className='w-20 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-black text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-200'
//                     required
//                   />
//                 </td>
//                 <td className='px-3 py-2'>
//                   <select
//                     value={med.name}
//                     onChange={(e) =>
//                       changeMedicine(index, 'name', e.target.value)
//                     }
//                     className='w-32 rounded-lg border border-gray-200 bg-gray-50 text-black px-2 py-1 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-200 z-50'
//                     required
//                   >
//                     <option value=''>Select</option>
//                     {names.map((n, i) => (
//                       <option key={i} value={n.name}>
//                         {n.name}
//                       </option>
//                     ))}
//                   </select>
//                 </td>
//                 <td className='px-3 py-2'>
//                   <select
//                     value={med.generic_name}
//                     onChange={(e) =>
//                       changeMedicine(index, 'generic_name', e.target.value)
//                     }
//                     className='w-32 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm focus:border-indigo-400 text-black focus:outline-none focus:ring-1 focus:ring-indigo-200 z-50'
//                   >
//                     <option value=''>Select</option>
//                     {generics.map((g, i) => (
//                       <option key={i} value={g.generic_name}>
//                         {g.generic_name}
//                       </option>
//                     ))}
//                   </select>
//                 </td>
//                 <td className='px-3 py-2'>
//                   <select
//                     value={med.company}
//                     onChange={(e) =>
//                       changeMedicine(index, 'company', e.target.value)
//                     }
//                     className='w-32 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm focus:border-indigo-400 text-black focus:outline-none focus:ring-1 focus:ring-indigo-200 z-50'
//                   >
//                     <option value=''>Select</option>
//                     {companies.map((c, i) => (
//                       <option key={i} value={c.company}>
//                         {c.company}
//                       </option>
//                     ))}
//                   </select>
//                 </td>
//                 <td className='px-3 py-2'>
//                   <select
//                     value={med.family}
//                     onChange={(e) =>
//                       changeMedicine(index, 'family', e.target.value)
//                     }
//                     className='w-32 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm focus:border-indigo-400 text-black focus:outline-none focus:ring-1 focus:ring-indigo-200 z-50'
//                   >
//                     <option value=''>Select</option>
//                     {families.map((f, i) => (
//                       <option key={i} value={f.family}>
//                         {f.family}
//                       </option>
//                     ))}
//                   </select>
//                 </td>
//                 <td className='px-3 py-2'>
//                   <input
//                     type='number'
//                     step='0.01'
//                     value={med.buy_price}
//                     placeholder='90...'
//                     onChange={(e) =>
//                       changeMedicine(index, 'buy_price', e.target.value)
//                     }
//                     className='w-24 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm focus:border-indigo-400 text-black focus:outline-none focus:ring-1 focus:ring-indigo-200'
//                     required
//                   />
//                 </td>
//                 <td className='px-3 py-2'>
//                   <input
//                     type='number'
//                     step='0.01'
//                     value={med.sale_price}
//                     placeholder='90...'
//                     onChange={(e) =>
//                       changeMedicine(index, 'sale_price', e.target.value)
//                     }
//                     className='w-24 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm focus:border-indigo-400 text-black focus:outline-none focus:ring-1 focus:ring-indigo-200'
//                     required
//                   />
//                 </td>
//                 <td className='px-3 py-2'>
//                   <input
//                     type='date'
//                     value={med.expiry_date}
//                     onChange={(e) =>
//                       changeMedicine(index, 'expiry_date', e.target.value)
//                     }
//                     className='w-32 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm focus:border-indigo-400 text-black focus:outline-none focus:ring-1 focus:ring-indigo-200'
//                     required
//                   />
//                 </td>
//                 <td className='px-3 py-2 text-right'>
//                   <button
//                     type='button'
//                     onClick={() => removeRow(index)}
//                     className='text-red-600 hover:text-red-800'
//                   >
//                     <FiTrash2 className='h-4 w-4' />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <button
//         type='button'
//         onClick={addRow}
//         className='flex items-center text-sm text-indigo-600 hover:text-indigo-800'
//       >
//         <FiPlus className='mr-1 h-4 w-4' />
//         Add Medicine
//       </button>

//       <div className='flex justify-end space-x-3 pt-4 border-t border-gray-100'>
//         <button
//           type='button'
//           onClick={onCancel}
//           className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:bg-gray-50'
//         >
//           Cancel
//         </button>
//         <button
//           type='submit'
//           className='rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
//         >
//           {submitLabel}
//         </button>
//       </div>
//     </form>
//   );
// }

// // src/pages/purchases/Purchase.jsx
// import { useEffect, useState, useMemo } from 'react';
// import { FiPlus } from 'react-icons/fi';
// import api from '../../api';
// import { Modal } from '../../components/Modal';
// import { LoadingSpinner } from '../../components/LoadingSpinner';
// import { SearchInput } from '../../components/SearchInput';
// import { TablePagination } from '../../components/TablePagination';
// import { DeleteConfirmModal } from '../../components/DeleteConfirmModal';
// import { PurchaseTable } from './components/PurchaseTable';
// import { PurchaseDetail } from './components/PurchaseDetail';
// import { PurchaseForm } from './components/PurchaseForm';

// export default function Purchase() {
//   const [purchases, setPurchases] = useState([]);
//   const [purchase, setPurchase] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Modal states
//   const [showDetail, setShowDetail] = useState(false);
//   const [showCreate, setShowCreate] = useState(false);
//   const [showEdit, setShowEdit] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const [editId, setEditId] = useState(null);

//   // Pagination
//   const [perPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);

//   const [searchTerm, setSearchTerm] = useState('');

//   // Form state (shared for create & edit)
//   const [form, setForm] = useState({
//     bill_no: '',
//     purchase_date: new Date().toISOString().slice(0, 10),
//     medicines: [
//       {
//         quantity: '',
//         name: '',
//         generic_name: '',
//         company: '',
//         family: '',
//         buy_price: '',
//         sale_price: '',
//         expiry_date: '',
//       },
//     ],
//   });

//   // Dropdown data
//   const [names, setNames] = useState([]);
//   const [generics, setGenerics] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [families, setFamilies] = useState([]);

//   // Lock body scroll when any modal is open
//   useEffect(() => {
//     if (showCreate || showEdit || showDetail || showDeleteConfirm) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = '';
//     }
//     return () => {
//       document.body.style.overflow = '';
//     };
//   }, [showCreate, showEdit, showDetail, showDeleteConfirm]);

//   // Load data
//   useEffect(() => {
//     fetchPurchases(currentPage);
//   }, [currentPage]);

//   useEffect(() => {
//     fetchDropdownData();
//   }, []);

//   const fetchPurchases = async (page = 1) => {
//     setLoading(true);
//     try {
//       const res = await api.get(`/purchases?page=${page}`);
//       setPurchases(res.data.data || res.data);
//       setTotalPages(res.data.last_page || 1);
//       setTotalItems(res.data.total || res.data.data?.length || 0);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDropdownData = async () => {
//     try {
//       const res = await api.get('/purchase-form-data');
//       setNames(res.data.names);
//       setGenerics(res.data.generics);
//       setCompanies(res.data.companies);
//       setFamilies(res.data.families);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // Form handlers
//   const addRow = () => {
//     setForm({
//       ...form,
//       medicines: [
//         ...form.medicines,
//         {
//           quantity: '',
//           name: '',
//           generic_name: '',
//           company: '',
//           family: '',
//           buy_price: '',
//           sale_price: '',
//           expiry_date: '',
//         },
//       ],
//     });
//   };

//   const removeRow = (index) => {
//     if (form.medicines.length === 1) {
//       alert('At least one row required');
//       return;
//     }
//     const rows = [...form.medicines];
//     rows.splice(index, 1);
//     setForm({ ...form, medicines: rows });
//   };

//   const changeMedicine = (index, field, value) => {
//     const rows = [...form.medicines];
//     rows[index][field] = value;
//     setForm({ ...form, medicines: rows });
//   };

//   const resetForm = () => {
//     setForm({
//       bill_no: '',
//       purchase_date: new Date().toISOString().slice(0, 10),
//       medicines: [
//         {
//           quantity: '',
//           name: '',
//           generic_name: '',
//           company: '',
//           family: '',
//           buy_price: '',
//           sale_price: '',
//           expiry_date: '',
//         },
//       ],
//     });
//   };

//   // Create
//   const handleCreateSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post('/purchases', form);
//       setShowCreate(false);
//       resetForm();
//       fetchPurchases(currentPage);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // Edit
//   const handleEditClick = async (id) => {
//     try {
//       const res = await api.get(`/purchases/${id}`);
//       const data = res.data;
//       setEditId(id);
//       setForm({
//         bill_no: data.bill_no,
//         purchase_date: data.purchase_date,
//         medicines: data.details.map((d) => ({
//           quantity: d.quantity,
//           name: d.name,
//           generic_name: d.generic_name,
//           company: d.company,
//           family: d.family,
//           buy_price: d.buy_price,
//           sale_price: d.sale_price,
//           expiry_date: d.expiry_date,
//         })),
//       });
//       setShowEdit(true);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.put(`/purchases/${editId}`, form);
//       setShowEdit(false);
//       resetForm();
//       fetchPurchases(currentPage);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // Delete
//   const handleDeleteClick = (id) => {
//     setDeleteId(id);
//     setShowDeleteConfirm(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       await api.delete(`/purchases/${deleteId}`);
//       setShowDeleteConfirm(false);
//       setDeleteId(null);
//       fetchPurchases(currentPage);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // Detail
//   const handleViewDetails = async (id) => {
//     try {
//       const res = await api.get(`/purchases/${id}`);
//       setPurchase(res.data);
//       setShowDetail(true);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const closeModals = () => {
//     setShowCreate(false);
//     setShowEdit(false);
//     setShowDetail(false);
//     setShowDeleteConfirm(false);
//     setDeleteId(null);
//     resetForm();
//   };

//   // Search filter
//   const filteredPurchases = useMemo(() => {
//     if (!searchTerm.trim()) return purchases;
//     const lowerSearch = searchTerm.toLowerCase();
//     return purchases.filter((p) => {
//       const searchable = [p.id, p.bill_no, p.purchase_date]
//         .map((field) => String(field ?? '').toLowerCase())
//         .join(' ');
//       return searchable.includes(lowerSearch);
//     });
//   }, [purchases, searchTerm]);

//   const handlePrev = () => {
//     if (currentPage > 1) setCurrentPage((prev) => prev - 1);
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
//   };

//   return (
//     <div className='space-y-6'>
//       {/* Header */}
//       <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
//         <h1 className='text-2xl font-semibold text-gray-800'>
//           Purchase Orders
//         </h1>
//         <button
//           onClick={() => setShowCreate(true)}
//           className='mt-4 sm:mt-0 flex items-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
//         >
//           <FiPlus className='mr-2 h-5 w-5' />
//           New Purchase
//         </button>
//       </div>

//       {/* Search input */}
//       <div className='sm:w-72'>
//         <SearchInput
//           value={searchTerm}
//           onChange={setSearchTerm}
//           placeholder='Search purchases...'
//         />
//       </div>

//       {/* Table Card */}
//       <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
//         {loading ? (
//           <LoadingSpinner />
//         ) : filteredPurchases.length === 0 ? (
//           <div className='text-center py-12'>
//             <p className='text-gray-500 text-lg'>No purchases found.</p>
//           </div>
//         ) : (
//           <>
//             <PurchaseTable
//               purchases={filteredPurchases}
//               currentPage={currentPage}
//               perPage={perPage}
//               onView={handleViewDetails}
//               onEdit={handleEditClick}
//               onDelete={handleDeleteClick}
//             />
//             <TablePagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPrev={handlePrev}
//               onNext={handleNext}
//             />
//           </>
//         )}
//       </div>

//       {/* Create Modal */}
//       {showCreate && (
//         <Modal title='Create Purchase' onClose={closeModals} size='max-w-6xl'>
//           <PurchaseForm
//             form={form}
//             setForm={setForm}
//             names={names}
//             generics={generics}
//             companies={companies}
//             families={families}
//             addRow={addRow}
//             removeRow={removeRow}
//             changeMedicine={changeMedicine}
//             onSubmit={handleCreateSubmit}
//             submitLabel='Save Purchase'
//             onCancel={closeModals}
//           />
//         </Modal>
//       )}

//       {/* Edit Modal */}
//       {showEdit && (
//         <Modal title='Edit Purchase' onClose={closeModals} size='max-w-6xl'>
//           <PurchaseForm
//             form={form}
//             setForm={setForm}
//             names={names}
//             generics={generics}
//             companies={companies}
//             families={families}
//             addRow={addRow}
//             removeRow={removeRow}
//             changeMedicine={changeMedicine}
//             onSubmit={handleEditSubmit}
//             submitLabel='Update Purchase'
//             onCancel={closeModals}
//           />
//         </Modal>
//       )}

//       {/* Detail Modal */}
//       {showDetail && purchase && (
//         <Modal
//           title={`Purchase Details - Bill ${purchase.bill_no}`}
//           onClose={closeModals}
//           size='max-w-7xl'
//         >
//           <PurchaseDetail purchase={purchase} />
//           <div className='mt-6 flex justify-end'>
//             <button
//               onClick={closeModals}
//               className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:bg-gray-50'
//             >
//               Close
//             </button>
//           </div>
//         </Modal>
//       )}

//       {/* Delete Confirmation Modal */}
//       <DeleteConfirmModal
//         isOpen={showDeleteConfirm}
//         onClose={closeModals}
//         onConfirm={confirmDelete}
//         itemName={`purchase #${deleteId}`}
//       />
//     </div>
//   );
// }

// src/pages/purchases/Purchase.jsx
import { useEffect, useState, useMemo } from 'react';
import { FiPlus } from 'react-icons/fi';
import api from '../../api';
import { Modal } from '../../components/Modal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { SearchInput } from '../../components/SearchInput';
import { TablePagination } from '../../components/TablePagination';
import { DeleteConfirmModal } from '../../components/DeleteConfirmModal';
import { PurchaseTable } from './components/PurchaseTable';
import { PurchaseDetail } from './components/PurchaseDetail';
import { PurchaseForm } from './components/PurchaseForm';

export default function Purchase() {
  const [purchases, setPurchases] = useState([]);
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showDetail, setShowDetail] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);

  // Pagination
  const [perPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'paid', 'partial'

  // Form state (shared for create & edit)
  const [form, setForm] = useState({
    bill_no: '',
    purchase_date: new Date().toISOString().slice(0, 10),
    paid_amount: 0,
    medicines: [
      {
        quantity: '',
        name: '',
        generic_name: '',
        company: '',
        family: '',
        buy_price: '',
        sale_price: '',
        expiry_date: '',
      },
    ],
  });

  // Dropdown data
  const [names, setNames] = useState([]);
  const [generics, setGenerics] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [families, setFamilies] = useState([]);

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (showCreate || showEdit || showDetail || showDeleteConfirm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showCreate, showEdit, showDetail, showDeleteConfirm]);

  // Load data when page or filter changes
  useEffect(() => {
    fetchPurchases(currentPage, statusFilter);
  }, [currentPage, statusFilter]);

  // Load dropdown data once
  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchPurchases = async (page = 1, status = 'all') => {
    setLoading(true);
    try {
      const url =
        status !== 'all'
          ? `/purchases?page=${page}&status=${status}`
          : `/purchases?page=${page}`;
      const res = await api.get(url);
      setPurchases(res.data.data || res.data);
      setTotalPages(res.data.last_page || 1);
      setTotalItems(res.data.total || res.data.data?.length || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const res = await api.get('/purchase-form-data');
      setNames(res.data.names);
      setGenerics(res.data.generics);
      setCompanies(res.data.companies);
      setFamilies(res.data.families);
    } catch (error) {
      console.error(error);
    }
  };

  // Form handlers
  const addRow = () => {
    setForm({
      ...form,
      medicines: [
        ...form.medicines,
        {
          quantity: '',
          name: '',
          generic_name: '',
          company: '',
          family: '',
          buy_price: '',
          sale_price: '',
          expiry_date: '',
        },
      ],
    });
  };

  const removeRow = (index) => {
    if (form.medicines.length === 1) {
      alert('At least one row required');
      return;
    }
    const rows = [...form.medicines];
    rows.splice(index, 1);
    setForm({ ...form, medicines: rows });
  };

  const changeMedicine = (index, field, value) => {
    const rows = [...form.medicines];
    rows[index][field] = value;
    setForm({ ...form, medicines: rows });
  };

  const resetForm = () => {
    setForm({
      bill_no: '',
      purchase_date: new Date().toISOString().slice(0, 10),
      paid_amount: 0,
      medicines: [
        {
          quantity: '',
          name: '',
          generic_name: '',
          company: '',
          family: '',
          buy_price: '',
          sale_price: '',
          expiry_date: '',
        },
      ],
    });
  };

  // Create
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/purchases', form);
      setShowCreate(false);
      resetForm();
      fetchPurchases(currentPage, statusFilter);
    } catch (error) {
      console.error(error);
    }
  };

  // Edit
  const handleEditClick = async (id) => {
    try {
      const res = await api.get(`/purchases/${id}`);
      const data = res.data;
      setEditId(id);
      setForm({
        bill_no: data.bill_no,
        purchase_date: data.purchase_date,
        paid_amount: data.paid_amount ?? 0,
        medicines: data.details.map((d) => ({
          quantity: d.quantity,
          name: d.name,
          generic_name: d.generic_name,
          company: d.company,
          family: d.family,
          buy_price: d.buy_price,
          sale_price: d.sale_price,
          expiry_date: d.expiry_date,
        })),
      });
      setShowEdit(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/purchases/${editId}`, form);
      setShowEdit(false);
      resetForm();
      fetchPurchases(currentPage, statusFilter);
    } catch (error) {
      console.error(error);
    }
  };

  // Delete
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/purchases/${deleteId}`);
      setShowDeleteConfirm(false);
      setDeleteId(null);
      fetchPurchases(currentPage, statusFilter);
    } catch (error) {
      console.error(error);
    }
  };

  // Detail
  const handleViewDetails = async (id) => {
    try {
      const res = await api.get(`/purchases/${id}`);
      setPurchase(res.data);
      setShowDetail(true);
    } catch (error) {
      console.error(error);
    }
  };

  const closeModals = () => {
    setShowCreate(false);
    setShowEdit(false);
    setShowDetail(false);
    setShowDeleteConfirm(false);
    setDeleteId(null);
    resetForm();
  };

  // Status filter handler
  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1); // reset to first page
  };

  // Search filter (local)
  const filteredPurchases = useMemo(() => {
    if (!searchTerm.trim()) return purchases;
    const lowerSearch = searchTerm.toLowerCase();
    return purchases.filter((p) => {
      const searchable = [
        p.id,
        p.bill_no,
        p.purchase_date,
        p.payment_status,
        p.total_amount,
        p.paid_amount,
        p.due_amount,
      ]
        .map((field) => String(field ?? '').toLowerCase())
        .join(' ');
      return searchable.includes(lowerSearch);
    });
  }, [purchases, searchTerm]);

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
        <h1 className='text-2xl font-semibold text-gray-800'>
          Purchase Orders
        </h1>
        <button
          onClick={() => setShowCreate(true)}
          className='mt-4 sm:mt-0 flex items-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
        >
          <FiPlus className='mr-2 h-5 w-5' />
          New Purchase
        </button>
      </div>

      {/* Filter and Search */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        {/* Status Tabs */}
        <div className='flex space-x-2 rounded-lg bg-gray-100 p-1'>
          {['all', 'pending', 'paid', 'partial'].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-4 py-2 text-sm font-medium rounded-md capitalize ${
                statusFilter === status
                  ? 'bg-white text-indigo-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className='sm:w-72'>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder='Search purchases...'
          />
        </div>
      </div>

      {/* Table Card */}
      <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
        {loading ? (
          <LoadingSpinner />
        ) : filteredPurchases.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>No purchases found.</p>
          </div>
        ) : (
          <>
            <PurchaseTable
              purchases={filteredPurchases}
              currentPage={currentPage}
              perPage={perPage}
              onView={handleViewDetails}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
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

      {/* Create Modal */}
      {showCreate && (
        <Modal title='Create Purchase' onClose={closeModals} size='max-w-6xl'>
          <PurchaseForm
            form={form}
            setForm={setForm}
            names={names}
            generics={generics}
            companies={companies}
            families={families}
            addRow={addRow}
            removeRow={removeRow}
            changeMedicine={changeMedicine}
            onSubmit={handleCreateSubmit}
            submitLabel='Save Purchase'
            onCancel={closeModals}
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <Modal title='Edit Purchase' onClose={closeModals} size='max-w-6xl'>
          <PurchaseForm
            form={form}
            setForm={setForm}
            names={names}
            generics={generics}
            companies={companies}
            families={families}
            addRow={addRow}
            removeRow={removeRow}
            changeMedicine={changeMedicine}
            onSubmit={handleEditSubmit}
            submitLabel='Update Purchase'
            onCancel={closeModals}
          />
        </Modal>
      )}

      {/* Detail Modal */}
      {showDetail && purchase && (
        <Modal
          title={`Purchase Details - Bill ${purchase.bill_no}`}
          onClose={closeModals}
          size='max-w-7xl'
        >
          <PurchaseDetail purchase={purchase} />
          <div className='mt-6 flex justify-end'>
            <button
              onClick={closeModals}
              className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:bg-gray-50'
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={closeModals}
        onConfirm={confirmDelete}
        itemName={`purchase #${deleteId}`}
      />
    </div>
  );
}
