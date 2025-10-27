import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminLayout from './components/layout/AdminLayout'
import Dashboard from './pages/Dashboard'
import ProductList from './pages/ProductList'
import ProductForm from './pages/ProductForm'
import OrderList from './pages/OrderList'
import CustomerList from './pages/CustomerList'
import './App.css'

function App() {
  return (
    <ProtectedRoute>
      <Layout className="min-h-screen bg-gray-50">
        <AdminLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/new" element={<ProductForm />} />
            <Route path="/products/edit/:id" element={<ProductForm />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/customers" element={<CustomerList />} />
          </Routes>
        </AdminLayout>
      </Layout>
    </ProtectedRoute>
  )
}

export default App
