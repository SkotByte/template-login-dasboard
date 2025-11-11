import { Card, Row, Col, Statistic, Table, Tag } from 'antd'
import { ShoppingOutlined, ShoppingCartOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons'
import dayjs from '../utils/dayjs'
import type { Order } from '../types'

const Dashboard = () => {
  // Mock data - replace with real API calls
  const stats = {
    totalProducts: 150,
    totalOrders: 1250,
    totalCustomers: 890,
    totalRevenue: 125000
  }

  const recentOrders: Order[] = [
    {
      id: 'ORD-001',
      customerId: 'CUST-001',
      customerName: 'John Doe',
      items: [],
      total: 1500,
      status: 'pending',
      createdAt: dayjs().subtract(1, 'hour').toISOString(),
      updatedAt: dayjs().subtract(1, 'hour').toISOString()
    },
    {
      id: 'ORD-002',
      customerId: 'CUST-002',
      customerName: 'Jane Smith',
      items: [],
      total: 2300,
      status: 'processing',
      createdAt: dayjs().subtract(2, 'hours').toISOString(),
      updatedAt: dayjs().subtract(1, 'hour').toISOString()
    },
    {
      id: 'ORD-003',
      customerId: 'CUST-003',
      customerName: 'Bob Johnson',
      items: [],
      total: 850,
      status: 'shipped',
      createdAt: dayjs().subtract(4, 'hours').toISOString(),
      updatedAt: dayjs().subtract(2, 'hours').toISOString()
    }
  ]

  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (value: number) => `฿${value.toLocaleString()}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          pending: 'orange',
          processing: 'blue',
          shipped: 'cyan',
          delivered: 'green',
          cancelled: 'red'
        }
        return <Tag color={colors[status as keyof typeof colors]}>{status}</Tag>
      }
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm')
    }
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>
      
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow">
            <Statistic
              title="Total Products"
              value={stats.totalProducts}
              prefix={<ShoppingOutlined className="text-blue-500" />}
              valueStyle={{ color: '#1f2937' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow">
            <Statistic
              title="Total Orders"
              value={stats.totalOrders}
              prefix={<ShoppingCartOutlined className="text-green-500" />}
              valueStyle={{ color: '#1f2937' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow">
            <Statistic
              title="Total Customers"
              value={stats.totalCustomers}
              prefix={<UserOutlined className="text-purple-500" />}
              valueStyle={{ color: '#1f2937' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow">
            <Statistic
              title="Total Revenue"
              value={stats.totalRevenue}
              prefix={<DollarOutlined className="text-orange-500" />}
              suffix="฿"
              valueStyle={{ color: '#1f2937' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Recent Orders" className="shadow-sm">
        <Table
          dataSource={recentOrders}
          columns={orderColumns}
          rowKey="id"
          pagination={false}
          className="rounded-lg"
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  )
}

export default Dashboard