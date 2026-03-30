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
