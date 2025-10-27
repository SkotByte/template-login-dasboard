export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  image?: string
  createdAt: string
  updatedAt: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  createdAt: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalCustomers: number
  totalRevenue: number
}