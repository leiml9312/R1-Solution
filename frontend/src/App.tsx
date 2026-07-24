import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import CustomerList from './pages/CustomerList';
import CustomerDetail from './pages/CustomerDetail';
import CustomerOrders from './pages/CustomerOrders';
import NewOrder from './pages/NewOrder';
import CustomerPackingList from './pages/CustomerPackingList';
import CustomerStatement from './pages/CustomerStatement';
import OrderInvoice from './pages/OrderInvoice';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <CustomerList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers/:customerId"
        element={
          <ProtectedRoute>
            <CustomerDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers/:customerId/orders"
        element={
          <ProtectedRoute>
            <CustomerOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers/:customerId/orders/new"
        element={
          <ProtectedRoute>
            <NewOrder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers/:customerId/orders/:orderId/invoice"
        element={
          <ProtectedRoute>
            <OrderInvoice />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers/:customerId/packing-list"
        element={
          <ProtectedRoute>
            <CustomerPackingList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers/:customerId/statement"
        element={
          <ProtectedRoute>
            <CustomerStatement />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
