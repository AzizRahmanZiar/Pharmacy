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
