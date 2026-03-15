// import { useEffect, useState, useMemo } from 'react';
// import {
//   FiPlus,
//   FiEdit2,
//   FiTrash2,
//   FiEye,
//   FiX,
//   FiChevronLeft,
//   FiChevronRight,
//   FiSearch,
// } from 'react-icons/fi';
// import api from '../../api';

// export default function Sale() {
//   const [sales, setSales] = useState([]);
//   const [medicines, setMedicines] = useState([]);
//   const [selectedSale, setSelectedSale] = useState(null);
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
//     patient_name: '',
//     sale_date: new Date().toISOString().slice(0, 10),
//     medicines: [
//       {
//         medicine_id: '',
//         quantity: '',
//         stock: 0,
//         medicine: null,
//       },
//     ],
//   });

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

//   // Load sales with pagination
//   useEffect(() => {
//     fetchSales(currentPage);
//   }, [currentPage]);

//   // Load medicines for dropdown
//   useEffect(() => {
//     api.get('/medicines').then((res) => setMedicines(res.data));
//   }, []);

//   const fetchSales = async (page = 1) => {
//     setLoading(true);
//     try {
//       const res = await api.get(`/sales?page=${page}`);
//       setSales(res.data.data || res.data);
//       setTotalPages(res.data.last_page || 1);
//       setTotalItems(res.data.total || res.data.data?.length || 0);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Form handlers
//   const addRow = () => {
//     setForm({
//       ...form,
//       medicines: [
//         ...form.medicines,
//         {
//           medicine_id: '',
//           quantity: '',
//           stock: 0,
//           medicine: null,
//         },
//       ],
//     });
//   };

//   const removeRow = (index) => {
//     const rows = [...form.medicines];
//     rows.splice(index, 1);
//     setForm({ ...form, medicines: rows });
//   };

//   const handleHeaderChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSelectMedicine = (index, medicineId) => {
//     const medicine = medicines.find((m) => m.id == medicineId);
//     const rows = [...form.medicines];
//     rows[index].medicine_id = medicineId;
//     rows[index].medicine = medicine;
//     rows[index].stock = medicine ? medicine.quantity : 0;
//     rows[index].quantity = ''; // reset quantity when medicine changes
//     setForm({ ...form, medicines: rows });
//   };

//   const handleQuantityChange = (index, value) => {
//     const rows = [...form.medicines];
//     rows[index].quantity = value;
//     setForm({ ...form, medicines: rows });
//   };

//   const resetForm = () => {
//     setForm({
//       bill_no: '',
//       patient_name: '',
//       sale_date: new Date().toISOString().slice(0, 10),
//       medicines: [
//         {
//           medicine_id: '',
//           quantity: '',
//           stock: 0,
//           medicine: null,
//         },
//       ],
//     });
//   };

//   // Validation helper (used before submit)
//   const validateForm = () => {
//     const newRows = form.medicines.map((row) => {
//       const errors = {};
//       if (!row.medicine_id) {
//         errors.medicine = 'Please select a medicine';
//       }
//       if (!row.quantity || row.quantity <= 0) {
//         errors.quantity = 'Quantity must be greater than zero';
//       } else if (parseInt(row.quantity) > row.stock) {
//         errors.quantity = `Exceeds stock (${row.stock})`;
//       }
//       return errors;
//     });

//     // If any errors, we can either set some state to show them or just return false
//     // We'll return false and the errors will be displayed inline via render
//     const hasErrors = newRows.some((e) => Object.keys(e).length > 0);
//     return { isValid: !hasErrors, errors: newRows };
//   };

//   // Create
//   const handleCreateSubmit = async (e) => {
//     e.preventDefault();
//     const { isValid } = validateForm();
//     if (!isValid) return;

//     try {
//       await api.post('/sales', form);
//       // Success: close modal and refresh list without alert
//       setShowCreate(false);
//       resetForm();
//       fetchSales(currentPage);
//     } catch (error) {
//       alert(error.response?.data?.error || 'Error saving sale');
//     }
//   };

