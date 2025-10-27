
import { Card, Form, Input, Button, Alert, Typography, Divider } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { useAuthStore } from '../store/authStore'

const { Title, Text } = Typography

const LoginPage = () => {
  const { login, error, clearError, isLoading } = useAuthStore()
  const [form] = Form.useForm()

  const handleSubmit = async (values: { email: string; password: string }) => {
    clearError()
    await login(values)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 rounded-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserOutlined className="text-2xl text-white" />
            </div>
            <Title level={2} className="text-gray-800 mb-2">
              Admin Login
            </Title>
            <Text type="secondary">
              Sign in to access your dashboard
            </Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={clearError}
              className="mb-6"
            />
          )}

          <Form
            form={form}
            name="login"
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Enter your email"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter your password' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Enter your password"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                className="w-full h-12 rounded-lg bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 text-base font-medium"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Form.Item>
          </Form>

          <Divider className="my-6" />

          <div className="bg-gray-50 p-4 rounded-lg">
            <Text strong className="block mb-2 text-gray-700">
              Demo Accounts:
            </Text>
            <div className="space-y-2 text-sm">
              <div className="flex flex-col">
                <Text code>admin@example.com</Text>
                <Text type="secondary">Password: admin123</Text>
              </div>
              <div className="flex flex-col">
                <Text code>user@example.com</Text>
                <Text type="secondary">Password: user123</Text>
              </div>
            </div>
            <Text type="secondary" className="block mt-3 text-xs">
              * OTP will be displayed in browser console
            </Text>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage