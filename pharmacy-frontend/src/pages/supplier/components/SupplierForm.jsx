import { useState } from 'react';
import api from '../../../api';

export function SupplierForm({ supplier, onSuccess }) {
  const [name, setName] = useState(supplier?.name || '');
  const [phone, setPhone] = useState(supplier?.phone || '');
  const [address, setAddress] = useState(supplier?.address || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (supplier) {
        await api.put(`/suppliers/${supplier.id}`, { name, phone, address });
      } else {
        await api.post('/suppliers', { name, phone, address });
      }
      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <input
        type='text'
        placeholder='Name'
        value={name}
        onChange={(e) => setName(e.target.value)}
        className='w-full border rounded p-2'
        required
      />
      <input
        type='text'
        placeholder='Phone'
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className='w-full border rounded p-2'
      />
      <textarea
        placeholder='Address'
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className='w-full border rounded p-2'
      />
      <button
        type='submit'
        disabled={loading}
        className='bg-indigo-600 text-white px-4 py-2 rounded w-full'
      >
        {loading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