//   // Edit
//   const handleEditClick = async (id) => {
//     try {
//       const res = await api.get(`/sales/${id}`);
//       const data = res.data;
//       setEditId(id);
//       setForm({
//         bill_no: data.bill_no,
//         patient_name: data.patient_name,
//         sale_date: data.sale_date,
//         medicines: data.details.map((d) => ({
//           medicine_id: d.medicine.id,
//           quantity: d.quantity,
//           stock: d.medicine.quantity,
//           medicine: d.medicine,
//         })),
//       });
//       setShowEdit(true);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     const { isValid } = validateForm();
//     if (!isValid) return;

//     try {
//       await api.put(`/sales/${editId}`, form);
//       // Success: close modal and refresh list without alert
//       setShowEdit(false);
//       resetForm();
//       fetchSales(currentPage);
//     } catch (error) {
//       alert(error.response?.data?.error || 'Error updating sale');
//     }
//   };

//   // Delete
//   const handleDeleteClick = (id) => {
//     setDeleteId(id);
//     setShowDeleteConfirm(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       await api.delete(`/sales/${deleteId}`);
//       setShowDeleteConfirm(false);
//       setDeleteId(null);
//       fetchSales(currentPage);
//     } catch (error) {
//       alert('Delete failed');
//     }
//   };

//   // Detail view
//   const handleViewDetails = async (id) => {
//     try {
//       const res = await api.get(`/sales/${id}`);
//       setSelectedSale(res.data);
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

//   // Pagination handlers
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

//   const filteredSales = useMemo(() => {
//     if (!searchTerm.trim()) return sales;
//     const lowerSearch = searchTerm.toLowerCase();
//     return sales.filter((sale) => {
//       const searchable = [
//         sale.id,
//         sale.bill_no,
//         sale.patient_name,
//         sale.sale_date,
//       ]
//         .map((field) => String(field ?? '').toLowerCase())
//         .join(' ');
//       return searchable.includes(lowerSearch);
//     });
//   }, [sales, searchTerm]);

//   return (
//     <div className='space-y-6'>
//       {/* Header */}
//       <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
//         <h1 className='text-2xl font-semibold text-gray-800'>
//           Sales Management
//         </h1>
//         <button
//           onClick={() => setShowCreate(true)}
//           className='mt-4 sm:mt-0 flex items-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
//         >
//           <FiPlus className='mr-2 h-5 w-5' />
//           Add Sale
//         </button>
//       </div>

//       {/* Search input */}
//       <div className='sm:w-72'>
//         <div className='relative'>
//           <input
//             type='text'
//             placeholder='Search sales...'
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
//         ) : filteredSales.length === 0 ? (
//           <div className='text-center py-12'>
//             <p className='text-gray-500 text-lg'>No sales found.</p>
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
//                       Patient
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
//                   {filteredSales.map((sale, index) => (
//                     <tr key={sale.id} className='hover:bg-gray-50'>
//                       <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-600'>
//                         {(currentPage - 1) * perPage + index + 1}
//                       </td>
//                       <td className='whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-800'>
//                         {sale.patient_name}
//                       </td>
//                       <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-600'>
//                         {new Date(sale.sale_date).toLocaleDateString()}
//                       </td>
//                       <td className='whitespace-nowrap px-4 py-3 text-right text-sm'>
//                         <button
//                           onClick={() => handleViewDetails(sale.id)}
//                           className='mr-2 rounded-lg bg-indigo-50 p-2 text-indigo-700 transition hover:bg-indigo-100'
//                           aria-label='View details'
//                         >
//                           <FiEye className='h-4 w-4' />
//                         </button>
//                         <button
//                           onClick={() => handleEditClick(sale.id)}
//                           className='mr-2 rounded-lg bg-blue-50 p-2 text-blue-700 transition hover:bg-blue-100'
//                           aria-label='Edit sale'
//                         >
//                           <FiEdit2 className='h-4 w-4' />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteClick(sale.id)}
//                           className='rounded-lg bg-red-50 p-2 text-red-700 transition hover:bg-red-100'
//                           aria-label='Delete sale'
//                         >
//                           <FiTrash2 className='h-4 w-4' />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
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
//         <Modal title='Create Sale' onClose={closeModals}>
//           <SaleForm
//             form={form}
//             medicines={medicines}
//             addRow={addRow}
//             removeRow={removeRow}
//             onHeaderChange={handleHeaderChange}
//             onSelectMedicine={handleSelectMedicine}
//             onQuantityChange={handleQuantityChange}
//             onSubmit={handleCreateSubmit}
//             submitLabel='Save Sale'
//             onCancel={closeModals}
//           />
//         </Modal>
//       )}

