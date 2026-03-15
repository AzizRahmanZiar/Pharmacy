// // src/pages/ExpensesPage.jsx
// import { useEffect, useState, useMemo } from 'react';
// import {
//   FiPlus,
//   FiEdit2,
//   FiTrash2,
//   FiX,
//   FiSearch,
//   FiChevronLeft,
//   FiChevronRight,
//   FiDollarSign,
//   FiCalendar,
//   FiFileText,
// } from 'react-icons/fi';
// import api from '../../api';

// export default function ExpensesPage() {
//   const [expenses, setExpenses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [perPage] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalExpenses, setTotalExpenses] = useState(0);

//   // Modal state
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [expenseToDelete, setExpenseToDelete] = useState(null);

//   const [createForm, setCreateForm] = useState({
//     title: '',
//     amount: '',
//     expense_date: '',
//     note: '',
//   });
//   const [editForm, setEditForm] = useState({
//     id: null,
//     title: '',
//     amount: '',
//     expense_date: '',
//     note: '',
//   });

//   // Load expenses with pagination
//   const loadExpenses = async (page = 1) => {
//     setLoading(true);
//     try {
//       const res = await api.get(`/expenses?page=${page}&per_page=${perPage}`);
//       const data = res.data.data || res.data;
//       setExpenses(data);
//       setTotalPages(res.data.last_page || 1);
//       setTotalExpenses(res.data.total || data.length);
//     } catch (error) {
//       console.error('Failed to load expenses', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadExpenses(currentPage);
//   }, [currentPage]);

//   // Client-side search on current page
//   const filteredExpenses = useMemo(() => {
//     if (!searchTerm.trim()) return expenses;
//     const lowerSearch = searchTerm.toLowerCase();
//     return expenses.filter((exp) => {
//       const searchable = [
//         exp.id,
//         exp.title,
//         exp.amount,
//         exp.expense_date,
//         exp.note,
//       ]
//         .map((field) => String(field ?? '').toLowerCase())
//         .join(' ');
//       return searchable.includes(lowerSearch);
//     });
//   }, [expenses, searchTerm]);

//   // Format currency
//   const formatCurrency = (amount) => {
//     if (!amount) return '—';
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 2,
//     }).format(amount);
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return '—';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     });
//   };

//   // Handlers for create modal
//   const handleCreateChange = (e) => {
//     setCreateForm({ ...createForm, [e.target.name]: e.target.value });
//   };

//   const handleCreateSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post('/expenses', createForm);
//       setCreateForm({ title: '', amount: '', expense_date: '', note: '' });
//       setIsCreateModalOpen(false);
//       loadExpenses(currentPage);
//     } catch (error) {
//       console.error('Create failed', error);
//     }
//   };

//   const closeCreateModal = () => {
//     setIsCreateModalOpen(false);
//     setCreateForm({ title: '', amount: '', expense_date: '', note: '' });
//   };

//   // Handlers for edit modal
//   const handleEditClick = (expense) => {
//     setEditForm({
//       id: expense.id,
//       title: expense.title,
//       amount: expense.amount,
//       expense_date: expense.expense_date,
//       note: expense.note || '',
//     });
//     setIsEditModalOpen(true);
//   };

//   const handleEditChange = (e) => {
//     setEditForm({ ...editForm, [e.target.name]: e.target.value });
//   };

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.put(`/expenses/${editForm.id}`, editForm);
//       setEditForm({
//         id: null,
//         title: '',
//         amount: '',
//         expense_date: '',
//         note: '',
//       });
//       setIsEditModalOpen(false);
//       loadExpenses(currentPage);
//     } catch (error) {
//       console.error('Update failed', error);
//     }
//   };

//   const closeEditModal = () => {
//     setIsEditModalOpen(false);
//     setEditForm({
//       id: null,
//       title: '',
//       amount: '',
//       expense_date: '',
//       note: '',
//     });
//   };

//   // Delete handlers with modal
//   const openDeleteModal = (expense) => {
//     setExpenseToDelete(expense);
//     setShowDeleteConfirm(true);
//   };

