import { useState, useEffect } from 'react'
import { Card, Form, Input, Button, Alert, Typography } from 'antd'
import { SafetyOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useAuthStore } from '../store/authStore'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/common/LanguageSwitcher'
import ThemeSwitcher from '../components/common/ThemeSwitcher'

const { Title, Text } = Typography

const OTPPage = () => {
  const { verifyOTP, resendOTP, error, clearError, isLoading, tempEmail } = useAuthStore()
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSubmit = async (values: { otp: string }) => {
    if (!tempEmail) return
    
    clearError()
    await verifyOTP({
      email: tempEmail,
      otp: values.otp
    })
  }

  const handleResendOTP = async () => {
    if (countdown > 0) return
    
    await resendOTP()
    setCountdown(60) // 60 seconds countdown
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex gap-2">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
      
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 rounded-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <SafetyOutlined className="text-2xl text-white" />
            </div>
            <Title level={2} className="text-gray-800 mb-2">
              {t('auth.otp.title')}
            </Title>
            <Text type="secondary" className="block">
              {t('auth.otp.subtitle')}
            </Text>
            <Text strong className="text-blue-600">
              {tempEmail}
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
            name="otp"
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="otp"
              label={t('auth.otp.enterCode')}
              rules={[
                { required: true, message: t('auth.otp.enterCode') },
                { len: 6, message: 'OTP must be exactly 6 digits' },
                { pattern: /^\d+$/, message: 'OTP must contain only numbers' }
              ]}
            >
              <Input
                placeholder="000000"
                maxLength={6}
                className="rounded-lg text-center text-2xl tracking-widest font-mono"
                autoComplete="one-time-code"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                className="w-full h-12 rounded-lg bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 text-base font-medium"
              >
                {isLoading ? t('auth.otp.verifying') : t('auth.otp.verify')}
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center space-y-4">
            <div>
              <Text type="secondary">
                {t('auth.otp.didntReceive')}{' '}
              </Text>
              <Button
                type="link"
                onClick={handleResendOTP}
                disabled={countdown > 0}
                className="p-0 text-blue-600 hover:text-blue-700"
              >
                {countdown > 0 ? `${t('auth.otp.resending')} ${countdown}s` : t('auth.otp.resend')}
              </Button>
            </div>

            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => window.location.reload()}
              className="text-gray-500 hover:text-gray-700"
            >
              {t('auth.otp.changeEmail')}
            </Button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-6">
            <Text type="warning" className="block text-sm">
              💡 <strong>Demo Note:</strong> Check the browser console for the OTP code
            </Text>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default OTPPage