//       {/* Edit Modal */}
//       {showEdit && (
//         <Modal title='Edit Sale' onClose={closeModals}>
//           <SaleForm
//             form={form}
//             medicines={medicines}
//             addRow={addRow}
//             removeRow={removeRow}
//             onHeaderChange={handleHeaderChange}
//             onSelectMedicine={handleSelectMedicine}
//             onQuantityChange={handleQuantityChange}
//             onSubmit={handleEditSubmit}
//             submitLabel='Update Sale'
//             onCancel={closeModals}
//           />
//         </Modal>
//       )}

//       {/* Detail Modal */}
//       {showDetail && selectedSale && (
//         <Modal
//           title={`Sale Details - Bill ${selectedSale.bill_no}`}
//           onClose={closeModals}
//         >
//           <div className='mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4'>
//             <div>
//               <span className='text-xs font-medium text-gray-500 block'>
//                 Bill No.
//               </span>
//               <span className='text-sm font-semibold text-gray-900'>
//                 {selectedSale.bill_no}
//               </span>
//             </div>
//             <div>
//               <span className='text-xs font-medium text-gray-500 block'>
//                 Patient
//               </span>
//               <span className='text-sm font-semibold text-gray-900'>
//                 {selectedSale.patient_name}
//               </span>
//             </div>
//             <div>
//               <span className='text-xs font-medium text-gray-500 block'>
//                 Date
//               </span>
//               <span className='text-sm font-semibold text-gray-900'>
//                 {new Date(selectedSale.sale_date).toLocaleDateString()}
//               </span>
//             </div>
//           </div>

//           <div className='overflow-x-auto'>
//             <table className='w-full min-w-full divide-y divide-gray-200'>
//               <thead className='bg-gray-50'>
//                 <tr>
//                   <th className='px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                     Medicine
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
//                     Quantity
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className='divide-y divide-gray-200 bg-white'>
//                 {selectedSale.details.map((detail, idx) => (
//                   <tr key={idx} className='hover:bg-gray-50'>
//                     <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-800'>
//                       {detail.medicine.name}
//                     </td>
//                     <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
//                       {detail.medicine.generic_name}
//                     </td>
//                     <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
//                       {detail.medicine.company}
//                     </td>
//                     <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
//                       {detail.medicine.family}
//                     </td>
//                     <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-600'>
//                       {detail.quantity}
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
//               Are you sure you want to delete this sale? This action cannot be
//               undone.
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

// // Modal Component (reusable)
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
//       className='fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/0 backdrop-blur-sm overflow-y-auto'
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

// // Sale Form Component (with four dropdowns per row and inline validation)
// function SaleForm({
//   form,
//   medicines,
//   addRow,
//   removeRow,
//   onHeaderChange,
//   onSelectMedicine,
//   onQuantityChange,
//   onSubmit,
//   submitLabel,
//   onCancel,
// }) {
//   // Compute errors for each row on the fly
//   const getRowErrors = (row) => {
//     const errors = {};
//     if (!row.medicine_id) {
//       errors.medicine = 'Please select a medicine';
//     }
//     if (!row.quantity || row.quantity <= 0) {
//       errors.quantity = 'Quantity must be greater than zero';
//     } else if (parseInt(row.quantity) > row.stock) {
//       errors.quantity = `Exceeds stock (${row.stock})`;
//     }
//     return errors;
//   };