//   const closeModals = () => {
//     setShowDeleteConfirm(false);
//     setExpenseToDelete(null);
//   };

//   const confirmDelete = async () => {
//     if (!expenseToDelete) return;
//     try {
//       await api.delete(`/expenses/${expenseToDelete.id}`);
//       closeModals();
//       if (expenses.length === 1 && currentPage > 1) {
//         setCurrentPage((prev) => prev - 1);
//       } else {
//         loadExpenses(currentPage);
//       }
//     } catch (error) {
//       console.error('Delete failed', error);
//     }
//   };

//   // Pagination controls
//   const handlePrev = () => {
//     if (currentPage > 1) setCurrentPage((prev) => prev - 1);
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
//   };

//   // Loading spinner
//   const LoadingSpinner = () => (
//     <div className='flex justify-center items-center py-12'>
//       <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600' />
//     </div>
//   );

//   return (
//     <div className='space-y-6'>
//       {/* Header */}
//       <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
//         <h1 className='text-2xl font-semibold text-gray-800'>Expenses</h1>
//         <div className='mt-4 sm:mt-0 flex items-center space-x-3'>
//           <span className='rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700'>
//             {totalExpenses} total
//           </span>
//           <button
//             onClick={() => setIsCreateModalOpen(true)}
//             className='flex items-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
//           >
//             <FiPlus className='mr-2 h-5 w-5' />
//             New Expense
//           </button>
//         </div>
//       </div>

//       {/* Search */}
//       <div className='sm:w-72'>
//         <div className='relative'>
//           <input
//             type='text'
//             placeholder='Search expenses...'
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
//         ) : filteredExpenses.length === 0 ? (
//           <div className='text-center py-12'>
//             <p className='text-gray-500 text-lg'>No expenses found.</p>
//           </div>
//         ) : (
//           <>
//             <div className='overflow-x-auto'>
//               <table className='w-full min-w-full divide-y divide-gray-200'>
//                 <thead className='bg-gray-50'>
//                   <tr>
//                     <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                       #
//                     </th>
//                     <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                       Title
//                     </th>
//                     <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                       Amount
//                     </th>
//                     <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                       Date
//                     </th>
//                     <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                       Note
//                     </th>
//                     <th className='px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className='divide-y divide-gray-200 bg-white'>
//                   {filteredExpenses.map((expense, index) => (
//                     <tr key={expense.id} className='hover:bg-gray-50'>
//                       <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-600'>
//                         {(currentPage - 1) * perPage + index + 1}
//                       </td>
//                       <td className='whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-800'>
//                         {expense.title}
//                       </td>
//                       <td className='whitespace-nowrap px-4 py-3 text-sm text-red-600 font-semibold'>
//                         {formatCurrency(expense.amount)}
//                       </td>
//                       <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-600'>
//                         {formatDate(expense.expense_date)}
//                       </td>
//                       <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-600'>
//                         {expense.note || '—'}
//                       </td>
//                       <td className='whitespace-nowrap px-4 py-3 text-right text-sm'>
//                         <button
//                           onClick={() => handleEditClick(expense)}
//                           className='mr-2 rounded-lg bg-indigo-50 p-2 text-indigo-700 transition hover:bg-indigo-100'
//                           aria-label='Edit expense'
//                         >
//                           <FiEdit2 className='h-4 w-4' />
//                         </button>
//                         <button
//                           onClick={() => openDeleteModal(expense)}
//                           className='rounded-lg bg-red-50 p-2 text-red-700 transition hover:bg-red-100'
//                           aria-label='Delete expense'
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
//       {isCreateModalOpen && (
//         <Modal onClose={closeCreateModal} title='Add New Expense'>
//           <form onSubmit={handleCreateSubmit} className='space-y-4'>
//             <div className='relative'>
//               <FiFileText className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
//               <input
//                 type='text'
//                 name='title'
//                 placeholder='Title *'
//                 value={createForm.title}
//                 onChange={handleCreateChange}
//                 className='w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
//                 required
//               />
//             </div>
//             <div className='relative'>
//               <FiDollarSign className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
//               <input
//                 type='number'
//                 name='amount'
//                 placeholder='Amount *'
//                 value={createForm.amount}
//                 onChange={handleCreateChange}
//                 min='0'
//                 step='0.01'
//                 className='w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
//                 required
//               />
//             </div>
//             <div className='relative'>
//               <FiCalendar className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
//               <input
//                 type='date'
//                 name='expense_date'
//                 value={createForm.expense_date}
//                 onChange={handleCreateChange}
//                 className='w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
//                 required
//               />
//             </div>
//             <textarea
//               name='note'
//               placeholder='Note (optional)'
//               value={createForm.note}
//               onChange={handleCreateChange}
//               rows='3'
//               className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
//             />
//             <div className='flex justify-end space-x-2 pt-4'>
//               <button
//                 type='button'
//                 onClick={closeCreateModal}
//                 className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:bg-gray-50'
//               >
//                 Cancel
//               </button>
//               <button
//                 type='submit'
//                 className='rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
//               >
//                 Add Expense
//               </button>
//             </div>
//           </form>
//         </Modal>
//       )}

