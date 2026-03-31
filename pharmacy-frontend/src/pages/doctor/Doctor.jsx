/* eslint-disable no-unused-vars */
import { useEffect, useState, useMemo } from 'react';
import { FiPlus } from 'react-icons/fi';
import api from '../../api';
import { Modal } from '../../components/Modal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { SearchInput } from '../../components/SearchInput';
import { TablePagination } from '../../components/TablePagination';
import { DeleteConfirmModal } from '../../components/DeleteConfirmModal';
import { DoctorTable } from './components/DoctorTable';
import { DoctorForm } from './components/DoctorForm';

export default function Doctor() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);

  // Pagination
  const [perPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  // Form state for create/edit
  const [formData, setFormData] = useState({
    fees: '',
    description: '',
  });
  const [extraFees, setExtraFees] = useState([]); // { type, amount }

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (showCreate || showEdit || showDeleteConfirm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showCreate, showEdit, showDeleteConfirm]);

  // Load data when page changes
  useEffect(() => {
    fetchDoctors(currentPage);
  }, [currentPage]);

  const fetchDoctors = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/doctors?page=${page}`);
      setDoctors(res.data.data || res.data);
      setTotalPages(res.data.last_page || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Reset form (used before opening modal)
  const resetForm = () => {
    setFormData({ fees: '', description: '' });
    setExtraFees([]);
  };

  // Open create modal
  const handleCreateClick = () => {
    resetForm();
    setShowCreate(true);
  };

  // Open edit modal
  const handleEditClick = async (id) => {
    try {
      const res = await api.get(`/doctors/${id}`);
      const data = res.data;
      setEditId(id);
      setFormData({
        fees: data.fees,
        description: data.description || '',
      });
      // Build extraFees array from existing data
      const extra = [];
      if (data.sonography_fee && data.sonography_fee > 0) {
        extra.push({ type: 'sonography', amount: data.sonography_fee });
      }
      if (data.ecg_fee && data.ecg_fee > 0) {
        extra.push({ type: 'ecg', amount: data.ecg_fee });
      }
      if (data.xray_fee && data.xray_fee > 0) {
        extra.push({ type: 'xray', amount: data.xray_fee });
      }
      setExtraFees(extra);
      setShowEdit(true);
    } catch (error) {
      console.error(error);
    }
  };

  // Create submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        fees: formData.fees,
        description: formData.description,
        sonography_fee: 0,
        ecg_fee: 0,
        xray_fee: 0,
      };
      extraFees.forEach((fee) => {
        if (fee.type === 'sonography') payload.sonography_fee = fee.amount || 0;
        if (fee.type === 'ecg') payload.ecg_fee = fee.amount || 0;
        if (fee.type === 'xray') payload.xray_fee = fee.amount || 0;
      });
      await api.post('/doctors', payload);
      setShowCreate(false);
      fetchDoctors(currentPage);
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving doctor fees');
    }
  };

  // Edit submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        fees: formData.fees,
        description: formData.description,
        sonography_fee: 0,
        ecg_fee: 0,
        xray_fee: 0,
      };
      extraFees.forEach((fee) => {
        if (fee.type === 'sonography') payload.sonography_fee = fee.amount || 0;
        if (fee.type === 'ecg') payload.ecg_fee = fee.amount || 0;
        if (fee.type === 'xray') payload.xray_fee = fee.amount || 0;
      });
      await api.put(`/doctors/${editId}`, payload);
      setShowEdit(false);
      fetchDoctors(currentPage);
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating doctor fees');
    }
  };

  // Delete
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/doctors/${deleteId}`);
      setShowDeleteConfirm(false);
      setDeleteId(null);
      fetchDoctors(currentPage);
    } catch (error) {
      alert('Delete failed');
    }
  };

  // Close modals
  const closeModals = () => {
    setShowCreate(false);
    setShowEdit(false);
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

  // Search filter (local)
  const filteredDoctors = useMemo(() => {
    if (!searchTerm.trim()) return doctors;
    const lowerSearch = searchTerm.toLowerCase();
    return doctors.filter((doc) => {
      const searchable = [
        doc.id,
        doc.fees,
        doc.sonography_fee,
        doc.ecg_fee,
        doc.xray_fee,
        doc.description,
      ]
        .map((field) => String(field ?? '').toLowerCase())
        .join(' ');
      return searchable.includes(lowerSearch);
    });
  }, [doctors, searchTerm]);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl font-semibold text-gray-800'>Doctor fees</h1>
        <button
          onClick={handleCreateClick}
          className='mt-4 sm:mt-0 flex items-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
        >
          <FiPlus className='mr-2 h-5 w-5' />
          Add Doctor Fees
        </button>
      </div>

      {/* Search */}
      <div className='flex justify-end'>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder='Search by fees or description...'
        />
      </div>

      {/* Table Card */}
      <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
        {loading ? (
          <LoadingSpinner />
        ) : filteredDoctors.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>No doctors found.</p>
          </div>
        ) : (
          <>
            <DoctorTable
              doctors={filteredDoctors}
              currentPage={currentPage}
              perPage={perPage}
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
        <Modal title='Add Doctor Fees' onClose={closeModals} size='max-w-3xl'>
          <DoctorForm
            formData={formData}
            setFormData={setFormData}
            extraFees={extraFees}
            setExtraFees={setExtraFees}
            onSubmit={handleCreateSubmit}
            submitLabel='Save Doctor Fees'
            onCancel={closeModals}
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <Modal title='Edit Doctor Fees' onClose={closeModals} size='max-w-3xl'>
          <DoctorForm
            formData={formData}
            setFormData={setFormData}
            extraFees={extraFees}
            setExtraFees={setExtraFees}
            onSubmit={handleEditSubmit}
            submitLabel='Update Doctor Fees'
            onCancel={closeModals}
          />
        </Modal>
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={closeModals}
        onConfirm={confirmDelete}
        itemName={`doctor fees #${deleteId}`}
      />
    </div>
  );
}
