import { useState } from 'react'
import { Table, Button, Space, Tag, Card, Input, Select, message } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import dayjs from '../utils/dayjs'
import type { Product } from '../types'

const { Search } = Input
const { Option } = Select

const ProductList = () => {
  const navigate = useNavigate()
  const [loading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')

  // Mock data - replace with real API calls
  const [products] = useState<Product[]>([
    {
      id: 'PROD-001',
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 2990,
      category: 'Electronics',
      stock: 50,
      image: 'https://via.placeholder.com/150',
      createdAt: dayjs().subtract(1, 'day').toISOString(),
      updatedAt: dayjs().subtract(1, 'day').toISOString()
    },
    {
      id: 'PROD-002',
      name: 'Gaming Mouse',
      description: 'RGB gaming mouse with 12000 DPI',
      price: 1590,
      category: 'Electronics',
      stock: 30,
      image: 'https://via.placeholder.com/150',
      createdAt: dayjs().subtract(2, 'days').toISOString(),
      updatedAt: dayjs().subtract(1, 'day').toISOString()
    },
    {
      id: 'PROD-003',
      name: 'Coffee Mug',
      description: 'Ceramic coffee mug with custom design',
      price: 299,
      category: 'Home & Garden',
      stock: 100,
      image: 'https://via.placeholder.com/150',
      createdAt: dayjs().subtract(3, 'days').toISOString(),
      updatedAt: dayjs().subtract(2, 'days').toISOString()
    }
  ])

  const handleEdit = (id: string) => {
    navigate(`/products/edit/${id}`)
  }

  const handleDelete = (productId: string, name: string) => {
    // Mock delete - replace with real API call
    console.log('Deleting product:', productId)
    message.success(`Product "${name}" deleted successfully`)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchText.toLowerCase())
    const matchesCategory = !categoryFilter || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Product) => (
        <Space>
          <img 
            src={record.image} 
            alt={record.name} 
            className="w-12 h-12 object-cover rounded-md" 
          />
          <div>
            <div className="font-semibold text-gray-900">{text}</div>
            <div className="text-gray-500 text-xs">{record.description}</div>
          </div>
        </Space>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{category}</Tag>
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `฿${price.toLocaleString()}`,
      sorter: (a: Product, b: Product) => a.price - b.price
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => (
        <Tag color={stock > 20 ? 'green' : stock > 0 ? 'orange' : 'red'}>
          {stock} units
        </Tag>
      ),
      sorter: (a: Product, b: Product) => a.stock - b.stock
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a: Product, b: Product) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Product) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id, record.name)}
          >
            Delete
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => navigate('/products/new')}
          className="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600"
        >
          Add Product
        </Button>
      </div>

      <Card className="shadow-sm">
        <Space className="mb-4 flex-wrap">
          <Search
            placeholder="Search products..."
            allowClear
            className="w-80"
            prefix={<SearchOutlined />}
            onSearch={setSearchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            placeholder="Filter by category"
            allowClear
            className="w-52"
            value={categoryFilter || undefined}
            onChange={setCategoryFilter}
          >
            <Option value="Electronics">Electronics</Option>
            <Option value="Home & Garden">Home & Garden</Option>
            <Option value="Fashion">Fashion</Option>
            <Option value="Sports">Sports</Option>
          </Select>
        </Space>

        <Table
          dataSource={filteredProducts}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
          }}
          className="rounded-lg"
        />
      </Card>
    </div>
  )
}

export default ProductList