import { useState } from 'react';
import api from '../../../api';

export function PaymentForm({ suppliers, onSuccess, onCancel }) {
  const [supplierId, setSupplierId] = useState('');
  const [amount, setAmount] = useState('');
  const [payment_date, setPaymentDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/payments', {
        supplier_id: supplierId,
        amount,
        payment_date, // ✅ fixed: was 'date'
        note,
      });
      onSuccess();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {error && (
        <div className='rounded-lg bg-red-50 p-3 text-sm text-red-700'>
          {error}
        </div>
      )}

      <select
        value={supplierId}
        onChange={(e) => setSupplierId(e.target.value)}
        className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
        required
      >
        <option value=''>Select Supplier</option>
        {suppliers.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <input
        type='number'
        step='0.01'
        placeholder='Amount'
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
        required
      />

      <input
        type='date'
        value={payment_date}
        onChange={(e) => setPaymentDate(e.target.value)}
        className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
        required
      />

      <textarea
        placeholder='Note (optional)'
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
      />

      <div className='flex justify-end space-x-3 pt-2'>
        <button
          type='button'
          onClick={onCancel}
          className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-50'
        >
          Cancel
        </button>
        <button
          type='submit'
          disabled={loading}
          className='rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-white shadow-md hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50'
        >
          {loading ? 'Saving...' : 'Save Payment'}
        </button>
      </div>
    </form>
  );
}
