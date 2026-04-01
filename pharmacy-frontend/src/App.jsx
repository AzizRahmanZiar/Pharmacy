import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import StockIndex from './pages/medicines/StockIndex';
import ItemsCreate from './pages/items/ItemsCreate';
import Purchase from './pages/purchases/Purchase';
import Sale from './pages/sales/Sale';
import ExpensesPage from './pages/expenses/Expenses';
import TransactionList from './pages/TransactionList';
import Doctor from './pages/doctor/Doctor';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          {/* Protected routes – all under Layout */}
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path='expense' element={<ExpensesPage />} />
            <Route path='medicine' element={<StockIndex />} />
            <Route path='purchase' element={<Purchase />} />
            <Route path='sale' element={<Sale />} />
            <Route path='items' element={<ItemsCreate />} />
            <Route path='tran' element={<TransactionList />} />
            <Route path='doc' element={<Doctor />} />
          </Route>
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
