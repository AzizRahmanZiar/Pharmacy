// // src/pages/items/ItemsPage.jsx
// import { useEffect, useState, useMemo } from 'react';
// import {
//   FiPlus,
//   FiEdit2,
//   FiTrash2,
//   FiX,
//   FiSearch,
//   FiChevronLeft,
//   FiChevronRight,
// } from 'react-icons/fi';
// import api from '../../api';

// export default function ItemsPage() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [perPage] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);

//   // Modal state
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState(null);

//   const [createForm, setCreateForm] = useState({
//     name: '',
//     generic_name: '',
//     company: '',
//     family: '',
//   });
//   const [editForm, setEditForm] = useState({
//     id: null,
//     name: '',
//     generic_name: '',
//     company: '',
//     family: '',
//   });

//   const loadItems = async (page = 1) => {
//     setLoading(true);
//     try {
//       const res = await api.get(`/items?page=${page}`);
//       const data = res.data.data || res.data;
//       setItems(data);
//       setTotalPages(res.data.last_page || 1);
//       setTotalItems(res.data.total || data.length);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadItems(currentPage);
//   }, [currentPage]);

//   // Client-side search on current page
//   const filteredItems = useMemo(() => {
//     if (!searchTerm.trim()) return items;
//     const lowerSearch = searchTerm.toLowerCase();
//     return items.filter((item) => {
//       const searchable = [
//         item.id,
//         item.name,
//         item.generic_name,
//         item.company,
//         item.family,
//       ]
//         .map((field) => String(field ?? '').toLowerCase())
//         .join(' ');
//       return searchable.includes(lowerSearch);
//     });
//   }, [items, searchTerm]);

//   const handleCreateChange = (e) => {
//     setCreateForm({ ...createForm, [e.target.name]: e.target.value });
//   };

//   const handleCreateSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post('/items', createForm);
//       setCreateForm({ name: '', generic_name: '', company: '', family: '' });
//       setIsCreateModalOpen(false);
//       loadItems(currentPage);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleEditClick = (item) => {
//     setEditForm({
//       id: item.id,
//       name: item.name,
//       generic_name: item.generic_name,
//       company: item.company,
//       family: item.family,
//     });
//     setIsEditModalOpen(true);
//   };

//   const handleEditChange = (e) => {
//     setEditForm({ ...editForm, [e.target.name]: e.target.value });
//   };

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.put(`/items/${editForm.id}`, editForm);
//       setEditForm({
//         id: null,
//         name: '',
//         generic_name: '',
//         company: '',
//         family: '',
//       });
//       setIsEditModalOpen(false);
//       loadItems(currentPage);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // Delete handlers with modal
//   const openDeleteModal = (item) => {
//     setItemToDelete(item);
//     setShowDeleteConfirm(true);
//   };

//   const closeModals = () => {
//     setShowDeleteConfirm(false);
//     setItemToDelete(null);
//   };

//   const confirmDelete = async () => {
//     if (!itemToDelete) return;
//     try {
//       await api.delete(`/items/${itemToDelete.id}`);
//       closeModals();
//       if (items.length === 1 && currentPage > 1) {
//         setCurrentPage((prev) => prev - 1);
//       } else {
//         loadItems(currentPage);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const closeCreateModal = () => {
//     setIsCreateModalOpen(false);
//     setCreateForm({ name: '', generic_name: '', company: '', family: '' });
//   };

//   const closeEditModal = () => {
//     setIsEditModalOpen(false);
//     setEditForm({
//       id: null,
//       name: '',
//       generic_name: '',
//       company: '',
//       family: '',
//     });
//   };

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
//       {/* Page Header */}
//       <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
//         <h1 className='text-2xl font-semibold text-gray-800'>Medicine Items</h1>
//         <div className='mt-4 sm:mt-0 flex items-center space-x-3'>
//           <span className='rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700'>
//             {totalItems} total
//           </span>
//           <button
//             onClick={() => setIsCreateModalOpen(true)}
//             className='flex items-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
//           >
//             <FiPlus className='mr-2 h-5 w-5' />
//             New Item
//           </button>
//         </div>
//       </div>

//       {/* Search input */}
//       <div className='sm:w-72'>
//         <div className='relative'>
//           <input
//             type='text'
//             placeholder='Search items...'
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className='w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
//           />
//           <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
//         </div>
//       </div>

//       {/* Items Table Card */}
//       <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
//         {loading ? (
//           <LoadingSpinner />
//         ) : filteredItems.length === 0 ? (
//           <div className='text-center py-12'>
//             <p className='text-gray-500 text-lg'>No items found.</p>
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
//                       Name
//                     </th>
//                     <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                       Generic
//                     </th>
//                     <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                       Company
//                     </th>
//                     <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
//                       Family
//                     </th>
//                     <th className='px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className='divide-y divide-gray-200 bg-white'>
//                   {filteredItems.map((item, index) => (
//                     <tr key={item.id} className='hover:bg-gray-50'>
//                       <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-600'>
//                         {(currentPage - 1) * perPage + index + 1}
//                       </td>
//                       <td className='whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-800'>
//                         {item.name}
//                       </td>
//                       <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-600'>
//                         {item.generic_name || '—'}
//                       </td>
//                       <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-600'>
//                         {item.company || '—'}
//                       </td>
//                       <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-600'>
//                         {item.family || '—'}
//                       </td>
//                       <td className='whitespace-nowrap px-4 py-3 text-right text-sm'>
//                         <button
//                           onClick={() => handleEditClick(item)}
//                           className='mr-2 rounded-lg bg-indigo-50 p-2 text-indigo-700 transition hover:bg-indigo-100'
//                           aria-label='Edit item'
//                         >
//                           <FiEdit2 className='h-4 w-4' />
//                         </button>
//                         <button
//                           onClick={() => openDeleteModal(item)}
//                           className='rounded-lg bg-red-50 p-2 text-red-700 transition hover:bg-red-100'
//                           aria-label='Delete item'
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
//       {isCreateModalOpen && (
//         <Modal onClose={closeCreateModal} title='Add New Medicine'>
//           <form onSubmit={handleCreateSubmit} className='space-y-4'>
//             <input
//               type='text'
//               name='name'
//               placeholder='Medicine Name *'
//               value={createForm.name}
//               onChange={handleCreateChange}
//               className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
//               required
//             />
//             <input
//               type='text'
//               name='generic_name'
//               placeholder='Generic Name'
//               value={createForm.generic_name}
//               onChange={handleCreateChange}
//               className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
//             />
//             <input
//               type='text'
//               name='company'
//               placeholder='Company'
//               value={createForm.company}
//               onChange={handleCreateChange}
//               className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
//             />
//             <input
//               type='text'
//               name='family'
//               placeholder='Family'
//               value={createForm.family}
//               onChange={handleCreateChange}
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
//                 Add Item
//               </button>
//             </div>
//           </form>
//         </Modal>
//       )}

