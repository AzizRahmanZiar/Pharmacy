// src/components/DashboardCharts.jsx
import { useState, useEffect } from 'react';
import api from '../api';
import { SalesPurchaseChart } from './SalesPurchaseChart';
import { LoadingSpinner } from './LoadingSpinner';

export function DashboardCharts() {
  const [period, setPeriod] = useState('daily'); // daily, monthly, yearly
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData(period);
  }, [period]);

  const fetchData = async (period) => {
    setLoading(true);
    try {
      const res = await api.get(`/reports/${period}`);
      setData(res.data);
    } catch (error) {
      console.error('Failed to load chart data', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-lg font-semibold text-gray-800'>
          Purchase & Sales Report
        </h2>
        <div className='flex space-x-2 bg-gray-100 p-1 rounded-lg'>
          <button
            onClick={() => setPeriod('daily')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition ${
              period === 'daily'
                ? 'bg-white text-indigo-600 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition ${
              period === 'monthly'
                ? 'bg-white text-indigo-600 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setPeriod('yearly')}
            className={`px-3 py-1 text-sm font-medium rounded-md transition ${
              period === 'yearly'
                ? 'bg-white text-indigo-600 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {loading ? (
        <div className='flex justify-center py-12'>
          <LoadingSpinner />
        </div>
      ) : (
        <SalesPurchaseChart
          data={data}
          type={period === 'yearly' ? 'bar' : 'line'}
        />
      )}
    </div>
  );
}
