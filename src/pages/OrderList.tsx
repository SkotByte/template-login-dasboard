import { useState } from 'react'
import { Table, Tag, Button, Card, Input, Select, DatePicker } from 'antd'
import { EyeOutlined, SearchOutlined } from '@ant-design/icons'
import dayjs from '../utils/dayjs'
import type { Order } from '../types'

const { Search } = Input
const { Option } = Select
const { RangePicker } = DatePicker

const OrderList = () => {
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null)

  // Mock data - replace with real API calls
  const [orders] = useState<Order[]>([
    {
      id: 'ORD-001',
      customerId: 'CUST-001',
      customerName: 'John Doe',
      items: [
        { id: '1', productId: 'PROD-001', productName: 'Wireless Headphones', quantity: 1, price: 2990 }
      ],
      total: 2990,
      status: 'pending',
      createdAt: dayjs().subtract(1, 'hour').toISOString(),
      updatedAt: dayjs().subtract(1, 'hour').toISOString()
    },
    {
      id: 'ORD-002',
      customerId: 'CUST-002',
      customerName: 'Jane Smith',
      items: [
        { id: '2', productId: 'PROD-001', productName: 'Wireless Headphones', quantity: 1, price: 2990 },
        { id: '3', productId: 'PROD-002', productName: 'Gaming Mouse', quantity: 2, price: 1590 }
      ],
      total: 6170,
      status: 'processing',
      createdAt: dayjs().subtract(2, 'hours').toISOString(),
      updatedAt: dayjs().subtract(1, 'hour').toISOString()
    },
    {
      id: 'ORD-003',
      customerId: 'CUST-003',
      customerName: 'Bob Johnson',
      items: [
        { id: '4', productId: 'PROD-003', productName: 'Coffee Mug', quantity: 3, price: 299 }
      ],
      total: 897,
      status: 'shipped',
      createdAt: dayjs().subtract(4, 'hours').toISOString(),
      updatedAt: dayjs().subtract(2, 'hours').toISOString()
    },
    {
      id: 'ORD-004',
      customerId: 'CUST-001',
      customerName: 'John Doe',
      items: [
        { id: '5', productId: 'PROD-002', productName: 'Gaming Mouse', quantity: 1, price: 1590 }
      ],
      total: 1590,
      status: 'delivered',
      createdAt: dayjs().subtract(1, 'day').toISOString(),
      updatedAt: dayjs().subtract(1, 'day').toISOString()
    },
    {
      id: 'ORD-005',
      customerId: 'CUST-004',
      customerName: 'Alice Brown',
      items: [
        { id: '6', productId: 'PROD-001', productName: 'Wireless Headphones', quantity: 2, price: 2990 }
      ],
      total: 5980,
      status: 'cancelled',
      createdAt: dayjs().subtract(2, 'days').toISOString(),
      updatedAt: dayjs().subtract(2, 'days').toISOString()
    }
  ])

  const handleViewOrder = (orderId: string) => {
    // Navigate to order details or open modal
    console.log('View order:', orderId)
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchText.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus = !statusFilter || order.status === statusFilter
    
    let matchesDate = true
    if (dateRange && dateRange[0] && dateRange[1]) {
      const orderDate = dayjs(order.createdAt)
      matchesDate = orderDate.isAfter(dateRange[0], 'day') && orderDate.isBefore(dateRange[1], 'day')
    }
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <strong>{text}</strong>
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items: Order['items']) => `${items.length} item${items.length > 1 ? 's' : ''}`
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (value: number) => `฿${value.toLocaleString()}`,
      sorter: (a: Order, b: Order) => a.total - b.total
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Order['status']) => {
        const colors = {
          pending: 'orange',
          processing: 'blue',
          shipped: 'cyan',
          delivered: 'green',
          cancelled: 'red'
        }
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>
      }
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a: Order, b: Order) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix()
    },
    {
      title: 'Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a: Order, b: Order) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Order) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewOrder(record.id)}
        >
          View
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Orders</h1>

      <Card className="shadow-sm">
        <div className="mb-4 flex flex-wrap gap-4">
          <Search
            placeholder="Search by Order ID or Customer..."
            allowClear
            className="w-80"
            prefix={<SearchOutlined />}
            onSearch={setSearchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          
          <Select
            placeholder="Filter by status"
            allowClear
            className="w-40"
            value={statusFilter || undefined}
            onChange={setStatusFilter}
          >
            <Option value="pending">Pending</Option>
            <Option value="processing">Processing</Option>
            <Option value="shipped">Shipped</Option>
            <Option value="delivered">Delivered</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>

          <RangePicker
            className="w-80"
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
            placeholder={['Start Date', 'End Date']}
          />
        </div>

        <Table
          dataSource={filteredOrders}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} orders`
          }}
          className="rounded-lg"
        />
      </Card>
    </div>
  )
}

export default OrderList