//       {/* Edit Modal */}
//       {isEditModalOpen && (
//         <Modal onClose={closeEditModal} title='Edit Medicine'>
//           <form onSubmit={handleEditSubmit} className='space-y-4'>
//             <input
//               type='text'
//               name='name'
//               placeholder='Medicine Name *'
//               value={editForm.name}
//               onChange={handleEditChange}
//               className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
//               required
//             />
//             <input
//               type='text'
//               name='generic_name'
//               placeholder='Generic Name'
//               value={editForm.generic_name}
//               onChange={handleEditChange}
//               className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
//             />
//             <input
//               type='text'
//               name='company'
//               placeholder='Company'
//               value={editForm.company}
//               onChange={handleEditChange}
//               className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
//             />
//             <input
//               type='text'
//               name='family'
//               placeholder='Family'
//               value={editForm.family}
//               onChange={handleEditChange}
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
//                 Update Item
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
//               Are you sure you want to delete this item? This action cannot be
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

// // Modal Component (unchanged)
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

// src/pages/items/ItemsPage.jsx
import { useEffect, useState, useMemo } from 'react';
import { FiPlus } from 'react-icons/fi';
import api from '../../api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { SearchInput } from '../../components/SearchInput';
import { ItemsTable } from '../../components/ItemsTable';
import { TablePagination } from '../../components/TablePagination';
import { ItemFormModal } from '../../components/ItemFormModal';
import { DeleteConfirmModal } from '../../components/DeleteConfirmModal';

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Forms
  const [createForm, setCreateForm] = useState({
    name: '',
    generic_name: '',
    company: '',
    family: '',
  });
  const [editForm, setEditForm] = useState({
    id: null,
    name: '',
    generic_name: '',
    company: '',
    family: '',
  });

  // Load items
  const loadItems = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/items?page=${page}`);
      const data = res.data.data || res.data;
      setItems(data);
      setTotalPages(res.data.last_page || 1);
      setTotalItems(res.data.total || data.length);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems(currentPage);
  }, [currentPage]);

  // Search filter
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    const lowerSearch = searchTerm.toLowerCase();
    return items.filter((item) => {
      const searchable = [
        item.id,
        item.name,
        item.generic_name,
        item.company,
        item.family,
      ]
        .map((field) => String(field ?? '').toLowerCase())
        .join(' ');
      return searchable.includes(lowerSearch);
    });
  }, [items, searchTerm]);

  // Create handlers
  const handleCreateChange = (e) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/items', createForm);
      setCreateForm({ name: '', generic_name: '', company: '', family: '' });
      setIsCreateModalOpen(false);
      loadItems(currentPage);
    } catch (error) {
      console.error(error);
    }
  };

  // Edit handlers
  const handleEditClick = (item) => {
    setEditForm({
      id: item.id,
      name: item.name,
      generic_name: item.generic_name,
      company: item.company,
      family: item.family,
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/items/${editForm.id}`, editForm);
      setEditForm({
        id: null,
        name: '',
        generic_name: '',
        company: '',
        family: '',
      });
      setIsEditModalOpen(false);
      loadItems(currentPage);
    } catch (error) {
      console.error(error);
    }
  };

  // Delete handlers
  const openDeleteModal = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await api.delete(`/items/${itemToDelete.id}`);
      closeDeleteModal();
      if (items.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        loadItems(currentPage);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Pagination handlers
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
        <h1 className='text-2xl font-semibold text-gray-800'>Medicine Items</h1>
        <div className='mt-4 sm:mt-0 flex items-center space-x-3'>
          <span className='rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700'>
            {totalItems} total
          </span>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className='flex items-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
          >
            <FiPlus className='mr-2 h-5 w-5' />
            New Item
          </button>
        </div>
      </div>

      {/* Search */}
      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder='Search items...'
      />

      {/* Table Card */}
      <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
        {loading ? (
          <LoadingSpinner />
        ) : filteredItems.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>No items found.</p>
          </div>
        ) : (
          <>
            <ItemsTable
              items={filteredItems}
              currentPage={currentPage}
              perPage={perPage}
              onEdit={handleEditClick}
              onDelete={openDeleteModal}
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
      <ItemFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        formData={createForm}
        onChange={handleCreateChange}
        title='Add New Medicine'
        submitLabel='Add Item'
      />

      {/* Edit Modal */}
      <ItemFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        formData={editForm}
        onChange={handleEditChange}
        title='Edit Medicine'
        submitLabel='Update Item'
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.name}
      />
    </div>
  );
}
