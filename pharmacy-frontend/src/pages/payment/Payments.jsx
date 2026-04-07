import { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import api from '../../api';
import { Modal } from '../../components/Modal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { SearchInput } from '../../components/SearchInput';
import { TablePagination } from '../../components/TablePagination';
import { PaymentForm } from './components/PaymentForm';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const itemsPerPage = 3;

  useEffect(() => {
    fetchSuppliers();
    fetchPayments();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/suppliers');
      setSuppliers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/payments');
      setPayments(res.data.data || []);
      setTotalPages(Math.ceil((res.data.data?.length || 0) / itemsPerPage));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    if (!searchTerm) return true;
    const lower = searchTerm.toLowerCase();
    return (
      p.supplier?.name.toLowerCase().includes(lower) ||
      p.note?.toLowerCase().includes(lower) ||
      p.amount.toString().includes(lower)
    );
  });

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalFilteredPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    if (currentPage < totalFilteredPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl font-semibold text-gray-800'>
          Payments to Suppliers
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className='mt-4 sm:mt-0 flex items-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-white shadow-md'
        >
          <FiPlus className='mr-2 h-5 w-5' />
          New Payment
        </button>
      </div>

      <div className='flex justify-end'>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder='Search payments...'
        />
      </div>

      <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
        {loading ? (
          <LoadingSpinner />
        ) : paginatedPayments.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>No payments found.</p>
          </div>
        ) : (
          <>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                    Supplier
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                    Amount
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                    Date
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                    Note
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 bg-white'>
                {paginatedPayments.map((p) => (
                  <tr key={p.id} className='hover:bg-gray-50'>
                    <td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900'>
                      {p.supplier?.name}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-600'>
                      ${Number(p.amount).toFixed(2)}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-600'>
                      {p.payment_date}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                      {p.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <TablePagination
              currentPage={currentPage}
              totalPages={totalFilteredPages}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          </>
        )}
      </div>

      {showForm && (
        <Modal title='Record Payment' onClose={() => setShowForm(false)}>
          <PaymentForm
            suppliers={suppliers}
            onSuccess={() => {
              setShowForm(false);
              fetchPayments();
            }}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      )}
    </div>
  );
}