//   return (
//     <form onSubmit={onSubmit} className='space-y-6'>
//       <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
//         <input
//           type='text'
//           name='bill_no'
//           placeholder='Bill Number'
//           value={form.bill_no}
//           onChange={onHeaderChange}
//           className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
//           required
//         />
//         <input
//           type='text'
//           name='patient_name'
//           placeholder='Patient Name'
//           value={form.patient_name}
//           onChange={onHeaderChange}
//           className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
//           required
//         />
//         <input
//           type='date'
//           name='sale_date'
//           value={form.sale_date}
//           onChange={onHeaderChange}
//           className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
//           required
//         />
//       </div>

//       <div className='overflow-x-auto'>
//         <table className='w-full min-w-full divide-y divide-gray-200'>
//           <thead className='bg-gray-50'>
//             <tr>
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
//                 Quantity
//               </th>
//               <th className='px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className='divide-y divide-gray-200 bg-white'>
//             {form.medicines.map((row, index) => {
//               const errors = getRowErrors(row);
//               const remaining = row.stock - (parseInt(row.quantity) || 0);
//               const isLastRow = form.medicines.length === 1;
//               return (
//                 <tr key={index} className='hover:bg-gray-50'>
//                   {/* Name dropdown */}
//                   <td className='px-3 py-2'>
//                     <select
//                       value={row.medicine_id}
//                       onChange={(e) => onSelectMedicine(index, e.target.value)}
//                       className='w-32 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-200'
//                     >
//                       <option value=''>Select</option>
//                       {medicines.map((med) => (
//                         <option
//                           key={med.id}
//                           value={med.id}
//                           disabled={med.quantity === 0}
//                         >
//                           {med.name}
//                         </option>
//                       ))}
//                     </select>
//                     {errors.medicine && (
//                       <p className='text-xs text-red-600 mt-1'>
//                         {errors.medicine}
//                       </p>
//                     )}
//                   </td>
//                   {/* Generic dropdown */}
//                   <td className='px-3 py-2'>
//                     <select
//                       value={row.medicine_id}
//                       onChange={(e) => onSelectMedicine(index, e.target.value)}
//                       className='w-32 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-200'
//                     >
//                       <option value=''>Select</option>
//                       {medicines.map((med) => (
//                         <option
//                           key={med.id}
//                           value={med.id}
//                           disabled={med.quantity === 0}
//                         >
//                           {med.generic_name}
//                         </option>
//                       ))}
//                     </select>
//                   </td>
//                   {/* Company dropdown */}
//                   <td className='px-3 py-2'>
//                     <select
//                       value={row.medicine_id}
//                       onChange={(e) => onSelectMedicine(index, e.target.value)}
//                       className='w-32 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-200'
//                     >
//                       <option value=''>Select</option>
//                       {medicines.map((med) => (
//                         <option
//                           key={med.id}
//                           value={med.id}
//                           disabled={med.quantity === 0}
//                         >
//                           {med.company}
//                         </option>
//                       ))}
//                     </select>
//                   </td>
//                   {/* Family dropdown */}
//                   <td className='px-3 py-2'>
//                     <select
//                       value={row.medicine_id}
//                       onChange={(e) => onSelectMedicine(index, e.target.value)}
//                       className='w-32 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-200'
//                     >
//                       <option value=''>Select</option>
//                       {medicines.map((med) => (
//                         <option
//                           key={med.id}
//                           value={med.id}
//                           disabled={med.quantity === 0}
//                         >
//                           {med.family}
//                         </option>
//                       ))}
//                     </select>
//                   </td>
//                   {/* Quantity with remaining indicator */}
//                   <td className='px-3 py-2'>
//                     <div>
//                       <input
//                         type='number'
//                         min='1'
//                         value={row.quantity}
//                         onChange={(e) =>
//                           onQuantityChange(index, e.target.value)
//                         }
//                         className='w-24 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-200'
//                       />
//                       {row.medicine_id && (
//                         <p className='text-xs text-gray-500 mt-1'>
//                           Remaining: {remaining >= 0 ? remaining : 0}
//                         </p>
//                       )}
//                       {errors.quantity && (
//                         <p className='text-xs text-red-600 mt-1'>
//                           {errors.quantity}
//                         </p>
//                       )}
//                     </div>
//                   </td>
//                   {/* Remove button */}
//                   <td className='px-3 py-2 text-right'>
//                     <button
//                       type='button'
//                       onClick={() => removeRow(index)}
//                       disabled={isLastRow}
//                       className={`text-red-600 hover:text-red-800 ${
//                         isLastRow ? 'opacity-50 cursor-not-allowed' : ''
//                       }`}
//                     >
//                       <FiTrash2 className='h-4 w-4' />
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
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

