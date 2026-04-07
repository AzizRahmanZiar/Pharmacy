import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export default function SupplierLedger() {
  const { id } = useParams();
  const navigate = useNavigate();
  const supplierId = parseInt(id, 10);

  const [supplier, setSupplier] = useState(null);
  const [balance, setBalance] = useState(0);
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;

  useEffect(() => {
    if (isNaN(supplierId)) {
      setError('Invalid supplier ID');
      setLoading(false);
      return;
    }
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [supplierRes, balanceRes, ledgerRes] = await Promise.all([
        api.get(`/suppliers/${supplierId}`),
        api.get(`/suppliers/${supplierId}/balance`),
        api.get(`/suppliers/${supplierId}/ledger`),
      ]);

      setSupplier(supplierRes.data);
      setBalance(balanceRes.data.balance ?? 0);

      let ledgersData = ledgerRes.data;
      if (ledgersData?.data && Array.isArray(ledgersData.data)) {
        ledgersData = ledgersData.data;
      }
      setLedgers(Array.isArray(ledgersData) ? ledgersData : []);
      setCurrentPage(1); // Reset to first page when new data loads
    } catch (err) {
      console.error('Ledger fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load ledger data');
    } finally {
      setLoading(false);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(ledgers.length / itemsPerPage);
  const paginatedLedgers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return ledgers.slice(start, start + itemsPerPage);
  }, [ledgers, currentPage]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className='text-center py-12'>
        <div className='text-red-600 mb-4'>{error}</div>
        <button
          onClick={() => navigate('/suppliers')}
          className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
        >
          Back to Suppliers
        </button>
      </div>
    );
  if (!supplier)
    return <div className='text-center py-12'>Supplier not found</div>;

  return (
    <div className='space-y-6 p-6'>
      {/* Back button */}
      <button
        onClick={() => navigate('/suppliers')}
        className='text-blue-600 hover:underline flex items-center gap-1'
      >
        ← Back to Suppliers
      </button>

      {/* Supplier Info Card */}
      <div className='bg-white p-6 rounded-lg shadow'>
        <h2 className='text-2xl font-bold text-gray-800'>{supplier.name}</h2>
        <p className='text-gray-600 mt-1'>
          {supplier.phone && `📞 ${supplier.phone}`}
          {supplier.address && ` | 📍 ${supplier.address}`}
        </p>
        <p className='mt-4 text-lg'>
          Current Balance:
          <span
            className={`ml-2 font-bold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}
          >
            ${Number(balance).toFixed(2)}
          </span>
        </p>
      </div>

      {/* Ledger Table */}
      <div className='bg-white rounded-lg shadow overflow-hidden'>
        <h3 className='text-lg font-semibold p-4 border-b bg-gray-50'>
          Ledger History
        </h3>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Date
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Type
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Amount
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white'>
              {paginatedLedgers.map((ledger) => (
                <tr key={ledger.id} className='hover:bg-gray-50'>
                  <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-600'>
                    {ledger.transaction_date
                      ? new Date(ledger.transaction_date).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className='whitespace-nowrap px-6 py-4 text-sm capitalize'>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        ledger.type === 'purchase'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {ledger.type}
                    </span>
                  </td>
                  <td
                    className={`whitespace-nowrap px-6 py-4 text-right text-sm font-medium ${
                      ledger.type === 'purchase'
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}
                  >
                    {ledger.type === 'purchase' ? '+' : '-'}$
                    {Number(ledger.amount).toFixed(2)}
                  </td>
                  <td className='whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-gray-900'>
                    ${Number(ledger.balance).toFixed(2)}
                  </td>
                </tr>
              ))}
              {paginatedLedgers.length === 0 && (
                <tr>
                  <td colSpan='4' className='text-center py-8 text-gray-500'>
                    No ledger entries found for this supplier.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className='flex items-center justify-between px-6 py-3 bg-gray-50 border-t'>
            <div className='text-sm text-gray-700'>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, ledgers.length)} of{' '}
              {ledgers.length} entries
            </div>
            <div className='flex gap-2'>
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded text-sm ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Previous
              </button>
              <span className='px-3 py-1 text-sm text-gray-700'>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded text-sm ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
