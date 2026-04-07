// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
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
import Pharmacy from './pages/pharmacy/Pharmacy';
import User from './pages/users/User';
import Setting from './pages/Setting';
import { SettingsProvider } from './context/SettingsContext';

// New imports for suppliers and payments
import Suppliers from './pages/supplier/Suppliers';
import Payments from './pages/payment/Payments';
import SupplierLedger from './pages/supplier/SupplierLedger';

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />

            {/* Protected routes (authentication required) */}
            <Route
              path='/'
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Admin only */}
              <Route
                index
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <Dashboard />
                  </RoleBasedRoute>
                }
              />
              <Route
                path='expense'
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <ExpensesPage />
                  </RoleBasedRoute>
                }
              />
              <Route
                path='tran'
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <TransactionList />
                  </RoleBasedRoute>
                }
              />
              <Route
                path='doc'
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <Doctor />
                  </RoleBasedRoute>
                }
              />
              <Route
                path='setting'
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <Setting />
                  </RoleBasedRoute>
                }
              />
              <Route
                path='user'
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <User />
                  </RoleBasedRoute>
                }
              />

              {/* Admin and staff */}
              <Route
                path='medicine'
                element={
                  <RoleBasedRoute allowedRoles={['admin', 'staff']}>
                    <StockIndex />
                  </RoleBasedRoute>
                }
              />
              <Route
                path='purchase'
                element={
                  <RoleBasedRoute allowedRoles={['admin', 'staff']}>
                    <Purchase />
                  </RoleBasedRoute>
                }
              />
              <Route
                path='sale'
                element={
                  <RoleBasedRoute allowedRoles={['admin', 'staff']}>
                    <Sale />
                  </RoleBasedRoute>
                }
              />
              <Route
                path='items'
                element={
                  <RoleBasedRoute allowedRoles={['admin', 'staff']}>
                    <ItemsCreate />
                  </RoleBasedRoute>
                }
              />

              {/* New routes for suppliers and payments */}
              <Route
                path='suppliers'
                element={
                  <RoleBasedRoute allowedRoles={['admin', 'staff']}>
                    <Suppliers />
                  </RoleBasedRoute>
                }
              />
              <Route
                path='payments'
                element={
                  <RoleBasedRoute allowedRoles={['admin', 'staff']}>
                    <Payments />
                  </RoleBasedRoute>
                }
              />
              <Route
                path='suppliers/:id/ledger'
                element={
                  <RoleBasedRoute allowedRoles={['admin', 'staff']}>
                    <SupplierLedger />
                  </RoleBasedRoute>
                }
              />

              {/* Super admin only */}
              <Route
                path='pharmacy'
                element={
                  <RoleBasedRoute allowedRoles={['super_admin']}>
                    <Pharmacy />
                  </RoleBasedRoute>
                }
              />
            </Route>

            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
