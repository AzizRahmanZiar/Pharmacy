import { useEffect, useState, useMemo } from 'react';
import { FiPlus } from 'react-icons/fi';
import api from '../../api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { SearchInput } from '../../components/SearchInput';
import { ItemsTable } from '../../components/ItemsTable';
import { TablePagination } from '../../components/TablePagination';
import { ItemForm } from './components/ItemForm';
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
      <ItemForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        formData={createForm}
        onChange={handleCreateChange}
        title='Add New Medicine'
        submitLabel='Add Item'
      />

      {/* Edit Modal */}
      <ItemForm
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
