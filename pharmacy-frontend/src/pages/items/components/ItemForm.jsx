import { Modal } from '../../../components/Modal';

export function ItemForm({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onChange,
  title,
  submitLabel,
}) {
  if (!isOpen) return null;

  return (
    <Modal onClose={onClose} title={title}>
      <form onSubmit={onSubmit} className='space-y-4'>
        <input
          type='text'
          name='generic'
          placeholder='Generic'
          value={formData.generic}
          onChange={onChange}
          className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
          required
        />
        <input
          type='text'
          name='brand'
          placeholder='Brand'
          value={formData.brand}
          onChange={onChange}
          className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
        />
        <input
          type='text'
          name='dosage'
          placeholder='Dosage'
          value={formData.dosage}
          onChange={onChange}
          className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
        />
        <input
          type='text'
          name='strength'
          placeholder='Strength'
          value={formData.strength}
          onChange={onChange}
          className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
        />
        <input
          type='text'
          name='route'
          placeholder='Route of administration'
          value={formData.route}
          onChange={onChange}
          className='w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
        />
        <div className='flex justify-end space-x-2 pt-4'>
          <button
            type='button'
            onClick={onClose}
            className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition hover:bg-gray-50'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2'
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}
