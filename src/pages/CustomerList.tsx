import { useState } from 'react'
import { Table, Button, Space, Card, Input, Avatar } from 'antd'
import { UserOutlined, EyeOutlined, SearchOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons'
import dayjs from '../utils/dayjs'
import type { Customer } from '../types'

const { Search } = Input

const CustomerList = () => {
  const [searchText, setSearchText] = useState('')

  // Mock data - replace with real API calls
  const [customers] = useState<Customer[]>([
    {
      id: 'CUST-001',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+66 81 234 5678',
      address: '123 Main St, Bangkok, Thailand',
      createdAt: dayjs().subtract(30, 'days').toISOString()
    },
    {
      id: 'CUST-002',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+66 82 345 6789',
      address: '456 Oak Ave, Chiang Mai, Thailand',
      createdAt: dayjs().subtract(25, 'days').toISOString()
    },
    {
      id: 'CUST-003',
      name: 'Bob Johnson',
      email: 'bob.johnson@email.com',
      phone: '+66 83 456 7890',
      address: '789 Pine Rd, Phuket, Thailand',
      createdAt: dayjs().subtract(20, 'days').toISOString()
    },
    {
      id: 'CUST-004',
      name: 'Alice Brown',
      email: 'alice.brown@email.com',
      phone: '+66 84 567 8901',
      address: '321 Cedar St, Pattaya, Thailand',
      createdAt: dayjs().subtract(15, 'days').toISOString()
    },
    {
      id: 'CUST-005',
      name: 'Charlie Wilson',
      email: 'charlie.wilson@email.com',
      phone: '+66 85 678 9012',
      address: '654 Birch Ln, Krabi, Thailand',
      createdAt: dayjs().subtract(10, 'days').toISOString()
    }
  ])

  const handleViewCustomer = (customerId: string) => {
    // Navigate to customer details or open modal
    console.log('View customer:', customerId)
  }

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchText.toLowerCase()) ||
    customer.phone.includes(searchText)
  )

  const columns = [
    {
      title: 'Customer',
      key: 'customer',
      render: (_: unknown, record: Customer) => (
        <Space>
          <Avatar size="large" icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.name}</div>
            <div style={{ color: '#666', fontSize: '12px' }}>{record.id}</div>
          </div>
        </Space>
      )
    },
    {
      title: 'Contact Information',
      key: 'contact',
      render: (_: unknown, record: Customer) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <MailOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            <a href={`mailto:${record.email}`}>{record.email}</a>
          </div>
          <div>
            <PhoneOutlined style={{ marginRight: 8, color: '#52c41a' }} />
            <a href={`tel:${record.phone}`}>{record.phone}</a>
          </div>
        </div>
      )
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true
    },
    {
      title: 'Registered',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <div>
          <div>{dayjs(date).format('DD/MM/YYYY')}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>
            {dayjs(date).fromNow()}
          </div>
        </div>
      ),
      sorter: (a: Customer, b: Customer) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Customer) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewCustomer(record.id)}
        >
          View Profile
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Customers</h1>

      <Card className="shadow-sm">
        <div className="mb-4">
          <Search
            placeholder="Search by name, email, or phone..."
            allowClear
            className="w-96"
            prefix={<SearchOutlined />}
            onSearch={setSearchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <Table
          dataSource={filteredCustomers}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} customers`
          }}
          className="rounded-lg"
        />
      </Card>
    </div>
  )
}

export default CustomerList