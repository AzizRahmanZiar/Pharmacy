import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';

import StockIndex from './pages/medicines/StockIndex';
import ItemsCreate from './pages/items/ItemsCreate';
import Purchase from './pages/purchases/Purchase';
import Sale from './pages/sales/Sale';
import ExpensesPage from './pages/expenses/Expenses';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='expense' element={<ExpensesPage />} />
          <Route path='medicine' element={<StockIndex />} />
          <Route path='purchase' element={<Purchase />} />
          <Route path='sale' element={<Sale />} />
          <Route path='items' element={<ItemsCreate />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