//       {/* Edit Modal */}
//       {isEditModalOpen && (
//         <Modal onClose={closeEditModal} title='Edit Expense'>
//           <form onSubmit={handleEditSubmit} className='space-y-4'>
//             <div className='relative'>
//               <FiFileText className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
//               <input
//                 type='text'
//                 name='title'
//                 placeholder='Title *'
//                 value={editForm.title}
//                 onChange={handleEditChange}
//                 className='w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
//                 required
//               />
//             </div>
//             <div className='relative'>
//               <FiDollarSign className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
//               <input
//                 type='number'
//                 name='amount'
//                 placeholder='Amount *'
//                 value={editForm.amount}
//                 onChange={handleEditChange}
//                 min='0'
//                 step='0.01'
//                 className='w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
//                 required
//               />
//             </div>
//             <div className='relative'>
//               <FiCalendar className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
//               <input
//                 type='date'
//                 name='expense_date'
//                 value={editForm.expense_date}
//                 onChange={handleEditChange}
//                 className='w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
//                 required
//               />
//             </div>
//             <textarea
//               name='note'
//               placeholder='Note (optional)'
//               value={editForm.note}
//               onChange={handleEditChange}
//               rows='3'
//               className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
//             />
//             <div className='flex justify-end space-x-2 pt-4'>
//               <button
//                 type='button'
//                 onClick={closeEditModal}
//                 className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:bg-gray-50'
//               >
//                 Cancel
//               </button>
//               <button
//                 type='submit'
//                 className='rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
//               >
//                 Update Expense
//               </button>
//             </div>
//           </form>
//         </Modal>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteConfirm && (
//         <Modal title='Confirm Delete' onClose={closeModals}>
//           <div className='py-4'>
//             <p className='text-gray-700'>
//               Are you sure you want to delete this expense? This action cannot
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

// // Modal Component (reused)
// function Modal({ onClose, title, children }) {
//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.key === 'Escape') onClose();
//     };
//     window.addEventListener('keydown', handleEsc);
//     return () => window.removeEventListener('keydown', handleEsc);
//   }, [onClose]);

//   return (
//     <div
//       className='fixed inset-0 z-50 flex items-center justify-center bg-black/0 backdrop-blur-sm'
//       onClick={onClose}
//     >
//       <div
//         className='w-full max-w-md rounded-2xl bg-white shadow-2xl'
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
//         <div className='px-6 py-4'>{children}</div>
//       </div>
//     </div>
//   );
// }

