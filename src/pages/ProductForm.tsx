import { useState, useEffect } from 'react'
import { Input, InputNumber, Select, Button, Card, Upload, message } from 'antd'
import { UploadOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import type { Product } from '../types'

const { Option } = Select
const { TextArea } = Input

// Validation schema
const productSchema = yup.object({
  name: yup.string().required('Product name is required').min(2, 'Name must be at least 2 characters'),
  description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  price: yup.number().required('Price is required').positive('Price must be positive'),
  category: yup.string().required('Category is required'),
  stock: yup.number().required('Stock is required').min(0, 'Stock cannot be negative').integer('Stock must be a whole number')
})

type ProductFormData = yup.InferType<typeof productSchema>

const ProductForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState<any[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema)
  })

  useEffect(() => {
    if (isEdit && id) {
      // Mock API call to get product data
      const mockProduct: Product = {
        id: id,
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 2990,
        category: 'Electronics',
        stock: 50,
        image: 'https://via.placeholder.com/150',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setValue('name', mockProduct.name)
      setValue('description', mockProduct.description)
      setValue('price', mockProduct.price)
      setValue('category', mockProduct.category)
      setValue('stock', mockProduct.stock)
      
      if (mockProduct.image) {
        setFileList([{
          uid: '1',
          name: 'image.png',
          status: 'done',
          url: mockProduct.image,
        }])
      }
    }
  }, [isEdit, id, setValue])

  const onSubmit = async (formData: ProductFormData) => {
    try {
      setLoading(true)
      
      // Mock API call - use formData here
      console.log('Submitting product:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const action = isEdit ? 'updated' : 'created'
      message.success(`Product ${action} successfully!`)
      navigate('/products')
    } catch (error) {
      message.error('Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  const handleUploadChange = (info: any) => {
    setFileList(info.fileList)
  }

  const uploadProps = {
    name: 'file',
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    headers: {
      authorization: 'authorization-text',
    },
    fileList,
    onChange: handleUploadChange,
  }

  return (
    <div>
      <div className="flex items-center space-x-4 mb-6">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/products')}
          className="hover:bg-gray-50"
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
      </div>

      <Card className="shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <Input
              {...register('name')}
              status={errors.name ? 'error' : ''}
              placeholder="Enter product name"
              className="w-full"
            />
            {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name.message}</div>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>Description *</label>
            <TextArea
              {...register('description')}
              rows={4}
              status={errors.description ? 'error' : ''}
              placeholder="Enter product description"
            />
            {errors.description && <div style={{ color: 'red', fontSize: 12 }}>{errors.description.message}</div>}
          </div>

          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label>Price (฿) *</label>
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                formatter={value => `฿ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => Number(value!.replace(/฿\s?|(,*)/g, '')) as any}
                status={errors.price ? 'error' : ''}
                placeholder="0.00"
                onChange={(value) => setValue('price', value || 0)}
              />
              {errors.price && <div style={{ color: 'red', fontSize: 12 }}>{errors.price.message}</div>}
            </div>

            <div style={{ flex: 1 }}>
              <label>Stock *</label>
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                status={errors.stock ? 'error' : ''}
                placeholder="0"
                onChange={(value) => setValue('stock', value || 0)}
              />
              {errors.stock && <div style={{ color: 'red', fontSize: 12 }}>{errors.stock.message}</div>}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>Category *</label>
            <Select
              style={{ width: '100%' }}
              status={errors.category ? 'error' : ''}
              placeholder="Select a category"
              onChange={(value) => setValue('category', value)}
            >
              <Option value="Electronics">Electronics</Option>
              <Option value="Home & Garden">Home & Garden</Option>
              <Option value="Fashion">Fashion</Option>
              <Option value="Sports">Sports</Option>
            </Select>
            {errors.category && <div style={{ color: 'red', fontSize: 12 }}>{errors.category.message}</div>}
          </div>

          <div style={{ marginBottom: 24 }}>
            <label>Product Image</label>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
            >
              {isEdit ? 'Update Product' : 'Create Product'}
            </Button>
            <Button onClick={() => reset()}>
              Reset
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default ProductForm