// src/pages/sales/Sale.jsx
import { useEffect, useState, useMemo } from 'react';
import { FiPlus } from 'react-icons/fi';
import api from '../../api';
import { Modal } from '../../components/Modal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { SearchInput } from '../../components/SearchInput';
import { TablePagination } from '../../components/TablePagination';
import { DeleteConfirmModal } from '../../components/DeleteConfirmModal';
import { SaleTable } from './components/SaleTable';
import { SaleDetail } from './components/SaleDetail';
import { SaleForm } from './components/SaleForm';

export default function Sale() {
  const [sales, setSales] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
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
  const [searchTerm, setSearchTerm] = useState('');

  // Form state (shared for create & edit)
  const [form, setForm] = useState({
    bill_no: '',
    patient_name: '',
    sale_date: new Date().toISOString().slice(0, 10),
    medicines: [
      {
        medicine_id: '',
        quantity: '',
        stock: 0,
        medicine: null,
      },
    ],
  });

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

  // Load sales with pagination
  useEffect(() => {
    fetchSales(currentPage);
  }, [currentPage]);

  // Load medicines for dropdown
  useEffect(() => {
    api.get('/medicines').then((res) => setMedicines(res.data));
  }, []);

  const fetchSales = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/sales?page=${page}`);
      setSales(res.data.data || res.data);
      setTotalPages(res.data.last_page || 1);
      setTotalItems(res.data.total || res.data.data?.length || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Form handlers
  const addRow = () => {
    setForm({
      ...form,
      medicines: [
        ...form.medicines,
        {
          medicine_id: '',
          quantity: '',
          stock: 0,
          medicine: null,
        },
      ],
    });
  };

  const removeRow = (index) => {
    const rows = [...form.medicines];
    rows.splice(index, 1);
    setForm({ ...form, medicines: rows });
  };

  const handleHeaderChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectMedicine = (index, medicineId) => {
    const medicine = medicines.find((m) => m.id == medicineId);
    const rows = [...form.medicines];
    rows[index].medicine_id = medicineId;
    rows[index].medicine = medicine;
    rows[index].stock = medicine ? medicine.quantity : 0;
    rows[index].quantity = ''; // reset quantity when medicine changes
    setForm({ ...form, medicines: rows });
  };

  const handleQuantityChange = (index, value) => {
    const rows = [...form.medicines];
    rows[index].quantity = value;
    setForm({ ...form, medicines: rows });
  };

  const resetForm = () => {
    setForm({
      bill_no: '',
      patient_name: '',
      sale_date: new Date().toISOString().slice(0, 10),
      medicines: [
        {
          medicine_id: '',
          quantity: '',
          stock: 0,
          medicine: null,
        },
      ],
    });
  };

  // Validation helper (used before submit)
  const validateForm = () => {
    const newRows = form.medicines.map((row) => {
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
    });

    // If any errors, we can either set some state to show them or just return false
    const hasErrors = newRows.some((e) => Object.keys(e).length > 0);
    return { isValid: !hasErrors, errors: newRows };
  };

  // Create
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const { isValid } = validateForm();
    if (!isValid) return;

    try {
      await api.post('/sales', form);
      setShowCreate(false);
      resetForm();
      fetchSales(currentPage);
    } catch (error) {
      alert(error.response?.data?.error || 'Error saving sale');
    }
  };

  // Edit
  const handleEditClick = async (id) => {
    try {
      const res = await api.get(`/sales/${id}`);
      const data = res.data;
      setEditId(id);
      setForm({
        bill_no: data.bill_no,
        patient_name: data.patient_name,
        sale_date: data.sale_date,
        medicines: data.details.map((d) => ({
          medicine_id: d.medicine.id,
          quantity: d.quantity,
          stock: d.medicine.quantity,
          medicine: d.medicine,
        })),
      });
      setShowEdit(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { isValid } = validateForm();
    if (!isValid) return;

    try {
      await api.put(`/sales/${editId}`, form);
      setShowEdit(false);
      resetForm();
      fetchSales(currentPage);
    } catch (error) {
      alert(error.response?.data?.error || 'Error updating sale');
    }
  };

  // Delete
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/sales/${deleteId}`);
      setShowDeleteConfirm(false);
      setDeleteId(null);
      fetchSales(currentPage);
    } catch (error) {
      alert('Delete failed');
    }
  };

  // Detail view
  const handleViewDetails = async (id) => {
    try {
      const res = await api.get(`/sales/${id}`);
      setSelectedSale(res.data);
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

  // Pagination handlers
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // Search filter
  const filteredSales = useMemo(() => {
    if (!searchTerm.trim()) return sales;
    const lowerSearch = searchTerm.toLowerCase();
    return sales.filter((sale) => {
      const searchable = [
        sale.id,
        sale.bill_no,
        sale.patient_name,
        sale.sale_date,
      ]
        .map((field) => String(field ?? '').toLowerCase())
        .join(' ');
      return searchable.includes(lowerSearch);
    });
  }, [sales, searchTerm]);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl font-semibold text-gray-800'>
          Sales Management
        </h1>
        <button
          onClick={() => setShowCreate(true)}
          className='mt-4 sm:mt-0 flex items-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
        >
          <FiPlus className='mr-2 h-5 w-5' />
          Add Sale
        </button>
      </div>

      {/* Search input */}
      <div className='sm:w-72'>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder='Search sales...'
        />
      </div>

      {/* Table Card */}
      <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
        {loading ? (
          <LoadingSpinner />
        ) : filteredSales.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>No sales found.</p>
          </div>
        ) : (
          <>
            <SaleTable
              sales={filteredSales}
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
        <Modal title='Create Sale' onClose={closeModals}>
          <SaleForm
            form={form}
            medicines={medicines}
            addRow={addRow}
            removeRow={removeRow}
            onHeaderChange={handleHeaderChange}
            onSelectMedicine={handleSelectMedicine}
            onQuantityChange={handleQuantityChange}
            onSubmit={handleCreateSubmit}
            submitLabel='Save Sale'
            onCancel={closeModals}
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <Modal title='Edit Sale' onClose={closeModals}>
          <SaleForm
            form={form}
            medicines={medicines}
            addRow={addRow}
            removeRow={removeRow}
            onHeaderChange={handleHeaderChange}
            onSelectMedicine={handleSelectMedicine}
            onQuantityChange={handleQuantityChange}
            onSubmit={handleEditSubmit}
            submitLabel='Update Sale'
            onCancel={closeModals}
          />
        </Modal>
      )}

      {/* Detail Modal */}
      {showDetail && selectedSale && (
        <Modal
          title={`Sale Details - Bill ${selectedSale.bill_no}`}
          onClose={closeModals}
        >
          <SaleDetail sale={selectedSale} />
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
        itemName={`sale #${deleteId}`}
      />
    </div>
  );
}