// src/pages/expenses/ExpensesPage.jsx
import { useEffect, useState, useMemo } from 'react';
import { FiPlus } from 'react-icons/fi';
import api from '../../api';
import { Modal } from '../../components/Modal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { SearchInput } from '../../components/SearchInput';
import { TablePagination } from '../../components/TablePagination';
import { DeleteConfirmModal } from '../../components/DeleteConfirmModal';
import { ExpensesTable } from './components/ExpensesTable';
import { ExpenseForm } from './components/ExpenseForm';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalExpenses, setTotalExpenses] = useState(0);

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const [createForm, setCreateForm] = useState({
    title: '',
    amount: '',
    expense_date: '',
    note: '',
  });
  const [editForm, setEditForm] = useState({
    id: null,
    title: '',
    amount: '',
    expense_date: '',
    note: '',
  });

  // Load expenses with pagination
  const loadExpenses = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/expenses?page=${page}&per_page=${perPage}`);
      const data = res.data.data || res.data;
      setExpenses(data);
      setTotalPages(res.data.last_page || 1);
      setTotalExpenses(res.data.total || data.length);
    } catch (error) {
      console.error('Failed to load expenses', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses(currentPage);
  }, [currentPage]);

  // Client-side search on current page
  const filteredExpenses = useMemo(() => {
    if (!searchTerm.trim()) return expenses;
    const lowerSearch = searchTerm.toLowerCase();
    return expenses.filter((exp) => {
      const searchable = [
        exp.id,
        exp.title,
        exp.amount,
        exp.expense_date,
        exp.note,
      ]
        .map((field) => String(field ?? '').toLowerCase())
        .join(' ');
      return searchable.includes(lowerSearch);
    });
  }, [expenses, searchTerm]);

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handlers for create modal
  const handleCreateChange = (e) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expenses', createForm);
      setCreateForm({ title: '', amount: '', expense_date: '', note: '' });
      setIsCreateModalOpen(false);
      loadExpenses(currentPage);
    } catch (error) {
      console.error('Create failed', error);
    }
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateForm({ title: '', amount: '', expense_date: '', note: '' });
  };

  // Handlers for edit modal
  const handleEditClick = (expense) => {
    setEditForm({
      id: expense.id,
      title: expense.title,
      amount: expense.amount,
      expense_date: expense.expense_date,
      note: expense.note || '',
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/expenses/${editForm.id}`, editForm);
      setEditForm({
        id: null,
        title: '',
        amount: '',
        expense_date: '',
        note: '',
      });
      setIsEditModalOpen(false);
      loadExpenses(currentPage);
    } catch (error) {
      console.error('Update failed', error);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditForm({
      id: null,
      title: '',
      amount: '',
      expense_date: '',
      note: '',
    });
  };

  // Delete handlers with modal
  const openDeleteModal = (expense) => {
    setExpenseToDelete(expense);
    setShowDeleteConfirm(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteConfirm(false);
    setExpenseToDelete(null);
  };

  const confirmDelete = async () => {
    if (!expenseToDelete) return;
    try {
      await api.delete(`/expenses/${expenseToDelete.id}`);
      closeDeleteModal();
      if (expenses.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        loadExpenses(currentPage);
      }
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  // Pagination controls
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
        <h1 className='text-2xl font-semibold text-gray-800'>Expenses</h1>
        <div className='mt-4 sm:mt-0 flex items-center space-x-3'>
          <span className='rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700'>
            {totalExpenses} total
          </span>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className='flex items-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
          >
            <FiPlus className='mr-2 h-5 w-5' />
            New Expense
          </button>
        </div>
      </div>

      {/* Search */}
      <div className='sm:w-72'>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder='Search expenses...'
        />
      </div>

      {/* Table Card */}
      <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
        {loading ? (
          <LoadingSpinner />
        ) : filteredExpenses.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>No expenses found.</p>
          </div>
        ) : (
          <>
            <ExpensesTable
              expenses={filteredExpenses}
              currentPage={currentPage}
              perPage={perPage}
              onEdit={handleEditClick}
              onDelete={openDeleteModal}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
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
      {isCreateModalOpen && (
        <Modal onClose={closeCreateModal} title='Add New Expense'>
          <ExpenseForm
            form={createForm}
            onChange={handleCreateChange}
            onSubmit={handleCreateSubmit}
            onCancel={closeCreateModal}
            submitLabel='Add Expense'
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <Modal onClose={closeEditModal} title='Edit Expense'>
          <ExpenseForm
            form={editForm}
            onChange={handleEditChange}
            onSubmit={handleEditSubmit}
            onCancel={closeEditModal}
            submitLabel='Update Expense'
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName={`expense "${expenseToDelete?.title}"`}
      />
    </div>
  );
}
