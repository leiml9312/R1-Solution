import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import CustomerList from './pages/CustomerList';
import CustomerDetail from './pages/CustomerDetail';
import CustomerOrders from './pages/CustomerOrders';
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
        path="/customers/:customerId/orders/:orderId/invoice"
        element={
          <ProtectedRoute>
            <OrderInvoice />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
